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
    // Input validation
    if (!text || typeof text !== 'string') {
        return { sentiment: 'neutral', score: 0 };
    }

    // Check cache first
    const cached = sentimentCache.get(text);
    if (cached) {
        return cached;
    }

    try {
        const analyzer = await initializeAnalyzer();
        const result = await analyzer(text);
        console.log("result", result);
        
        if (!result?.[0]) {
            throw new Error('Invalid sentiment analysis result');
        }

        const sentiment = mapSentiment(result[0].label);
        const score = result[0].score || 0;
        
        const sentimentResult: SentimentResult = {
            sentiment,
            score
        };

        // Update cache
        cleanupCache();
        sentimentCache.set(text, sentimentResult);

        return sentimentResult;
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
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
    if (!messages?.length) {
        return [];
    }

    try {
        const analyzer = await initializeAnalyzer();
        
        // Process in smaller batches to avoid memory issues
        const BATCH_SIZE = 10;
        const results: SentimentResult[] = [];
        
        for (let i = 0; i < messages.length; i += BATCH_SIZE) {
            const batch = messages.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.all(
                batch.map(msg => analyzeSentiment(msg))
            );
            results.push(...batchResults);
        }
        
        return results;
    } catch (error) {
        console.error('Error in batch sentiment analysis:', error);
        return messages.map(() => ({ sentiment: 'neutral', score: 0 }));
    }
} 