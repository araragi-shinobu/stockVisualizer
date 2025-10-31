/**
 * LocalStorage 工具类 - 管理自选股列表
 */

const WATCHLIST_KEY = 'stock_watchlist';

export const storageService = {
  /**
   * 获取自选股列表
   */
  getWatchlist(): string[] {
    try {
      const data = localStorage.getItem(WATCHLIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading watchlist:', error);
      return [];
    }
  },

  /**
   * 保存自选股列表
   */
  saveWatchlist(symbols: string[]): void {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(symbols));
    } catch (error) {
      console.error('Error saving watchlist:', error);
    }
  },

  /**
   * 添加到自选股
   */
  addToWatchlist(symbol: string): boolean {
    const watchlist = this.getWatchlist();
    if (watchlist.includes(symbol)) {
      return false; // 已存在
    }
    watchlist.push(symbol);
    this.saveWatchlist(watchlist);
    return true;
  },

  /**
   * 从自选股移除
   */
  removeFromWatchlist(symbol: string): boolean {
    const watchlist = this.getWatchlist();
    const filtered = watchlist.filter((s) => s !== symbol);
    if (filtered.length === watchlist.length) {
      return false; // 不存在
    }
    this.saveWatchlist(filtered);
    return true;
  },

  /**
   * 检查是否在自选股中
   */
  isInWatchlist(symbol: string): boolean {
    return this.getWatchlist().includes(symbol);
  },

  /**
   * 清空自选股
   */
  clearWatchlist(): void {
    localStorage.removeItem(WATCHLIST_KEY);
  },
};
