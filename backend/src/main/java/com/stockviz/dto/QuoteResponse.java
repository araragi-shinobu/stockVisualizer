package com.stockviz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 股票报价数据传输对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuoteResponse {
    
    private String symbol;              // 股票代码
    private String name;                // 公司名称
    private BigDecimal currentPrice;    // 当前价格
    private BigDecimal change;          // 涨跌额
    private BigDecimal changePercent;   // 涨跌幅 %
    private BigDecimal open;            // 开盘价
    private BigDecimal high;            // 最高价
    private BigDecimal low;             // 最低价
    private BigDecimal previousClose;   // 昨收价
    private Long volume;                // 成交量
    private Long timestamp;             // 时间戳
}
