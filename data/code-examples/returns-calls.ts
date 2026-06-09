import type { Lang } from "@/components/CodeTabs";

export interface ApiCallSnippet {
  old: Record<Lang, string>;
  new: Record<Lang, string>;
}

// ─── Get Return / Search Returns ─────────────────────────────────────────────
// Old: POST /post-order/v2/return/search (GET with query params)
// New: sellerOrderReturns(input: { initialPage: { filter: { presets }, sort }, pagination })
//      presets: AWAITING_ACTION_FROM_SELLER | AWAITING_ACTION_FROM_BUYER | IN_PROGRESS | CLOSED

export const searchReturns: ApiCallSnippet = {
  old: {
    php: `<?php
// Post-Order API: Search Returns
// GET https://api.ebay.com/post-order/v2/return/search
// status: APPROVED | CLOSED | EMPTY | ITEM_SHIPPED | LAST_SELLER_RESPONSE | MISSING_SELLER_RESPONSE | MORE_INFO_REQUESTED | OPEN | PARTIAL_REFUND | RETURNED | UNKNOWN
$params = http_build_query([
    'status' => 'OPEN',
    'limit'  => 20,
    'offset' => 0,
]);
$ch = curl_init("https://api.ebay.com/post-order/v2/return/search?{$params}");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
    ],
]);
$data = json_decode(curl_exec($ch), true);
$returns = $data['returns'];
curl_close($ch);`,

    ruby: `# Post-Order API: Search Returns
require 'net/http'
uri = URI('https://api.ebay.com/post-order/v2/return/search')
uri.query = URI.encode_www_form(status: 'OPEN', limit: 20, offset: 0)
req = Net::HTTP::Get.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
returns = JSON.parse(res.body)['returns']`,

    java: `// Post-Order API: Search Returns
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/post-order/v2/return/search?status=OPEN&limit=20&offset=0"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .GET()
    .build();
http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Post-Order API: Search Returns
const params = new URLSearchParams({ status: 'OPEN', limit: '20', offset: '0' });
const { returns } = await fetch(
  \`https://api.ebay.com/post-order/v2/return/search?\${params}\`,
  { headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US' } }
).then(r => r.json());`,

    go: `// Post-Order API: Search Returns
req, _ := http.NewRequest("GET",
    "https://api.ebay.com/post-order/v2/return/search?status=OPEN&limit=20&offset=0",
    nil)
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
http.DefaultClient.Do(req)`,

    python: `# Post-Order API: Search Returns
import requests
res = requests.get(
    'https://api.ebay.com/post-order/v2/return/search',
    params={'status': 'OPEN', 'limit': 20, 'offset': 0},
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'},
)
returns = res.json()['returns']`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: sellerOrderReturns
// presets: AWAITING_ACTION_FROM_SELLER | AWAITING_ACTION_FROM_BUYER | AWAITING_ACTION_FROM_EBAY | IN_PROGRESS | CLOSED
// pagination: initialPage で最初のページ、続ページは pagination.pageCursor を使う
$query = <<<'GQL'
query {
  sellerOrderReturns(input: {
    initialPage: {
      filter: { presets: AWAITING_ACTION_FROM_SELLER }
      sort: { sortField: REQUESTED_AT, sortOrder: DESC }
    }
  }) {
    orderReturns {
      returnId
      status { code displayText }
      requestedAt
      closedAt
      returnLineItems {
        returnLineItemId
        returnReason { code displayText }
        requestedQuantity
      }
    }
    pagination { nextCursor previousCursor }
  }
}
GQL;

$ch = curl_init('https://graphqlapi.ebay.com/graphql');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode(['query' => $query]),
]);
$data = json_decode(curl_exec($ch), true);
$returns = $data['data']['sellerOrderReturns']['orderReturns'];
curl_close($ch);`,

    ruby: `# GraphQL: sellerOrderReturns
# presets: AWAITING_ACTION_FROM_SELLER | AWAITING_ACTION_FROM_BUYER | IN_PROGRESS | CLOSED
require 'net/http'; require 'json'

query = <<~GQL
  query {
    sellerOrderReturns(input: {
      initialPage: {
        filter: { presets: AWAITING_ACTION_FROM_SELLER }
        sort: { sortField: REQUESTED_AT, sortOrder: DESC }
      }
    }) {
      orderReturns {
        returnId status { code displayText } requestedAt
        returnLineItems { returnLineItemId returnReason { code displayText } requestedQuantity }
      }
      pagination { nextCursor }
    }
  }
GQL

uri = URI('https://graphqlapi.ebay.com/graphql')
req = Net::HTTP::Post.new(uri)
req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req['Content-Type'] = 'application/json'
req.body = { query: query }.to_json
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
returns = JSON.parse(res.body)['data']['sellerOrderReturns']['orderReturns']`,

    java: `// GraphQL: sellerOrderReturns — scope: sell.return.read
// presets: AWAITING_ACTION_FROM_SELLER | AWAITING_ACTION_FROM_BUYER | IN_PROGRESS | CLOSED
String query = """
    query {
      sellerOrderReturns(input: {
        initialPage: {
          filter: { presets: AWAITING_ACTION_FROM_SELLER }
          sort: { sortField: REQUESTED_AT, sortOrder: DESC }
        }
      }) {
        orderReturns {
          returnId status { code displayText } requestedAt
          returnLineItems { returnLineItemId returnReason { code displayText } requestedQuantity }
        }
        pagination { nextCursor }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: sellerOrderReturns — scope: sell.return.read
// presets: AWAITING_ACTION_FROM_SELLER | AWAITING_ACTION_FROM_BUYER | IN_PROGRESS | CLOSED
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`query {
    sellerOrderReturns(input: {
      initialPage: {
        filter: { presets: AWAITING_ACTION_FROM_SELLER }
        sort: { sortField: REQUESTED_AT, sortOrder: DESC }
      }
    }) {
      orderReturns {
        returnId status { code displayText } requestedAt
        returnLineItems { returnLineItemId returnReason { code displayText } requestedQuantity }
      }
      pagination { nextCursor }
    }
  }\` }),
}).then(r => r.json());
const returns = data.sellerOrderReturns.orderReturns;`,

    go: `// GraphQL: sellerOrderReturns — scope: sell.return.read
body := \`{"query":"query { sellerOrderReturns(input: { initialPage: { filter: { presets: AWAITING_ACTION_FROM_SELLER } sort: { sortField: REQUESTED_AT sortOrder: DESC } } }) { orderReturns { returnId status { code displayText } requestedAt returnLineItems { returnLineItemId returnReason { code displayText } requestedQuantity } } pagination { nextCursor } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: sellerOrderReturns — scope: sell.return.read
# presets: AWAITING_ACTION_FROM_SELLER | AWAITING_ACTION_FROM_BUYER | IN_PROGRESS | CLOSED
import requests

query = """query {
  sellerOrderReturns(input: {
    initialPage: {
      filter: { presets: AWAITING_ACTION_FROM_SELLER }
      sort: { sortField: REQUESTED_AT, sortOrder: DESC }
    }
  }) {
    orderReturns {
      returnId status { code displayText } requestedAt
      returnLineItems { returnLineItemId returnReason { code displayText } requestedQuantity }
    }
    pagination { nextCursor }
  }
}"""

res = requests.post('https://graphqlapi.ebay.com/graphql',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
    },
    json={'query': query})
returns = res.json()['data']['sellerOrderReturns']['orderReturns']`,
  } as Record<Lang, string>,
};

// ─── Approve / Decline Return ─────────────────────────────────────────────────
// Old: POST /post-order/v2/return/{returnId}/decide
// New: approveReturn({ returnId, approvalNote? }) / declineReturn({ returnId, declinationNote? })

export const approveReturn: ApiCallSnippet = {
  old: {
    php: `<?php
// Post-Order API: Approve Return
// POST https://api.ebay.com/post-order/v2/return/{returnId}/decide
$returnId = 'RETURN-ID-123';
$ch = curl_init("https://api.ebay.com/post-order/v2/return/{$returnId}/decide");
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'Content-Type: application/json',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'decision'       => 'SELLER_APPROVE',
        'sellerComment'  => 'Approved. Please ship within 3 days.',
    ]),
]);
curl_exec($ch); curl_close($ch);`,

    ruby: `# Post-Order API: Approve Return
require 'net/http'; require 'json'
uri = URI('https://api.ebay.com/post-order/v2/return/RETURN-ID-123/decide')
req = Net::HTTP::Post.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['Content-Type']            = 'application/json'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req.body = { decision: 'SELLER_APPROVE', sellerComment: 'Approved.' }.to_json
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// Post-Order API: Approve Return
String body = """{"decision":"SELLER_APPROVE","sellerComment":"Approved."}""";
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/post-order/v2/return/RETURN-ID-123/decide"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();`,

    nodejs: `// Post-Order API: Approve Return
await fetch('https://api.ebay.com/post-order/v2/return/RETURN-ID-123/decide', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ decision: 'SELLER_APPROVE', sellerComment: 'Approved.' }),
});`,

    go: `// Post-Order API: Approve Return
body := \`{"decision":"SELLER_APPROVE","sellerComment":"Approved."}\`
req, _ := http.NewRequest("POST",
    "https://api.ebay.com/post-order/v2/return/RETURN-ID-123/decide",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")`,

    python: `# Post-Order API: Approve Return
import requests
requests.post(
    'https://api.ebay.com/post-order/v2/return/RETURN-ID-123/decide',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={'decision': 'SELLER_APPROVE', 'sellerComment': 'Approved.'},
)`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: approveReturn / declineReturn
// approveReturn input:  { returnId, approvalNote? }
// declineReturn input:  { returnId, declinationNote? }
$query = <<<'GQL'
mutation {
  approveReturn(input: {
    returnId: "RETURN-ID-123"
    approvalNote: "Approved. Please ship within 3 days."
  }) {
    ... on OrderReturn {
      returnId
      status { code displayText }
    }
    ... on ReturnActionNotPermittedError { errorCode errorMessage }
    ... on ReturnNotFoundError { errorCode errorMessage }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: sell.return`,

    ruby: `# GraphQL: approveReturn — scope: sell.return
# approveReturn input: { returnId, approvalNote? }
query = <<~GQL
  mutation {
    approveReturn(input: {
      returnId: "RETURN-ID-123"
      approvalNote: "Approved."
    }) {
      ... on OrderReturn { returnId status { code displayText } }
      ... on ReturnActionNotPermittedError { errorCode errorMessage }
      ... on ReturnNotFoundError { errorCode errorMessage }
    }
  }
GQL
# POST https://graphqlapi.ebay.com/graphql`,

    java: `// GraphQL: approveReturn — scope: sell.return
// approveReturn input: { returnId, approvalNote? }
String query = """
    mutation {
      approveReturn(input: {
        returnId: \\"RETURN-ID-123\\"
        approvalNote: \\"Approved.\\"
      }) {
        ... on OrderReturn { returnId status { code displayText } }
        ... on ReturnActionNotPermittedError { errorCode errorMessage }
        ... on ReturnNotFoundError { errorCode errorMessage }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: approveReturn — scope: sell.return
// approveReturn input: { returnId, approvalNote? }
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`mutation {
    approveReturn(input: {
      returnId: "RETURN-ID-123"
      approvalNote: "Approved."
    }) {
      ... on OrderReturn { returnId status { code displayText } }
      ... on ReturnActionNotPermittedError { errorCode errorMessage }
      ... on ReturnNotFoundError { errorCode errorMessage }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL: approveReturn — scope: sell.return
body := \`{"query":"mutation { approveReturn(input: { returnId: \\"RETURN-ID-123\\" approvalNote: \\"Approved.\\" }) { ... on OrderReturn { returnId status { code displayText } } ... on ReturnActionNotPermittedError { errorCode errorMessage } ... on ReturnNotFoundError { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: approveReturn — scope: sell.return
# approveReturn input: { returnId, approvalNote? }
import requests

query = """mutation {
  approveReturn(input: {
    returnId: "RETURN-ID-123"
    approvalNote: "Approved. Please ship within 3 days."
  }) {
    ... on OrderReturn { returnId status { code displayText } }
    ... on ReturnActionNotPermittedError { errorCode errorMessage }
    ... on ReturnNotFoundError { errorCode errorMessage }
  }
}"""

requests.post('https://graphqlapi.ebay.com/graphql',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
    },
    json={'query': query})`,
  } as Record<Lang, string>,
};

// ─── Issue Refund (Return) ────────────────────────────────────────────────────
// Old: POST /post-order/v2/return/{returnId}/issue_refund
// New: processReturnRefund({ returnId, returnLineItemRefundWithholdings? })
//      withholdReturnRefundReason: RETURNED_IN_DAMAGED_CONDITION | RETURNED_IN_USED_CONDITION | RETURNED_WITH_MISSING_PARTS

export const issueReturnRefund: ApiCallSnippet = {
  old: {
    php: `<?php
// Post-Order API: Issue Return Refund
// POST https://api.ebay.com/post-order/v2/return/{returnId}/issue_refund
$ch = curl_init('https://api.ebay.com/post-order/v2/return/RETURN-ID-123/issue_refund');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => '{}',
]);
curl_exec($ch); curl_close($ch);`,

    ruby: `# Post-Order API: Issue Return Refund
require 'net/http'
uri = URI('https://api.ebay.com/post-order/v2/return/RETURN-ID-123/issue_refund')
req = Net::HTTP::Post.new(uri)
req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
req['Content-Type']  = 'application/json'
req.body = '{}'
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// Post-Order API: Issue Return Refund
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/post-order/v2/return/RETURN-ID-123/issue_refund"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .POST(HttpRequest.BodyPublishers.ofString("{}"))
    .build();`,

    nodejs: `// Post-Order API: Issue Return Refund
await fetch('https://api.ebay.com/post-order/v2/return/RETURN-ID-123/issue_refund', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json' },
  body: '{}',
});`,

    go: `// Post-Order API: Issue Return Refund
req, _ := http.NewRequest("POST",
    "https://api.ebay.com/post-order/v2/return/RETURN-ID-123/issue_refund",
    strings.NewReader("{}"))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")`,

    python: `# Post-Order API: Issue Return Refund
import requests
requests.post(
    'https://api.ebay.com/post-order/v2/return/RETURN-ID-123/issue_refund',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={},
)`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: processReturnRefund
// 返品品が損傷・使用済みの場合は returnLineItemRefundWithholdings で差し引きを指定可能
// withholdReturnRefundReason: RETURNED_IN_DAMAGED_CONDITION | RETURNED_IN_USED_CONDITION | RETURNED_WITH_MISSING_PARTS
$query = <<<'GQL'
mutation {
  processReturnRefund(input: {
    returnId: "RETURN-ID-123"
  }) {
    ... on OrderReturn {
      returnId
      status { code displayText }
      refunds {
        refundId
        refundStatus
      }
    }
    ... on ReturnActionNotPermittedError { errorCode errorMessage }
    ... on ReturnNotFoundError { errorCode errorMessage }
    ... on RefundProcessingError { errorCode errorMessage }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: sell.return`,

    ruby: `# GraphQL: processReturnRefund — scope: sell.return
# returnLineItemRefundWithholdings で差し引きを指定可能
query = <<~GQL
  mutation {
    processReturnRefund(input: { returnId: "RETURN-ID-123" }) {
      ... on OrderReturn { returnId status { code displayText } refunds { refundId refundStatus } }
      ... on ReturnActionNotPermittedError { errorCode errorMessage }
      ... on RefundProcessingError { errorCode errorMessage }
    }
  }
GQL
# POST https://graphqlapi.ebay.com/graphql`,

    java: `// GraphQL: processReturnRefund — scope: sell.return
String query = """
    mutation {
      processReturnRefund(input: { returnId: \\"RETURN-ID-123\\" }) {
        ... on OrderReturn { returnId status { code displayText } refunds { refundId refundStatus } }
        ... on ReturnActionNotPermittedError { errorCode errorMessage }
        ... on RefundProcessingError { errorCode errorMessage }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: processReturnRefund — scope: sell.return
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`mutation {
    processReturnRefund(input: { returnId: "RETURN-ID-123" }) {
      ... on OrderReturn { returnId status { code displayText } refunds { refundId refundStatus } }
      ... on ReturnActionNotPermittedError { errorCode errorMessage }
      ... on RefundProcessingError { errorCode errorMessage }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL: processReturnRefund — scope: sell.return
body := \`{"query":"mutation { processReturnRefund(input: { returnId: \\"RETURN-ID-123\\" }) { ... on OrderReturn { returnId status { code displayText } refunds { refundId refundStatus } } ... on ReturnActionNotPermittedError { errorCode errorMessage } ... on RefundProcessingError { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: processReturnRefund — scope: sell.return
import requests

query = """mutation {
  processReturnRefund(input: { returnId: "RETURN-ID-123" }) {
    ... on OrderReturn { returnId status { code displayText } refunds { refundId refundStatus } }
    ... on ReturnActionNotPermittedError { errorCode errorMessage }
    ... on RefundProcessingError { errorCode errorMessage }
  }
}"""

requests.post('https://graphqlapi.ebay.com/graphql',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
    },
    json={'query': query})`,
  } as Record<Lang, string>,
};

// ─── Shipping Label / RMA / Message / Escalate (one compact snippet) ─────────
// Old: Post-Order API  POST /post-order/v2/return/{returnId}/add_shipping_label
//                      POST /post-order/v2/return/{returnId}/send_message
//                      POST /post-order/v2/return/{returnId}/escalate
// New:
//   attachReturnShipmentLabel({ returnId, returnShipmentLabels: [{ documentId, shippingCarrier: { carrierCode } }] })
//     ← documentId は Media API uploadPostOrderDocument で事前取得
//   recordReturnLabelSentOffline({ returnId, offlineReturnLabelChannel, trackings? })
//     offlineReturnLabelChannel: COMMUNICATED_TO_BUYER | RETURN_LABEL_IN_THE_BOX
//   provideRmaNumber({ returnId, rmaNumber?, rmaRequirementWaived: false })
//   sendReturnMessage({ returnId, message })
//   submitReturnReferral({ returnId, referralReasonCode })
//   updateSellerRmaPreference({ listingMarketplace, rmaPreference: { preferenceStatus: ENABLED|DISABLED } })
//     scope for preference: sell.return.preference (その他は sell.return)

export const returnShippingAndComm: ApiCallSnippet = {
  old: {
    php: `<?php
// Post-Order API: Add Shipping Label / Send Message / Escalate
$returnId = 'RETURN-ID-123';

// 配送ラベル追加 (ダウンロード可能)
// 注意: documentId は事前に Media API uploadPostOrderDocument で取得
$ch = curl_init("https://api.ebay.com/post-order/v2/return/{$returnId}/add_shipping_label");
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer YOUR_ACCESS_TOKEN', 'Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode([
        'fileType' => 'RETURN_LABEL',
        'comments' => 'Please use this label to ship the return.',
    ]),
]);
curl_exec($ch); curl_close($ch);

// メッセージ送信
$ch2 = curl_init("https://api.ebay.com/post-order/v2/return/{$returnId}/send_message");
curl_setopt_array($ch2, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer YOUR_ACCESS_TOKEN', 'Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode(['message' => 'Please ship the item back within 3 days.']),
]);
curl_exec($ch2); curl_close($ch2);`,

    ruby: `# Post-Order API: Shipping Label / Message / Escalate
require 'net/http'; require 'json'
return_id = 'RETURN-ID-123'
auth = 'Bearer YOUR_ACCESS_TOKEN'

# 配送ラベル追加
uri = URI("https://api.ebay.com/post-order/v2/return/#{return_id}/add_shipping_label")
req = Net::HTTP::Post.new(uri)
req['Authorization'] = auth; req['Content-Type'] = 'application/json'
req.body = { fileType: 'RETURN_LABEL' }.to_json
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }

# メッセージ送信
uri2 = URI("https://api.ebay.com/post-order/v2/return/#{return_id}/send_message")
req2 = Net::HTTP::Post.new(uri2)
req2['Authorization'] = auth; req2['Content-Type'] = 'application/json'
req2.body = { message: 'Please ship within 3 days.' }.to_json
Net::HTTP.start(uri2.host, 443, use_ssl: true) { |h| h.request(req2) }`,

    java: `// Post-Order API: Shipping Label / Message / Escalate
String returnId = "RETURN-ID-123";

// 配送ラベル追加 (documentId は事前に Media API で取得)
HttpRequest labelReq = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/post-order/v2/return/" + returnId + "/add_shipping_label"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("""{"fileType":"RETURN_LABEL"}"""))
    .build();
http.send(labelReq, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Post-Order API: Shipping Label / Message / Escalate
const returnId = 'RETURN-ID-123';
const auth = { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json' };

await fetch(\`https://api.ebay.com/post-order/v2/return/\${returnId}/add_shipping_label\`,
  { method: 'POST', headers: auth, body: JSON.stringify({ fileType: 'RETURN_LABEL' }) });

await fetch(\`https://api.ebay.com/post-order/v2/return/\${returnId}/send_message\`,
  { method: 'POST', headers: auth, body: JSON.stringify({ message: 'Please ship within 3 days.' }) });`,

    go: `// Post-Order API: Shipping Label / Message / Escalate
returnId := "RETURN-ID-123"
auth := "Bearer YOUR_ACCESS_TOKEN"

for _, ep := range []string{"add_shipping_label", "send_message"} {
    req, _ := http.NewRequest("POST",
        "https://api.ebay.com/post-order/v2/return/"+returnId+"/"+ep,
        strings.NewReader(\`{"fileType":"RETURN_LABEL"}\`))
    req.Header.Set("Authorization", auth)
    req.Header.Set("Content-Type", "application/json")
    http.DefaultClient.Do(req)
}`,

    python: `# Post-Order API: Shipping Label / Message / Escalate
import requests

return_id = 'RETURN-ID-123'
headers = {'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'}

# 配送ラベル追加
requests.post(
    f'https://api.ebay.com/post-order/v2/return/{return_id}/add_shipping_label',
    headers=headers, json={'fileType': 'RETURN_LABEL'})

# メッセージ送信
requests.post(
    f'https://api.ebay.com/post-order/v2/return/{return_id}/send_message',
    headers=headers, json={'message': 'Please ship within 3 days.'})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: 配送ラベル / RMA / メッセージ / エスカレーション / 設定
// scope: sell.return (attachReturnShipmentLabel / recordReturnLabelSentOffline /
//         provideRmaNumber / sendReturnMessage / submitReturnReferral)
// scope: sell.return.preference (updateSellerRmaPreference)

$gql = fn($q) => function() use ($q) {
    $ch = curl_init('https://graphqlapi.ebay.com/graphql');
    curl_setopt_array($ch, [
        CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer YOUR_ACCESS_TOKEN', 'Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode(['query' => $q]),
    ]);
    $r = curl_exec($ch); curl_close($ch);
    return json_decode($r, true);
};

// 1. 配送ラベル添付 (documentId は先に Media API uploadPostOrderDocument で取得)
$attachQuery = <<<'GQL'
mutation {
  attachReturnShipmentLabel(input: {
    returnId: "RETURN-ID-123"
    returnShipmentLabels: [{
      documentId: "DOCUMENT-ID-123"
      shippingCarrier: { carrierCode: "UPS" }
      trackingNumber: "1Z999AA10123456784"
    }]
  }) {
    ... on OrderReturn { returnId status { code displayText } }
    ... on ReturnActionNotPermittedError { errorCode errorMessage }
  }
}
GQL;

// 2. オフライン配送ラベルを記録 (買い手に連絡済みの場合)
// offlineReturnLabelChannel: COMMUNICATED_TO_BUYER | RETURN_LABEL_IN_THE_BOX
$offlineQuery = <<<'GQL'
mutation {
  recordReturnLabelSentOffline(input: {
    returnId: "RETURN-ID-123"
    offlineReturnLabelChannel: COMMUNICATED_TO_BUYER
  }) {
    ... on OrderReturn { returnId status { code displayText } }
    ... on ReturnActionNotPermittedError { errorCode errorMessage }
  }
}
GQL;

// 3. RMA 番号を提供
$rmaQuery = <<<'GQL'
mutation {
  provideRmaNumber(input: {
    returnId: "RETURN-ID-123"
    rmaNumber: "RMA-2025-001"
    rmaRequirementWaived: false
  }) {
    ... on OrderReturn { returnId status { code displayText } }
    ... on ReturnActionNotPermittedError { errorCode errorMessage }
  }
}
GQL;

// 4. メッセージ送信
$msgQuery = <<<'GQL'
mutation {
  sendReturnMessage(input: {
    returnId: "RETURN-ID-123"
    message: "Please ship the item back within 3 business days."
  }) {
    ... on OrderReturn { returnId }
    ... on ReturnActionNotPermittedError { errorCode errorMessage }
  }
}
GQL;

// 5. eBay エスカレーション
$escalateQuery = <<<'GQL'
mutation {
  submitReturnReferral(input: {
    returnId: "RETURN-ID-123"
    referralReasonCode: "SELLER_NOT_RESPONDING"
  }) {
    ... on OrderReturn { returnId status { code displayText } }
    ... on ReturnActionNotPermittedError { errorCode errorMessage }
  }
}
GQL;

// 6. RMA 要件の設定変更 (scope: sell.return.preference)
$rmaPreferenceQuery = <<<'GQL'
mutation {
  updateSellerRmaPreference(input: {
    listingMarketplace: EBAY_US
    rmaPreference: { preferenceStatus: ENABLED }
  }) {
    ... on SellerReturnPreferences {
      listingMarketplace
    }
    ... on ReturnPreferenceNotFoundError { errorCode errorMessage }
  }
}
GQL;`,

    ruby: `# GraphQL: 配送ラベル / RMA / メッセージ / エスカレーション / 設定
# scope: sell.return (1-5) / sell.return.preference (6)
require 'net/http'; require 'json'

def gql(query)
  uri = URI('https://graphqlapi.ebay.com/graphql')
  req = Net::HTTP::Post.new(uri)
  req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
  req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
  req['Content-Type']            = 'application/json'
  req.body = { query: query }.to_json
  Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
end

# 1. 配送ラベル添付 (documentId は Media API で事前取得)
gql(<<~GQL)
  mutation {
    attachReturnShipmentLabel(input: {
      returnId: "RETURN-ID-123"
      returnShipmentLabels: [{ documentId: "DOC-ID" shippingCarrier: { carrierCode: "UPS" } }]
    }) {
      ... on OrderReturn { returnId status { code displayText } }
      ... on ReturnActionNotPermittedError { errorCode errorMessage }
    }
  }
GQL

# 2. オフライン配送ラベル記録 (COMMUNICATED_TO_BUYER | RETURN_LABEL_IN_THE_BOX)
gql(<<~GQL)
  mutation {
    recordReturnLabelSentOffline(input: {
      returnId: "RETURN-ID-123"
      offlineReturnLabelChannel: COMMUNICATED_TO_BUYER
    }) { ... on OrderReturn { returnId } }
  }
GQL

# 3. RMA番号提供
gql(<<~GQL)
  mutation {
    provideRmaNumber(input: {
      returnId: "RETURN-ID-123"
      rmaNumber: "RMA-2025-001"
      rmaRequirementWaived: false
    }) { ... on OrderReturn { returnId } }
  }
GQL

# 4. メッセージ送信
gql(<<~GQL)
  mutation {
    sendReturnMessage(input: { returnId: "RETURN-ID-123" message: "Please ship within 3 days." }) {
      ... on OrderReturn { returnId }
    }
  }
GQL`,

    java: `// GraphQL: 配送ラベル / RMA / メッセージ — scope: sell.return
// 1. 配送ラベル添付 (documentId は Media API uploadPostOrderDocument で事前取得)
String attachQuery = """
    mutation {
      attachReturnShipmentLabel(input: {
        returnId: \\"RETURN-ID-123\\"
        returnShipmentLabels: [{ documentId: \\"DOC-ID\\" shippingCarrier: { carrierCode: \\"UPS\\" } }]
      }) {
        ... on OrderReturn { returnId status { code displayText } }
        ... on ReturnActionNotPermittedError { errorCode errorMessage }
      }
    }""";

// 2. RMA番号提供
String rmaQuery = """
    mutation {
      provideRmaNumber(input: {
        returnId: \\"RETURN-ID-123\\"
        rmaNumber: \\"RMA-2025-001\\"
        rmaRequirementWaived: false
      }) {
        ... on OrderReturn { returnId }
        ... on ReturnActionNotPermittedError { errorCode errorMessage }
      }
    }""";

// 3. メッセージ送信
String msgQuery = """
    mutation {
      sendReturnMessage(input: { returnId: \\"RETURN-ID-123\\" message: \\"Please ship within 3 days.\\" }) {
        ... on OrderReturn { returnId }
        ... on ReturnActionNotPermittedError { errorCode errorMessage }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: 配送ラベル / RMA / メッセージ / エスカレーション — scope: sell.return
const gql = (query) => fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
}).then(r => r.json());

// 1. 配送ラベル添付 (documentId は Media API で事前取得)
await gql(\`mutation {
  attachReturnShipmentLabel(input: {
    returnId: "RETURN-ID-123"
    returnShipmentLabels: [{ documentId: "DOC-ID" shippingCarrier: { carrierCode: "UPS" } }]
  }) {
    ... on OrderReturn { returnId status { code displayText } }
    ... on ReturnActionNotPermittedError { errorCode errorMessage }
  }
}\`);

// 2. オフラインラベル記録 (COMMUNICATED_TO_BUYER | RETURN_LABEL_IN_THE_BOX)
await gql(\`mutation {
  recordReturnLabelSentOffline(input: {
    returnId: "RETURN-ID-123"
    offlineReturnLabelChannel: COMMUNICATED_TO_BUYER
  }) { ... on OrderReturn { returnId } }
}\`);

// 3. RMA番号提供
await gql(\`mutation {
  provideRmaNumber(input: { returnId: "RETURN-ID-123" rmaNumber: "RMA-2025-001" rmaRequirementWaived: false }) {
    ... on OrderReturn { returnId }
  }
}\`);

// 4. メッセージ送信
await gql(\`mutation {
  sendReturnMessage(input: { returnId: "RETURN-ID-123" message: "Please ship within 3 days." }) {
    ... on OrderReturn { returnId }
  }
}\`);

// 5. eBay エスカレーション
await gql(\`mutation {
  submitReturnReferral(input: { returnId: "RETURN-ID-123" referralReasonCode: "SELLER_NOT_RESPONDING" }) {
    ... on OrderReturn { returnId status { code displayText } }
  }
}\`);`,

    go: `// GraphQL: 配送ラベル / RMA / メッセージ / エスカレーション — scope: sell.return
func gql(query string) {
    body := \`{"query":"\` + query + \`"}\`
    req, _ := http.NewRequest("POST", "https://graphqlapi.ebay.com/graphql", strings.NewReader(body))
    req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    req.Header.Set("Content-Type", "application/json")
    http.DefaultClient.Do(req)
}

// 1. 配送ラベル添付
gql(\`mutation { attachReturnShipmentLabel(input: { returnId: \\"RETURN-ID-123\\" returnShipmentLabels: [{ documentId: \\"DOC-ID\\" shippingCarrier: { carrierCode: \\"UPS\\" } }] }) { ... on OrderReturn { returnId } ... on ReturnActionNotPermittedError { errorCode } } }\`)

// 2. RMA番号提供
gql(\`mutation { provideRmaNumber(input: { returnId: \\"RETURN-ID-123\\" rmaNumber: \\"RMA-2025-001\\" rmaRequirementWaived: false }) { ... on OrderReturn { returnId } } }\`)

// 3. メッセージ送信
gql(\`mutation { sendReturnMessage(input: { returnId: \\"RETURN-ID-123\\" message: \\"Please ship within 3 days.\\" }) { ... on OrderReturn { returnId } } }\`)

// 4. eBay エスカレーション
gql(\`mutation { submitReturnReferral(input: { returnId: \\"RETURN-ID-123\\" referralReasonCode: \\"SELLER_NOT_RESPONDING\\" }) { ... on OrderReturn { returnId } } }\`)`,

    python: `# GraphQL: 配送ラベル / RMA / メッセージ / エスカレーション — scope: sell.return
import requests

def gql(query):
    return requests.post('https://graphqlapi.ebay.com/graphql',
        headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
        json={'query': query}).json()

# 1. 配送ラベル添付 (documentId は Media API uploadPostOrderDocument で事前取得)
gql("""mutation {
  attachReturnShipmentLabel(input: {
    returnId: "RETURN-ID-123"
    returnShipmentLabels: [{ documentId: "DOC-ID" shippingCarrier: { carrierCode: "UPS" } }]
  }) {
    ... on OrderReturn { returnId status { code displayText } }
    ... on ReturnActionNotPermittedError { errorCode errorMessage }
  }
}""")

# 2. オフラインラベル記録 (COMMUNICATED_TO_BUYER | RETURN_LABEL_IN_THE_BOX)
gql("""mutation {
  recordReturnLabelSentOffline(input: {
    returnId: "RETURN-ID-123"
    offlineReturnLabelChannel: COMMUNICATED_TO_BUYER
  }) { ... on OrderReturn { returnId } }
}""")

# 3. RMA番号提供
gql("""mutation {
  provideRmaNumber(input: { returnId: "RETURN-ID-123" rmaNumber: "RMA-2025-001" rmaRequirementWaived: false }) {
    ... on OrderReturn { returnId }
  }
}""")

# 4. メッセージ送信
gql("""mutation {
  sendReturnMessage(input: { returnId: "RETURN-ID-123" message: "Please ship within 3 days." }) {
    ... on OrderReturn { returnId }
  }
}""")

# 5. eBay エスカレーション
gql("""mutation {
  submitReturnReferral(input: { returnId: "RETURN-ID-123" referralReasonCode: "SELLER_NOT_RESPONDING" }) {
    ... on OrderReturn { returnId status { code displayText } }
  }
}""")

# 6. RMA設定変更 (scope: sell.return.preference)
gql("""mutation {
  updateSellerRmaPreference(input: {
    listingMarketplace: EBAY_US
    rmaPreference: { preferenceStatus: ENABLED }
  }) { ... on SellerReturnPreferences { listingMarketplace } }
}""")`,
  } as Record<Lang, string>,
};

// ─── Map: oldApi name → snippet ──────────────────────────────────────────────

export const returnsSnippetByOldApi: Record<string, ApiCallSnippet> = {
  "Get Return":                          searchReturns,
  "Search Returns":                      searchReturns,
  "Get Return Preference":               searchReturns,
  "Approve Return":                      approveReturn,
  "Decline Return":                      approveReturn,
  "Issue Refund":                        issueReturnRefund,
  "Mark Return Received":                issueReturnRefund,
  "Propose Keep Item + Partial Refund":  issueReturnRefund,
  "Add Shipping Label (downloadable)":   returnShippingAndComm,
  "Add Shipping Label Info (offline)":   returnShippingAndComm,
  "Provide RMA Number":                  returnShippingAndComm,
  "Send Message":                        returnShippingAndComm,
  "Set Return Preference":               returnShippingAndComm,
  "Escalate to eBay (return case)":      returnShippingAndComm,
};
