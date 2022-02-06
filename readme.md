`GET` `/api` : Just to check

`GET` `/api/history` : To get list of over matches

Example:

````
{
  "success": true,
  "matches": [
    {
      "_id": "60f17866843fb605309504b2",
      "bets": [
        {
          "addy": "8726987346587236897xo9587q398",
          "betOn": "black",
          "amount": "12",
          "status": "tie"
        }
      ],
      "timestamp": "1626437734143",
      "matchID": "20176268757",
      "resolved": true,
      "__v": 0
    },
    {
      "_id": "60f17ac7f741dc35246b05b9",
      "bets": [
        {
          "addy": "231",
          "betOn": "black",
          "amount": "321",
          "status": "won"
        },
        {
          "addy": "8726987346587236897xo9587q398",
          "betOn": "white",
          "amount": "123",
          "status": "lost"
        }
      ],
      "timestamp": "1626438343757",
      "matchID": "20177348645",
      "resolved": true,
      "__v": 0
    },
    {
      "_id": "60f1e32eac291037204246ec",
      "bets": [
        {
          "addy": "8u132",
          "betOn": "black",
          "amount": "222222",
          "status": "won"
        },
        {
          "addy": "8726987346587236897xo9587q398",
          "betOn": "white",
          "amount": "12331213",
          "status": "lost"
        }
      ],
      "timestamp": "1626465070770",
      "matchID": "20203791543",
      "resolved": true,
      "__v": 0
    },
    {
      "_id": "60f28a325b41f306fccdc344",
      "bets": [
        {
          "addy": "8726987346587236897xo9587q398",
          "betOn": "black",
          "amount": "234",
          "status": "won"
        },
        {
          "addy": "8726987346587236897xo9587q398",
          "betOn": "white",
          "amount": "12",
          "status": "lost"
        }
      ],
      "timestamp": "1626507826018",
      "matchID": "20246435461",
      "resolved": true,
      "__v": 0
    },
    {
      "_id": "60f28c59640ba00f5c5cec9e",
      "bets": [
        {
          "addy": "124234234232",
          "betOn": "black",
          "amount": "100",
          "status": "lost"
        }
      ],
      "timestamp": "1626508377395",
      "matchID": "20246985791",
      "resolved": true,
      "__v": 0
    },
    {
      "_id": "60f28dfa76b2734b5cedb18f",
      "bets": [
        {
          "addy": "8726987346587236897xo9587q398",
          "betOn": "black",
          "amount": "234",
          "status": "lost"
        }
      ],
      "timestamp": "1626508794581",
      "matchID": "20247596689",
      "resolved": true,
      "__v": 0
    },
    {
      "_id": "60f293dd02d40d1f603b03cb",
      "bets": [
        {
          "addy": "8726987346587236897xo9587q398",
          "betOn": "black",
          "amount": "222222",
          "status": "won"
        },
        {
          "addy": "8729587q398",
          "betOn": "white",
          "amount": "1111111111",
          "status": "lost"
        },
        {
          "addy": "23er432536v3456334hq526546g4",
          "betOn": "black",
          "amount": "3",
          "status": "won"
        }
      ],
      "timestamp": "1626510301846",
      "matchID": "20249355863",
      "resolved": true,
      "__v": 0
    },
    {
      "_id": "60fc4d5c5c954944a42e2960",
      "bets": [
        {
          "addy": "8726987346587236897xo9587q398",
          "betOn": "black",
          "amount": "12",
          "status": "tie"
        }
      ],
      "timestamp": "1627147612580",
      "matchID": "20886621909",
      "resolved": true,
      "__v": 0
    },
    {
      "_id": "60fc4db45c954944a42e2969",
      "bets": [
        {
          "addy": "8726987346587236897xo9587q398",
          "betOn": "black",
          "amount": "12",
          "status": "lost"
        }
      ],
      "timestamp": "1627147700406",
      "matchID": "20886642005",
      "resolved": true,
      "__v": 0
    }
  ]
}
````

`GET` `/api/live` : To get list of live matches with at least 1 bet placed

Example:

````
{
  "success": true,
  "matches": [
    {
      "_id": "615094cf215afd1fdca3436d",
      "bets": [
        {
          "addy": "8726987346587236897xo9587q398",
          "betOn": "white",
          "amount": "43",
          "status": "nil"
        }
      ],
      "timestamp": "1632670927932",
      "matchID": "26409619331",
      "resolved": false,
      "__v": 0
    },
    {
      "_id": "6150b710a97a9fd5d9ff346a",
      "timestamp": "1632679696191",
      "matchID": "2641021222222222222401",
      "resolved": false,
      "bets": [
        {
          "addy": "xxxxxxxxxxxxxxxxxxxxxxxx",
          "betOn": "white",
          "amount": 23102001,
          "status": "nil"
        }
      ],
      "__v": 0
    },
    {
      "_id": "6150b71aa97a9fd5d9ff346d",
      "timestamp": "1632679706635",
      "matchID": "2641021222222222322401",
      "resolved": false,
      "bets": [
        {
          "addy": "xxxxxxxxxxxxxxxxxxxxxxxx",
          "betOn": "white",
          "amount": 23102001,
          "status": "nil"
        },
        {
          "addy": "xxxxxxxxxxxxxxxxxxxxxxxx",
          "betOn": "black",
          "amount": 23102001,
          "status": "nil"
        },
        {
          "addy": "xxxxxyyyyyyyyyyyyxxxxx",
          "betOn": "black",
          "amount": 23102001,
          "status": "nil"
        }
      ],
      "__v": 0
    }
  ]
}
````

`GET` `/api/resolve` Resolves the matches and pays once match over
(Not for front end)

````
{
  gameID(String),
  colour(String),
  amount(Integer),
  walletAddress(String)
}
````

`POST` `/api/create` Creates a match (handles duplicates)

Example:

````
{
  success: true,
  message: 'Bet placed'
}
````

OR

````
{
  success: false,
  message: "Error",
  err
}
````
