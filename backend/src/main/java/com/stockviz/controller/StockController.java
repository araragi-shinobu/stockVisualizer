package com.stockviz.controller;

import com.stockviz.dto.ApiResponse;
import com.stockviz.dto.HistoryResponse;
import com.stockviz.dto.QuoteResponse;
import com.stockviz.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 股票数据 API 控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 允许跨域,生产环境应限制具体域名
public class StockController {

    private final StockService stockService;

    /**
     * 获取股票实时报价
     * GET /api/stocks/quote/{symbol}
     */
    @GetMapping("/quote/{symbol}")
    public ResponseEntity<ApiResponse<QuoteResponse>> getQuote(
            @PathVariable String symbol) {
        
        log.info("Received quote request for: {}", symbol);
        QuoteResponse quote = stockService.getQuote(symbol.toUpperCase());
        return ResponseEntity.ok(ApiResponse.success(quote));
    }

    /**
     * 获取历史数据
     * GET /api/stocks/history/{symbol}?range=1M
     */
    @GetMapping("/history/{symbol}")
    public ResponseEntity<ApiResponse<HistoryResponse>> getHistory(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "1M") String range) {
        
        log.info("Received history request for: {}, range: {}", symbol, range);
        HistoryResponse history = stockService.getHistory(symbol.toUpperCase(), range);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    /**
     * 搜索股票
     * GET /api/stocks/search?q=apple
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<QuoteResponse>>> searchStocks(
            @RequestParam String q) {
        
        log.info("Received search request for: {}", q);
        List<QuoteResponse> results = stockService.searchStocks(q);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    /**
     * 批量获取报价
     * POST /api/stocks/batch
     * Body: ["AAPL", "GOOGL", "MSFT"]
     */
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<QuoteResponse>>> getBatchQuotes(
            @RequestBody List<String> symbols) {
        
        log.info("Received batch quote request for: {}", symbols);
        List<QuoteResponse> quotes = stockService.getBatchQuotes(
                symbols.stream().map(String::toUpperCase).toList()
        );
        return ResponseEntity.ok(ApiResponse.success(quotes));
    }

    /**
     * 健康检查
     * GET /api/stocks/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("Service is running"));
    }
}
