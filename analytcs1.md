curl "http://localhost:3000/api/dex/defi-activities?address=ob2htHLoCu2P6tX7RrNVtiG1mYTas8NGJEVLaFEUngk&page=1&page_size=10" | json_pp


# Get liquidity analytics for a pool
curl "http://localhost:3000/api/analytics/liquidity?pool_address=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM" | json_pp

# Get volume analytics
curl "http://localhost:3000/api/analytics/volume?pool_address=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM" | json_pp

# Get price analytics
curl "http://localhost:3000/api/analytics/price?token_address=HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3" | json_pp




# First, start a WebSocket connection
curl -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Host: localhost:3000" -H "Origin: http://localhost:3000" http://localhost:3000/ws

# Then in another terminal, subscribe to a pool
curl -X POST "http://localhost:3000/api/analytics/subscribe" -H "Content-Type: application/json" -d '{"pool_address": "8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM"}' | json_pp



curl "http://localhost:3000/api/analytics/arbitrage?token1=HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3&token2=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" | json_pp





curl "http://localhost:3000/api/analytics/patterns?pool_address=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM&timeframe=24h" | json_pp


# Get active alerts
curl "http://localhost:3000/api/analytics/alerts" | json_pp

# Get alerts for a specific pool
curl "http://localhost:3000/api/analytics/alerts?pool_address=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM" | json_pp



# Get cached pool state
curl "http://localhost:3000/api/dex/pools/8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM/state" | json_pp

# Get cached activities
curl "http://localhost:3000/api/dex/activities?pool_address=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM" | json_pp




# Make multiple rapid requests to test rate limiting
for i in {1..20}; do curl "http://localhost:3000/api/dex/defi-activities?address=ob2htHLoCu2P6tX7RrNVtiG1mYTas8NGJEVLaFEUngk&page=1&page_size=10" | json_pp; sleep 0.1; done