// ========== 工具函数 ==========
// for nodejs
// import { promisify } from 'node:util'

// polyfill for node:util promisify
export function promisify<Args extends any[], Result>(
  func: (...args: [...Args, (err: any, result: Result) => void]) => void,
): (...args: Args) => Promise<Result> {
  return (...args: Args) => new Promise((resolve, reject) => {
    func(...args, (err: unknown, result: any) => err ? reject(err) : resolve(result))
  })
}
