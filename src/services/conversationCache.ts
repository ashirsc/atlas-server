

export class ConversationCache {

    private static instance: ConversationCache;
    private cache: Map<string, any>;
    private erasers: Map<string, NodeJS.Timeout>;

    private constructor() {
        this.cache = new Map();
        this.erasers = new Map();
    }

    public static getInstance(): ConversationCache {
        if (!ConversationCache.instance) {
            ConversationCache.instance = new ConversationCache();
        }
        return ConversationCache.instance;
    }



    get(chatId: string): any {
        return this.cache.get(chatId);
    }



    set(chatId: string, value: any, ttl: number = 30 * 1000): void {
        this.cache.set(chatId, value);

        // Set a timeout to remove the entry after the given TTL (in milliseconds)
        const eraser = setTimeout(() => {
            this.delete(chatId);
        }, ttl);
        this.erasers.set(chatId, eraser)

    }

    delete(chatId: string): void {
        this.cache.delete(chatId);
        if (this.erasers.has(chatId)) {
            let eraser = this.erasers.get(chatId)
            clearTimeout(eraser)
            this.erasers.delete(chatId)
        }
    }

    has(chatId:string):boolean {
        return this.cache.has(chatId)
    }

}