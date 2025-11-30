// Probability and Information Theory Utilities

// Tokenization
const tokenize = (text) => {
    if (!text) return [];
    // Lowercase, remove special chars (keep spaces), split by whitespace
    return text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(t => t.length > 0);
};

// MLE Estimates with Laplace Smoothing
const calculateMLE = (tokens, vocabulary, lambda = 1) => {
    const counts = {};
    vocabulary.forEach(w => counts[w] = 0);
    tokens.forEach(t => {
        if (counts[t] !== undefined) counts[t]++;
    });

    const total = tokens.length;
    const V = vocabulary.length;
    const probs = {};

    vocabulary.forEach(w => {
        probs[w] = (counts[w] + lambda) / (total + lambda * V);
    });

    return probs;
};

// Entropy (H(P))
const calculateEntropy = (probs) => {
    let entropy = 0;
    Object.values(probs).forEach(p => {
        if (p > 0) {
            entropy -= p * Math.log2(p);
        }
    });
    return entropy;
};

// Cross Entropy (H(P, Q))
const calculateCrossEntropy = (pProbs, qProbs) => {
    let ce = 0;
    Object.keys(pProbs).forEach(w => {
        const p = pProbs[w];
        const q = qProbs[w];
        if (p > 0 && q > 0) {
            ce -= p * Math.log2(q);
        }
    });
    return ce;
};

// KL Divergence (D_KL(P || Q) = H(P, Q) - H(P))
const calculateKLDivergence = (pProbs, qProbs) => {
    const hP = calculateEntropy(pProbs);
    const hPQ = calculateCrossEntropy(pProbs, qProbs);
    return hPQ - hP;
};

// Accuracy and CI
const calculateAccuracyStats = (matches, total) => {
    if (total === 0) return { accuracy: 0, ci: [0, 0] };

    const p = matches / total;
    // CI = p +/- 1.96 * sqrt(p(1-p)/n)
    const margin = 1.96 * Math.sqrt((p * (1 - p)) / total);

    return {
        accuracy: p,
        ci: [Math.max(0, p - margin), Math.min(1, p + margin)]
    };
};

// Bootstrapping
const bootstrapStats = (sentences, numSamples = 200) => {
    // sentences: array of { googleTokens, chatgptTokens }
    const kls = [];
    const accuracies = [];

    for (let i = 0; i < numSamples; i++) {
        // Resample with replacement
        const sample = [];
        for (let j = 0; j < sentences.length; j++) {
            const idx = Math.floor(Math.random() * sentences.length);
            sample.push(sentences[idx]);
        }

        // Compute metrics for this sample (simplified: just accuracy for now, KL requires full vocab rebuild)
        let matches = 0;
        let total = 0;
        sample.forEach(s => {
            const len = Math.min(s.googleTokens.length, s.chatgptTokens.length);
            total += len;
            for (let k = 0; k < len; k++) {
                if (s.googleTokens[k] === s.chatgptTokens[k]) matches++;
            }
        });
        accuracies.push(matches / (total || 1));
    }

    accuracies.sort((a, b) => a - b);
    const lower = accuracies[Math.floor(0.025 * numSamples)];
    const upper = accuracies[Math.floor(0.975 * numSamples)];

    return {
        accuracyCI: [lower, upper]
    };
};

module.exports = {
    tokenize,
    calculateMLE,
    calculateEntropy,
    calculateCrossEntropy,
    calculateKLDivergence,
    calculateAccuracyStats,
    bootstrapStats
};
