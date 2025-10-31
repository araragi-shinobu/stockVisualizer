package com.stockviz.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import com.github.benmanes.caffeine.cache.Caffeine;

import java.time.Duration;

/**
 * 应用配置类
 */
@Configuration
@EnableCaching
public class AppConfig {

    /**
     * RestTemplate Bean - 用于 HTTP 请求
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * ObjectMapper Bean - 用于 JSON 处理
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    /**
     * 缓存管理器 - 使用 Caffeine
     * quotes: 缓存实时报价 60 秒
     * history: 缓存历史数据 5 分钟
     */
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("stockQuote", "stockHistory");
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofSeconds(60))
                .maximumSize(1000)
                .recordStats());
        return cacheManager;
    }
}
