export type Severity = "high" | "medium";

export interface CodeExample {
  lang: string;
  bad?: string;
  good: string;
}

export interface Pitfall {
  id: string;
  severity: Severity;
  relatedApis: string[];
  codeExample?: CodeExample;
}

export const pitfalls: Pitfall[] = [
  {
    id: "arrays-full-replace",
    severity: "high",
    relatedApis: ["listing"],
    codeExample: {
      lang: "graphql",
      bad: `# NG: 画像を1枚追加したつもりが、既存画像が全て削除される
mutation {
  updateListing(input: {
    listingIdentifier: { listingId: "123" }
    product: {
      imageUrls: ["https://new-image.jpg"]  # 既存画像が全て消える
    }
  }) { listingId }
}`,
      good: `# OK: 残したい既存画像も全て含める
mutation {
  updateListing(input: {
    listingIdentifier: { listingId: "123" }
    product: {
      imageUrls: [
        "https://existing-image-1.jpg",  # 既存を維持
        "https://existing-image-2.jpg",  # 既存を維持
        "https://new-image.jpg"           # 新規追加
      ]
    }
  }) { listingId }
}`,
    },
  },
  {
    id: "transaction-id-removed",
    severity: "high",
    relatedApis: ["order"],
  },
  {
    id: "verify-operation-mode",
    severity: "medium",
    relatedApis: ["listing"],
    codeExample: {
      lang: "graphql",
      good: `# VerifyAddFixedPriceItem の代わりに operationMode: VALIDATE を使う
mutation {
  createListing(input: {
    options: { operationMode: VALIDATE }
    # ... 通常と同じ入力フィールド ...
  }) {
    errors { errorId message }   # 実際には出品されない
    warnings { warningId message }
  }
}`,
    },
  },
  {
    id: "paid-unpaid-split",
    severity: "high",
    relatedApis: ["order"],
  },
  {
    id: "case-entity-removed",
    severity: "high",
    relatedApis: ["cancellation", "returns", "inr"],
  },
  {
    id: "site-id-to-marketplace-id",
    severity: "high",
    relatedApis: ["listing", "order", "account"],
    codeExample: {
      lang: "http",
      bad: `# NG: Trading API スタイル
POST https://api.ebay.com/ws/api.dll
X-EBAY-API-SITEID: 0`,
      good: `# OK: 新 API スタイル
POST https://graphqlapi.ebay.com/graphql
X-EBAY-C-MARKETPLACE-ID: EBAY_US`,
    },
  },
  {
    id: "cursor-pagination",
    severity: "medium",
    relatedApis: ["listing", "order"],
    codeExample: {
      lang: "graphql",
      bad: `# NG: orders は入力なし・pageCursor フィールドは存在しない
query {
  orders(input: { ordersPage: { limit: 20 } }) {
    orders { orderId }
    pageCursor { nextPageCursor }  # ← このフィールドは存在しない
  }
}`,
      good: `# OK: orders { sellerOrders(input:...) } の2層構造 / pagination { nextCursor }
# 1ページ目
query {
  orders {
    sellerOrders(input: {
      ordersFirstPage: {
        maxPageSize: 20
        filter: {
          dateRange: { dateTimeRange: { startDateTime: "2025-01-01T00:00:00Z" endDateTime: "2025-03-31T23:59:59Z" } dateType: CONFIRMED }
          filter: { includeConfirmed: true }
          sort: { sortField: CONFIRMED_AT sortOrder: DESC }
        }
      }
    }) {
      orders { orderId }
      pagination { nextCursor }  # ← 正しいフィールド名
    }
  }
}

# 次ページ: pagination.nextCursor の値をそのまま渡す (計算・逆算不可)
query {
  orders {
    sellerOrders(input: {
      ordersPage: { maxPageSize: 20 pageCursor: "eyJza2lwIjoyMH0=" }
    }) {
      orders { orderId }
      pagination { nextCursor previousCursor }
    }
  }
}`,
    },
  },
  {
    id: "inventory-mapping-no-sandbox",
    severity: "medium",
    relatedApis: ["listing"],
  },
  {
    id: "mapping-reference-id",
    severity: "medium",
    relatedApis: ["listing"],
    codeExample: {
      lang: "graphql",
      good: `# Inventory Mapping API を使った場合、mappingReferenceId を createListing に渡す
mutation {
  createListing(input: {
    mappingReferenceId: "MAPPING_REF_ID_FROM_PREVIEW"
    # ... その他のフィールド ...
  }) { listingId }
}`,
    },
  },
  {
    id: "auth-scope-granularity",
    severity: "high",
    relatedApis: ["listing", "order", "account"],
  },
  {
    id: "add-to-item-description-removed",
    severity: "medium",
    relatedApis: ["listing"],
  },
  {
    id: "get-user-contact-details-removed",
    severity: "medium",
    relatedApis: ["account"],
  },
  {
    id: "messaging-preferences-removed",
    severity: "medium",
    relatedApis: ["messaging"],
  },
  {
    id: "auction-restrictions",
    severity: "medium",
    relatedApis: ["listing"],
  },
  {
    id: "graphql-partial-success",
    severity: "high",
    relatedApis: ["listing", "order"],
    codeExample: {
      lang: "json",
      good: `// GraphQL は data と errors が同時に返ることがある（部分成功）
// 必ず failures / errors 配列も確認すること
{
  "data": {
    "bulkUpdateInventory": {
      "successes": [
        { "listingId": "1" },
        { "listingId": "2" }
      ],
      "failures": [
        {
          "listingId": "3",
          "errors": [{ "errorId": "25714", "message": "..." }]
        }
      ]
    }
  }
}`,
    },
  },
  {
    id: "item-commitments-two-level",
    severity: "high",
    relatedApis: ["order"],
    codeExample: {
      lang: "graphql",
      bad: `# NG: itemCommitments はルートクエリに入力なし
# かつフィールドが存在しない
query {
  itemCommitments(input: {
    commitmentsPage: { limit: 20 }
  }) {
    itemCommitments {
      itemCommitmentId
      status      # ← 存在しない (state が正しい)
      listingId   # ← 存在しない (lineItem.item.itemId が正しい)
      quantity    # ← 存在しない (lineItem.quantity が正しい)
    }
    pageCursor { nextPageCursor }  # ← 存在しない
  }
}`,
      good: `# OK: itemCommitments → sellerItemCommitments(input:...) の2層構造
query {
  itemCommitments {
    sellerItemCommitments(input: {
      itemCommitmentsFirstPage: {
        maxPageSize: 20
        filter: {
          dateRange: {
            dateTimeRange: { startDateTime: "2025-01-01T00:00:00Z" endDateTime: "2025-03-31T23:59:59Z" }
            dateType: CREATED
          }
          filter: { includeActive: true }
          sort: { sortField: CREATED_AT sortOrder: DESC }
        }
      }
    }) {
      itemCommitments {
        itemCommitmentId
        state                        # ← state (status ではない)
        lineItem { quantity item { itemId } }  # ← 正しい場所
      }
      pagination { nextCursor }      # ← 正しいフィールド名
    }
  }
}`,
    },
  },
  {
    id: "order-amount-field-names",
    severity: "high",
    relatedApis: ["order"],
    codeExample: {
      lang: "graphql",
      bad: `# NG: total フィールドは存在しない
query {
  orders {
    sellerOrders(input: { ... }) {
      orders {
        totals { total { value currency } }                    # ← エラー
        orderLineItems {
          lineItemTotals { total { value currency } }          # ← エラー
        }
      }
    }
  }
}`,
      good: `# OK: 正しいフィールド名
query {
  orders {
    sellerOrders(input: { ... }) {
      orders {
        totals { orderTotal { original { value currency } } }           # ← orderTotal
        orderLineItems {
          lineItemTotals { lineItemTotal { original { value currency } } }  # ← lineItemTotal
        }
      }
    }
  }
}`,
    },
  },
  {
    id: "trading-order-status-completed",
    severity: "medium",
    relatedApis: ["order"],
    codeExample: {
      lang: "xml",
      bad: `<!-- NG: 'Complete' は無効な値 -->
<GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderStatus>Complete</OrderStatus>  <!-- エラーまたは0件返却 -->
</GetOrdersRequest>`,
      good: `<!-- OK: 'Completed' が正しい列挙値 -->
<GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderStatus>Completed</OrderStatus>  <!-- 正しい値 -->
  <!-- 未払い注文は OrderStatus: Active -->
</GetOrdersRequest>`,
    },
  },
  {
    id: "trading-create-time-range-limit",
    severity: "medium",
    relatedApis: ["order"],
    codeExample: {
      lang: "xml",
      bad: `<!-- NG: 90日を超える日付範囲はエラー -->
<GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CreateTimeFrom>2024-01-01T00:00:00Z</CreateTimeFrom>
  <CreateTimeTo>2024-12-31T23:59:59Z</CreateTimeTo>  <!-- 365日 → エラー -->
</GetOrdersRequest>`,
      good: `<!-- OK: CreateTimeFrom/CreateTimeTo の最大範囲は 90 日 -->
<!-- 90日を超えるデータが必要な場合は範囲を分割して複数回呼び出す -->
<GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CreateTimeFrom>2025-01-01T00:00:00Z</CreateTimeFrom>
  <CreateTimeTo>2025-03-31T23:59:59Z</CreateTimeTo>  <!-- 89日 ✓ -->
</GetOrdersRequest>`,
    },
  },
  {
    id: "seller-listings-input-and-union",
    severity: "high",
    relatedApis: ["listing", "offers"],
    codeExample: {
      lang: "graphql",
      bad: `# NG1: listingIds は存在しない (正: listings: [{ listingId }])
# NG2: union 型のハンドリングなし
# NG3: itemOfferOverview は listing.items の中
query {
  sellerListings(input: { listingIds: ["123456789"] }) {
    listings {
      listingId
      product { title }             # ← ListingSuccess.listing.product が正しいパス
      itemOfferOverview { ... }     # ← listing.items[].itemOfferOverview が正しいパス
    }
  }
}`,
      good: `# OK: 正しい input + union ハンドリング (現在 listingId は最大1件)
query {
  sellerListings(input: { listings: [{ listingId: "123456789" }] }) {
    ... on ListingsSuccess {
      listings {
        ... on ListingSuccess {
          listingId
          listing {
            product { title }
            items {
              itemOfferOverview { negotiationCount }  # ← 正しいパス
            }
          }
        }
        ... on ListingPartialSuccess {
          listingId
          errors { errorId message }  # onHold 出品の場合
        }
      }
    }
    ... on ListingIdsMaxLimitError {
      errorCode errorMessage  # 1件超指定時
    }
  }
}`,
    },
  },
  {
    id: "graphql-union-error-handling",
    severity: "high",
    relatedApis: ["listing", "order", "cancellation", "returns"],
    codeExample: {
      lang: "graphql",
      bad: `# NG: union error を無視して data だけ参照するとサイレント失敗する
mutation {
  createOrderCancellation(input: {
    orderId: "ORDER-ID-123"
    contractCancellationReason: OUT_OF_STOCK
    relistAllItems: false
  }) {
    contractCancellation { cancellationId }  # ← エラー時は null が返りサイレント失敗
  }
}`,
      good: `# OK: 必ず union error の inline fragment を書いてエラーを補足する
mutation {
  createOrderCancellation(input: {
    orderId: "ORDER-ID-123"
    contractCancellationReason: OUT_OF_STOCK
    relistAllItems: false
  }) {
    ... on CreateOrderCancellationSuccess {
      contractCancellation { cancellationId status { code displayText } }
    }
    ... on OrderNotFoundError {
      errorCode  # "ORDER_NOT_FOUND"
      errorMessage
    }
    ... on OrderCancellationEligibilityError {
      errorCode  # キャンセル不可の理由
      errorMessage
    }
    ... on RefundProcessingError {
      errorCode
      errorMessage
    }
  }
}

# レスポンス例 (エラー時): __typename で判別
# {
#   "data": {
#     "createOrderCancellation": {
#       "__typename": "OrderNotFoundError",
#       "errorCode": "ORDER_NOT_FOUND",
#       "errorMessage": "Order not found."
#     }
#   }
# }`,
    },
  },
];
