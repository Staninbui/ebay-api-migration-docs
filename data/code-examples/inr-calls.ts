import type { Lang } from "@/components/CodeTabs";

export interface ApiCallSnippet {
  old: Record<Lang, string>;
  new: Record<Lang, string>;
}

// ─── Search INR Inquiries ────────────────────────────────────────────────────
// Old: GET /post-order/v2/inquiry/{inquiryId}  (no bulk search in old API)
// New: sellerOrderInquiries(input: { initialPage: { filter, sort }, pageInfo })
//      presets: AWAITING_ACTION_FROM_SELLER | AWAITING_ACTION_FROM_EBAY | CLOSED

export const searchInquiries: ApiCallSnippet = {
  old: {
    php: `<?php
// Post-Order API: Get Inquiry (旧APIには一括検索なし — 個別IDで取得)
// GET https://api.ebay.com/post-order/v2/inquiry/{inquiryId}
$inquiryId = 'INQUIRY-ID-123';
$ch = curl_init("https://api.ebay.com/post-order/v2/inquiry/{$inquiryId}");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
    ],
]);
$data = json_decode(curl_exec($ch), true);
curl_close($ch);`,

    ruby: `# Post-Order API: Get Inquiry (旧APIには一括検索なし — 個別IDで取得)
require 'net/http'
uri = URI('https://api.ebay.com/post-order/v2/inquiry/INQUIRY-ID-123')
req = Net::HTTP::Get.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
data = JSON.parse(res.body)`,

    java: `// Post-Order API: Get Inquiry (旧APIには一括検索なし — 個別IDで取得)
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/post-order/v2/inquiry/INQUIRY-ID-123"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .GET()
    .build();
http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Post-Order API: Get Inquiry (旧APIには一括検索なし — 個別IDで取得)
const inquiry = await fetch('https://api.ebay.com/post-order/v2/inquiry/INQUIRY-ID-123', {
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
  },
}).then(r => r.json());`,

    go: `// Post-Order API: Get Inquiry (旧APIには一括検索なし — 個別IDで取得)
req, _ := http.NewRequest("GET",
    "https://api.ebay.com/post-order/v2/inquiry/INQUIRY-ID-123", nil)
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
http.DefaultClient.Do(req)`,

    python: `# Post-Order API: Get Inquiry (旧APIには一括検索なし — 個別IDで取得)
import requests
res = requests.get(
    'https://api.ebay.com/post-order/v2/inquiry/INQUIRY-ID-123',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'},
)
data = res.json()`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: sellerOrderInquiries (新APIで一括検索が可能になった)
// presets: AWAITING_ACTION_FROM_SELLER | AWAITING_ACTION_FROM_EBAY | CLOSED
$query = <<<'GQL'
query {
  sellerOrderInquiries(input: {
    initialPage: {
      filter: { presets: AWAITING_ACTION_FROM_SELLER }
      sort: { sortField: CREATED_AT, sortOrder: DESC }
    }
  }) {
    ... on SellerOrderInquiries {
      inquiries {
        inquiryId
        status { code displayText }
        createdAt
        closedAt
        lineItems {
          inquiryLineItemId
          orderLineItem { orderLineItemId }
          quantity
        }
        sellerAvailableActions { primaryActions { code displayText } }
      }
      pagination { nextCursor }
    }
    ... on OrderInquiryInvalidSearchInputError { errorCode errorMessage }
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

    ruby: `# GraphQL: sellerOrderInquiries — scope: sell.inquiry.read
# presets: AWAITING_ACTION_FROM_SELLER | AWAITING_ACTION_FROM_EBAY | CLOSED
require 'net/http'; require 'json'

query = <<~GQL
  query {
    sellerOrderInquiries(input: {
      initialPage: {
        filter: { presets: AWAITING_ACTION_FROM_SELLER }
        sort: { sortField: CREATED_AT, sortOrder: DESC }
      }
    }) {
      ... on SellerOrderInquiries {
        inquiries {
          inquiryId status { code displayText } createdAt
          lineItems { inquiryLineItemId quantity }
          sellerAvailableActions { primaryActions { code displayText } }
        }
        pagination { nextCursor }
      }
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

    java: `// GraphQL: sellerOrderInquiries — scope: sell.inquiry.read
// presets: AWAITING_ACTION_FROM_SELLER | AWAITING_ACTION_FROM_EBAY | CLOSED
String query = """
    query {
      sellerOrderInquiries(input: {
        initialPage: {
          filter: { presets: AWAITING_ACTION_FROM_SELLER }
          sort: { sortField: CREATED_AT, sortOrder: DESC }
        }
      }) {
        ... on SellerOrderInquiries {
          inquiries {
            inquiryId status { code displayText } createdAt
            lineItems { inquiryLineItemId quantity }
          }
          pagination { nextCursor }
        }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: sellerOrderInquiries — scope: sell.inquiry.read
// presets: AWAITING_ACTION_FROM_SELLER | AWAITING_ACTION_FROM_EBAY | CLOSED
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`query {
    sellerOrderInquiries(input: {
      initialPage: {
        filter: { presets: AWAITING_ACTION_FROM_SELLER }
        sort: { sortField: CREATED_AT, sortOrder: DESC }
      }
    }) {
      ... on SellerOrderInquiries {
        inquiries {
          inquiryId status { code displayText } createdAt
          lineItems { inquiryLineItemId quantity }
          sellerAvailableActions { primaryActions { code displayText } }
        }
        pagination { nextCursor }
      }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL: sellerOrderInquiries — scope: sell.inquiry.read
body := \`{"query":"query { sellerOrderInquiries(input: { initialPage: { filter: { presets: AWAITING_ACTION_FROM_SELLER } sort: { sortField: CREATED_AT sortOrder: DESC } } }) { ... on SellerOrderInquiries { inquiries { inquiryId status { code displayText } createdAt lineItems { inquiryLineItemId quantity } } pagination { nextCursor } } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: sellerOrderInquiries — scope: sell.inquiry.read
# presets: AWAITING_ACTION_FROM_SELLER | AWAITING_ACTION_FROM_EBAY | CLOSED
import requests

query = """query {
  sellerOrderInquiries(input: {
    initialPage: {
      filter: { presets: AWAITING_ACTION_FROM_SELLER }
      sort: { sortField: CREATED_AT, sortOrder: DESC }
    }
  }) {
    ... on SellerOrderInquiries {
      inquiries {
        inquiryId status { code displayText } createdAt
        lineItems { inquiryLineItemId quantity }
        sellerAvailableActions { primaryActions { code displayText } }
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

// ─── Provide Tracking (INR) ───────────────────────────────────────────────────
// Old: POST /post-order/v2/inquiry/{inquiryId}/provide_shipment_info
// New: provideShipmentInfoForItemNotReceivedInquiry
//      input: { inquiryId, trackings: [{ trackingNumber, shippingCarrier: { carrierCode } }] }

export const provideTracking: ApiCallSnippet = {
  old: {
    php: `<?php
// Post-Order API: Provide Tracking for INR Inquiry
// POST https://api.ebay.com/post-order/v2/inquiry/{inquiryId}/provide_shipment_info
$ch = curl_init('https://api.ebay.com/post-order/v2/inquiry/INQUIRY-ID-123/provide_shipment_info');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'shipmentTracking' => [
            ['trackingNumber' => '1Z999AA10123456784', 'carrierCode' => 'UPS'],
        ],
    ]),
]);
curl_exec($ch); curl_close($ch);`,

    ruby: `# Post-Order API: Provide Tracking for INR Inquiry
require 'net/http'; require 'json'
uri = URI('https://api.ebay.com/post-order/v2/inquiry/INQUIRY-ID-123/provide_shipment_info')
req = Net::HTTP::Post.new(uri)
req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
req['Content-Type']  = 'application/json'
req.body = {
  shipmentTracking: [{ trackingNumber: '1Z999AA10123456784', carrierCode: 'UPS' }]
}.to_json
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// Post-Order API: Provide Tracking for INR Inquiry
String body = """
    {"shipmentTracking":[{"trackingNumber":"1Z999AA10123456784","carrierCode":"UPS"}]}""";
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/post-order/v2/inquiry/INQUIRY-ID-123/provide_shipment_info"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();`,

    nodejs: `// Post-Order API: Provide Tracking for INR Inquiry
await fetch('https://api.ebay.com/post-order/v2/inquiry/INQUIRY-ID-123/provide_shipment_info', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    shipmentTracking: [{ trackingNumber: '1Z999AA10123456784', carrierCode: 'UPS' }],
  }),
});`,

    go: `// Post-Order API: Provide Tracking for INR Inquiry
body := \`{"shipmentTracking":[{"trackingNumber":"1Z999AA10123456784","carrierCode":"UPS"}]}\`
req, _ := http.NewRequest("POST",
    "https://api.ebay.com/post-order/v2/inquiry/INQUIRY-ID-123/provide_shipment_info",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")`,

    python: `# Post-Order API: Provide Tracking for INR Inquiry
import requests
requests.post(
    'https://api.ebay.com/post-order/v2/inquiry/INQUIRY-ID-123/provide_shipment_info',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={'shipmentTracking': [{'trackingNumber': '1Z999AA10123456784', 'carrierCode': 'UPS'}]},
)`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: provideShipmentInfoForItemNotReceivedInquiry
// trackings: [{ trackingNumber, shippingCarrier: { carrierCode, unsupportedCarrierName? } }]
$query = <<<'GQL'
mutation {
  provideShipmentInfoForItemNotReceivedInquiry(input: {
    inquiryId: "INQUIRY-ID-123"
    trackings: [{
      trackingNumber: "1Z999AA10123456784"
      shippingCarrier: { carrierCode: "UPS" }
    }]
  }) {
    ... on ProvideShipmentInfoForItemNotReceivedInquirySuccess {
      orderInquiry {
        inquiryId
        status { code displayText }
      }
    }
    ... on OrderInquiryActionNotPermittedError { errorCode errorMessage }
    ... on OrderInquiryNotFoundError { errorCode errorMessage }
    ... on ProvideShipmentInfoForInquiryInputValidationError { errorCode errorMessage }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: sell.inquiry`,

    ruby: `# GraphQL: provideShipmentInfoForItemNotReceivedInquiry — scope: sell.inquiry
# trackings: [{ trackingNumber, shippingCarrier: { carrierCode } }]
query = <<~GQL
  mutation {
    provideShipmentInfoForItemNotReceivedInquiry(input: {
      inquiryId: "INQUIRY-ID-123"
      trackings: [{ trackingNumber: "1Z999AA10123456784" shippingCarrier: { carrierCode: "UPS" } }]
    }) {
      ... on ProvideShipmentInfoForItemNotReceivedInquirySuccess {
        orderInquiry { inquiryId status { code displayText } }
      }
      ... on OrderInquiryNotFoundError { errorCode errorMessage }
    }
  }
GQL
# POST https://graphqlapi.ebay.com/graphql`,

    java: `// GraphQL: provideShipmentInfoForItemNotReceivedInquiry — scope: sell.inquiry
String query = """
    mutation {
      provideShipmentInfoForItemNotReceivedInquiry(input: {
        inquiryId: \\"INQUIRY-ID-123\\"
        trackings: [{ trackingNumber: \\"1Z999AA10123456784\\" shippingCarrier: { carrierCode: \\"UPS\\" } }]
      }) {
        ... on ProvideShipmentInfoForItemNotReceivedInquirySuccess {
          orderInquiry { inquiryId status { code displayText } }
        }
        ... on OrderInquiryNotFoundError { errorCode errorMessage }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: provideShipmentInfoForItemNotReceivedInquiry — scope: sell.inquiry
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`mutation {
    provideShipmentInfoForItemNotReceivedInquiry(input: {
      inquiryId: "INQUIRY-ID-123"
      trackings: [{ trackingNumber: "1Z999AA10123456784" shippingCarrier: { carrierCode: "UPS" } }]
    }) {
      ... on ProvideShipmentInfoForItemNotReceivedInquirySuccess {
        orderInquiry { inquiryId status { code displayText } }
      }
      ... on OrderInquiryNotFoundError { errorCode errorMessage }
      ... on ProvideShipmentInfoForInquiryInputValidationError { errorCode errorMessage }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL: provideShipmentInfoForItemNotReceivedInquiry — scope: sell.inquiry
body := \`{"query":"mutation { provideShipmentInfoForItemNotReceivedInquiry(input: { inquiryId: \\"INQUIRY-ID-123\\" trackings: [{ trackingNumber: \\"1Z999AA10123456784\\" shippingCarrier: { carrierCode: \\"UPS\\" } }] }) { ... on ProvideShipmentInfoForItemNotReceivedInquirySuccess { orderInquiry { inquiryId status { code displayText } } } ... on OrderInquiryNotFoundError { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: provideShipmentInfoForItemNotReceivedInquiry — scope: sell.inquiry
import requests

query = """mutation {
  provideShipmentInfoForItemNotReceivedInquiry(input: {
    inquiryId: "INQUIRY-ID-123"
    trackings: [{
      trackingNumber: "1Z999AA10123456784"
      shippingCarrier: { carrierCode: "UPS" }
    }]
  }) {
    ... on ProvideShipmentInfoForItemNotReceivedInquirySuccess {
      orderInquiry { inquiryId status { code displayText } }
    }
    ... on OrderInquiryNotFoundError { errorCode errorMessage }
    ... on ProvideShipmentInfoForInquiryInputValidationError { errorCode errorMessage }
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

// ─── Map: oldApi name → snippet ──────────────────────────────────────────────

export const inrSnippetByOldApi: Record<string, ApiCallSnippet> = {
  "Get Inquiry":                     searchInquiries,
  "Search Inquiries":                searchInquiries,
  "Provide Tracking (INR)":          provideTracking,
  "Issue Refund (INR)":              provideTracking,
  "Send Message (INR)":              provideTracking,
  "Escalate to eBay (INR case)":     provideTracking,
};
