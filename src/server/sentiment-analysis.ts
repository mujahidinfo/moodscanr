import { pipeline } from '@xenova/transformers';

// Types
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type SentimentResult = {
    sentiment: Sentiment;
    score: number;
};
// Cache configuration
const CACHE_SIZE = 1000;
const sentimentCache = new Map<string, SentimentResult>();

// Model configuration
const MODEL_NAME = 'Xenova/robertuito-sentiment-analysis';
let sentimentAnalyzer: any = null;

// Initialize the pipeline with error handling
async function initializeAnalyzer() {
    if (!sentimentAnalyzer) {
        try {
            sentimentAnalyzer = await pipeline(
                'sentiment-analysis',
                MODEL_NAME
            );
        } catch (error) {
            console.error('Failed to initialize sentiment analyzer:', error);
            throw new Error('Sentiment analysis service unavailable');
        }
    }
    return sentimentAnalyzer;
}

// Clean up cache when it gets too large
function cleanupCache() {
    if (sentimentCache.size >= CACHE_SIZE) {
        const keysToDelete = Array.from(sentimentCache.keys())
            .slice(0, Math.floor(CACHE_SIZE * 0.2)); // Remove 20% of entries
        keysToDelete.forEach(key => sentimentCache.delete(key));
    }
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
    // Stricter input validation
    if (
        text === undefined ||
        text === null ||
        typeof text !== 'string' ||
        text.trim().length === 0
    ) {
        console.warn('analyzeSentiment: Invalid input (undefined, null, empty, or whitespace):', text);
        return { sentiment: 'neutral', score: 0 };
    }
    // Log input value
    console.log('analyzeSentiment: input value:', text);

    // Check cache first
    const cached = sentimentCache.get(text);
    if (cached) {
        return cached;
    }

    try {
        const analyzer = await initializeAnalyzer();
        let result;
        try {
            result = await analyzer(text);
        } catch (modelError) {
            console.error('analyzeSentiment: Model threw error for input:', text, modelError);
            return { sentiment: 'neutral', score: 0 };
        }
        // Defensive: ensure result is an array and has expected structure
        if (!Array.isArray(result) || !result[0] || typeof result[0] !== 'object') {
            console.error('analyzeSentiment: Invalid result structure from model', { input: text, result });
            return { sentiment: 'neutral', score: 0 };
        }
        if (!('label' in result[0]) || typeof result[0].label !== 'string') {
            console.error('analyzeSentiment: Missing or invalid label in result', { input: text, result: result[0] });
            return { sentiment: 'neutral', score: 0 };
        }
        if (!('score' in result[0]) || typeof result[0].score !== 'number' || isNaN(result[0].score)) {
            console.error('analyzeSentiment: Missing or invalid score in result', { input: text, result: result[0] });
            return { sentiment: 'neutral', score: 0 };
        }

        const sentiment = mapSentiment(result[0].label);
        const score = result[0].score;

        const sentimentResult: SentimentResult = {
            sentiment,
            score
        };

        // Update cache
        cleanupCache();
        sentimentCache.set(text, sentimentResult);

        return sentimentResult;
    } catch (error) {
        console.error('Error analyzing sentiment (outer catch):', { input: text, error });
        return { sentiment: 'neutral', score: 0 };
    }
}

function mapSentiment(label: string): Sentiment {
    switch (label.toUpperCase()) {
        case 'POS':
        case 'POSITIVE':
            return 'positive';
        case 'NEG':
        case 'NEGATIVE':
            return 'negative';
        case 'NEU':
        case 'NEUTRAL':
        default:
            return 'neutral';
    }
}

// Batch process messages with improved error handling and performance
export async function analyzeBatchSentiments(messages: string[]): Promise<SentimentResult[]> {
    // Filter out empty/whitespace messages before processing
    const filteredMessages = (messages || []).filter(
        (msg) => typeof msg === 'string' && msg.trim().length > 0
    );
    if (!filteredMessages.length) {
        return [];
    }

    try {
        const analyzer = await initializeAnalyzer();
        // Process in smaller batches to avoid memory issues
        const BATCH_SIZE = 10;
        const results: SentimentResult[] = [];

        for (let i = 0; i < filteredMessages.length; i += BATCH_SIZE) {
            const batch = filteredMessages.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.all(
                batch.map(async (msg) => {
                    try {
                        const result = await analyzeSentiment(msg);
                        // Defensive: ensure result is valid
                        if (!result || typeof result.sentiment !== 'string' || typeof result.score !== 'number' || isNaN(result.score)) {
                            return { sentiment: 'neutral' as Sentiment, score: 0 };
                        }
                        return result;
                    } catch (e) {
                        return { sentiment: 'neutral' as Sentiment, score: 0 };
                    }
                })
            );
            results.push(...batchResults);
        }

        return results;
    } catch (error) {
        console.error('Error in batch sentiment analysis:', error);
        return filteredMessages.map(() => ({ sentiment: 'neutral' as Sentiment, score: 0 }));
    }
} 