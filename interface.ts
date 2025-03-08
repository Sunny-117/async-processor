export interface CacheStore {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
}

export interface ProcessorOptions {
    /** 执行模式：并行（默认）| 串行 */
    mode?: 'parallel' | 'serial';
    /** 自定义缓存实现 */
    cache?: CacheStore | false;
    /** 自定义缓存键生成器 */
    keyGenerator?: (...args: any[]) => string;
}
