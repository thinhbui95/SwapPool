export type Vd1 = {
  "version": "0.1.0",
  "name": "vd1",
  "instructions": [
    {
      "name": "addPool",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintY",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "addLiquidity",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintY",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccountX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccountY",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenUserX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenUserY",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountX",
          "type": "u64"
        },
        {
          "name": "amountY",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintY",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenUserX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenUserY",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenPoolX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenPoolY",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "typeToken",
          "type": "publicKey"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "initPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintX",
            "type": "publicKey"
          },
          {
            "name": "mintY",
            "type": "publicKey"
          },
          {
            "name": "isActived",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "TransferTokenParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "instruction",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NeedInitPool",
      "msg": "Pool haven't created yet"
    },
    {
      "code": 6001,
      "name": "NotEnough",
      "msg": "Not enough balance"
    }
  ]
};

export const IDL: Vd1 = {
  "version": "0.1.0",
  "name": "vd1",
  "instructions": [
    {
      "name": "addPool",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintY",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "addLiquidity",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintY",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccountX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccountY",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenUserX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenUserY",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountX",
          "type": "u64"
        },
        {
          "name": "amountY",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintY",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenUserX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenUserY",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenPoolX",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenPoolY",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "typeToken",
          "type": "publicKey"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "initPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintX",
            "type": "publicKey"
          },
          {
            "name": "mintY",
            "type": "publicKey"
          },
          {
            "name": "isActived",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "TransferTokenParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "instruction",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NeedInitPool",
      "msg": "Pool haven't created yet"
    },
    {
      "code": 6001,
      "name": "NotEnough",
      "msg": "Not enough balance"
    }
  ]
};
