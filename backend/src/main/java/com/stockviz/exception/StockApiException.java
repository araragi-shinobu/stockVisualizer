package com.stockviz.exception;

/**
 * 股票 API 异常
 */
public class StockApiException extends RuntimeException {
    
    public StockApiException(String message) {
        super(message);
    }

    public StockApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
