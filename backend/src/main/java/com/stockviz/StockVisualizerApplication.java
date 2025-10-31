package com.stockviz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * 股票数据可视化工具 - 主应用程序
 * 
 * @author YourName
 * @version 1.0
 */
@SpringBootApplication
@EnableCaching
public class StockVisualizerApplication {

    public static void main(String[] args) {
        SpringApplication.run(StockVisualizerApplication.class, args);
    }
}
