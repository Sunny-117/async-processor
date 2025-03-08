# 🌟 async-processor

English | [简体中文](./README.md)

---

## 🌟 Features

- ✨ **Lightweight**: Zero-dependency, core <3kb
- ⚡ **High Performance**: Smart parallel processing + cache reuse
- 🔄 **Multi-strategy**: Parallel/Serial modes
- 💾 **Extensible Cache**: Memory/LocalStorage/Custom stores
- 🔧 **Type Safe**: Full TypeScript support
- 🎯 **Error-first Conversion**: Auto convert callback to Promise

## 📦 Installation

```bash
npm install async-processor
```

## 🛠 Quick Start

### 🔄 Basic Usage
```ts
import { createAsyncProcessor } from 'async-processor'

function asyncAdd(a: number, b: number, cb: (err: any, res: number) => void) {
  setTimeout(() => cb(null, a + b), 1000)
}

const processor = createAsyncProcessor(asyncAdd)
processor(5, 3).then(console.log) // ➡️ 8
```

### 🚀 Advanced: Multi-argument Sum
```ts
const sumProcessor = createAsyncProcessor(asyncAdd, {
  mode: 'parallel',
  keyGenerator: (a, b) => `add_${a}_${b}`
})

async function sum(...nums: number[]) {
  return sumProcessor(...nums)
}

sum(1, 2, 3, 4, 5).then(console.log) // 15 (~1.2s)
```

## ⚙️ Configuration

| Option          | Type                  | Default       | Description              |
|-----------------|-----------------------|---------------|--------------------------|
| `mode`         | `parallel \| serial` | `parallel`    | Execution mode          |
| `cache`        | `CacheStore \| false`| `MemoryCache` | Cache instance or false |
| `keyGenerator` | `(...args) => string`| JSON stringify| Cache key generator     |

## 🔧 Extensibility

### 💾 Custom Cache
```ts
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

## 📖 API Docs

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

## 🎯 Design Philosophy

### 🧩 Composable Architecture
```mermaid
graph TD
  A[Original Function] --> B(Strategy Pattern)
  B --> C{Execution Mode}
  C -->|Parallel| D[Promise.all]
  C -->|Serial| E[Sequential]
  B --> F(Dependency Inversion)
  F --> G[Cache Decorator]
  G --> H[Interface Programming]
  H --> I[MemoryCache]
  H --> J[RedisCache]
  H --> K[Custom Cache]
```

---

## License

[MIT](./LICENSE) License © [Sunny-117](https://github.com/Sunny-117)
