const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const {
    tokenize,
    calculateMLE,
    calculateEntropy,
    calculateKLDivergence,
    calculateAccuracyStats,
    calculateCrossEntropy,
    bootstrapStats
} = require('./probability');

const {
    googleTranslateToQuechua,
    chatGPTTranslateToQuechua,
    mockGoogleTranslate,
    mockChatGPTTranslate,
    areAPIsConfigured,
    generateTestSentences
} = require('./translationService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Check if using real APIs or mock
const USE_REAL_APIS = areAPIsConfigured();
console.log(`🔧 Translation Mode: ${USE_REAL_APIS ? 'REAL APIs' : 'MOCK (Demo Mode)'}`);

if (USE_REAL_APIS) {
    console.log('✅ Google Cloud Translation API: Configured');
    console.log('✅ OpenAI API: Configured');
} else {
    console.log('⚠️  No API keys found. Using mock translations for demo.');
    console.log('   To use real APIs, create a .env file with:');
    console.log('   - GOOGLE_TRANSLATE_API_KEY=your-google-key');
    console.log('   - OPENAI_API_KEY=sk-your-openai-key');
}

// Routes
app.get('/api/translate', async (req, res) => {
    const { sentence } = req.query;
    if (!sentence) return res.status(400).json({ error: "Sentence required" });

    try {
        // Use real APIs if configured, otherwise use mock
        const googleQuechua = USE_REAL_APIS
            ? await googleTranslateToQuechua(sentence)
            : mockGoogleTranslate(sentence);

        const chatgptQuechua = USE_REAL_APIS
            ? await chatGPTTranslateToQuechua(sentence)
            : mockChatGPTTranslate(sentence);

    const googleTokens = tokenize(googleQuechua);
    const chatgptTokens = tokenize(chatgptQuechua);

    // Build vocabulary from this single sentence pair (limited scope for single sentence)
    // For proper entropy, we usually need a larger corpus, but we'll compute strictly on these
    const vocabulary = [...new Set([...googleTokens, ...chatgptTokens])];

    // MLE
    const pGoogle = calculateMLE(googleTokens, vocabulary);
    const pChatGPT = calculateMLE(chatgptTokens, vocabulary); // Using same vocab for comparison

    // Metrics
    const entropyGoogle = calculateEntropy(pGoogle);
    const crossEntropy = calculateCrossEntropy(pGoogle, pChatGPT);
    const klDivergenceBits = calculateKLDivergence(pGoogle, pChatGPT);

    // Accuracy
    let matches = 0;
    const len = Math.min(googleTokens.length, chatgptTokens.length);
    for (let i = 0; i < len; i++) {
        if (googleTokens[i] === chatgptTokens[i]) matches++;
    }
    const { accuracy, ci } = calculateAccuracyStats(matches, len);

        res.json({
            english: sentence,
            googleQuechua,
            chatgptQuechua,
            metrics: {
                entropyGoogle,
                crossEntropy,
                klDivergenceBits,
                tokenMatchAccuracy: accuracy,
                tokenMatchCI: ci,
                perWordStats: vocabulary.map(w => ({
                    word: w,
                    pGoogle: pGoogle[w],
                    pChatGPT: pChatGPT[w]
                }))
            },
            usingRealAPIs: USE_REAL_APIS
        });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed', details: error.message });
    }
});

app.post('/api/experiment', async (req, res) => {
    const { numSentences = 100 } = req.body;

    try {
        // Generate test sentences using AI or fallback to hardcoded ones
        console.log(`🤖 Generating ${numSentences} test sentences...`);
        const sentences = await generateTestSentences(numSentences);

        console.log(`🔄 Translating ${sentences.length} sentences...`);

        // Translate all sentences (batch processing)
        const results = await Promise.all(sentences.map(async (s) => {
            const g = USE_REAL_APIS
                ? await googleTranslateToQuechua(s)
                : mockGoogleTranslate(s);

            const c = USE_REAL_APIS
                ? await chatGPTTranslateToQuechua(s)
                : mockChatGPTTranslate(s);

            return {
                english: s,
                googleQuechua: g,
                chatgptQuechua: c,
                googleTokens: tokenize(g),
                chatgptTokens: tokenize(c)
            };
        }));

        console.log(`✅ Translation complete!`);

    // Global Stats
    let allGoogleTokens = [];
    let allChatGPTTokens = [];
    results.forEach(r => {
        allGoogleTokens.push(...r.googleTokens);
        allChatGPTTokens.push(...r.chatgptTokens);
    });

    const vocabulary = [...new Set([...allGoogleTokens, ...allChatGPTTokens])];
    const pGoogle = calculateMLE(allGoogleTokens, vocabulary);
    const pChatGPT = calculateMLE(allChatGPTTokens, vocabulary);

    const entropyGoogle = calculateEntropy(pGoogle);
    const crossEntropy = calculateCrossEntropy(pGoogle, pChatGPT);
    const klDivergenceBits = calculateKLDivergence(pGoogle, pChatGPT);

    // Bootstrap Accuracy
    const { accuracyCI } = bootstrapStats(results);

    // Confusion Dictionary (Top 20)
    const confusions = {};
    results.forEach(r => {
        const len = Math.min(r.googleTokens.length, r.chatgptTokens.length);
        for (let i = 0; i < len; i++) {
            const g = r.googleTokens[i];
            const c = r.chatgptTokens[i];
            if (g !== c) {
                if (!confusions[g]) confusions[g] = {};
                if (!confusions[g][c]) confusions[g][c] = 0;
                confusions[g][c]++;
            }
        }
    });

    const topConfusions = Object.keys(confusions).map(gWord => {
        const wrongWords = confusions[gWord];
        const bestWrong = Object.keys(wrongWords).reduce((a, b) => wrongWords[a] > wrongWords[b] ? a : b);
        return {
            googleWord: gWord,
            chatGPTWord: bestWrong,
            count: wrongWords[bestWrong]
        };
    }).sort((a, b) => b.count - a.count).slice(0, 20);

    // Per-sentence KL for histogram
    const perSentenceKL = results.map(r => {
        const v = [...new Set([...r.googleTokens, ...r.chatgptTokens])];
        const pG = calculateMLE(r.googleTokens, v);
        const pC = calculateMLE(r.chatgptTokens, v);
        return calculateKLDivergence(pG, pC);
    });

        res.json({
            entropyGoogle,
            crossEntropy,
            klDivergenceBits,
            tokenMatchAccuracy: accuracyCI[0],
            tokenMatchCI: accuracyCI,
            perSentenceKL,
            topConfusions,
            usingRealAPIs: USE_REAL_APIS
        });
    } catch (error) {
        console.error('Experiment error:', error);
        res.status(500).json({ error: 'Experiment failed', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
