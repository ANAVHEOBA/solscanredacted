a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/balance-analytics?address=9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"
{"success":true,"data":{"flowMetrics":{"totalInflow":3210.0180000000005,"totalOutflow":3210.1997897,"netFlow":-0.18178969999962646,"flowCount":{"inflow":4,"outflow":6}},"tokenMetrics":{"uniqueTokens":["So11111111111111111111111111111111111111111","2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv"],"mostActive":{"token":"2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv","volume":6420},"volumeByToken":{"So11111111111111111111111111111111111111111":0.2177897,"2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv":6420}},"timeMetrics":{"firstActivity":1721830143,"lastActivity":1734453685,"averageInterval":1402615.7777777778,"peakVolume":{"time":1734453351,"volume":3210}},"riskMetrics":{"largeTransfers":{"count":2,"threshold":1000,"transactions":[{"time":1734453669,"amount":3210,"token":"2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv"},{"time":1734453351,"amount":3210,"token":"2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv"}]},"volatility":1283.9891115819335,"unusualPatterns":[{"type":"high_volatility","severity":0.7,"details":"High balance change volatility (1283.99)"}]}}}a@a:~/solscanredacted$ 













a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/balance-changes?address=9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"
{"success":true,"data":{"changes":[{"block_id":308085232,"block_time":1734453685,"trans_id":"34QejNTHjinT6fubDksjidAegBTyWeSSweP1DQWVxiv8FSUU4yDbmYmRFWvaGrCP58fQzk2yELSVAj1AKWYPe1rh","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":4984999,"pre_balance":4984999,"post_balance":0,"change_type":"dec","fee":15000,"time":"2024-12-17T16:41:25.000Z"},{"block_id":308085197,"block_time":1734453669,"trans_id":"22Yc3aToA82Uh8VNXga5MF2zFPkdVD5PVwvSa1YdMN32zE9dPv8xsRzuMCKMUK21zz4z6oe9AKHbRnJnVdaUyMd1","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv","token_account":"5BtKE9C63LvTigtBt2to5o6qqySaBTEfwsdftpKPGmkW","token_decimals":6,"amount":3210000000,"pre_balance":3210000000,"post_balance":0,"change_type":"dec","fee":15001,"time":"2024-12-17T16:41:09.000Z"},{"block_id":308085197,"block_time":1734453669,"trans_id":"22Yc3aToA82Uh8VNXga5MF2zFPkdVD5PVwvSa1YdMN32zE9dPv8xsRzuMCKMUK21zz4z6oe9AKHbRnJnVdaUyMd1","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":15001,"pre_balance":5000000,"post_balance":4984999,"change_type":"dec","fee":15001,"time":"2024-12-17T16:41:09.000Z"},{"block_id":308085116,"block_time":1734453635,"trans_id":"2Ji2b5dyoWVPy7GA6C61D6VUDb1qx4hCgsUNN8AVDukLMgZSwjouEAzboJYFt3ErP9nbj2iUCg1MhdFBDEVrYBcB","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":5000000,"pre_balance":0,"post_balance":5000000,"change_type":"inc","fee":15000,"time":"2024-12-17T16:40:35.000Z"},{"block_id":308084634,"block_time":1734453435,"trans_id":"2r618jWv9zNZMbEmn6byrTTunMdeosxKCvyTKs5MWCZkPbZhSwjJqJspT4LfDqKodWT7LTp8TcDPfUPtGMAWZAkL","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":10790720,"pre_balance":10790720,"post_balance":0,"change_type":"dec","fee":15000,"time":"2024-12-17T16:37:15.000Z"},{"block_id":308084434,"block_time":1734453351,"trans_id":"5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv","token_account":"5BtKE9C63LvTigtBt2to5o6qqySaBTEfwsdftpKPGmkW","token_decimals":6,"amount":3210000000,"pre_balance":0,"post_balance":3210000000,"change_type":"inc","fee":170000,"time":"2024-12-17T16:35:51.000Z"},{"block_id":308084434,"block_time":1734453351,"trans_id":"5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":2209280,"pre_balance":13000000,"post_balance":10790720,"change_type":"dec","fee":170000,"time":"2024-12-17T16:35:51.000Z"},{"block_id":308084232,"block_time":1734453266,"trans_id":"3C2FBZLhi7TBdBx1BozLxwXNoGJy1f1py4PcZCFze8GcHMXu779gyaQMWtQE5J9h2TASJ8G1UYSxAaBd5PdwSwhU","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":10000000,"pre_balance":3000000,"post_balance":13000000,"change_type":"inc","fee":15000,"time":"2024-12-17T16:34:26.000Z"},{"block_id":308083843,"block_time":1734453109,"trans_id":"2GfQmmnUV5DxKSp33apVs2ErY8mWkt5yDxruf6p14JFCUJMAZuYBmb1e5244NT4Uz4iq78vc32CQSSBY5it8i4Cc","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":3000000,"pre_balance":0,"post_balance":3000000,"change_type":"inc","fee":15000,"time":"2024-12-17T16:31:49.000Z"},{"block_id":279414368,"block_time":1721830143,"trans_id":"soGavDqhiLC7fayDqWVJ9tFHdXU5JusH7W7W2M4EYCrsrLNvjwMqyAUKQyeGAgDaTSM41kH22f964gMuQ8EKopd","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":181789700,"pre_balance":181789700,"post_balance":0,"change_type":"dec","fee":15000,"time":"2024-07-24T14:09:03.000Z"}],"analysis":{"summary":{"totalChanges":10,"uniqueTokens":["So11111111111111111111111111111111111111111","2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv"],"totalInflow":3210.018,"totalOutflow":3210.1997897,"netChange":-0.1817897000000812,"averageChangeSize":642.02177897},"tokenBreakdown":{"So11111111111111111111111111111111111111111":{"inflow":0.018000000000000002,"outflow":0.1997897,"netChange":-0.1817897,"changeCount":8,"averageChangeSize":0.027223712499999997},"2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv":{"inflow":3210,"outflow":3210,"netChange":0,"changeCount":2,"averageChangeSize":3210}},"timeAnalysis":{"firstChange":1721830143,"lastChange":1734453685,"averageInterval":1402615.7777777778,"busyPeriods":[{"startTime":1734453109,"endTime":1734453685,"changeCount":9,"totalVolume":6420.036}]},"patterns":{"largeChanges":[{"time":1734453351,"token":"2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv","amount":3210,"type":"inflow","transactionId":"5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2"},{"time":1734453669,"token":"2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv","amount":3210,"type":"outflow","transactionId":"22Yc3aToA82Uh8VNXga5MF2zFPkdVD5PVwvSa1YdMN32zE9dPv8xsRzuMCKMUK21zz4z6oe9AKHbRnJnVdaUyMd1"}],"frequentInteractions":[{"token":"So11111111111111111111111111111111111111111","frequency":8,"totalVolume":0.2177897,"averageSize":0.0272237125},{"token":"2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv","frequency":2,"totalVolume":6420,"averageSize":3210}],"volatilityScore":1283.9891115819337}}}}a@a:~/solscanredacted$ 




















a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/transactions?address=9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg&limit=10"
{"success":true,"data":{"transactions":[{"slot":308085232,"fee":15000,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1734453685,"tx_hash":"34QejNTHjinT6fubDksjidAegBTyWeSSweP1DQWVxiv8FSUU4yDbmYmRFWvaGrCP58fQzk2yELSVAj1AKWYPe1rh","parsed_instructions":[{"type":"transfer","program":"system","program_id":"11111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111"],"time":"2024-12-17T16:41:25.000Z"},{"slot":308085197,"fee":15001,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1734453669,"tx_hash":"22Yc3aToA82Uh8VNXga5MF2zFPkdVD5PVwvSa1YdMN32zE9dPv8xsRzuMCKMUK21zz4z6oe9AKHbRnJnVdaUyMd1","parsed_instructions":[{"type":"transferChecked","program":"spl-token","program_id":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],"time":"2024-12-17T16:41:09.000Z"},{"slot":308085116,"fee":15000,"status":"Success","signer":["9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV"],"block_time":1734453635,"tx_hash":"2Ji2b5dyoWVPy7GA6C61D6VUDb1qx4hCgsUNN8AVDukLMgZSwjouEAzboJYFt3ErP9nbj2iUCg1MhdFBDEVrYBcB","parsed_instructions":[{"type":"transfer","program":"system","program_id":"11111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111"],"time":"2024-12-17T16:40:35.000Z"},{"slot":308084634,"fee":15000,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1734453435,"tx_hash":"2r618jWv9zNZMbEmn6byrTTunMdeosxKCvyTKs5MWCZkPbZhSwjJqJspT4LfDqKodWT7LTp8TcDPfUPtGMAWZAkL","parsed_instructions":[{"type":"transfer","program":"system","program_id":"11111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111"],"time":"2024-12-17T16:37:15.000Z"},{"slot":308084434,"fee":170000,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1734453351,"tx_hash":"5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2","parsed_instructions":[{"type":"createIdempotent","program":"spl-associated-token-account","program_id":"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"},{"type":"getAccountDataSize","program":"spl-token","program_id":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"type":"createAccount","program":"system","program_id":"11111111111111111111111111111111"},{"type":"initializeImmutableOwner","program":"spl-token","program_id":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"type":"initializeAccount3","program":"spl-token","program_id":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"type":"transfer","program":"spl-token","program_id":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL","Ed25519SigVerify111111111111111111111111111","CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","11111111111111111111111111111111"],"time":"2024-12-17T16:35:51.000Z"},{"slot":308084232,"fee":15000,"status":"Success","signer":["9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV"],"block_time":1734453266,"tx_hash":"3C2FBZLhi7TBdBx1BozLxwXNoGJy1f1py4PcZCFze8GcHMXu779gyaQMWtQE5J9h2TASJ8G1UYSxAaBd5PdwSwhU","parsed_instructions":[{"type":"transfer","program":"system","program_id":"11111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111"],"time":"2024-12-17T16:34:26.000Z"},{"slot":308083843,"fee":15000,"status":"Success","signer":["9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV"],"block_time":1734453109,"tx_hash":"2GfQmmnUV5DxKSp33apVs2ErY8mWkt5yDxruf6p14JFCUJMAZuYBmb1e5244NT4Uz4iq78vc32CQSSBY5it8i4Cc","parsed_instructions":[{"type":"transfer","program":"system","program_id":"11111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111"],"time":"2024-12-17T16:31:49.000Z"},{"slot":279414368,"fee":15000,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1721830143,"tx_hash":"soGavDqhiLC7fayDqWVJ9tFHdXU5JusH7W7W2M4EYCrsrLNvjwMqyAUKQyeGAgDaTSM41kH22f964gMuQ8EKopd","parsed_instructions":[{"type":"transfer","program":"system","program_id":"11111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111"],"time":"2024-07-24T14:09:03.000Z"},{"slot":279414099,"fee":10000,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1721830023,"tx_hash":"32FzLa6WyP97y3FRU8VZvzU7zn2ja4CQpWFVc6NsZcsS1xZAS2hYTksTofB3FqufuF2XUr97XBMDgG6QMfh5pxAr","parsed_instructions":[{"type":"burn","program":"mpl_token_metadata","program_id":"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"}],"program_ids":["ComputeBudget111111111111111111111111111111","F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7","11111111111111111111111111111111","metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],"time":"2024-07-24T14:07:03.000Z"},{"slot":279414099,"fee":10000,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1721830023,"tx_hash":"5nCfJ17d3qY6GWVspEjSoFqvRtpTjHuMPqu3mTmr2EuxPJ61pRuZ9xckZqcqyLZJ2h26f5Sbo2eNQmFom4odk2VL","parsed_instructions":[{"type":"burn","program":"mpl_token_metadata","program_id":"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"}],"program_ids":["ComputeBudget111111111111111111111111111111","F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7","11111111111111111111111111111111","metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],"time":"2024-07-24T14:07:03.000Z"}],"analysis":{"summary":{"totalTransactions":10,"uniqueSigners":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV"],"totalFees":295001,"averageFee":29500.1,"successRate":1},"programBreakdown":{"ComputeBudget111111111111111111111111111111":{"callCount":10,"instructionTypes":{"SetComputeUnitPrice":8,"SetComputeUnitLimit":8},"totalFees":295001,"successCount":10},"F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7":{"callCount":2,"instructionTypes":{},"totalFees":20000,"successCount":2},"11111111111111111111111111111111":{"callCount":9,"instructionTypes":{"transfer":6,"createAccount":1},"totalFees":280000,"successCount":9},"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s":{"callCount":2,"instructionTypes":{"burn":2},"totalFees":20000,"successCount":2},"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA":{"callCount":4,"instructionTypes":{"getAccountDataSize":1,"initializeImmutableOwner":1,"initializeAccount3":1,"transfer":1,"transferChecked":1},"totalFees":205001,"successCount":4},"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL":{"callCount":1,"instructionTypes":{"createIdempotent":1},"totalFees":170000,"successCount":1},"Ed25519SigVerify111111111111111111111111111":{"callCount":1,"instructionTypes":{},"totalFees":170000,"successCount":1},"CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR":{"callCount":1,"instructionTypes":{},"totalFees":170000,"successCount":1}},"timeAnalysis":{"firstTransaction":1721830023,"lastTransaction":1734453685,"averageInterval":1402629.111111111,"busyPeriods":[{"startTime":1721830023,"endTime":1721830143,"transactionCount":3,"totalFees":35000,"programs":["ComputeBudget111111111111111111111111111111","F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7","11111111111111111111111111111111","metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"]},{"startTime":1734453109,"endTime":1734453685,"transactionCount":7,"totalFees":260001,"programs":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111","ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL","Ed25519SigVerify111111111111111111111111111","CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"]}]},"patterns":{"highFeeTransactions":[{"time":1734453351,"hash":"5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2","fee":170000,"programs":["ComputeBudget111111111111111111111111111111","ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL","Ed25519SigVerify111111111111111111111111111","CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","11111111111111111111111111111111"],"status":"Success"}],"complexTransactions":[{"time":1734453351,"hash":"5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2","instructionCount":8,"programs":["ComputeBudget111111111111111111111111111111","ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL","Ed25519SigVerify111111111111111111111111111","CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","11111111111111111111111111111111"],"status":"Success"}],"frequentPrograms":[{"programId":"ComputeBudget111111111111111111111111111111","callCount":10,"successRate":1,"averageFee":29500.1},{"programId":"11111111111111111111111111111111","callCount":9,"successRate":1,"averageFee":31111.11111111111},{"programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","callCount":4,"successRate":1,"averageFee":51250.25},{"programId":"F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7","callCount":2,"successRate":1,"averageFee":10000},{"programId":"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s","callCount":2,"successRate":1,"averageFee":10000}],"signerActivity":{"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg":{"transactionCount":7,"totalFees":250001,"successCount":7,"programs":{"ComputeBudget111111111111111111111111111111":7,"F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7":2,"11111111111111111111111111111111":6,"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s":2,"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA":4,"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL":1,"Ed25519SigVerify111111111111111111111111111":1,"CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR":1}},"9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV":{"transactionCount":3,"totalFees":45000,"successCount":3,"programs":{"ComputeBudget111111111111111111111111111111":3,"11111111111111111111111111111111":3}}}}}}}a@a:~/solscanredacted$ 



























a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/transactions?address=9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg&limit=10" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 12189  100 12189    0     0   7080      0  0:00:01  0:00:01 --:--:--  7107
{
   "data" : {
      "analysis" : {
         "patterns" : {
            "complexTransactions" : [
               {
                  "hash" : "5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2",
                  "instructionCount" : 8,
                  "programs" : [
                     "ComputeBudget111111111111111111111111111111",
                     "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
                     "Ed25519SigVerify111111111111111111111111111",
                     "CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR",
                     "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                     "11111111111111111111111111111111"
                  ],
                  "status" : "Success",
                  "time" : 1734453351
               }
            ],
            "frequentPrograms" : [
               {
                  "averageFee" : 29500.1,
                  "callCount" : 10,
                  "programId" : "ComputeBudget111111111111111111111111111111",
                  "successRate" : 1
               },
               {
                  "averageFee" : 31111.1111111111,
                  "callCount" : 9,
                  "programId" : "11111111111111111111111111111111",
                  "successRate" : 1
               },
               {
                  "averageFee" : 51250.25,
                  "callCount" : 4,
                  "programId" : "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                  "successRate" : 1
               },
               {
                  "averageFee" : 10000,
                  "callCount" : 2,
                  "programId" : "F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7",
                  "successRate" : 1
               },
               {
                  "averageFee" : 10000,
                  "callCount" : 2,
                  "programId" : "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
                  "successRate" : 1
               }
            ],
            "highFeeTransactions" : [
               {
                  "fee" : 170000,
                  "hash" : "5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2",
                  "programs" : [
                     "ComputeBudget111111111111111111111111111111",
                     "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
                     "Ed25519SigVerify111111111111111111111111111",
                     "CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR",
                     "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                     "11111111111111111111111111111111"
                  ],
                  "status" : "Success",
                  "time" : 1734453351
               }
            ],
            "signerActivity" : {
               "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg" : {
                  "programs" : {
                     "11111111111111111111111111111111" : 6,
                     "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL" : 1,
                     "CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR" : 1,
                     "ComputeBudget111111111111111111111111111111" : 7,
                     "Ed25519SigVerify111111111111111111111111111" : 1,
                     "F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7" : 2,
                     "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" : 4,
                     "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s" : 2
                  },
                  "successCount" : 7,
                  "totalFees" : 250001,
                  "transactionCount" : 7
               },
               "9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV" : {
                  "programs" : {
                     "11111111111111111111111111111111" : 3,
                     "ComputeBudget111111111111111111111111111111" : 3
                  },
                  "successCount" : 3,
                  "totalFees" : 45000,
                  "transactionCount" : 3
               }
            }
         },
         "programBreakdown" : {
            "11111111111111111111111111111111" : {
               "callCount" : 9,
               "instructionTypes" : {
                  "createAccount" : 1,
                  "transfer" : 6
               },
               "successCount" : 9,
               "totalFees" : 280000
            },
            "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL" : {
               "callCount" : 1,
               "instructionTypes" : {
                  "createIdempotent" : 1
               },
               "successCount" : 1,
               "totalFees" : 170000
            },
            "CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR" : {
               "callCount" : 1,
               "instructionTypes" : {},
               "successCount" : 1,
               "totalFees" : 170000
            },
            "ComputeBudget111111111111111111111111111111" : {
               "callCount" : 10,
               "instructionTypes" : {
                  "SetComputeUnitLimit" : 8,
                  "SetComputeUnitPrice" : 8
               },
               "successCount" : 10,
               "totalFees" : 295001
            },
            "Ed25519SigVerify111111111111111111111111111" : {
               "callCount" : 1,
               "instructionTypes" : {},
               "successCount" : 1,
               "totalFees" : 170000
            },
            "F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7" : {
               "callCount" : 2,
               "instructionTypes" : {},
               "successCount" : 2,
               "totalFees" : 20000
            },
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" : {
               "callCount" : 4,
               "instructionTypes" : {
                  "getAccountDataSize" : 1,
                  "initializeAccount3" : 1,
                  "initializeImmutableOwner" : 1,
                  "transfer" : 1,
                  "transferChecked" : 1
               },
               "successCount" : 4,
               "totalFees" : 205001
            },
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s" : {
               "callCount" : 2,
               "instructionTypes" : {
                  "burn" : 2
               },
               "successCount" : 2,
               "totalFees" : 20000
            }
         },
         "summary" : {
            "averageFee" : 29500.1,
            "successRate" : 1,
            "totalFees" : 295001,
            "totalTransactions" : 10,
            "uniqueSigners" : [
               "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
               "9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV"
            ]
         },
         "timeAnalysis" : {
            "averageInterval" : 1402629.11111111,
            "busyPeriods" : [
               {
                  "endTime" : 1721830143,
                  "programs" : [
                     "ComputeBudget111111111111111111111111111111",
                     "F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7",
                     "11111111111111111111111111111111",
                     "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
                     "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                  ],
                  "startTime" : 1721830023,
                  "totalFees" : 35000,
                  "transactionCount" : 3
               },
               {
                  "endTime" : 1734453685,
                  "programs" : [
                     "ComputeBudget111111111111111111111111111111",
                     "11111111111111111111111111111111",
                     "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
                     "Ed25519SigVerify111111111111111111111111111",
                     "CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR",
                     "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                  ],
                  "startTime" : 1734453109,
                  "totalFees" : 260001,
                  "transactionCount" : 7
               }
            ],
            "firstTransaction" : 1721830023,
            "lastTransaction" : 1734453685
         }
      },
      "transactions" : [
         {
            "block_time" : 1734453685,
            "fee" : 15000,
            "parsed_instructions" : [
               {
                  "program" : "system",
                  "program_id" : "11111111111111111111111111111111",
                  "type" : "transfer"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitPrice"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitLimit"
               }
            ],
            "program_ids" : [
               "ComputeBudget111111111111111111111111111111",
               "11111111111111111111111111111111"
            ],
            "signer" : [
               "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"
            ],
            "slot" : 308085232,
            "status" : "Success",
            "time" : "2024-12-17T16:41:25.000Z",
            "tx_hash" : "34QejNTHjinT6fubDksjidAegBTyWeSSweP1DQWVxiv8FSUU4yDbmYmRFWvaGrCP58fQzk2yELSVAj1AKWYPe1rh"
         },
         {
            "block_time" : 1734453669,
            "fee" : 15001,
            "parsed_instructions" : [
               {
                  "program" : "spl-token",
                  "program_id" : "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                  "type" : "transferChecked"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitPrice"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitLimit"
               }
            ],
            "program_ids" : [
               "ComputeBudget111111111111111111111111111111",
               "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ],
            "signer" : [
               "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"
            ],
            "slot" : 308085197,
            "status" : "Success",
            "time" : "2024-12-17T16:41:09.000Z",
            "tx_hash" : "22Yc3aToA82Uh8VNXga5MF2zFPkdVD5PVwvSa1YdMN32zE9dPv8xsRzuMCKMUK21zz4z6oe9AKHbRnJnVdaUyMd1"
         },
         {
            "block_time" : 1734453635,
            "fee" : 15000,
            "parsed_instructions" : [
               {
                  "program" : "system",
                  "program_id" : "11111111111111111111111111111111",
                  "type" : "transfer"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitPrice"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitLimit"
               }
            ],
            "program_ids" : [
               "ComputeBudget111111111111111111111111111111",
               "11111111111111111111111111111111"
            ],
            "signer" : [
               "9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV"
            ],
            "slot" : 308085116,
            "status" : "Success",
            "time" : "2024-12-17T16:40:35.000Z",
            "tx_hash" : "2Ji2b5dyoWVPy7GA6C61D6VUDb1qx4hCgsUNN8AVDukLMgZSwjouEAzboJYFt3ErP9nbj2iUCg1MhdFBDEVrYBcB"
         },
         {
            "block_time" : 1734453435,
            "fee" : 15000,
            "parsed_instructions" : [
               {
                  "program" : "system",
                  "program_id" : "11111111111111111111111111111111",
                  "type" : "transfer"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitPrice"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitLimit"
               }
            ],
            "program_ids" : [
               "ComputeBudget111111111111111111111111111111",
               "11111111111111111111111111111111"
            ],
            "signer" : [
               "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"
            ],
            "slot" : 308084634,
            "status" : "Success",
            "time" : "2024-12-17T16:37:15.000Z",
            "tx_hash" : "2r618jWv9zNZMbEmn6byrTTunMdeosxKCvyTKs5MWCZkPbZhSwjJqJspT4LfDqKodWT7LTp8TcDPfUPtGMAWZAkL"
         },
         {
            "block_time" : 1734453351,
            "fee" : 170000,
            "parsed_instructions" : [
               {
                  "program" : "spl-associated-token-account",
                  "program_id" : "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
                  "type" : "createIdempotent"
               },
               {
                  "program" : "spl-token",
                  "program_id" : "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                  "type" : "getAccountDataSize"
               },
               {
                  "program" : "system",
                  "program_id" : "11111111111111111111111111111111",
                  "type" : "createAccount"
               },
               {
                  "program" : "spl-token",
                  "program_id" : "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                  "type" : "initializeImmutableOwner"
               },
               {
                  "program" : "spl-token",
                  "program_id" : "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                  "type" : "initializeAccount3"
               },
               {
                  "program" : "spl-token",
                  "program_id" : "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                  "type" : "transfer"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitLimit"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitPrice"
               }
            ],
            "program_ids" : [
               "ComputeBudget111111111111111111111111111111",
               "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
               "Ed25519SigVerify111111111111111111111111111",
               "CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR",
               "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
               "11111111111111111111111111111111"
            ],
            "signer" : [
               "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"
            ],
            "slot" : 308084434,
            "status" : "Success",
            "time" : "2024-12-17T16:35:51.000Z",
            "tx_hash" : "5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2"
         },
         {
            "block_time" : 1734453266,
            "fee" : 15000,
            "parsed_instructions" : [
               {
                  "program" : "system",
                  "program_id" : "11111111111111111111111111111111",
                  "type" : "transfer"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitPrice"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitLimit"
               }
            ],
            "program_ids" : [
               "ComputeBudget111111111111111111111111111111",
               "11111111111111111111111111111111"
            ],
            "signer" : [
               "9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV"
            ],
            "slot" : 308084232,
            "status" : "Success",
            "time" : "2024-12-17T16:34:26.000Z",
            "tx_hash" : "3C2FBZLhi7TBdBx1BozLxwXNoGJy1f1py4PcZCFze8GcHMXu779gyaQMWtQE5J9h2TASJ8G1UYSxAaBd5PdwSwhU"
         },
         {
            "block_time" : 1734453109,
            "fee" : 15000,
            "parsed_instructions" : [
               {
                  "program" : "system",
                  "program_id" : "11111111111111111111111111111111",
                  "type" : "transfer"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitPrice"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitLimit"
               }
            ],
            "program_ids" : [
               "ComputeBudget111111111111111111111111111111",
               "11111111111111111111111111111111"
            ],
            "signer" : [
               "9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV"
            ],
            "slot" : 308083843,
            "status" : "Success",
            "time" : "2024-12-17T16:31:49.000Z",
            "tx_hash" : "2GfQmmnUV5DxKSp33apVs2ErY8mWkt5yDxruf6p14JFCUJMAZuYBmb1e5244NT4Uz4iq78vc32CQSSBY5it8i4Cc"
         },
         {
            "block_time" : 1721830143,
            "fee" : 15000,
            "parsed_instructions" : [
               {
                  "program" : "system",
                  "program_id" : "11111111111111111111111111111111",
                  "type" : "transfer"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitPrice"
               },
               {
                  "program" : "ComputeBudget",
                  "program_id" : "ComputeBudget111111111111111111111111111111",
                  "type" : "SetComputeUnitLimit"
               }
            ],
            "program_ids" : [
               "ComputeBudget111111111111111111111111111111",
               "11111111111111111111111111111111"
            ],
            "signer" : [
               "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"
            ],
            "slot" : 279414368,
            "status" : "Success",
            "time" : "2024-07-24T14:09:03.000Z",
            "tx_hash" : "soGavDqhiLC7fayDqWVJ9tFHdXU5JusH7W7W2M4EYCrsrLNvjwMqyAUKQyeGAgDaTSM41kH22f964gMuQ8EKopd"
         },
         {
            "block_time" : 1721830023,
            "fee" : 10000,
            "parsed_instructions" : [
               {
                  "program" : "mpl_token_metadata",
                  "program_id" : "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
                  "type" : "burn"
               }
            ],
            "program_ids" : [
               "ComputeBudget111111111111111111111111111111",
               "F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7",
               "11111111111111111111111111111111",
               "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
               "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ],
            "signer" : [
               "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"
            ],
            "slot" : 279414099,
            "status" : "Success",
            "time" : "2024-07-24T14:07:03.000Z",
            "tx_hash" : "32FzLa6WyP97y3FRU8VZvzU7zn2ja4CQpWFVc6NsZcsS1xZAS2hYTksTofB3FqufuF2XUr97XBMDgG6QMfh5pxAr"
         },
         {
            "block_time" : 1721830023,
            "fee" : 10000,
            "parsed_instructions" : [
               {
                  "program" : "mpl_token_metadata",
                  "program_id" : "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
                  "type" : "burn"
               }
            ],
            "program_ids" : [
               "ComputeBudget111111111111111111111111111111",
               "F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7",
               "11111111111111111111111111111111",
               "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
               "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ],
            "signer" : [
               "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"
            ],
            "slot" : 279414099,
            "status" : "Success",
            "time" : "2024-07-24T14:07:03.000Z",
            "tx_hash" : "5nCfJ17d3qY6GWVspEjSoFqvRtpTjHuMPqu3mTmr2EuxPJ61pRuZ9xckZqcqyLZJ2h26f5Sbo2eNQmFom4odk2VL"
         }
      ]
   },
   "success" : true
}
a@a:~/solscanredacted$ 