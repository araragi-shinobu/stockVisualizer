package com.stockviz.service;

import com.stockviz.dto.HistoryResponse;
import com.stockviz.dto.QuoteResponse;

import java.util.List;

/**
 * 股票数据服务接口
 */
public interface StockService {
    
    /**
     * 获取实时报价
     * @param symbol 股票代码
     * @return 报价信息
     */
    QuoteResponse getQuote(String symbol);

    /**
     * 获取历史数据
     * @param symbol 股票代码
     * @param range 时间范围 (1D, 1W, 1M, 3M, 1Y)
     * @return 历史数据
     */
    HistoryResponse getHistory(String symbol, String range);

    /**
     * 搜索股票
     * @param keyword 关键词
     * @return 搜索结果列表
     */
    List<QuoteResponse> searchStocks(String keyword);

    /**
     * 批量获取报价
     * @param symbols 股票代码列表
     * @return 报价列表
     */
    List<QuoteResponse> getBatchQuotes(List<String> symbols);
}
