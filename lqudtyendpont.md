a@a:~/solscanredacted$ curl "http://localhost:3000/api/analytics/liquidity/alerts?poolAddress=58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2&limit=10&offset=0" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   106  100   106    0     0  11067      0 --:--:-- --:--:-- --:--:-- 17666
{
   "alerts" : [],
   "limit" : 10,
   "offset" : 0,
   "poolAddress" : "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
   "total" : 0
}
a@a:~/solscanredacted$ curl -X POST http://localhost:3000/api/analytics/liquidity/monitor   -H "Content-Type: application/json"   -d '{"poolAddress": "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"}' | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   161  100    98  100    63      8      5  0:00:12  0:00:11  0:00:01    28
{
   "message" : "Started monitoring pool: 58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
   "success" : true
}
a@a:~/solscanredacted$ curl "http://localhost:3000/api/analytics/liquidity/status?poolAddress=58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    97  100    97    0     0  10576      0 --:--:-- --:--:-- --:--:-- 13857
{
   "alertCount" : 0,
   "isMonitoring" : true,
   "poolAddress" : "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"
}
a@a:~/solscanredacted$ curl "http://localhost:3000/api/analytics/liquidity/alerts?poolAddress=58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2&limit=10&offset=0" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   106  100   106    0     0  12956      0 --:--:-- --:--:-- --:--:-- 15142
{
   "alerts" : [],
   "limit" : 10,
   "offset" : 0,
   "poolAddress" : "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
   "total" : 0
}
a@a:~/solscanredacted$ curl "http://localhost:3000/api/analytics/liquidity/alerts?poolAddress=58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2&limit=10&offset=0" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   106  100   106    0     0  28812      0 --:--:-- --:--:-- --:--:-- 35333
{
   "alerts" : [],
   "limit" : 10,
   "offset" : 0,
   "poolAddress" : "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
   "total" : 0
}
a@a:~/solscanredacted$ 