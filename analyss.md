Liquidity Changes Analysis

       // Combine these endpoints:
- Market: `/market/volume` - Get volume data over time
- Token: `/token/holders` - Track LP token holder changes
- DEX: `/balance-changes` - Monitor pool balance changes
- Transaction: `/actions` - Analyze liquidity add/remove actions

Analysis approach:
1. Track LP token movements from token/holders
2. Monitor pool balance changes from balance-changes
3. Correlate with market volume data
4. Use transaction actions to identify liquidity events





Volume Anomaly Detection



// Combine these endpoints:
- Market: `/market/volume` - Base volume data
- Token: `/defi-activities` - DEX trading activities
- DEX: `/defi-activities` - Overall DEX activities
- Transaction: `/last` - Recent transaction patterns

Analysis approach:
1. Calculate baseline volume from historical data
2. Set standard deviation thresholds
3. Monitor real-time volume changes
4. Compare across different time windows (1h, 4h, 24h)


Price Movement Patterns


// Combine these endpoints:
- Token: `/price` - Token price data
- Token: `/markets` - Market pairs data
- Market: `/info` - Market details
- Transaction: `/actions` - Trade actions

Analysis approach:
1. Track price movements across different markets
2. Calculate price momentum indicators
3. Identify support/resistance levels
4. Detect pattern formations (e.g., sudden spikes)



Arbitrage Monitoring


// Combine these endpoints:
- Token: `/markets` - Get all markets for a token
- Market: `/info` - Get detailed market info
- DEX: `/transactions` - Monitor arbitrage transactions
- Transaction: `/detail` - Analyze transaction details

Analysis approach:
1. Compare prices across different markets
2. Calculate price differences and potential profits
3. Monitor high-frequency trading patterns
4. Track successful arbitrage transactions



Swap Activity Analysis



// Combine these endpoints:
- DEX: `/defi-activities` - Get swap activities
- Token: `/transfers` - Track token movements
- Market: `/volume` - Compare with market volume
- Transaction: `/actions` - Analyze swap details

Analysis approach:
1. Monitor swap sizes and frequencies
2. Calculate impact on pool prices
3. Identify related transactions
4. Measure slippage and price impact





