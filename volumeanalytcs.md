a@a:~/solscanredacted$ 
curl -X POST "http://localhost:3000/api/analytics/volume/58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2/start"
{"success":true}a@a:~/solscanredacted$ 


a@a:~/solscanredacted$ curl "http://localhost:3000/api/analytics/volume/58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2/status"
{"poolAddress":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","isMonitoring":true,"alertCount":0}a@a:~/solscanredacted$ 



a@a:~/solscanredacted$ curl "http://localhost:3000/api/analytics/volume/58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2/alerts"
{"alerts":[]}a@a:~/solscanredacted$ 



