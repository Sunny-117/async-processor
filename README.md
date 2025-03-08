# async-processor

一个轻量级、高性能的异步处理工具库，用于优化 JavaScript/TypeScript 中的异步操作。

## 特性

轻量级、零依赖
多种执行策略：支持并行和串行执行模式
内置缓存机制：避免重复计算，提高性能
可扩展的缓存实现：内存缓存、LocalStorage 缓存，以及自定义缓存接口
自定义缓存键生成：灵活控制缓存策略
错误优先回调转 Promise：自动将传统回调风格 API 转换为 Promise

## Install

```shell
npm install async-processor
```

## 基本用法

```ts
import { createAsyncProcessor } from 'async-processor';

// 原始的错误优先回调风格函数
function asyncAdd(a: number, b: number, cb: (err: any, result: number) => void) {
  setTimeout(() => cb(null, a + b), 1000);
}

// 创建优化后的处理器
const optimizedAdd = createAsyncProcessor(asyncAdd);

// 使用 Promise 风格调用
optimizedAdd(5, 3).then(result => {
  console.log(result); // 8
});
```

## 高级用法

### 缓存控制

```ts
import { createAsyncProcessor, MemoryCache } from 'async-processor';

// 使用内存缓存
const cachedProcessor = createAsyncProcessor(asyncAdd, {
  cache: new MemoryCache(),
  keyGenerator: (a, b) => `add_${a}_${b}` // 自定义缓存键
});

// 禁用缓存
const noCacheProcessor = createAsyncProcessor(asyncAdd, {
  cache: false
});
```

### 执行模式

```ts
// 并行执行（默认）
const parallelProcessor = createAsyncProcessor(asyncAdd, {
  mode: 'parallel'
});

// 串行执行
const serialProcessor = createAsyncProcessor(asyncAdd, {
  mode: 'serial'
});
```
### 自定义缓存实现

```ts
import { createAsyncProcessor, CacheStore } from 'async-processor';

// 实现自定义缓存
class RedisCache implements CacheStore {
  async get(key: string) {
    // 从 Redis 获取数据
  }

  async set(key: string, value: any) {
    // 存储数据到 Redis
  }
}

const redisProcessor = createAsyncProcessor(asyncAdd, {
  cache: new RedisCache()
});
```

### 复杂示例：多参数求和

```ts
import { createAsyncProcessor } from 'async-processor';

// 创建优化后的处理器
const optimizedSum = createAsyncProcessor(asyncAdd, {
  mode: 'parallel',
  keyGenerator: (a, b) => `add_${a}_${b}`
});

// 最终求和函数
async function sum(...nums: number[]) {
  return optimizedSum(...nums);
}

// 使用示例
sum(1, 2, 3, 4, 5).then(result => {
  console.log(result); // 15
});
```

## API 参考


`createAsyncProcessor(originalFunc, options)`

创建一个支持缓存和多种执行策略的异步处理器。
参数:
- originalFunc: 原始的错误优先回调风格函数
- options: 处理器配置选项
    - mode: 执行模式，'parallel'(默认) 或 'serial'
    - cache: 缓存实现，默认为 MemoryCache 实例，设为 false 禁用缓存
    - keyGenerator: 自定义缓存键生成函数
返回: 返回一个 Promise 风格的函数