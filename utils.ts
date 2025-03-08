// ========== 工具函数 ==========
export function promisify<Args extends any[], Result>(
    func: (...args: [...Args, (err: any, result: Result) => void]) => void
): (...args: Args) => Promise<Result> {
    return (...args: Args) => new Promise((resolve, reject) => {
        func(...args, (err, result) => err ? reject(err) : resolve(result));
    });
}
