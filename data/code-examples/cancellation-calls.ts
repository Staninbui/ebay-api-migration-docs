import type { Lang } from "@/components/CodeTabs";

export interface ApiCallSnippet {
  old: Record<Lang, string>;
  new: Record<Lang, string>;
}

// ─── Create Order Cancellation ───────────────────────────────────────────────
// Old: Post-Order API  POST /post-order/v2/cancellation
// New: GraphQL createOrderCancellation(input: { orderId, contractCancellationReason, relistAllItems })
// Reason enum: BUYER_REQUESTED | OUT_OF_STOCK | SHIPPING_ADDRESS_ISSUES | UNPAID_CONTRACT

export const createOrderCancellation: ApiCallSnippet = {
  old: {
    php: `<?php
// Post-Order API: Create Cancellation Request (Order)
// POST https://api.ebay.com/post-order/v2/cancellation
$body = json_encode([
    'cancelReason'  => 'OUT_OF_STOCK',
    'legacyOrderId' => '12-34567-89012',
]);
$ch = curl_init('https://api.ebay.com/post-order/v2/cancellation');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'Content-Type: application/json',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
$data = json_decode(curl_exec($ch), true);
$cancellationId = $data['cancellationId'];
curl_close($ch);`,

    ruby: `# Post-Order API: Create Cancellation Request (Order)
require 'net/http'; require 'json'

uri = URI('https://api.ebay.com/post-order/v2/cancellation')
req = Net::HTTP::Post.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['Content-Type']            = 'application/json'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req.body = { cancelReason: 'OUT_OF_STOCK', legacyOrderId: '12-34567-89012' }.to_json
res  = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
data = JSON.parse(res.body)
puts data['cancellationId']`,

    java: `// Post-Order API: Create Cancellation Request (Order)
String body = """{"cancelReason":"OUT_OF_STOCK","legacyOrderId":"12-34567-89012"}""";
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/post-order/v2/cancellation"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();
HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Post-Order API: Create Cancellation Request (Order)
const res = await fetch('https://api.ebay.com/post-order/v2/cancellation', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
  },
  body: JSON.stringify({
    cancelReason: 'OUT_OF_STOCK',
    legacyOrderId: '12-34567-89012',
  }),
});
const { cancellationId } = await res.json();`,

    go: `// Post-Order API: Create Cancellation Request (Order)
body := \`{"cancelReason":"OUT_OF_STOCK","legacyOrderId":"12-34567-89012"}\`
req, _ := http.NewRequest("POST",
    "https://api.ebay.com/post-order/v2/cancellation",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
http.DefaultClient.Do(req)`,

    python: `# Post-Order API: Create Cancellation Request (Order)
import requests

res = requests.post(
    'https://api.ebay.com/post-order/v2/cancellation',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    },
    json={'cancelReason': 'OUT_OF_STOCK', 'legacyOrderId': '12-34567-89012'},
)
cancellation_id = res.json()['cancellationId']`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: createOrderCancellation
// contractCancellationReason: BUYER_REQUESTED | OUT_OF_STOCK | SHIPPING_ADDRESS_ISSUES | UNPAID_CONTRACT
// relistAllItems: true でキャンセル後に自動再出品
$query = <<<'GQL'
mutation {
  createOrderCancellation(input: {
    orderId: "ORDER-ID-123"
    contractCancellationReason: OUT_OF_STOCK
    relistAllItems: false
  }) {
    ... on CreateOrderCancellationSuccess {
      contractCancellation {
        cancellationId
        status { code displayText }
        requestedAt
      }
    }
    ... on OrderNotFoundError { errorCode errorMessage }
    ... on OrderCancellationEligibilityError { errorCode errorMessage }
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
curl_close($ch);`,

    ruby: `# GraphQL: createOrderCancellation
# contractCancellationReason: BUYER_REQUESTED | OUT_OF_STOCK | SHIPPING_ADDRESS_ISSUES | UNPAID_CONTRACT
require 'net/http'; require 'json'

query = <<~GQL
  mutation {
    createOrderCancellation(input: {
      orderId: "ORDER-ID-123"
      contractCancellationReason: OUT_OF_STOCK
      relistAllItems: false
    }) {
      ... on CreateOrderCancellationSuccess {
        contractCancellation { cancellationId status { code displayText } requestedAt }
      }
      ... on OrderNotFoundError { errorCode errorMessage }
    }
  }
GQL

uri = URI('https://graphqlapi.ebay.com/graphql')
req = Net::HTTP::Post.new(uri)
req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req['Content-Type'] = 'application/json'
req.body = { query: query }.to_json
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// GraphQL: createOrderCancellation
// contractCancellationReason: BUYER_REQUESTED | OUT_OF_STOCK | SHIPPING_ADDRESS_ISSUES | UNPAID_CONTRACT
String query = """
    mutation {
      createOrderCancellation(input: {
        orderId: \\"ORDER-ID-123\\"
        contractCancellationReason: OUT_OF_STOCK
        relistAllItems: false
      }) {
        ... on CreateOrderCancellationSuccess {
          contractCancellation { cancellationId status { code displayText } requestedAt }
        }
        ... on OrderNotFoundError { errorCode errorMessage }
      }
    }""";
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://graphqlapi.ebay.com/graphql"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\\"query\\":\\"" + query.replace("\\n", " ").replace("\\"", "\\\\\\"") + "\\"}"
    ))
    .build();`,

    nodejs: `// GraphQL: createOrderCancellation
// contractCancellationReason: BUYER_REQUESTED | OUT_OF_STOCK | SHIPPING_ADDRESS_ISSUES | UNPAID_CONTRACT
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`mutation {
    createOrderCancellation(input: {
      orderId: "ORDER-ID-123"
      contractCancellationReason: OUT_OF_STOCK
      relistAllItems: false
    }) {
      ... on CreateOrderCancellationSuccess {
        contractCancellation { cancellationId status { code displayText } requestedAt }
      }
      ... on OrderNotFoundError { errorCode errorMessage }
      ... on OrderCancellationEligibilityError { errorCode errorMessage }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL: createOrderCancellation
// contractCancellationReason: BUYER_REQUESTED | OUT_OF_STOCK | SHIPPING_ADDRESS_ISSUES | UNPAID_CONTRACT
body := \`{"query":"mutation { createOrderCancellation(input: { orderId: \\"ORDER-ID-123\\" contractCancellationReason: OUT_OF_STOCK relistAllItems: false }) { ... on CreateOrderCancellationSuccess { contractCancellation { cancellationId status { code displayText } requestedAt } } ... on OrderNotFoundError { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: createOrderCancellation
# contractCancellationReason: BUYER_REQUESTED | OUT_OF_STOCK | SHIPPING_ADDRESS_ISSUES | UNPAID_CONTRACT
import requests

query = """mutation {
  createOrderCancellation(input: {
    orderId: "ORDER-ID-123"
    contractCancellationReason: OUT_OF_STOCK
    relistAllItems: false
  }) {
    ... on CreateOrderCancellationSuccess {
      contractCancellation { cancellationId status { code displayText } requestedAt }
    }
    ... on OrderNotFoundError { errorCode errorMessage }
    ... on OrderCancellationEligibilityError { errorCode errorMessage }
  }
}"""

res = requests.post('https://graphqlapi.ebay.com/graphql',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
    },
    json={'query': query})`,
  } as Record<Lang, string>,
};

// ─── Approve / Decline Cancellation ──────────────────────────────────────────
// Old: Post-Order API  POST /post-order/v2/cancellation/{cancellationId}/approve (or reject)
// New: approveContractCancellation / declineContractCancellation
// Approve input: { cancellationId, relistAllItems }
// Decline input: { cancellationId, fulfillmentDetails? { shippedAt, shipmentTrackingDetails } }

export const approveCancellation: ApiCallSnippet = {
  old: {
    php: `<?php
// Post-Order API: Approve Cancellation Request
// POST https://api.ebay.com/post-order/v2/cancellation/{cancellationId}/approve
$cancellationId = 'CANCELLATION-ID-123';
$ch = curl_init("https://api.ebay.com/post-order/v2/cancellation/{$cancellationId}/approve");
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => '{}',
]);
curl_exec($ch); curl_close($ch);`,

    ruby: `# Post-Order API: Approve Cancellation Request
require 'net/http'
uri = URI("https://api.ebay.com/post-order/v2/cancellation/CANCELLATION-ID-123/approve")
req = Net::HTTP::Post.new(uri)
req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
req['Content-Type']  = 'application/json'
req.body = '{}'
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// Post-Order API: Approve Cancellation Request
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/post-order/v2/cancellation/CANCELLATION-ID-123/approve"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("{}"))
    .build();
http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Post-Order API: Approve Cancellation Request
await fetch('https://api.ebay.com/post-order/v2/cancellation/CANCELLATION-ID-123/approve', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json',
  },
  body: '{}',
});`,

    go: `// Post-Order API: Approve Cancellation Request
req, _ := http.NewRequest("POST",
    "https://api.ebay.com/post-order/v2/cancellation/CANCELLATION-ID-123/approve",
    strings.NewReader("{}"))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")
http.DefaultClient.Do(req)`,

    python: `# Post-Order API: Approve Cancellation Request
import requests
requests.post(
    'https://api.ebay.com/post-order/v2/cancellation/CANCELLATION-ID-123/approve',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={},
)`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: approveContractCancellation
// relistAllItems: true でキャンセル後に自動再出品
$query = <<<'GQL'
mutation {
  approveContractCancellation(input: {
    cancellationId: "CANCELLATION-ID-123"
    relistAllItems: false
  }) {
    ... on ApproveContractCancellationSuccess {
      contractCancellation {
        cancellationId
        status { code displayText }
        closedAt
      }
    }
    ... on ContractCancellationNotFoundError { errorCode errorMessage }
    ... on ContractCancellationActionNotPermittedError { errorCode errorMessage }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql
// scope: sell.cancellation`,

    ruby: `# GraphQL: approveContractCancellation
# scope: sell.cancellation
query = <<~GQL
  mutation {
    approveContractCancellation(input: {
      cancellationId: "CANCELLATION-ID-123"
      relistAllItems: false
    }) {
      ... on ApproveContractCancellationSuccess {
        contractCancellation { cancellationId status { code displayText } closedAt }
      }
      ... on ContractCancellationNotFoundError { errorCode errorMessage }
    }
  }
GQL
# POST https://graphqlapi.ebay.com/graphql`,

    java: `// GraphQL: approveContractCancellation — scope: sell.cancellation
String query = """
    mutation {
      approveContractCancellation(input: {
        cancellationId: \\"CANCELLATION-ID-123\\"
        relistAllItems: false
      }) {
        ... on ApproveContractCancellationSuccess {
          contractCancellation { cancellationId status { code displayText } closedAt }
        }
        ... on ContractCancellationNotFoundError { errorCode errorMessage }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: approveContractCancellation — scope: sell.cancellation
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`mutation {
    approveContractCancellation(input: {
      cancellationId: "CANCELLATION-ID-123"
      relistAllItems: false
    }) {
      ... on ApproveContractCancellationSuccess {
        contractCancellation { cancellationId status { code displayText } closedAt }
      }
      ... on ContractCancellationNotFoundError { errorCode errorMessage }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL: approveContractCancellation — scope: sell.cancellation
body := \`{"query":"mutation { approveContractCancellation(input: { cancellationId: \\"CANCELLATION-ID-123\\" relistAllItems: false }) { ... on ApproveContractCancellationSuccess { contractCancellation { cancellationId status { code displayText } closedAt } } ... on ContractCancellationNotFoundError { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: approveContractCancellation — scope: sell.cancellation
import requests

query = """mutation {
  approveContractCancellation(input: {
    cancellationId: "CANCELLATION-ID-123"
    relistAllItems: false
  }) {
    ... on ApproveContractCancellationSuccess {
      contractCancellation { cancellationId status { code displayText } closedAt }
    }
    ... on ContractCancellationNotFoundError { errorCode errorMessage }
    ... on ContractCancellationActionNotPermittedError { errorCode errorMessage }
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

// ─── Search Cancellations ─────────────────────────────────────────────────────
// Old: Post-Order API  GET /post-order/v2/cancellation/search
// New: sellerContractCancellations
// filter.statuses: AWAITING_ACTION_FROM_SELLER | PENDING | DECLINED | COMPLETED

export const searchCancellations: ApiCallSnippet = {
  old: {
    php: `<?php
// Post-Order API: Search Cancellations
// GET https://api.ebay.com/post-order/v2/cancellation/search?fieldgroups=FULL&status=BUYER_REQUESTED&limit=20
$ch = curl_init('https://api.ebay.com/post-order/v2/cancellation/search?fieldgroups=FULL&status=BUYER_REQUESTED&limit=20');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
    ],
]);
$data = json_decode(curl_exec($ch), true);
curl_close($ch);`,

    ruby: `# Post-Order API: Search Cancellations
require 'net/http'
uri = URI('https://api.ebay.com/post-order/v2/cancellation/search')
uri.query = URI.encode_www_form(fieldgroups: 'FULL', status: 'BUYER_REQUESTED', limit: 20)
req = Net::HTTP::Get.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// Post-Order API: Search Cancellations
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/post-order/v2/cancellation/search?fieldgroups=FULL&status=BUYER_REQUESTED&limit=20"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .GET()
    .build();
http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Post-Order API: Search Cancellations
const params = new URLSearchParams({ fieldgroups: 'FULL', status: 'BUYER_REQUESTED', limit: '20' });
const { cancellations } = await fetch(
  \`https://api.ebay.com/post-order/v2/cancellation/search?\${params}\`,
  { headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US' } }
).then(r => r.json());`,

    go: `// Post-Order API: Search Cancellations
req, _ := http.NewRequest("GET",
    "https://api.ebay.com/post-order/v2/cancellation/search?fieldgroups=FULL&status=BUYER_REQUESTED&limit=20",
    nil)
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
http.DefaultClient.Do(req)`,

    python: `# Post-Order API: Search Cancellations
import requests
res = requests.get(
    'https://api.ebay.com/post-order/v2/cancellation/search',
    params={'fieldgroups': 'FULL', 'status': 'BUYER_REQUESTED', 'limit': 20},
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'},
)`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: sellerContractCancellations
// statuses: AWAITING_ACTION_FROM_SELLER | PENDING | DECLINED | COMPLETED
$query = <<<'GQL'
query {
  sellerContractCancellations(input: {
    initialPage: {
      filter: {
        statuses: [AWAITING_ACTION_FROM_SELLER]
        createdBetween: {
          startDateTime: "2025-01-01T00:00:00Z"
          endDateTime: "2025-03-31T23:59:59Z"
        }
      }
      sort: { sortField: REQUESTED_AT, sortOrder: DESC }
    }
  }) {
    ... on SellerContractCancellationsSuccess {
      contractCancellations {
        cancellationId
        status { code displayText }
        reason { code displayText }
        requestedAt
        buyer { username }
      }
      pagination { nextCursor }
    }
    ... on ContractCancellationInvalidDateRangeError { errorCode errorMessage }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: sell.cancellation.read`,

    ruby: `# GraphQL: sellerContractCancellations
# statuses: AWAITING_ACTION_FROM_SELLER | PENDING | DECLINED | COMPLETED
query = <<~GQL
  query {
    sellerContractCancellations(input: {
      initialPage: {
        filter: { statuses: [AWAITING_ACTION_FROM_SELLER] }
        sort: { sortField: REQUESTED_AT, sortOrder: DESC }
      }
    }) {
      ... on SellerContractCancellationsSuccess {
        contractCancellations {
          cancellationId status { code displayText }
          reason { code displayText } requestedAt buyer { username }
        }
        pagination { nextCursor }
      }
    }
  }
GQL
# POST https://graphqlapi.ebay.com/graphql`,

    java: `// GraphQL: sellerContractCancellations — scope: sell.cancellation.read
String query = """
    query {
      sellerContractCancellations(input: {
        initialPage: {
          filter: { statuses: [AWAITING_ACTION_FROM_SELLER] }
          sort: { sortField: REQUESTED_AT, sortOrder: DESC }
        }
      }) {
        ... on SellerContractCancellationsSuccess {
          contractCancellations {
            cancellationId status { code displayText }
            reason { code displayText } requestedAt buyer { username }
          }
          pagination { nextCursor }
        }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: sellerContractCancellations — scope: sell.cancellation.read
// statuses: AWAITING_ACTION_FROM_SELLER | PENDING | DECLINED | COMPLETED
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`query {
    sellerContractCancellations(input: {
      initialPage: {
        filter: { statuses: [AWAITING_ACTION_FROM_SELLER] }
        sort: { sortField: REQUESTED_AT, sortOrder: DESC }
      }
    }) {
      ... on SellerContractCancellationsSuccess {
        contractCancellations {
          cancellationId status { code displayText }
          reason { code displayText } requestedAt buyer { username }
        }
        pagination { nextCursor }
      }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL: sellerContractCancellations — scope: sell.cancellation.read
body := \`{"query":"query { sellerContractCancellations(input: { initialPage: { filter: { statuses: [AWAITING_ACTION_FROM_SELLER] } sort: { sortField: REQUESTED_AT sortOrder: DESC } } }) { ... on SellerContractCancellationsSuccess { contractCancellations { cancellationId status { code displayText } reason { code displayText } requestedAt buyer { username } } pagination { nextCursor } } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: sellerContractCancellations — scope: sell.cancellation.read
# statuses: AWAITING_ACTION_FROM_SELLER | PENDING | DECLINED | COMPLETED
import requests

query = """query {
  sellerContractCancellations(input: {
    initialPage: {
      filter: { statuses: [AWAITING_ACTION_FROM_SELLER] }
      sort: { sortField: REQUESTED_AT, sortOrder: DESC }
    }
  }) {
    ... on SellerContractCancellationsSuccess {
      contractCancellations {
        cancellationId status { code displayText }
        reason { code displayText } requestedAt buyer { username }
      }
      pagination { nextCursor }
    }
  }
}"""

res = requests.post('https://graphqlapi.ebay.com/graphql',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
    },
    json={'query': query})`,
  } as Record<Lang, string>,
};

// ─── Map: oldApi name → snippet ──────────────────────────────────────────────

export const cancellationSnippetByOldApi: Record<string, ApiCallSnippet> = {
  "Create Cancellation Request (Item Commitments)": createOrderCancellation,
  "Create Cancellation Request (Orders)":           createOrderCancellation,
  "Create Cancellation Request (Purchase Quotes)":  createOrderCancellation,
  "Approve Cancellation":                           approveCancellation,
  "Reject Cancellation":                            approveCancellation,
  "Search Cancellations":                           searchCancellations,
  "Get Cancellation":                               searchCancellations,
};
