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







a@a:~/solscanredacted$ curl -X GET "http://localhost:3000/api/token/holders?address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&page=1&page_size=10" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1659  100  1659    0     0    269      0  0:00:06  0:00:06 --:--:--   419
{
   "data" : {
      "items" : [
         {
            "address" : "FGETo8T8wMcN2wCjav8VK6eh3dLk63evNDPxzLSJra8B",
            "amount" : 1517138645856576,
            "decimals" : 6,
            "owner" : "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
            "rank" : 1
         },
         {
            "address" : "HUFSUji6HJ4JE7E66bUH7NBjdLweZoQstBaRD4Bj7fnx",
            "amount" : 500000000001000,
            "decimals" : 6,
            "owner" : "3gd3dqgtJ4jWfBfLYTX67DALFetjc5iS72sCgRhCkW2u",
            "rank" : 2
         },
         {
            "address" : "3emsAVdmGKERbHjmGfQ6oZ1e35dkf5iYcS6U4CPKFVaa",
            "amount" : 448520505835906,
            "decimals" : 6,
            "owner" : "7VHUFJHWu2CuExkJcJrzhQPJ2oygupTWkL2A2For4BmE",
            "rank" : 3
         },
         {
            "address" : "WzWUoCmtVv7eqAbU3BfKPU3fhLP6CXR8NCJH78UK9VS",
            "amount" : 353204964253630,
            "decimals" : 6,
            "owner" : "AVzP2GeRmqGphJsMxWoqjpUifPpCret7LqWhD8NWQK49",
            "rank" : 4
         },
         {
            "address" : "FzbcyEZ9m8xjtergWgWDq7mfPoHEbboBF791B6cTpzbq",
            "amount" : 241808605097682,
            "decimals" : 6,
            "owner" : "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9",
            "rank" : 5
         },
         {
            "address" : "81BadRGfaHFpAmuXpJ65k8tYtUWsZ54EFSmsVo1rbDTV",
            "amount" : 230162462177922,
            "decimals" : 6,
            "owner" : "9d9mb8kooFfaD3SctgZtkxQypkshx6ezhbKio89ixyy2",
            "rank" : 6
         },
         {
            "address" : "DD7nZPcgbhfM7qMG33iuKJ3in8U3wbUzVnheB5ob27pf",
            "amount" : 170180259132523,
            "decimals" : 6,
            "owner" : "FWznbcNXWQuHTawe9RxvQ2LdCENssh12dsznf4RiouN5",
            "rank" : 7
         },
         {
            "address" : "GXWqPpjQpdz7KZw9p7f5PX2eGxHAhvpNXiviFkAB8zXg",
            "amount" : 119913456116989,
            "decimals" : 6,
            "owner" : "JCNCMFXo5M5qwUPg2Utu1u6YWp3MbygxqBsBeXXJfrw",
            "rank" : 8
         },
         {
            "address" : "GENey8es3EgGiNTM8H8gzA3vf98haQF8LHiYFyErjgrv",
            "amount" : 83420446270621,
            "decimals" : 6,
            "owner" : "B9spsrMK6pJicYtukaZzDyzsUQLgc3jbx5gHVwdDxb6y",
            "rank" : 9
         },
         {
            "address" : "C54G13hzspfVrDyStqFkRWkFA5tPA7KBNnmSCA8yENTs",
            "amount" : 83070353964567,
            "decimals" : 6,
            "owner" : "7MNeJP9gi5kBY1DVzJA1kzdeCr6oscXEZW51XMnmByC7",
            "rank" : 10
         }
      ],
      "total" : 4034088
   },
   "success" : true
}
a@a:~/solscanredacted$ 







a@a:~/solscanredacted$ curl -X GET "http://localhost:3000/api/token/transfers?address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&page=1&page_size=10&sort_by=block_time&sort_order=desc" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  5972  100  5972    0     0   5394      0  0:00:01  0:00:01 --:--:--  5399
{
   "data" : [
      {
         "activity_type" : "ACTIVITY_SPL_TRANSFER",
         "amount" : 4604719,
         "block_id" : 331492137,
         "block_time" : 1743870389,
         "from_address" : "EjwYJMj7wyP9w29WttYBSfh4dfFSuCFiSpAmjhiU72yp",
         "from_token_account" : "E3zDf4vedFtmCUw6AF2mNPiYpthZpoHbyzkcshxd9xfx",
         "time" : "2025-04-05T16:26:29.000Z",
         "to_address" : "B4kEjrb6BNY1jUavEcARqy8D3Y89vhvJzkPtUpFoxpzm",
         "to_token_account" : "B4kEjrb6BNY1jUavEcARqy8D3Y89vhvJzkPtUpFoxpzm",
         "token_address" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token_decimals" : 6,
         "trans_id" : "47zaHQ9LRv1pwcima1AbtSKHNtayRPD9S85nQXT2AF1TjXocih9jHfdAt7y4cUU2bqhXmqzBPMEA8atpLPXAa8Re",
         "value" : 4.604719
      },
      {
         "activity_type" : "ACTIVITY_SPL_TRANSFER",
         "amount" : 402122,
         "block_id" : 331492137,
         "block_time" : 1743870389,
         "from_address" : "6ephzaH4vB2D2MQaHLLgheuS6qvuVLevyXg61eXmiS2w",
         "from_token_account" : "6ephzaH4vB2D2MQaHLLgheuS6qvuVLevyXg61eXmiS2w",
         "time" : "2025-04-05T16:26:29.000Z",
         "to_address" : "EjwYJMj7wyP9w29WttYBSfh4dfFSuCFiSpAmjhiU72yp",
         "to_token_account" : "E3zDf4vedFtmCUw6AF2mNPiYpthZpoHbyzkcshxd9xfx",
         "token_address" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token_decimals" : 6,
         "trans_id" : "bu5iJ9zGsKwsbWjAeML2PzhWt5jfzhepF2FgHmtu4np2c4DjymryD4LwXMQboRVA9LQUvWUe2D7odVzGAcQUKKj",
         "value" : 0.402122
      },
      {
         "activity_type" : "ACTIVITY_SPL_TRANSFER",
         "amount" : 3163635,
         "block_id" : 331492137,
         "block_time" : 1743870389,
         "from_address" : "EjwYJMj7wyP9w29WttYBSfh4dfFSuCFiSpAmjhiU72yp",
         "from_token_account" : "E3zDf4vedFtmCUw6AF2mNPiYpthZpoHbyzkcshxd9xfx",
         "time" : "2025-04-05T16:26:29.000Z",
         "to_address" : "HyE9rkM9kCfvpAxVnzTNhNzKDvoc8en3V76cH9RFNsx5",
         "to_token_account" : "HyE9rkM9kCfvpAxVnzTNhNzKDvoc8en3V76cH9RFNsx5",
         "token_address" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token_decimals" : 6,
         "trans_id" : "2sQ8Nr66bigRWY5KwqVT9XhXmjQnCWrbiTMybnZSqEXjREWS95EqzGjrmSfEmUXsoPR7xFhmqfziowd6w6odV3AW",
         "value" : 3.163635
      },
      {
         "activity_type" : "ACTIVITY_SPL_TRANSFER",
         "amount" : 19061695,
         "block_id" : 331492137,
         "block_time" : 1743870389,
         "from_address" : "cat2qg7ZhrpPrcMeB62dJwJAtZcQbn61oh6j2guYUuB",
         "from_token_account" : "ijZhhXduhEGvzPwkP9utQM6mMwujHkBUxEg4VxD9rje",
         "time" : "2025-04-05T16:26:29.000Z",
         "to_address" : "AHhiY6GAKfBkvseQDQbBC7qp3fTRNpyZccuEdYSdPFEf",
         "to_token_account" : "3cUAyfvugAibjb2USudpRUjx4JNzWchDWaLnaBok6BEy",
         "token_address" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token_decimals" : 6,
         "trans_id" : "4PeRJK62jHUW6L5tLovjgYu7b5V3g3DwVo1NKe2MeJ9SAmpup8tm8A3ouqvEbKtNpJtfx8oCVYtSbXsonzRedkZH",
         "value" : 19.061695
      },
      {
         "activity_type" : "ACTIVITY_SPL_TRANSFER",
         "amount" : 19061695,
         "block_id" : 331492137,
         "block_time" : 1743870389,
         "from_address" : "3ESUFCnRNgZ7Mn2mPPUMmXYaKU8jpnV9VtA17M7t2mHQ",
         "from_token_account" : "C2QoQ111jGHEy5918XkNXQro7gGwC9PKLXd1LqBiYNwA",
         "time" : "2025-04-05T16:26:29.000Z",
         "to_address" : "cat2qg7ZhrpPrcMeB62dJwJAtZcQbn61oh6j2guYUuB",
         "to_token_account" : "ijZhhXduhEGvzPwkP9utQM6mMwujHkBUxEg4VxD9rje",
         "token_address" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token_decimals" : 6,
         "trans_id" : "4PeRJK62jHUW6L5tLovjgYu7b5V3g3DwVo1NKe2MeJ9SAmpup8tm8A3ouqvEbKtNpJtfx8oCVYtSbXsonzRedkZH",
         "value" : 19.061695
      },
      {
         "activity_type" : "ACTIVITY_SPL_TRANSFER",
         "amount" : 2467603,
         "block_id" : 331492137,
         "block_time" : 1743870389,
         "from_address" : "ob2htHLoCu2P6tX7RrNVtiG1mYTas8NGJEVLaFEUngk",
         "from_token_account" : "CYwvrMNTYzS9bXftriexXmcgRavXfNo8octro6Yjzv7h",
         "time" : "2025-04-05T16:26:29.000Z",
         "to_address" : "Gvxu1UiqNZXqs7Arsj7j4aYaEKwCjo6zVhKv6b7QZNB6",
         "to_token_account" : "GdkVxnTUxaMNpFiDjeaqxp5WeuhT6KuDk4nG4yQ8pasL",
         "token_address" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token_decimals" : 6,
         "trans_id" : "64DpqTZLcJAvaaPExV3L5wFQyKfgTuxFodVjN7RDJnff1Z4dsBmXbfPykqVp6pHbk63TH3Ca7wzdzjeCXzzDSjGj",
         "value" : 2.467603
      },
      {
         "activity_type" : "ACTIVITY_SPL_TRANSFER",
         "amount" : 249771943,
         "block_id" : 331492137,
         "block_time" : 1743870389,
         "from_address" : "8cjeuVV3KQ9k8RqW1JUyCfey2TDAhuo7f4hPDMeGfxv",
         "from_token_account" : "8cjeuVV3KQ9k8RqW1JUyCfey2TDAhuo7f4hPDMeGfxv",
         "time" : "2025-04-05T16:26:29.000Z",
         "to_address" : "A9YHpem75DYBc6eCM7vviKwhShwEdMqgDZK3W9bkJExw",
         "to_token_account" : "CsCxuadtz6SZyFyyypMtTt3oMRA5CpPvVtwjCXfwHXTk",
         "token_address" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token_decimals" : 6,
         "trans_id" : "5SNmawm7X62DNMVwzGoJvWebcfXRN9MTmM23KYofR32jJ6XTYrpnL6R67eRUXVPKwAcHmvTSpT5o6cQzhaKzQuTr",
         "value" : 249.771943
      },
      {
         "activity_type" : "ACTIVITY_SPL_TRANSFER",
         "amount" : 1260933,
         "block_id" : 331492137,
         "block_time" : 1743870389,
         "from_address" : "6kntKawNmZNKZqUHvRVGKMwp8LQU5upyhht7w1PL7dde",
         "from_token_account" : "G6LqigtFSrK3pwaXKnaWiTjYYxTuyaey3YhdtQSFCvn9",
         "time" : "2025-04-05T16:26:29.000Z",
         "to_address" : "6ephzaH4vB2D2MQaHLLgheuS6qvuVLevyXg61eXmiS2w",
         "to_token_account" : "6ephzaH4vB2D2MQaHLLgheuS6qvuVLevyXg61eXmiS2w",
         "token_address" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token_decimals" : 6,
         "trans_id" : "23YnaR14aTXKATLbyppVzKMchXgSgJtWUALKfJ7KrE9KZNAe1mSGLsqWb3oCesbcvmkYnfQk6s9LadUwxStNgVEd",
         "value" : 1.260933
      },
      {
         "activity_type" : "ACTIVITY_SPL_TRANSFER",
         "amount" : 1392619,
         "block_id" : 331492135,
         "block_time" : 1743870389,
         "from_address" : "6ephzaH4vB2D2MQaHLLgheuS6qvuVLevyXg61eXmiS2w",
         "from_token_account" : "6ephzaH4vB2D2MQaHLLgheuS6qvuVLevyXg61eXmiS2w",
         "time" : "2025-04-05T16:26:29.000Z",
         "to_address" : "EjwYJMj7wyP9w29WttYBSfh4dfFSuCFiSpAmjhiU72yp",
         "to_token_account" : "E3zDf4vedFtmCUw6AF2mNPiYpthZpoHbyzkcshxd9xfx",
         "token_address" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token_decimals" : 6,
         "trans_id" : "2QttV3pm43ygMb8c3DCw2EeB5CgJEzjBQpKEy81aZagmdwLbrMdu1q5HLuppXLBFZsoQaxfaiQbFc3te2LaefThh",
         "value" : 1.392619
      },
      {
         "activity_type" : "ACTIVITY_SPL_TRANSFER",
         "amount" : 10063,
         "block_id" : 331492135,
         "block_time" : 1743870389,
         "from_address" : "8q9MsiznkhXk5mEveQHkmXh723YHX4yHpVBNfSgKcYXY",
         "from_token_account" : "8q9MsiznkhXk5mEveQHkmXh723YHX4yHpVBNfSgKcYXY",
         "time" : "2025-04-05T16:26:29.000Z",
         "to_address" : "EjwYJMj7wyP9w29WttYBSfh4dfFSuCFiSpAmjhiU72yp",
         "to_token_account" : "E3zDf4vedFtmCUw6AF2mNPiYpthZpoHbyzkcshxd9xfx",
         "token_address" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
         "token_decimals" : 6,
         "trans_id" : "3uhCf6o21WXXHwLDDyy1RXHs5RG1XXk4L8eSGrWzeDxN7U7j3KzKxAJRGSrH5amRhyxHD5AP9nA7PgdSUqnsAVgL",
         "value" : 0.010063
      }
   ],
   "success" : true
}
a@a:~/solscanredacted$ 







a@a:~/solscanredacted$ curl -X GET "http://localhost:3000/api/token/defi-activities?address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&page=1&page_size=10&sort_by=block_time&sort_order=desc" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 11801  100 11801    0     0  10754      0  0:00:01  0:00:01 --:--:-- 10767
{
   "data" : [
      {
         "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
         "block_id" : 331492206,
         "block_time" : 1743870418,
         "from_address" : "JD25qVdtd65FoiXNmR89JjmoJdYk9sjYQeSTZAALFiMy",
         "platform" : [
            "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
         ],
         "routers" : {
            "amount1" : 76388888,
            "amount2" : 21123154,
            "child_routers" : [
               {
                  "amount1" : "76388888",
                  "amount2" : "21123154",
                  "pool_address" : "6NUiVmsNjsi4AfsMsEiaezsaV9N4N1ZrD4jEnuWNRvyb",
                  "program_address" : "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
                  "token1" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token1_decimals" : 6,
                  "token2" : "27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4",
                  "token2_decimals" : 6
               }
            ],
            "token1" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "token1_decimals" : 6,
            "token2" : "27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4",
            "token2_decimals" : 6
         },
         "sources" : [
            "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
         ],
         "time" : "2025-04-05T16:26:58.000Z",
         "trans_id" : "4owzcc4kcmZXCDf2oCJ4892MmieonkyRKW2qgKy9E84eWfPfCGhcuzDkQ385pv517S6wxXTpkg54MjUU6PouKDen",
         "value" : 76.388888
      },
      {
         "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
         "block_id" : 331492206,
         "block_time" : 1743870418,
         "from_address" : "GNn51cf6rGoS7PAY7m7MAHoHhfMPFtrB4aUTHg92EMnx",
         "platform" : [
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
         ],
         "routers" : {
            "amount1" : 992,
            "amount2" : 8402,
            "child_routers" : [
               {
                  "amount1" : "992",
                  "amount2" : "8402",
                  "pool_address" : "EXHyQxMSttcvLPwjENnXCPZ8GmLjJYHtNBnAkcFeFKMn",
                  "program_address" : "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
                  "token1" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token1_decimals" : 6,
                  "token2" : "So11111111111111111111111111111111111111112",
                  "token2_decimals" : 9
               }
            ],
            "token1" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "token1_decimals" : 6,
            "token2" : "So11111111111111111111111111111111111111112",
            "token2_decimals" : 9
         },
         "sources" : [
            "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"
         ],
         "time" : "2025-04-05T16:26:58.000Z",
         "trans_id" : "5ZGfMhjxmzUHc9dfUEoBQyxjzZyM2YTcNmhx4wSH2EiWc3WidYRv3zENPDb85YY7Qt4dcXqqkAwEGzkRxsxcsFSC",
         "value" : 0.0009893355
      },
      {
         "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
         "block_id" : 331492206,
         "block_time" : 1743870418,
         "from_address" : "CSZSgJ8mAWSo886KD9jqjLaFLKHzpyjHmx8BAW7xMJyN",
         "platform" : [
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
         ],
         "routers" : {
            "amount1" : 4954,
            "amount2" : 41972,
            "child_routers" : [
               {
                  "amount1" : "4954",
                  "amount2" : "4951",
                  "pool_address" : "2w4A1eGyjRutakyFdmVyBiLPf98qKxNTC2LpuwhaCruZ",
                  "program_address" : "NUMERUNsFCP3kuNmWZuXtm1AaQCPj9uw6Guv2Ekoi5P",
                  "token1" : "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
                  "token1_decimals" : 6,
                  "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token2_decimals" : 6
               },
               {
                  "amount1" : "4951",
                  "amount2" : "41972",
                  "pool_address" : "EXHyQxMSttcvLPwjENnXCPZ8GmLjJYHtNBnAkcFeFKMn",
                  "program_address" : "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
                  "token1" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token1_decimals" : 6,
                  "token2" : "So11111111111111111111111111111111111111112",
                  "token2_decimals" : 9
               }
            ],
            "token1" : "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
            "token1_decimals" : 6,
            "token2" : "So11111111111111111111111111111111111111112",
            "token2_decimals" : 9
         },
         "sources" : [
            "NUMERUNsFCP3kuNmWZuXtm1AaQCPj9uw6Guv2Ekoi5P",
            "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"
         ],
         "time" : "2025-04-05T16:26:58.000Z",
         "trans_id" : "3oCCEMpVz72d2XCSJtgtnEZgSNBJ1zjcLPJFJiad93yPfQ7P2JM2uJJwWKNjLXCSLWxErV9CyJs3xoQNF4MzJDNW",
         "value" : 0.004942203
      },
      {
         "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
         "block_id" : 331492204,
         "block_time" : 1743870417,
         "from_address" : "cQgfbnbhdPjFWjTU7PhpbzQXN3L9etXHuW8sBtDrEsg",
         "platform" : [
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
         ],
         "routers" : {
            "amount1" : 990500,
            "amount2" : 8414579,
            "child_routers" : [
               {
                  "amount1" : "990500",
                  "amount2" : "8414579",
                  "pool_address" : "5guD4Uz462GT4Y4gEuqyGsHZ59JGxFN4a3rF6KWguMcJ",
                  "program_address" : "SoLFiHG9TfgtdUXUjWAxi3LtvYuFyDLVhBWxdMZxyCe",
                  "token1" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token1_decimals" : 6,
                  "token2" : "So11111111111111111111111111111111111111112",
                  "token2_decimals" : 9
               }
            ],
            "token1" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "token1_decimals" : 6,
            "token2" : "So11111111111111111111111111111111111111112",
            "token2_decimals" : 9
         },
         "sources" : [
            "SoLFiHG9TfgtdUXUjWAxi3LtvYuFyDLVhBWxdMZxyCe"
         ],
         "time" : "2025-04-05T16:26:57.000Z",
         "trans_id" : "35mZapoV1Hffd9q2u4LAL8U4nCCZm1VJm4fUiCWRn46o2kxRgQWqohoXv1zNkToPSEogmd37mThb2rjMAfjB5za6",
         "value" : 0.99081667725
      },
      {
         "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
         "block_id" : 331492204,
         "block_time" : 1743870417,
         "from_address" : "LUY1UEr2tBkpHK89fvGUatSrr93vxJmN21yamuZzJpU",
         "platform" : [
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
         ],
         "routers" : {
            "amount1" : 91046,
            "amount2" : 98270,
            "child_routers" : [
               {
                  "amount1" : "91046",
                  "amount2" : "75555",
                  "pool_address" : "DUgHCQYCA2RMNKv1cqFpSE6yzUhdL3y3bPApd5qnTjMu",
                  "program_address" : "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
                  "token1" : "he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A",
                  "token1_decimals" : 9,
                  "token2" : "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm",
                  "token2_decimals" : 9
               },
               {
                  "amount1" : "75555",
                  "amount2" : "11589",
                  "pool_address" : "Gu7nyFkTzTX5FLKqe9qTK4oJFpmZhFRQTrSwYg32C1m6",
                  "program_address" : "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c",
                  "token1" : "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm",
                  "token1_decimals" : 9,
                  "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token2_decimals" : 6
               },
               {
                  "amount1" : "11589",
                  "amount2" : "98270",
                  "pool_address" : "EXHyQxMSttcvLPwjENnXCPZ8GmLjJYHtNBnAkcFeFKMn",
                  "program_address" : "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
                  "token1" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token1_decimals" : 6,
                  "token2" : "So11111111111111111111111111111111111111112",
                  "token2_decimals" : 9
               }
            ],
            "token1" : "he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A",
            "token1_decimals" : 9,
            "token2" : "So11111111111111111111111111111111111111112",
            "token2_decimals" : 9
         },
         "sources" : [
            "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
            "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c",
            "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"
         ],
         "time" : "2025-04-05T16:26:57.000Z",
         "trans_id" : "oyNQQNF3UszwdWWmLveFANNJQAAA9eMuvnrvNGAktwMGwEmTnn2upBvhiuaFkbBSigckn9xA2KKEWpXf4cqpYtd",
         "value" : 0.0115712925
      },
      {
         "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
         "block_id" : 331492204,
         "block_time" : 1743870417,
         "from_address" : "HEpD7Ri5VyJENf9ttnErgQRqehUnCNSzCwdStBHo1m4B",
         "platform" : [
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
         ],
         "routers" : {
            "amount1" : 990900,
            "amount2" : 12734,
            "child_routers" : [
               {
                  "amount1" : "990900",
                  "amount2" : "116656",
                  "pool_address" : "3nMFwZXwY1s1M5s8vYAHqd4wGs4iSxXE4LRoUMMYqEgF",
                  "program_address" : "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
                  "token1" : "So11111111111111111111111111111111111111112",
                  "token1_decimals" : 9,
                  "token2" : "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
                  "token2_decimals" : 6
               },
               {
                  "amount1" : "116656",
                  "amount2" : "116612",
                  "pool_address" : "AxHocY4moH8roYQXMQWqoehtW5piMtTJQYmfL4wQ83D8",
                  "program_address" : "SoLFiHG9TfgtdUXUjWAxi3LtvYuFyDLVhBWxdMZxyCe",
                  "token1" : "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
                  "token1_decimals" : 6,
                  "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token2_decimals" : 6
               },
               {
                  "amount1" : "116612",
                  "amount2" : "12734",
                  "pool_address" : "3AbG3ZA19fJKjTSTMTCz7j2bodPagXog4PwTBi8H7UA4",
                  "program_address" : "SoLFiHG9TfgtdUXUjWAxi3LtvYuFyDLVhBWxdMZxyCe",
                  "token1" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token1_decimals" : 6,
                  "token2" : "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
                  "token2_decimals" : 6
               }
            ],
            "token1" : "So11111111111111111111111111111111111111112",
            "token1_decimals" : 9,
            "token2" : "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
            "token2_decimals" : 6
         },
         "sources" : [
            "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
            "SoLFiHG9TfgtdUXUjWAxi3LtvYuFyDLVhBWxdMZxyCe"
         ],
         "time" : "2025-04-05T16:26:57.000Z",
         "trans_id" : "eYuGjJ52NS31W9JeXZPG9Z64KfTH6EVnE6BFZxzWNfGW2KHKMdZ3nyofBLpDxBNU3cMzELfDs1uUL3ZvSrdSbjq",
         "value" : 0.116678475
      },
      {
         "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
         "block_id" : 331492204,
         "block_time" : 1743870417,
         "from_address" : "3JSQxqWHhHn3GKvqLJjts5R8jxe1rmJ7epWnjJ3tgDLi",
         "platform" : [
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
         ],
         "routers" : {
            "amount1" : 3689572812,
            "amount2" : 434244678,
            "child_routers" : [
               {
                  "amount1" : "3689572812",
                  "amount2" : "434244678",
                  "pool_address" : "DH4xmaWDnTzKXehVaPSNy9tMKJxnYL5Mo5U3oTHFtNYJ",
                  "program_address" : "SoLFiHG9TfgtdUXUjWAxi3LtvYuFyDLVhBWxdMZxyCe",
                  "token1" : "So11111111111111111111111111111111111111112",
                  "token1_decimals" : 9,
                  "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token2_decimals" : 6
               }
            ],
            "token1" : "So11111111111111111111111111111111111111112",
            "token1_decimals" : 9,
            "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "token2_decimals" : 6
         },
         "sources" : [
            "SoLFiHG9TfgtdUXUjWAxi3LtvYuFyDLVhBWxdMZxyCe"
         ],
         "time" : "2025-04-05T16:26:57.000Z",
         "trans_id" : "52KsxrFH9nd7ZhypYTJhwQxSBMxq6h4EnVJvobUuLPPRjxmqDnKjXgp59KZnFkxiVXcxdHXSnaQrDv9TDFc4EoDz",
         "value" : 434.244678
      },
      {
         "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
         "block_id" : 331492204,
         "block_time" : 1743870417,
         "from_address" : "GCvHhEUYQwTJ8jyf8Lc4bv8jBXyZU4LMMsZCobwEPzvM",
         "platform" : [
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
         ],
         "routers" : {
            "amount1" : 2555310298,
            "amount2" : 1927464383,
            "child_routers" : [
               {
                  "amount1" : "2555310298",
                  "amount2" : "300742133",
                  "pool_address" : "CAPhoEse9xEH95XmdnJjYrZdNCA8xfUWdy3aWymHa1Vj",
                  "program_address" : "SoLFiHG9TfgtdUXUjWAxi3LtvYuFyDLVhBWxdMZxyCe",
                  "token1" : "So11111111111111111111111111111111111111112",
                  "token1_decimals" : 9,
                  "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token2_decimals" : 6
               },
               {
                  "amount1" : "300742133",
                  "amount2" : "1927464383",
                  "pool_address" : "7EFmig3Jb9j1kJ7ppaUs5iY8P5pBnRdQXUR4q9vSCY37",
                  "program_address" : "SSwapUtytfBdBn1b9NUGG6foMVPtcWgpRU32HToDUZr",
                  "token1" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token1_decimals" : 6,
                  "token2" : "SarosY6Vscao718M4A778z4CGtvcwcGef5M9MEH1LGL",
                  "token2_decimals" : 6
               }
            ],
            "token1" : "So11111111111111111111111111111111111111112",
            "token1_decimals" : 9,
            "token2" : "SarosY6Vscao718M4A778z4CGtvcwcGef5M9MEH1LGL",
            "token2_decimals" : 6
         },
         "sources" : [
            "SoLFiHG9TfgtdUXUjWAxi3LtvYuFyDLVhBWxdMZxyCe",
            "SSwapUtytfBdBn1b9NUGG6foMVPtcWgpRU32HToDUZr"
         ],
         "time" : "2025-04-05T16:26:57.000Z",
         "trans_id" : "2FckQHJnxKGxEjPWd9QbXk7G2LYeaziWPB3vdyshhzGKEtAaYrKHL3NBrfrcJFo7ygcoFPKGJc17JuvtKBmX6dQY",
         "value" : 300.8877875895
      },
      {
         "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
         "block_id" : 331492204,
         "block_time" : 1743870417,
         "from_address" : "BgMQfZThg1RxoSyex7v3W6mzMEvjHU5mD2bpyo4nmZtU",
         "platform" : [
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
         ],
         "routers" : {
            "amount1" : 81450000,
            "amount2" : 211080171,
            "child_routers" : [
               {
                  "amount1" : "81450000",
                  "amount2" : "211080171",
                  "program_address" : "ZERor4xhbUycZ6gb9ntrhqscUcZmAbQDjEAtCf4hbZY",
                  "token1" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token1_decimals" : 6,
                  "token2" : "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
                  "token2_decimals" : 6
               }
            ],
            "token1" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "token1_decimals" : 6,
            "token2" : "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
            "token2_decimals" : 6
         },
         "sources" : [
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
         ],
         "time" : "2025-04-05T16:26:57.000Z",
         "trans_id" : "2K1CfjV4AG2ESzdLaRdP1i9i5nMgHfhipKBkthFQRFebY4YSGfJMfEcbPLXLLyu5MmNfNugg9JbxgZFZNXiMJT9F",
         "value" : 81.6247021257
      },
      {
         "activity_type" : "ACTIVITY_AGG_TOKEN_SWAP",
         "block_id" : 331492202,
         "block_time" : 1743870416,
         "from_address" : "j1opmdubY84LUeidrPCsSGskTCYmeJVzds1UWm6nngb",
         "platform" : [
            "j1o2qRpjcyUwEvwtcfhEQefh773ZgjxcVRry7LDqg5X",
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
         ],
         "routers" : {
            "amount1" : 1207248190,
            "amount2" : 187194466,
            "child_routers" : [
               {
                  "amount1" : "1207248190",
                  "amount2" : "187194466",
                  "pool_address" : "7EFmig3Jb9j1kJ7ppaUs5iY8P5pBnRdQXUR4q9vSCY37",
                  "program_address" : "SSwapUtytfBdBn1b9NUGG6foMVPtcWgpRU32HToDUZr",
                  "token1" : "SarosY6Vscao718M4A778z4CGtvcwcGef5M9MEH1LGL",
                  "token1_decimals" : 6,
                  "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "token2_decimals" : 6
               }
            ],
            "token1" : "SarosY6Vscao718M4A778z4CGtvcwcGef5M9MEH1LGL",
            "token1_decimals" : 6,
            "token2" : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "token2_decimals" : 6
         },
         "sources" : [
            "SSwapUtytfBdBn1b9NUGG6foMVPtcWgpRU32HToDUZr"
         ],
         "time" : "2025-04-05T16:26:56.000Z",
         "trans_id" : "GHZDw22rYFb5s1SSi4Tff5QyuqUnqwL4yYJm5fAPk1BXXfooaNzKqZrMTSNYfZhyMdvkyUL4DM2cMgZYNhUwDo7",
         "value" : 187.194466
      }
   ],
   "success" : true
}
a@a:~/solscanredacted$ 










