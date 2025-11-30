const { Translate } = require('@google-cloud/translate').v2;
const OpenAI = require('openai');
require('dotenv').config();

// Initialize Google Translate with service account credentials
let googleTranslate;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    googleTranslate = new Translate({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
}

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Translate text using Google Cloud Translation API
 * @param {string} text - English text to translate
 * @returns {Promise<string>} - Quechua translation
 */
async function googleTranslateToQuechua(text) {
    try {
        // Google Translate API
        // Two-step translation: English->Spanish->Quechua
        // Direct English->Quechua is not well supported

        // Step 1: English to Spanish
        const [spanish] = await googleTranslate.translate(text, 'es');

        // Step 2: Spanish to Quechua
        const [quechua] = await googleTranslate.translate(spanish, {
            from: 'es',
            to: 'qu'
        });

        return quechua;
    } catch (error) {
        console.error('Google Translate Error:', error);
        // Fallback to mock if API fails
        return mockGoogleTranslate(text);
    }
}

/**
 * Translate text using ChatGPT (OpenAI)
 * @param {string} text - English text to translate
 * @returns {Promise<string>} - Quechua translation
 */
async function chatGPTTranslateToQuechua(text) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use gpt-4o-mini for cost-effectiveness, or gpt-4o for better quality
            messages: [
                {
                    role: "system",
                    content: "You are a professional translator specializing in Quechua language. Translate the given English text to Quechua. Only provide the translation, no explanations."
                },
                {
                    role: "user",
                    content: `Translate this English text to Quechua: "${text}"`
                }
            ],
            temperature: 0.3, // Lower temperature for more consistent translations
            max_tokens: 500
        });

        // Remove surrounding quotes if ChatGPT adds them
        let translation = completion.choices[0].message.content.trim();
        if ((translation.startsWith('"') && translation.endsWith('"')) ||
            (translation.startsWith("'") && translation.endsWith("'"))) {
            translation = translation.slice(1, -1);
        }
        return translation;
    } catch (error) {
        console.error('ChatGPT Translate Error:', error);
        // Fallback to mock if API fails
        return mockChatGPTTranslate(text);
    }
}

// Mock fallback functions (keep these for testing without API keys)
function mockGoogleTranslate(text) {
    const words = text.split(' ');
    return words.map(w => w + 'qa').join(' ');
}

function mockChatGPTTranslate(text) {
    const words = text.split(' ');
    return words.map(w => {
        if (Math.random() > 0.8) return w + 'kuna';
        if (Math.random() > 0.9) return 'mana';
        return w + 'qa';
    }).join(' ');
}

/**
 * Generate diverse test sentences using ChatGPT API
 * @param {number} count - Number of sentences to generate
 * @returns {Promise<string[]>} - Array of English test sentences
 */
async function generateTestSentences(count) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a linguistic expert creating diverse test sentences for Quechua translation evaluation. Generate simple to moderately complex English sentences that cover various topics relevant to Andean culture, daily life, nature, and common situations."
                },
                {
                    role: "user",
                    content: `Generate exactly ${count} diverse English sentences for translation testing. The sentences should:
- Cover various topics: animals (llamas, alpacas, condors), nature, weather, daily life, agriculture, food, culture, traditions, locations, time, actions, questions, commands, and modern life
- Range from simple to moderately complex
- Be culturally relevant to Andean/Quechua-speaking regions when possible
- Vary in grammatical structure (statements, questions, commands, negations)
- Be between 4-12 words each

Format: Return ONLY the sentences, one per line, numbered. No additional text.`
                }
            ],
            temperature: 0.8, // Higher temperature for more diversity
            max_tokens: 2000
        });

        // Parse the response to extract sentences
        const response = completion.choices[0].message.content.trim();
        const sentences = response
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                // Remove numbering like "1. " or "1) " or "1 - "
                return line.replace(/^\d+[\.\)\-\:]\s*/, '').trim();
            })
            .filter(line => line.length > 0)
            .slice(0, count); // Ensure we don't exceed requested count

        console.log(`✅ Generated ${sentences.length} test sentences via ChatGPT`);
        return sentences;
    } catch (error) {
        console.error('ChatGPT Sentence Generation Error:', error);
        // Fallback to hardcoded sentences if API fails
        return getFallbackTestSentences(count);
    }
}

/**
 * Fallback test sentences when API is unavailable
 * @param {number} count - Number of sentences to return
 * @returns {string[]} - Array of test sentences
 */
function getFallbackTestSentences(count) {
    const fallbackSentences = [
        // Animals
        "the llama eats grass in the mountains",
        "alpacas live in the high altitude regions",
        "condors fly over the Andes mountains",
        "vicuñas are wild relatives of alpacas",
        "guinea pigs are native to the Andes",

        // Nature and Weather
        "the sun rises over the sacred valley",
        "rain falls on the terraced fields",
        "snow covers the mountain peaks",
        "the river flows through the valley",
        "clouds gather over lake Titicaca",

        // Daily Life
        "farmers plant potatoes in spring",
        "women weave colorful textiles",
        "children play in the village square",
        "families cook traditional meals together",
        "people celebrate harvest festivals",

        // Time and Seasons
        "winter is the dry season",
        "spring brings new growth",
        "summer rains nourish the crops",
        "autumn is harvest time",
        "the seasons change in the mountains",

        // Actions and Activities
        "she walks to the market early",
        "he carries water from the well",
        "they dance during the festival",
        "we gather firewood for cooking",
        "elders tell stories at night",

        // Food and Agriculture
        "corn grows in the terraced fields",
        "quinoa is a nutritious grain",
        "potatoes come in many varieties",
        "beans are dried for storage",
        "chili peppers add flavor to food",

        // Locations and Geography
        "Cusco was the Inca capital",
        "Machu Picchu sits high in the mountains",
        "the valley is green and fertile",
        "villages dot the mountainside",
        "paths connect the highland communities",

        // Culture and Tradition
        "music echoes through the plaza",
        "traditional clothing shows regional identity",
        "festivals honor Pachamama",
        "ancient stones tell old stories",
        "ceremonies mark important transitions",

        // Simple Statements
        "the sky is blue",
        "water is essential for life",
        "mountains are tall and steep",
        "night follows day",
        "fire provides warmth",

        // Questions and Commands
        "where is my house",
        "what time is it",
        "please help me",
        "come here quickly",
        "listen to the music",

        // Abstract Concepts
        "wisdom comes with age",
        "respect is important",
        "community supports everyone",
        "tradition guides our actions",
        "nature teaches patience",

        // Numbers and Quantities
        "three llamas graze together",
        "five children study in school",
        "many people attend the ceremony",
        "few clouds appear today",
        "all families contribute to the work",

        // Negations and Contrasts
        "the dog does not bark",
        "she is not tired today",
        "we have no more bread",
        "it is not raining now",
        "they did not arrive yet",

        // Technology and Modern Life
        "students use computers to learn",
        "phones connect distant relatives",
        "buses travel to the city",
        "electricity powers the lights",
        "radio broadcasts news and music"
    ];

    // Shuffle and return requested count
    const shuffled = [...fallbackSentences].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Check if APIs are configured
 */
function areAPIsConfigured() {
    return !!(process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.OPENAI_API_KEY);
}

module.exports = {
    googleTranslateToQuechua,
    chatGPTTranslateToQuechua,
    mockGoogleTranslate,
    mockChatGPTTranslate,
    areAPIsConfigured,
    generateTestSentences
};
