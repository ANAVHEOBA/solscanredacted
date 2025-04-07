a@a:~/solscanredacted$ curl -X POST 'http://localhost:3000/api/analytics/arbitrage/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/start' \
  -H 'Content-Type: application/json'
{"success":true,"message":"Started arbitrage monitoring for token EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}a@a:~/solscanredacted$ 





a@a:~/solscanredacted$ curl -X GET 'http://localhost:3000/api/analytics/arbitrage/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/status'
{"success":true,"data":{"isMonitoring":true,"tokenAddress":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","alertCount":0}}a@a:~/solscanredacted$ 



a@a:~/solscanredacted$ curl -X GET 'http://localhost:3000/api/analytics/arbitrage/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/alerts'
{"success":true,"data":[]}a@a:~/solscanredacted$ 


a@a:~/solscanredacted$ curl -X POST 'http://localhost:3000/api/analytics/arbitrage/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/stop' \
  -H 'Content-Type: application/json'
{"success":true,"message":"Stopped arbitrage monitoring for token EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}a@a:~/solscanredacted$ 




a@a:~/solscanredacted$ curl -X GET 'http://localhost:3000/api/analytics/monitoring/status?address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
{"address":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","monitoring":{"liquidity":false,"volume":false,"price":false,"arbitrage":false},"alertCounts":{"liquidity":0,"volume":0,"price":0,"arbitrage":0},"lastAlerts":{}}a@a:~/solscanredacted$ 





