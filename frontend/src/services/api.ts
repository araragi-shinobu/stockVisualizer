import axios, { AxiosInstance } from 'axios';
import { ApiResponse, Quote, HistoryData, SearchResult, TimeRange } from '../types';

/**
 * API 服务类 - 封装所有后端接口调用
 */
class StockApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: (import.meta as any).env.VITE_API_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.api.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('[API Error]', error.message);
        if (error.response) {
          throw new Error(error.response.data.message || 'API request failed');
        }
        throw new Error('Network error');
      }
    );
  }

  /**
   * 获取股票实时报价
   */
  async getQuote(symbol: string): Promise<Quote> {
    const response = await this.api.get<ApiResponse<Quote>>(`/stocks/quote/${symbol}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch quote');
    }
    return response.data.data;
  }

  /**
   * 获取历史数据
   */
  async getHistory(symbol: string, range: TimeRange = '1M'): Promise<HistoryData> {
    const response = await this.api.get<ApiResponse<HistoryData>>(
      `/stocks/history/${symbol}`,
      { params: { range } }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch history');
    }
    return response.data.data;
  }

  /**
   * 搜索股票
   */
  async searchStocks(keyword: string): Promise<SearchResult[]> {
    const response = await this.api.get<ApiResponse<SearchResult[]>>('/stocks/search', {
      params: { q: keyword },
    });
    if (!response.data.success || !response.data.data) {
      return [];
    }
    return response.data.data;
  }

  /**
   * 批量获取报价
   */
  async getBatchQuotes(symbols: string[]): Promise<Quote[]> {
    const response = await this.api.post<ApiResponse<Quote[]>>('/stocks/batch', symbols);
    if (!response.data.success || !response.data.data) {
      return [];
    }
    return response.data.data;
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get('/stocks/health');
      return response.data.success;
    } catch {
      return false;
    }
  }
}

// 导出单例
export const stockApi = new StockApiService();
