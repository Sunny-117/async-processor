# 🌟 async-processor

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

简体中文 | [English](./README-en.md)

---

## 🚀 特性

- ✨ **轻量级**：零依赖，核心代码 <1kb
- ⚡ **高性能**：智能并行处理 + 缓存复用
- 🔄 **多策略**：并行/串行执行模式自由切换
- 💾 **可扩展缓存**：内存/LocalStorage/自定义存储
- 🔧 **类型安全**：完整的 TypeScript 支持
- 🎯 **错误优先转换**：自动将回调转为 Promise

## 📦 安装

```bash
npm install async-processor
```

## 🛠 快速开始

### 🔄 基础用法
```ts
import { createAsyncProcessor } from 'async-processor'

// 1️⃣ 定义原始异步函数
function asyncAdd(a: number, b: number, cb: (err: any, res: number) => void) {
  setTimeout(() => cb(null, a + b), 1000)
}

// 2️⃣ 创建处理器
const processor = createAsyncProcessor(asyncAdd)

// 3️⃣ Promise风格调用
processor(5, 3).then(console.log) // ➡️ 8
```

### 🚀 高级示例：多参数求和
```ts
// 创建优化处理器
const sumProcessor = createAsyncProcessor(asyncAdd, {
  mode: 'parallel',
  keyGenerator: (a, b) => `add_${a}_${b}`
})

// 递归求和函数
async function sum(...nums: number[]) {
  return sumProcessor(...nums)
}

// 使用示例
sum(1, 2, 3, 4, 5).then(console.log) // 15 (仅需~1.2s)
```

## ⚙️ 配置选项

| 选项            | 类型                  | 默认值         | 描述                      |
|-----------------|-----------------------|---------------|--------------------------|
| `mode`         | `parallel \| serial` | `parallel`    | 执行模式                 |
| `cache`        | `CacheStore \| false`| `MemoryCache` | 缓存实例或禁用缓存       |
| `keyGenerator` | `(...args) => string`| JSON序列化    | 自定义缓存键生成策略     |

## 🔧 扩展能力

### 💾 自定义缓存
```ts
import { CacheStore } from 'async-processor'

class RedisCache implements CacheStore {
  async get(key: string) {
    return redisClient.get(key)
  }

  async set(key: string, value: any) {
    await redisClient.set(key, value)
  }
}

const processor = createAsyncProcessor(asyncAdd, {
  cache: new RedisCache()
})
```

### 💾 自定义复杂任务处理

```ts
function asyncRepeat(a: string, b: number, cb: (err: null, res: string) => void) {
  setTimeout(() => cb(null, a.repeat(b)), 1000)
}

const complexProcessor = createAsyncProcessor(
  asyncRepeat,
  {
    keyGenerator: (str, num) => `repeat_${str}_${num}`,
  },
)
complexProcessor('ts', 3).then(console.log) // 输出 "tststs"
```

## 📖 API 文档

### `createAsyncProcessor(originalFunc, options?)`
```ts
interface Options<Args extends any[]> {
  mode?: 'parallel' | 'serial'
  cache?: CacheStore | false
  keyGenerator?: (...args: Args) => string
}

function createAsyncProcessor<Args extends any[], Result>(
  func: (...args: [...Args, (err: any, res: Result) => void]) => void,
  options?: Options<Args>
): (...args: Args) => Promise<Result>
```

## 🎯 设计理念

### 🧩 组合式架构
```mermaid
graph TD
  A[原始函数] --> B(策略模式)
  B --> C{执行模式}
  C -->|并行| D[Promise.all]
  C -->|串行| E[顺序执行]
  B --> F(依赖倒置)
  F --> G[IOC]
  G --> H[接口编程]
  H --> I[MemoryCache]
  H --> J[RedisCache]
  H --> K[自定义缓存]
```
## License

[MIT](./LICENSE) License © [Sunny-117](https://github.com/Sunny-117)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/async-processor?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/async-processor
[npm-downloads-src]: https://img.shields.io/npm/dm/async-processor?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/async-processor
[bundle-src]: https://img.shields.io/bundlephobia/minzip/async-processor?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=async-processor
[license-src]: https://img.shields.io/github/license/Sunny-117/async-processor.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/Sunny-117/async-processor/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/async-processor
