# Get DEX activities with analysis
curl "http://localhost:3000/api/dex/defi-activities?address=ob2htHLoCu2P6tX7RrNVtiG1mYTas8NGJEVLaFEUngk&page=1&page_size=10"

# Get liquidity flow analysis
curl "http://localhost:3000/api/dex/liquidity-flows?poolAddress=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM"

# Get pool state with cached data
curl "http://localhost:3000/api/dex/pool-state?poolAddress=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM"



# Get liquidity flows for a pool
curl "http://localhost:3000/api/dex/liquidity-flows?poolAddress=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM" | json_pp

# Get pool state
curl "http://localhost:3000/api/dex/pool-state?poolAddress=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM" | json_pp

# Get DeFi activities
curl "http://localhost:3000/api/dex/defi-activities?address=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM" | json_pp





















a@a:~/solscanredacted$ # Get liquidity flows for a pool
curl "http://localhost:3000/api/dex/liquidity-flows?poolAddress=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   481  100   481    0     0  10141      0 --:--:-- --:--:-- --:--:-- 10234
{
   "data" : [
      {
         "efficiency" : {
            "gasUsed" : 150000,
            "optimalPath" : false
         },
         "impact" : {
            "depth" : 95,
            "poolReserves" : 100,
            "priceImpact" : 0.1,
            "slippage" : 0.05
         },
         "tokenFlow" : {
            "inflow" : 1,
            "netFlow" : -0.05,
            "outflow" : 0.95,
            "path" : [
               "tokenA",
               "tokenB"
            ]
         }
      },
      {
         "efficiency" : {
            "gasUsed" : 150000,
            "optimalPath" : false
         },
         "impact" : {
            "depth" : 95,
            "poolReserves" : 100,
            "priceImpact" : 0.1,
            "slippage" : 0.05
         },
         "tokenFlow" : {
            "inflow" : 1,
            "netFlow" : -0.05,
            "outflow" : 0.95,
            "path" : [
               "tokenA",
               "tokenB"
            ]
         }
      }
   ],
   "success" : true
}










a@a:~/solscanredacted$ # Get pool state
curl "http://localhost:3000/api/dex/pool-state?poolAddress=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   367  100   367    0     0  18180      0 --:--:-- --:--:-- --:--:-- 19315
{
   "data" : {
      "anomalies" : [
         {
            "details" : "path, price",
            "detected" : true,
            "severity" : 0.8,
            "type" : "path"
         },
         {
            "details" : "path, price",
            "detected" : true,
            "severity" : 0.8,
            "type" : "path"
         }
      ],
      "riskFactors" : [
         "suboptimal_path",
         "anomaly_path"
      ],
      "riskLevel" : "high",
      "tradingPatterns" : [
         {
            "confidence" : 0,
            "indicators" : [],
            "type" : "normal"
         },
         {
            "confidence" : 0,
            "indicators" : [],
            "type" : "normal"
         }
      ]
   },
   "success" : true
}
a@a:~/solscanredacted$ 
















a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/liquidity-flows?poolAddress=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM&interval=1h"
{"success":true,"data":{"success":true,"data":[{"timestamp":1744045200000,"open":0.95,"high":0.95,"low":0.95,"close":0.95,"volume":2,"count":2},{"timestamp":1744063200000,"open":0.95,"high":0.95,"low":0.95,"close":0.95,"volume":1,"count":1},{"timestamp":1744066800000,"open":0.95,"high":0.95,"low":0.95,"close":0.95,"volua@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/pool-state?poolAddress=8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM"F1yqHmN8uDbAhk6tWM"
{"success":true,"data":{"success":true,"data":{"tradingPatterns":[{"type":"normal","confidence":0,"indicators":[]},{"type":"normal","confidence":0,"indicators":[]},{"type":"normal","confidence":0,"indicators":[]},{"type":"normal","confidence":0,"indicators":[]},{"type":"normal","confidence":0,"indicators":[]}],"anomalies":[{"detected":true,"type":"path","severity":0.8,"details":"path, price"},{"detected":true,"type":"path","severity":0.8,"details":"path, price"},{"detected":true,"type":"path","severity":0.8,"details":"path, price"},{"detected":true,"type":"path","severity":0.3,"details":"path"},{"detected":true,"type":"path","severity":0.3,"details":"path"}],"riskLevel":"high","riskFactors":["suboptimal_path","anomaly_path"],"timeSeriesData":{"1h":[{"timestamp":1744045200000,"open":0.95,"high":0.95,"low":0.95,"close":0.95,"volume":2,"count":2},{"timestamp":1744063200000,"open":0.95,"high":0.95,"low":0.95,"close":0.95,"volume":1,"count":1},{"timestamp":1744066800000,"open":0.95,"high":0.95,"low":0.95,"close":0.95,"volume":2,"count":2}],"4h":[{"timestamp":1744041600000,"open":0.95,"high":0.95,"low":0.95,"close":0.95,"volume":2,"count":2},{"timestamp":1744056000000,"open":0.95,"high":0.95,"low":0.95,"close":0.95,"volume":3,"count":3}],"1d":[{"timestamp":1743984000000,"open":0.95,"high":0.95,"low":0.95,"close":0.95,"volume":5,"count":5}]}}}}a@a:~/solscanredacted$ 