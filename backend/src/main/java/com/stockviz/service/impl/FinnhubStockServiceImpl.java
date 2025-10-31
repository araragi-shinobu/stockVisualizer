package com.stockviz.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stockviz.dto.HistoryResponse;
import com.stockviz.dto.QuoteResponse;
import com.stockviz.exception.StockApiException;
import com.stockviz.service.StockService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Finnhub Stock Service 实现
 * 使用 Finnhub API 获取股票数据
 */
@Slf4j
@Service
public class FinnhubStockServiceImpl implements StockService {

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String baseUrl = "https://finnhub.io/api/v1";

    public FinnhubStockServiceImpl(RestTemplate restTemplate,
                                   @Value("${finnhub.api.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        log.info("FinnhubStockService initialized with base URL: {}", baseUrl);
    }

    // ========== 公共 API 方法 ==========

    @Override
    @Cacheable(value = "stockQuote", key = "#symbol")
    public QuoteResponse getQuote(String symbol) {
        log.info("Fetching quote for symbol: {}", symbol);

        try {
            // 获取报价数据
            String quoteUrl = buildUrl("/quote", symbol);
            JsonNode quoteData = fetchData(quoteUrl);

            // 获取公司信息
            String profileUrl = buildUrl("/stock/profile2", symbol);
            JsonNode profileData = fetchData(profileUrl);

            return buildQuoteResponse(symbol, quoteData, profileData);

        } catch (Exception e) {
            log.error("Error fetching quote for {}: {}", symbol, e.getMessage());
            throw new StockApiException("Failed to fetch quote for " + symbol, e);
        }
    }

    @Override
    @Cacheable(value = "stockHistory", key = "#symbol + '_' + #range")
    public HistoryResponse getHistory(String symbol, String range) {
        log.info("Fetching history for symbol: {}, range: {}", symbol, range);

        try {
            // Finnhub 免费版不支持历史 K 线数据
            // 我们使用模拟数据来演示功能
            log.warn("Using simulated data for history (Finnhub free tier limitation)");
            return generateSimulatedHistory(symbol, range);
        } catch (Exception e) {
            log.error("Error generating history for {}: {}", symbol, e.getMessage());
            throw new StockApiException("Failed to fetch history for " + symbol);
        }
    }

    @Override
    public List<QuoteResponse> searchStocks(String keyword) {
        log.info("Searching stocks with keyword: {}", keyword);

        try {
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/search")
                    .queryParam("q", keyword)
                    .queryParam("token", apiKey)
                    .toUriString();

            JsonNode data = fetchData(url);
            List<QuoteResponse> results = new ArrayList<>();

            if (data.has("result")) {
                JsonNode resultArray = data.get("result");
                int limit = Math.min(10, resultArray.size()); // 限制返回10个结果

                for (int i = 0; i < limit; i++) {
                    JsonNode item = resultArray.get(i);
                    results.add(QuoteResponse.builder()
                            .symbol(item.get("symbol").asText())
                            .name(item.get("description").asText())
                            .build());
                }
            }

            return results;

        } catch (Exception e) {
            log.error("Error searching stocks: {}", e.getMessage());
            throw new StockApiException("Failed to search stocks", e);
        }
    }

    @Override
    public List<QuoteResponse> getBatchQuotes(List<String> symbols) {
        List<QuoteResponse> quotes = new ArrayList<>();
        for (String symbol : symbols) {
            try {
                quotes.add(getQuote(symbol));
            } catch (Exception e) {
                log.warn("Failed to fetch quote for {}: {}", symbol, e.getMessage());
            }
        }
        return quotes;
    }

    // ========== 辅助方法 ==========

    private String buildUrl(String endpoint, String symbol) {
        return UriComponentsBuilder.fromHttpUrl(baseUrl + endpoint)
                .queryParam("symbol", symbol)
                .queryParam("token", apiKey)
                .toUriString();
    }

    private JsonNode fetchData(String url) {
        try {
            String response = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(response);
        } catch (Exception e) {
            log.error("Error fetching data from URL: {}, error: {}", url, e.getMessage());
            throw new StockApiException("API request failed: " + e.getMessage(), e);
        }
    }

    private QuoteResponse buildQuoteResponse(String symbol, JsonNode quoteData, JsonNode profileData) {
        BigDecimal currentPrice = new BigDecimal(quoteData.get("c").asText());
        BigDecimal previousClose = new BigDecimal(quoteData.get("pc").asText());
        BigDecimal change = currentPrice.subtract(previousClose);
        BigDecimal changePercent = change.divide(previousClose, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));

        return QuoteResponse.builder()
                .symbol(symbol)
                .name(profileData.has("name") ? profileData.get("name").asText() : symbol)
                .currentPrice(currentPrice)
                .change(change)
                .changePercent(changePercent)
                .open(new BigDecimal(quoteData.get("o").asText()))
                .high(new BigDecimal(quoteData.get("h").asText()))
                .low(new BigDecimal(quoteData.get("l").asText()))
                .previousClose(previousClose)
                .timestamp(System.currentTimeMillis())
                .build();
    }

    /**
     * 生成模拟的历史数据用于演示
     * 注意: 这不是真实数据,仅用于功能演示
     * Finnhub 免费版不支持历史K线数据API
     */
    private HistoryResponse generateSimulatedHistory(String symbol, String range) {
        int days = getDaysFromRange(range);
        long now = Instant.now().getEpochSecond();
        long dayInSeconds = 24 * 60 * 60;

        List<HistoryResponse.DataPoint> dataPoints = new ArrayList<>();

        // 获取当前价格作为基准
        BigDecimal basePrice = new BigDecimal("100.00");
        try {
            QuoteResponse quote = getQuote(symbol);
            basePrice = quote.getCurrentPrice();
        } catch (Exception e) {
            log.warn("Could not fetch current price for {}, using default base price", symbol);
        }

        // 生成随机波动的历史价格
        Random random = new Random(symbol.hashCode()); // 使用symbol作为种子,保证同一股票数据一致
        for (int i = days; i >= 0; i--) {
            long timestamp = (now - (i * dayInSeconds)) * 1000; // 转换为毫秒

            // 价格在基准价格的 ±15% 范围内波动
            double variationPercent = (random.nextDouble() - 0.5) * 0.3;
            BigDecimal variation = basePrice.multiply(new BigDecimal(variationPercent));
            BigDecimal price = basePrice.add(variation);

            // 生成开盘、最高、最低、收盘价
            BigDecimal open = price.multiply(new BigDecimal(0.98 + random.nextDouble() * 0.04));
            BigDecimal close = price.multiply(new BigDecimal(0.98 + random.nextDouble() * 0.04));
            BigDecimal high = price.multiply(new BigDecimal(1.00 + random.nextDouble() * 0.03));
            BigDecimal low = price.multiply(new BigDecimal(0.97 + random.nextDouble() * 0.03));
            long volume = (long) (1000000 + random.nextInt(10000000));

            dataPoints.add(HistoryResponse.DataPoint.builder()
                    .timestamp(timestamp)
                    .open(open.setScale(2, RoundingMode.HALF_UP))
                    .high(high.setScale(2, RoundingMode.HALF_UP))
                    .low(low.setScale(2, RoundingMode.HALF_UP))
                    .close(close.setScale(2, RoundingMode.HALF_UP))
                    .volume(volume)
                    .build());
        }

        return HistoryResponse.builder()
                .symbol(symbol)
                .range(range)
                .data(dataPoints)
                .build();
    }

    /**
     * 根据时间范围获取天数
     */
    private int getDaysFromRange(String range) {
        return switch (range.toUpperCase()) {
            case "1D" -> 1;
            case "1W" -> 7;
            case "1M" -> 30;
            case "3M" -> 90;
            case "1Y" -> 365;
            default -> 30;
        };
    }
}