import { MemoryCache } from "./cache";
import { ProcessorOptions } from "./interface";
import { promisify } from "./utils";

/**
 * 创建支持缓存和多种执行策略的异步处理器
 * @param originalFunc 原始异步函数（需符合错误优先回调风格）
 * @param options 处理器配置选项
 */
export function createAsyncProcessor<Args extends any[], Result>(
    originalFunc: (...args: [...Args, (err: any, res: Result) => void]) => void,
    options: ProcessorOptions = {}
): (...args: Args) => Promise<Result> {
    // ========== 基础处理 ==========
    const promisified = promisify(originalFunc);
    const {
        mode = 'parallel',
        cache = new MemoryCache(),
        keyGenerator = (...args) => JSON.stringify(args)
    } = options;

    // ========== 带缓存功能的执行器 ==========
    const executor = async (...args: Args): Promise<Result> => {
        // 当禁用缓存时直接执行
        if (cache === false) {
            return await promisified(...args);
        }

        const key = keyGenerator(...args);

        // 缓存检查
        const cached = await cache.get(key);
        if (cached !== undefined) return cached;

        // 实际执行并缓存结果
        const result = await promisified(...args);
        await cache.set(key, result);
        return result;
    };

    // ========== 执行策略控制 ==========
    return function processedFunc(...args: Args): Promise<Result> {
        // 处理参数分组逻辑（示例按两两分组）
        const processBatch = async (tasks: Args[]): Promise<Result[]> => {
            if (mode === 'parallel') {
                return Promise.all(tasks.map(task => executor(...task)));
            }

            // 串行执行
            const results: Result[] = [];
            for (const task of tasks) {
                results.push(await executor(...task));
            }
            return results;
        };

        // 递归处理多参数场景（示例实现）
        const recursiveProcess = async (currentArgs: any[]): Promise<any> => {
            if (currentArgs.length <= 1) return currentArgs[0] || 0;

            // 生成任务批次（两两分组）
            const tasks: Args[] = [];
            for (let i = 0; i < currentArgs.length; i += 2) {
                const pair = currentArgs.slice(i, i + 2) as Args;
                tasks.push(pair.length === 1 ? [...pair, 0] as Args : pair); // 补零处理
            }

            // 执行当前批次
            const batchResults = await processBatch(tasks);
            return recursiveProcess(batchResults);
        };

        return recursiveProcess(args);
    };
}

