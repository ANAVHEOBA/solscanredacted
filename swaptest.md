a@a:~/solscanredacted$ curl -X POST "http://localhost:3000/api/analytics/swaps/58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2/start"
{"success":true,"message":"Started swap monitoring for pool 58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"}a@a:~/solscanredacted$ 








a@a:~/solscanredacted$ curl "http://localhost:3000/api/analytics/swaps/58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2/status"
{"success":true,"data":{"isMonitoring":true,"poolAddress":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","alertCount":0}}a@a:~/solscanredacted$ 




a@a:~/solscanredacted$ curl "http://localhost:3000/api/analytics/swaps/58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2/metrics"
{"success":true,"data":{"poolAddress":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","timeframe":3600,"metrics":{"swapCount":0,"totalVolume":0,"averageSize":0,"uniqueAddresses":0,"priceVolatility":0}}}a@a:~/solscanredacted$ 




a@a:~/solscanredacted$ curl "http://localhost:3000/api/analytics/swaps/58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2/alerts"
{"success":true,"data":[]}a@a:~/solscanredacted$ 




a@a:~/solscanredacted$ curl -X POST "http://localhost:3000/api/analytics/swaps/58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2/stop"
{"success":true,"message":"Stopped swap monitoring for pool 58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"}a@a:~/solscanredacted$ 


