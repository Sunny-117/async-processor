import type { CacheStore } from './interface'

// ========== 默认缓存实现 ==========
export class MemoryCache implements CacheStore {
  private store = new Map<string, any>()

  async get(key: string) {
    return this.store.get(key)
  }

  async set(key: string, value: any) {
    this.store.set(key, value)
  }
}

// 自定义缓存实现（localStorage）
export class LocalStorageCache implements CacheStore {
  async get(key: string) {
    return JSON.parse(localStorage.getItem(key)!)
  }

  async set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
