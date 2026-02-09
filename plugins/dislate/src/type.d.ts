export interface DeepLResponse {
    alternatives?: string[]
    code?: number
    message?: string
    data?: string
    id?: number
}
export interface GTranslateResponse {
    src?: string;
    sentences?: {
        trans?: string;
    }[];
}

export interface OpenRouterResponse {
    id: string;
    model: string;
    choices: Array<{
        message: {
            content: string;
            role: string;
        };
        finish_reason: string;
        index: number;
    }>;
    error?: {
        message: string;
        type: string;
        code: string;
    };
}

export interface GoogleAIResponse {
    candidates?: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
            role: string;
        };
        finishReason: string;
        index: number;
    }>;
    promptFeedback?: {
        blockReason: string;
        safetyRatings: Array<{
            category: string;
            probability: string;
        }>;
    };
    error?: {
        message: string;
        code: number;
        status: string;
    };
}

export interface ChatGPTResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
        };
        logprobs: any; // Can be null or an object
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    error?: {
        message: string;
        type: string;
        param: string;
        code: string;
    };
}
