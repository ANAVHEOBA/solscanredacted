a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/defi-activities?address=ob2htHLoCu2P6tX7RrNVtiG1mYTas8NGJEVLaFEUngk&page=1&page_size=10" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 12747  100 12747    0     0   2073      0  0:00:06  0:00:06 --:--:--  3231
[
   {
      "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
      "block_id" : 331467457,
      "block_time" : 1743860506,
      "from_address" : "JD25qVdtd65FoiXNmR89JjmoJdYk9sjYQeSTZAALFiMy",
      "platform" : [
         "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
         "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
      ],
      "routers" : {
         "amount1" : 480629973,
         "amount2" : 63141266,
         "child_routers" : [
            {
               "amount1" : "480629973",
               "amount2" : "535669051",
               "pool_address" : "8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM",
               "program_address" : "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
               "token1" : "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
               "token1_decimals" : 6,
               "token2" : "So11111111111111111111111111111111111111112",
               "token2_decimals" : 9
            },
            {
               "amount1" : "535669051",
               "amount2" : "63141266",
               "pool_address" : "DrRd8gYMJu9XGxLhwTCPdHNLXCKHsxJtMpbn62YqmwQe",
               "program_address" : "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c",
               "token1" : "So11111111111111111111111111111111111111112",
               "token1_decimals" : 9,
               "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
               "token2_decimals" : 6
            }
         ],
         "token1" : "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
         "token1_decimals" : 6,
         "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token2_decimals" : 6
      },
      "sources" : [
         "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
         "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c"
      ],
      "time" : "2025-04-05T13:41:46.000Z",
      "trans_id" : "4h1gWAxwNqx6pBAVq4LM8TzgCqcRus4E6qspyZNAv6hUbvnaGecmGi6fQock6KNwKP8T1V31rSCNaXXDB72bP3mU",
      "value" : 63.141266
   },
   {
      "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
      "block_id" : 331466870,
      "block_time" : 1743860274,
      "from_address" : "JD38n7ynKYcgPpF7k1BhXEeREu1KqptU93fVGy3S624k",
      "platform" : [
         "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
         "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
      ],
      "routers" : {
         "amount1" : 661851735794,
         "amount2" : 54354929,
         "child_routers" : [
            {
               "amount1" : "661851735794",
               "amount2" : "54354929",
               "pool_address" : "CsJTG4mospaCYvwQghmL5SAqh8YUkBw6YyzBrbfvTDSN",
               "program_address" : "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
               "token1" : "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
               "token1_decimals" : 9,
               "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
               "token2_decimals" : 6
            }
         ],
         "token1" : "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
         "token1_decimals" : 9,
         "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token2_decimals" : 6
      },
      "sources" : [
         "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
      ],
      "time" : "2025-04-05T13:37:54.000Z",
      "trans_id" : "J7RFc88RWHCFrQsYTEokttz4dbn4Uji1pgp22MtsLgzhxELTD1gUmPVwwsc1WEbanj5F7Cedckbkf2L3J1quiT7",
      "value" : 54.354929
   },
   {
      "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
      "block_id" : 331458472,
      "block_time" : 1743856912,
      "from_address" : "JD25qVdtd65FoiXNmR89JjmoJdYk9sjYQeSTZAALFiMy",
      "platform" : [
         "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
         "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
      ],
      "routers" : {
         "amount1" : 480629973,
         "amount2" : 64009939,
         "child_routers" : [
            {
               "amount1" : "480629973",
               "amount2" : "64009939",
               "pool_address" : "7qnkr7EQJjwKbQyemdMKiemXDjyri4C54Z9JMakMWey2",
               "program_address" : "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
               "token1" : "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
               "token1_decimals" : 6,
               "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
               "token2_decimals" : 6
            }
         ],
         "token1" : "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
         "token1_decimals" : 6,
         "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token2_decimals" : 6
      },
      "sources" : [
         "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"
      ],
      "time" : "2025-04-05T12:41:52.000Z",
      "trans_id" : "53SyHC7uuR3QrPJX35fEKvPHLKU2HafYCn35dfBxe8L8raDrpbwBR3nht49E9LBHdr1x7sQuKh1MEWrnZYY8CAoP",
      "value" : 64.009939
   },
   {
      "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
      "block_id" : 331457855,
      "block_time" : 1743856668,
      "from_address" : "JD25qVdtd65FoiXNmR89JjmoJdYk9sjYQeSTZAALFiMy",
      "platform" : [
         "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
         "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
      ],
      "routers" : {
         "amount1" : 661851735794,
         "amount2" : 54657597,
         "child_routers" : [
            {
               "amount1" : "661851735794",
               "amount2" : "54657597",
               "pool_address" : "CsJTG4mospaCYvwQghmL5SAqh8YUkBw6YyzBrbfvTDSN",
               "program_address" : "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
               "token1" : "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
               "token1_decimals" : 9,
               "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
               "token2_decimals" : 6
            }
         ],
         "token1" : "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
         "token1_decimals" : 9,
         "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token2_decimals" : 6
      },
      "sources" : [
         "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
      ],
      "time" : "2025-04-05T12:37:48.000Z",
      "trans_id" : "3gKYuWBp6Zwos53t9JFLtWWz8DjFSMuumfpKLnk4MAr8jgbTRRK8xrjo1UKsAbw1mVU1v3gJdkyUwrJ9rfoSzM5Y",
      "value" : 54.657597
   },
   {
      "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
      "block_id" : 331449425,
      "block_time" : 1743853304,
      "from_address" : "JD38n7ynKYcgPpF7k1BhXEeREu1KqptU93fVGy3S624k",
      "platform" : [
         "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
         "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
      ],
      "routers" : {
         "amount1" : 480629973,
         "amount2" : 64115450,
         "child_routers" : [
            {
               "amount1" : "480629973",
               "amount2" : "534223084",
               "pool_address" : "8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM",
               "program_address" : "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
               "token1" : "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
               "token1_decimals" : 6,
               "token2" : "So11111111111111111111111111111111111111112",
               "token2_decimals" : 9
            },
            {
               "amount1" : "534223084",
               "amount2" : "64115450",
               "pool_address" : "DH4xmaWDnTzKXehVaPSNy9tMKJxnYL5Mo5U3oTHFtNYJ",
               "program_address" : "SoLFiHG9TfgtdUXUjWAxi3LtvYuFyDLVhBWxdMZxyCe",
               "token1" : "So11111111111111111111111111111111111111112",
               "token1_decimals" : 9,
               "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
               "token2_decimals" : 6
            }
         ],
         "token1" : "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
         "token1_decimals" : 6,
         "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token2_decimals" : 6
      },
      "sources" : [
         "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
         "SoLFiHG9TfgtdUXUjWAxi3LtvYuFyDLVhBWxdMZxyCe"
      ],
      "time" : "2025-04-05T11:41:44.000Z",
      "trans_id" : "2YBYYRWd8fVd8BkT2LZ5sRn4NDXfnC96vzDp4GzuqXNqG1EeZLKBPjBf9tWq3s6EbD4ZBNmt2YFk5tktN5XioiZ3",
      "value" : 64.11545
   },
   {
      "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
      "block_id" : 331448844,
      "block_time" : 1743853071,
      "from_address" : "JD38n7ynKYcgPpF7k1BhXEeREu1KqptU93fVGy3S624k",
      "platform" : [
         "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
         "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
      ],
      "routers" : {
         "amount1" : 661851735794,
         "amount2" : 55018851,
         "child_routers" : [
            {
               "amount1" : "661851735794",
               "amount2" : "55018851",
               "pool_address" : "CsJTG4mospaCYvwQghmL5SAqh8YUkBw6YyzBrbfvTDSN",
               "program_address" : "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
               "token1" : "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
               "token1_decimals" : 9,
               "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
               "token2_decimals" : 6
            }
         ],
         "token1" : "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
         "token1_decimals" : 9,
         "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token2_decimals" : 6
      },
      "sources" : [
         "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
      ],
      "time" : "2025-04-05T11:37:51.000Z",
      "trans_id" : "5XwoGsceULWQ8PaQd28onZxSJrhgqCLXW5GGNgQkBgQedEZfuv1ctZ97psRJwxzZhu6hCfQJhGJg128UmCX24QbM",
      "value" : 55.018851
   },
   {
      "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
      "block_id" : 331440373,
      "block_time" : 1743849710,
      "from_address" : "JD25qVdtd65FoiXNmR89JjmoJdYk9sjYQeSTZAALFiMy",
      "platform" : [
         "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
         "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
      ],
      "routers" : {
         "amount1" : 480629973,
         "amount2" : 64551598,
         "child_routers" : [
            {
               "amount1" : "480629973",
               "amount2" : "533971707",
               "pool_address" : "8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM",
               "program_address" : "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
               "token1" : "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
               "token1_decimals" : 6,
               "token2" : "So11111111111111111111111111111111111111112",
               "token2_decimals" : 9
            },
            {
               "amount1" : "533971707",
               "amount2" : "64567768",
               "pool_address" : "HyGVf4UhoQ4ux9ueZgTCf6aJwCcvWqeWf258ZtbeRteV",
               "program_address" : "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c",
               "token1" : "So11111111111111111111111111111111111111112",
               "token1_decimals" : 9,
               "token2" : "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
               "token2_decimals" : 6
            },
            {
               "amount1" : "64567768",
               "amount2" : "64551598",
               "pool_address" : "BWBHrYqfcjAh5dSiRwzPnY4656cApXVXmkeDmAfwBKQG",
               "program_address" : "obriQD1zbpyLz95G5n7nJe6a4DPjpFwa5XYPoNm113y",
               "token1" : "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
               "token1_decimals" : 6,
               "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
               "token2_decimals" : 6
            }
         ],
         "token1" : "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
         "token1_decimals" : 6,
         "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token2_decimals" : 6
      },
      "sources" : [
         "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
         "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c",
         "obriQD1zbpyLz95G5n7nJe6a4DPjpFwa5XYPoNm113y"
      ],
      "time" : "2025-04-05T10:41:50.000Z",
      "trans_id" : "uhMyGbMwtZeVDxQjxoa3kK15eueBJ75HtmgiK6eriFgvPvtzWwgWLRYBQVPVui9N5yBsQGyT4oDYEfoiLdyWHTQ",
      "value" : 64.551598
   },
   {
      "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
      "block_id" : 331439756,
      "block_time" : 1743849466,
      "from_address" : "JD25qVdtd65FoiXNmR89JjmoJdYk9sjYQeSTZAALFiMy",
      "platform" : [
         "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
         "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
      ],
      "routers" : {
         "amount1" : 661851735794,
         "amount2" : 55680978,
         "child_routers" : [
            {
               "amount1" : "661851735794",
               "amount2" : "459580884",
               "pool_address" : "5uTwG3y3F5cx4YkodgTjWEHDrX5HDKZ5bZZ72x8eQ6zE",
               "program_address" : "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
               "token1" : "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
               "token1_decimals" : 9,
               "token2" : "So11111111111111111111111111111111111111112",
               "token2_decimals" : 9
            },
            {
               "amount1" : "459580884",
               "amount2" : "55680978",
               "pool_address" : "DrRd8gYMJu9XGxLhwTCPdHNLXCKHsxJtMpbn62YqmwQe",
               "program_address" : "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c",
               "token1" : "So11111111111111111111111111111111111111112",
               "token1_decimals" : 9,
               "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
               "token2_decimals" : 6
            }
         ],
         "token1" : "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
         "token1_decimals" : 9,
         "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token2_decimals" : 6
      },
      "sources" : [
         "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
         "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c"
      ],
      "time" : "2025-04-05T10:37:46.000Z",
      "trans_id" : "3YeG1RfcM5hBYNfkFcHaJCHcwMHg89MGzrbPWQNhqHPsW4WtdNFtaoMnnxxF9U9nJgvZeo7jqABCdyGD6awuT7Fm",
      "value" : 55.680978
   },
   {
      "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
      "block_id" : 331431362,
      "block_time" : 1743846105,
      "from_address" : "JD38n7ynKYcgPpF7k1BhXEeREu1KqptU93fVGy3S624k",
      "platform" : [
         "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
         "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
      ],
      "routers" : {
         "amount1" : 480629973,
         "amount2" : 64744612,
         "child_routers" : [
            {
               "amount1" : "480629973",
               "amount2" : "534578812",
               "pool_address" : "8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM",
               "program_address" : "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
               "token1" : "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
               "token1_decimals" : 6,
               "token2" : "So11111111111111111111111111111111111111112",
               "token2_decimals" : 9
            },
            {
               "amount1" : "534578812",
               "amount2" : "64744612",
               "pool_address" : "DrRd8gYMJu9XGxLhwTCPdHNLXCKHsxJtMpbn62YqmwQe",
               "program_address" : "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c",
               "token1" : "So11111111111111111111111111111111111111112",
               "token1_decimals" : 9,
               "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
               "token2_decimals" : 6
            }
         ],
         "token1" : "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
         "token1_decimals" : 6,
         "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token2_decimals" : 6
      },
      "sources" : [
         "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
         "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c"
      ],
      "time" : "2025-04-05T09:41:45.000Z",
      "trans_id" : "oqJnb7tvUgnwXrAju8Px54KXRMn9U4LkeeASyU3XkXVqY48Z7NjN299kL2zvnrwn7TxEjXVjx2fa7xpJKzGnPFf",
      "value" : 64.744612
   },
   {
      "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
      "block_id" : 331430780,
      "block_time" : 1743845872,
      "from_address" : "JD25qVdtd65FoiXNmR89JjmoJdYk9sjYQeSTZAALFiMy",
      "platform" : [
         "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
         "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
      ],
      "routers" : {
         "amount1" : 661851735794,
         "amount2" : 55880333,
         "child_routers" : [
            {
               "amount1" : "661851735794",
               "amount2" : "460615528",
               "pool_address" : "5uTwG3y3F5cx4YkodgTjWEHDrX5HDKZ5bZZ72x8eQ6zE",
               "program_address" : "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
               "token1" : "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
               "token1_decimals" : 9,
               "token2" : "So11111111111111111111111111111111111111112",
               "token2_decimals" : 9
            },
            {
               "amount1" : "460615528",
               "amount2" : "55880333",
               "pool_address" : "8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj",
               "program_address" : "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
               "token1" : "So11111111111111111111111111111111111111112",
               "token1_decimals" : 9,
               "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
               "token2_decimals" : 6
            }
         ],
         "token1" : "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
         "token1_decimals" : 9,
         "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token2_decimals" : 6
      },
      "sources" : [
         "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
         "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"
      ],
      "time" : "2025-04-05T09:37:52.000Z",
      "trans_id" : "4QvHzDSzprkycsxnEViKBuqp2GTKgEZhwJhSntkJkctKf4vojvx66LWnJBnHhAamWouwpqsgraJadahi5Wf45EZY",
      "value" : 55.880333
   }
]
a@a:~/solscanredacted$ 

















a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/balance-changes?address=9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  4762  100  4762    0     0    461      0  0:00:10  0:00:10 --:--:--  1160
[
   {
      "address" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "amount" : 4984999,
      "block_id" : 308085232,
      "block_time" : 1734453685,
      "change_type" : "dec",
      "fee" : 15000,
      "post_balance" : 0,
      "pre_balance" : 4984999,
      "time" : "2024-12-17T16:41:25.000Z",
      "token_account" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "token_address" : "So11111111111111111111111111111111111111111",
      "token_decimals" : 9,
      "trans_id" : "34QejNTHjinT6fubDksjidAegBTyWeSSweP1DQWVxiv8FSUU4yDbmYmRFWvaGrCP58fQzk2yELSVAj1AKWYPe1rh"
   },
   {
      "address" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "amount" : 3210000000,
      "block_id" : 308085197,
      "block_time" : 1734453669,
      "change_type" : "dec",
      "fee" : 15001,
      "post_balance" : 0,
      "pre_balance" : 3210000000,
      "time" : "2024-12-17T16:41:09.000Z",
      "token_account" : "5BtKE9C63LvTigtBt2to5o6qqySaBTEfwsdftpKPGmkW",
      "token_address" : "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
      "token_decimals" : 6,
      "trans_id" : "22Yc3aToA82Uh8VNXga5MF2zFPkdVD5PVwvSa1YdMN32zE9dPv8xsRzuMCKMUK21zz4z6oe9AKHbRnJnVdaUyMd1"
   },
   {
      "address" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "amount" : 15001,
      "block_id" : 308085197,
      "block_time" : 1734453669,
      "change_type" : "dec",
      "fee" : 15001,
      "post_balance" : 4984999,
      "pre_balance" : 5000000,
      "time" : "2024-12-17T16:41:09.000Z",
      "token_account" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "token_address" : "So11111111111111111111111111111111111111111",
      "token_decimals" : 9,
      "trans_id" : "22Yc3aToA82Uh8VNXga5MF2zFPkdVD5PVwvSa1YdMN32zE9dPv8xsRzuMCKMUK21zz4z6oe9AKHbRnJnVdaUyMd1"
   },
   {
      "address" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "amount" : 5000000,
      "block_id" : 308085116,
      "block_time" : 1734453635,
      "change_type" : "inc",
      "fee" : 15000,
      "post_balance" : 5000000,
      "pre_balance" : 0,
      "time" : "2024-12-17T16:40:35.000Z",
      "token_account" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "token_address" : "So11111111111111111111111111111111111111111",
      "token_decimals" : 9,
      "trans_id" : "2Ji2b5dyoWVPy7GA6C61D6VUDb1qx4hCgsUNN8AVDukLMgZSwjouEAzboJYFt3ErP9nbj2iUCg1MhdFBDEVrYBcB"
   },
   {
      "address" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "amount" : 10790720,
      "block_id" : 308084634,
      "block_time" : 1734453435,
      "change_type" : "dec",
      "fee" : 15000,
      "post_balance" : 0,
      "pre_balance" : 10790720,
      "time" : "2024-12-17T16:37:15.000Z",
      "token_account" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "token_address" : "So11111111111111111111111111111111111111111",
      "token_decimals" : 9,
      "trans_id" : "2r618jWv9zNZMbEmn6byrTTunMdeosxKCvyTKs5MWCZkPbZhSwjJqJspT4LfDqKodWT7LTp8TcDPfUPtGMAWZAkL"
   },
   {
      "address" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "amount" : 3210000000,
      "block_id" : 308084434,
      "block_time" : 1734453351,
      "change_type" : "inc",
      "fee" : 170000,
      "post_balance" : 3210000000,
      "pre_balance" : 0,
      "time" : "2024-12-17T16:35:51.000Z",
      "token_account" : "5BtKE9C63LvTigtBt2to5o6qqySaBTEfwsdftpKPGmkW",
      "token_address" : "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
      "token_decimals" : 6,
      "trans_id" : "5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2"
   },
   {
      "address" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "amount" : 2209280,
      "block_id" : 308084434,
      "block_time" : 1734453351,
      "change_type" : "dec",
      "fee" : 170000,
      "post_balance" : 10790720,
      "pre_balance" : 13000000,
      "time" : "2024-12-17T16:35:51.000Z",
      "token_account" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "token_address" : "So11111111111111111111111111111111111111111",
      "token_decimals" : 9,
      "trans_id" : "5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2"
   },
   {
      "address" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "amount" : 10000000,
      "block_id" : 308084232,
      "block_time" : 1734453266,
      "change_type" : "inc",
      "fee" : 15000,
      "post_balance" : 13000000,
      "pre_balance" : 3000000,
      "time" : "2024-12-17T16:34:26.000Z",
      "token_account" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "token_address" : "So11111111111111111111111111111111111111111",
      "token_decimals" : 9,
      "trans_id" : "3C2FBZLhi7TBdBx1BozLxwXNoGJy1f1py4PcZCFze8GcHMXu779gyaQMWtQE5J9h2TASJ8G1UYSxAaBd5PdwSwhU"
   },
   {
      "address" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "amount" : 3000000,
      "block_id" : 308083843,
      "block_time" : 1734453109,
      "change_type" : "inc",
      "fee" : 15000,
      "post_balance" : 3000000,
      "pre_balance" : 0,
      "time" : "2024-12-17T16:31:49.000Z",
      "token_account" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "token_address" : "So11111111111111111111111111111111111111111",
      "token_decimals" : 9,
      "trans_id" : "2GfQmmnUV5DxKSp33apVs2ErY8mWkt5yDxruf6p14JFCUJMAZuYBmb1e5244NT4Uz4iq78vc32CQSSBY5it8i4Cc"
   },
   {
      "address" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "amount" : 181789700,
      "block_id" : 279414368,
      "block_time" : 1721830143,
      "change_type" : "dec",
      "fee" : 15000,
      "post_balance" : 0,
      "pre_balance" : 181789700,
      "time" : "2024-07-24T14:09:03.000Z",
      "token_account" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "token_address" : "So11111111111111111111111111111111111111111",
      "token_decimals" : 9,
      "trans_id" : "soGavDqhiLC7fayDqWVJ9tFHdXU5JusH7W7W2M4EYCrsrLNvjwMqyAUKQyeGAgDaTSM41kH22f964gMuQ8EKopd"
   }
]
a@a:~/solscanredacted$ 










a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/balance-changes\
?address=9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg\
&token=JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"
[{"block_id":245299551,"block_time":1706718687,"trans_id":"658GxSAnEm5prByijgRKzRj7AgBn9xrCMRJGQLo2va8kYrt5Hokk8s4vBdXjTYqE4xn65aT9gpMhjjZHEbbHcWQ5","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN","token_account":"FSmkHGcjmGuQaB2aKBqnsg35aajitvqjDWiJi9PdFpxB","token_decimals":6,"amount":200000000,"pre_balance":200000000,"post_balance":0,"change_type":"dec","fee":15000,"time":"2024-01-31T16:31:27.000Z"},{"block_id":245299423,"block_time":1706718634,"trans_id":"2njDKnCCqM9XEsN3TxqbQdPMg6sTSijevfoinsSMg1hZMhn2ubFCtHRR6ux9huLKd7hAPMxCGKJqZ2wcNveoQyDS","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN","token_account":"FSmkHGcjmGuQaB2aKBqnsg35aajitvqjDWiJi9PdFpxB","token_decimals":6,"amount":200000000,"pre_balance":0,"post_balance":200000000,"change_type":"inc","fee":1005000,"time":"2024-01-31T16:30:34.000Z"}]a@a:~/solscanredacted$ 



a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/balance-changes\
?address=9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg\
&flow=in"
[{"block_id":308085116,"block_time":1734453635,"trans_id":"2Ji2b5dyoWVPy7GA6C61D6VUDb1qx4hCgsUNN8AVDukLMgZSwjouEAzboJYFt3ErP9nbj2iUCg1MhdFBDEVrYBcB","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":5000000,"pre_balance":0,"post_balance":5000000,"change_type":"inc","fee":15000,"time":"2024-12-17T16:40:35.000Z"},{"block_id":308084434,"block_time":1734453351,"trans_id":"5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv","token_account":"5BtKE9C63LvTigtBt2to5o6qqySaBTEfwsdftpKPGmkW","token_decimals":6,"amount":3210000000,"pre_balance":0,"post_balance":3210000000,"change_type":"inc","fee":170000,"time":"2024-12-17T16:35:51.000Z"},{"block_id":308084232,"block_time":1734453266,"trans_id":"3C2FBZLhi7TBdBx1BozLxwXNoGJy1f1py4PcZCFze8GcHMXu779gyaQMWtQE5J9h2TASJ8G1UYSxAaBd5PdwSwhU","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":10000000,"pre_balance":3000000,"post_balance":13000000,"change_type":"inc","fee":15000,"time":"2024-12-17T16:34:26.000Z"},{"block_id":308083843,"block_time":1734453109,"trans_id":"2GfQmmnUV5DxKSp33apVs2ErY8mWkt5yDxruf6p14JFCUJMAZuYBmb1e5244NT4Uz4iq78vc32CQSSBY5it8i4Cc","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":3000000,"pre_balance":0,"post_balance":3000000,"change_type":"inc","fee":15000,"time":"2024-12-17T16:31:49.000Z"},{"block_id":279414099,"block_time":1721830023,"trans_id":"32FzLa6WyP97y3FRU8VZvzU7zn2ja4CQpWFVc6NsZcsS1xZAS2hYTksTofB3FqufuF2XUr97XBMDgG6QMfh5pxAr","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":9990000,"pre_balance":171799700,"post_balance":181789700,"change_type":"inc","fee":10000,"time":"2024-07-24T14:07:03.000Z"},{"block_id":279414099,"block_time":1721830023,"trans_id":"5nCfJ17d3qY6GWVspEjSoFqvRtpTjHuMPqu3mTmr2EuxPJ61pRuZ9xckZqcqyLZJ2h26f5Sbo2eNQmFom4odk2VL","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":9990000,"pre_balance":161809700,"post_balance":171799700,"change_type":"inc","fee":10000,"time":"2024-07-24T14:07:03.000Z"},{"block_id":279414098,"block_time":1721830023,"trans_id":"3SH6rj5bi3GHW61ch6yS7aCugEbjHdg3GCi5FHLYhQcqmnUSPKdHU3wLvpxTPKDXFUejiAp4hQjCuB7aMdEDk7ev","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":9990000,"pre_balance":149825200,"post_balance":159815200,"change_type":"inc","fee":10000,"time":"2024-07-24T14:07:03.000Z"},{"block_id":279414098,"block_time":1721830023,"trans_id":"3vwe5xkh2e5PrSYC4q8oGU4C9Fy6i7wVQ6BhKLb4ZUKTtgPRY3zuXXoUjiCcCTwsLKfiUThh3WdyGYSC84kKoA2L","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":1994500,"pre_balance":159815200,"post_balance":161809700,"change_type":"inc","fee":5500,"time":"2024-07-24T14:07:03.000Z"},{"block_id":279414097,"block_time":1721830023,"trans_id":"3KyjK6Bxzo47Lnhr2kHwo9uN4S93VYuZcV9Cb1wycGQFuns7u2LpAnNWP2Ha68pmCzeAfZmUfYVCFXJ3wo9xKJ51","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":1994500,"pre_balance":147830700,"post_balance":149825200,"change_type":"inc","fee":5500,"time":"2024-07-24T14:07:03.000Z"},{"block_id":279414097,"block_time":1721830023,"trans_id":"3eUpx2W8XRxtTp3ZBAzuwhXE3XDrJVV3REvSwYWBSSHtCLDMFGswxyc2c1RiVCuBfFr2uE7PsF9WhLDsdvBSjjsm","address":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_address":"So11111111111111111111111111111111111111111","token_account":"9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg","token_decimals":9,"amount":1994500,"pre_balance":143841700,"post_balance":145836200,"change_type":"inc","fee":5500,"time":"2024-07-24T14:07:03.000Z"}]a@a:~/solscanredacted$ 













a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/transactions?address=9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg&limit=10"
{"success":true,"data":[{"slot":308085232,"fee":15000,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1734453685,"tx_hash":"34QejNTHjinT6fubDksjidAegBTyWeSSweP1DQWVxiv8FSUU4yDbmYmRFWvaGrCP58fQzk2yELSVAj1AKWYPe1rh","parsed_instructions":[{"type":"transfer","program":"system","program_id":"11111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111"],"time":"2024-12-17T16:41:25.000Z"},{"slot":308085197,"fee":15001,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1734453669,"tx_hash":"22Yc3aToA82Uh8VNXga5MF2zFPkdVD5PVwvSa1YdMN32zE9dPv8xsRzuMCKMUK21zz4z6oe9AKHbRnJnVdaUyMd1","parsed_instructions":[{"type":"transferChecked","program":"spl-token","program_id":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],"time":"2024-12-17T16:41:09.000Z"},{"slot":308085116,"fee":15000,"status":"Success","signer":["9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV"],"block_time":1734453635,"tx_hash":"2Ji2b5dyoWVPy7GA6C61D6VUDb1qx4hCgsUNN8AVDukLMgZSwjouEAzboJYFt3ErP9nbj2iUCg1MhdFBDEVrYBcB","parsed_instructions":[{"type":"transfer","program":"system","program_id":"11111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111"],"time":"2024-12-17T16:40:35.000Z"},{"slot":308084634,"fee":15000,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1734453435,"tx_hash":"2r618jWv9zNZMbEmn6byrTTunMdeosxKCvyTKs5MWCZkPbZhSwjJqJspT4LfDqKodWT7LTp8TcDPfUPtGMAWZAkL","parsed_instructions":[{"type":"transfer","program":"system","program_id":"11111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111"],"time":"2024-12-17T16:37:15.000Z"},{"slot":308084434,"fee":170000,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1734453351,"tx_hash":"5CFaGuFnamQUwb9hW2G2ZxA48ouZU3FePRT9nMY22dDr5MvwFb5fcx6Si6QAP4prHJRc7oAnhrgynbRfMCnaYNi2","parsed_instructions":[{"type":"createIdempotent","program":"spl-associated-token-account","program_id":"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"},{"type":"getAccountDataSize","program":"spl-token","program_id":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"type":"createAccount","program":"system","program_id":"11111111111111111111111111111111"},{"type":"initializeImmutableOwner","program":"spl-token","program_id":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"type":"initializeAccount3","program":"spl-token","program_id":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"type":"transfer","program":"spl-token","program_id":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL","Ed25519SigVerify111111111111111111111111111","CUEB3rQGVrvCRTmyjLrPnsd6bBBsGbz1Sr49vxNLJkGR","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","11111111111111111111111111111111"],"time":"2024-12-17T16:35:51.000Z"},{"slot":308084232,"fee":15000,"status":"Success","signer":["9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV"],"block_time":1734453266,"tx_hash":"3C2FBZLhi7TBdBx1BozLxwXNoGJy1f1py4PcZCFze8GcHMXu779gyaQMWtQE5J9h2TASJ8G1UYSxAaBd5PdwSwhU","parsed_instructions":[{"type":"transfer","program":"system","program_id":"11111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111"],"time":"2024-12-17T16:34:26.000Z"},{"slot":308083843,"fee":15000,"status":"Success","signer":["9f1h8rye6BU9P3ENWJduJc5YSrU6QjinoNMXMqDVvNuV"],"block_time":1734453109,"tx_hash":"2GfQmmnUV5DxKSp33apVs2ErY8mWkt5yDxruf6p14JFCUJMAZuYBmb1e5244NT4Uz4iq78vc32CQSSBY5it8i4Cc","parsed_instructions":[{"type":"transfer","program":"system","program_id":"11111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111"],"time":"2024-12-17T16:31:49.000Z"},{"slot":279414368,"fee":15000,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1721830143,"tx_hash":"soGavDqhiLC7fayDqWVJ9tFHdXU5JusH7W7W2M4EYCrsrLNvjwMqyAUKQyeGAgDaTSM41kH22f964gMuQ8EKopd","parsed_instructions":[{"type":"transfer","program":"system","program_id":"11111111111111111111111111111111"},{"type":"SetComputeUnitPrice","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"},{"type":"SetComputeUnitLimit","program":"ComputeBudget","program_id":"ComputeBudget111111111111111111111111111111"}],"program_ids":["ComputeBudget111111111111111111111111111111","11111111111111111111111111111111"],"time":"2024-07-24T14:09:03.000Z"},{"slot":279414099,"fee":10000,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1721830023,"tx_hash":"32FzLa6WyP97y3FRU8VZvzU7zn2ja4CQpWFVc6NsZcsS1xZAS2hYTksTofB3FqufuF2XUr97XBMDgG6QMfh5pxAr","parsed_instructions":[{"type":"burn","program":"mpl_token_metadata","program_id":"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"}],"program_ids":["ComputeBudget111111111111111111111111111111","F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7","11111111111111111111111111111111","metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],"time":"2024-07-24T14:07:03.000Z"},{"slot":279414099,"fee":10000,"status":"Success","signer":["9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"],"block_time":1721830023,"tx_hash":"5nCfJ17d3qY6GWVspEjSoFqvRtpTjHuMPqu3mTmr2EuxPJ61pRuZ9xckZqcqyLZJ2h26f5Sbo2eNQmFom4odk2VL","parsed_instructions":[{"type":"burn","program":"mpl_token_metadata","program_id":"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"}],"program_ids":["ComputeBudget111111111111111111111111111111","F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7","11111111111111111111111111111111","metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],"time":"2024-07-24T14:07:03.000Z"}]}a@a:~/solscanredacted$ 





a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/portfolio?address=9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg"
{"success":true,"data":{"total_value":0,"native_balance":null,"tokens":[]}}a@a:~/solscanredacted$ 






a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/token-accounts?address=9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg&type=token" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   238  100   238    0     0    160      0  0:00:01  0:00:01 --:--:--   160
{
   "data" : [
      {
         "amount" : 0,
         "owner" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
         "token_account" : "5BtKE9C63LvTigtBt2to5o6qqySaBTEfwsdftpKPGmkW",
         "token_address" : "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
         "token_decimals" : 6
      }
   ],
   "success" : true
}
a@a:~/solscanredacted$ 








a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/account-detail?address=9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   100  100   100    0     0    113      0 --:--:-- --:--:-- --:--:--   113
{
   "data" : {
      "account" : "9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg",
      "is_oncurve" : true
   },
   "success" : true
}
a@a:~/solscanredacted$ 









a@a:~/solscanredacted$ curl "http://localhost:3000/api/dex/account-metadata?address=9KR7WY8ebL5jD99tmzi3RFmk4v4ahwwHQKdqpG47Vsrg" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    26  100    26    0     0     39      0 --:--:-- --:--:-- --:--:--    39
{
   "data" : {},
   "success" : true
}
a@a:~/solscanredacted$ 













a@a:~/solscanredacted$ curl -X GET "http://localhost:3000/api/token/meta?address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   706  100   706    0     0    174      0  0:00:04  0:00:04 --:--:--   174
{
   "data" : {
      "address" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "decimals" : 6,
      "first_mint_time" : 1721427641,
      "first_mint_tx" : "5bLgbFhs1tugs4YHFHxmoBWdanG8N7sqjAYT9FWPkXpmPhtr2haifoLg65uLBLzdc1sh4FuEfRG6VZ82T1u2xvLX",
      "freeze_authority" : "7dGbd2QZcCKcTndnHcTL8q7SMVXAkp688NTQYwrRCrar",
      "holder" : 4033997,
      "icon" : "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
      "market_cap" : 10064317724.8348,
      "market_cap_rank" : 6,
      "metadata" : null,
      "mint_authority" : "BJE5MMbqXjVwjAF7oxwPYXnTXDyspzZyt4vwenNw5ruG",
      "name" : "USDC",
      "price" : 1,
      "price_change_24h" : -0.00222,
      "supply" : "10062560821312778",
      "symbol" : "USDC",
      "volume_24h" : 6163765229
   },
   "success" : true
}
a@a:~/solscanredacted$ 












a@a:~/solscanredacted$ curl -X GET "http://localhost:3000/api/token/price?address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   312  100   312    0     0    257      0  0:00:01  0:00:01 --:--:--   258
{
   "data" : [
      {
         "date" : 20250329,
         "price" : 1.0000193
      },
      {
         "date" : 20250330,
         "price" : 0.999969
      },
      {
         "date" : 20250331,
         "price" : 0.9998988
      },
      {
         "date" : 20250401,
         "price" : 0.999944
      },
      {
         "date" : 20250402,
         "price" : 0.9999559
      },
      {
         "date" : 20250403,
         "price" : 0.99992055
      },
      {
         "date" : 20250404,
         "price" : 1.0000042
      },
      {
         "date" : 20250405,
         "price" : 0.9999936
      }
   ],
   "success" : true
}
a@a:~/solscanredacted$ 









