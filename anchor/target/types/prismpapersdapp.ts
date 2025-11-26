/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/prismpapersdapp.json`.
 */
export type Prismpapersdapp = {
  "address": "JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H",
  "metadata": {
    "name": "prismpapersdapp",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initResearch",
      "discriminator": [
        244,
        75,
        131,
        90,
        164,
        217,
        220,
        42
      ],
      "accounts": [
        {
          "name": "author",
          "writable": true,
          "signer": true
        },
        {
          "name": "researchPaper",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  112,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "author"
              }
            ]
          }
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user_account.owner",
                "account": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "encryptedUrl",
          "type": "string"
        },
        {
          "name": "encryptionKey",
          "type": "string"
        }
      ]
    },
    {
      "name": "initUser",
      "discriminator": [
        14,
        51,
        68,
        159,
        237,
        78,
        158,
        102
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "userVault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "purchaseAccess",
      "discriminator": [
        191,
        249,
        111,
        210,
        163,
        248,
        87,
        242
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "researchPaper",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  112,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "research_paper.author",
                "account": "researchPaper"
              }
            ]
          }
        },
        {
          "name": "buyerUserAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "buyer_user_account.owner",
                "account": "user"
              }
            ]
          }
        },
        {
          "name": "buyerVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "authorUserAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "research_paper.author",
                "account": "researchPaper"
              }
            ]
          }
        },
        {
          "name": "authorVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "research_paper.author",
                "account": "researchPaper"
              }
            ]
          }
        },
        {
          "name": "adminVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "accessReceipt",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  101,
                  105,
                  112,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "account",
                "path": "researchPaper"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "accessReceipt",
      "discriminator": [
        160,
        208,
        81,
        74,
        140,
        203,
        172,
        176
      ]
    },
    {
      "name": "researchPaper",
      "discriminator": [
        103,
        125,
        147,
        192,
        213,
        248,
        70,
        245
      ]
    },
    {
      "name": "user",
      "discriminator": [
        159,
        117,
        95,
        227,
        239,
        151,
        58,
        236
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "userNameInvalid",
      "msg": "User name cannot be empty or too long"
    },
    {
      "code": 6001,
      "name": "paperTitleInvalid",
      "msg": "Research Paper Title cannot be empty or too long"
    },
    {
      "code": 6002,
      "name": "paperDescriptionInvalid",
      "msg": "Research Paper Description cannot be empty or too long"
    },
    {
      "code": 6003,
      "name": "paperUrlEmpty",
      "msg": "Research Paper URL/CID cannot be empty"
    },
    {
      "code": 6004,
      "name": "encryptionKeyEmpty",
      "msg": "Protocol Encryption Key cannot be empty"
    },
    {
      "code": 6005,
      "name": "reviewUrlEmpty",
      "msg": "Review Link/CID cannot be empty"
    },
    {
      "code": 6006,
      "name": "researchPriceInvalid",
      "msg": "Price must be greater than zero"
    },
    {
      "code": 6007,
      "name": "mathOverflow",
      "msg": "Mathematical Operation Overflow"
    },
    {
      "code": 6008,
      "name": "insufficientFundsInVault",
      "msg": "The vault does not have enough SOL to fulfill this request"
    },
    {
      "code": 6009,
      "name": "insufficientUserEarnings",
      "msg": "User does not have enough accrued earnings for this withdrawal"
    },
    {
      "code": 6010,
      "name": "insufficientFundsInWallet",
      "msg": "The buyer/reviewer/author does not have enough SOL in their wallet"
    },
    {
      "code": 6011,
      "name": "unauthorizedAdmin",
      "msg": "You are not authorized to perform this action (Admin Only)"
    },
    {
      "code": 6012,
      "name": "unauthorizedUpdate",
      "msg": "Only the original author can update this paper"
    },
    {
      "code": 6013,
      "name": "authorCantBuySelf",
      "msg": "You cannot buy your own research paper"
    },
    {
      "code": 6014,
      "name": "authorCantReviewSelf",
      "msg": "You cannot review your own research paper"
    },
    {
      "code": 6015,
      "name": "alreadyPurchased",
      "msg": "You have already purchased this paper"
    },
    {
      "code": 6016,
      "name": "alreadyReviewed",
      "msg": "You have already submitted a review for this paper"
    },
    {
      "code": 6017,
      "name": "reviewNotPending",
      "msg": "This review has already been processed (Accepted/Rejected)"
    },
    {
      "code": 6018,
      "name": "notPurchased",
      "msg": "You must purchase the paper before reviewing it"
    }
  ],
  "types": [
    {
      "name": "accessReceipt",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "purchasedPaper",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "researchPaper",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "sales",
            "type": "u32"
          },
          {
            "name": "reviews",
            "type": "u32"
          },
          {
            "name": "encryptedUrl",
            "type": "string"
          },
          {
            "name": "encryptionKey",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "published",
            "type": "u16"
          },
          {
            "name": "purchased",
            "type": "u16"
          },
          {
            "name": "sold",
            "type": "u16"
          },
          {
            "name": "reviewed",
            "type": "u16"
          },
          {
            "name": "earning",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
