import type { Lang } from "@/components/CodeTabs";

export interface ApiCallSnippet {
  old: Record<Lang, string>;
  new: Record<Lang, string>;
}

// ─── GetBestOffers → sellerNegotiationHistory ─────────────────────────────────
// Old: Trading API GetBestOffers  (ItemID optional, BestOfferStatus optional)
// New: GraphQL item.itemOfferOverview.negotiationHistory
// Doc confirmed: BestOfferStatus default=Active, can use All/Active

export const getBestOffers: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetBestOffers
// BestOfferStatus: Active (default) | All | Accepted | Declined | Expired | AdminEnded
// ItemID を省略すると出品者の全アクティブオファーを最大10,000件取得
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetBestOffersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <BestOfferStatus>All</BestOfferStatus>
  <Pagination>
    <EntriesPerPage>20</EntriesPerPage>
    <PageNumber>1</PageNumber>
  </Pagination>
</GetBestOffersRequest>';

$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'X-EBAY-API-SITEID: 0',
        'X-EBAY-API-CALL-NAME: GetBestOffers',
        'X-EBAY-API-APP-NAME: YOUR_APP_ID',
        'X-EBAY-API-CERT-NAME: YOUR_CERT_ID',
        'X-EBAY-API-DEV-NAME: YOUR_DEV_ID',
        'Content-Type: text/xml',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
$response = curl_exec($ch); curl_close($ch);`,

    ruby: `# Trading API: GetBestOffers
# BestOfferStatus: Active (default) | All | Accepted | Declined | Expired
body = <<~XML
  <?xml version="1.0" encoding="utf-8"?>
  <GetBestOffersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ItemID>123456789</ItemID>
    <BestOfferStatus>All</BestOfferStatus>
    <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
  </GetBestOffersRequest>
XML
# POST https://api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetBestOffers`,

    java: `// Trading API: GetBestOffers
// BestOfferStatus: Active (default) | All | Accepted | Declined | Expired
String body = """
    <?xml version="1.0" encoding="utf-8"?>
    <GetBestOffersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ItemID>123456789</ItemID>
      <BestOfferStatus>All</BestOfferStatus>
      <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
    </GetBestOffersRequest>""";
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetBestOffers`,

    nodejs: `// Trading API: GetBestOffers
// BestOfferStatus: Active (default) | All | Accepted | Declined | Expired
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: {
    'X-EBAY-API-SITEID': '0',
    'X-EBAY-API-CALL-NAME': 'GetBestOffers',
    'X-EBAY-API-APP-NAME': 'YOUR_APP_ID',
    'X-EBAY-API-CERT-NAME': 'YOUR_CERT_ID',
    'Content-Type': 'text/xml',
  },
  body: \`<?xml version="1.0" encoding="utf-8"?>
<GetBestOffersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <BestOfferStatus>All</BestOfferStatus>
  <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetBestOffersRequest>\`,
});`,

    go: `// Trading API: GetBestOffers
// BestOfferStatus: Active (default) | All | Accepted | Declined | Expired
body := \`<?xml version="1.0" encoding="utf-8"?>
<GetBestOffersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <BestOfferStatus>All</BestOfferStatus>
</GetBestOffersRequest>\`
req, _ := http.NewRequest("POST", "https://api.ebay.com/ws/api.dll",
    strings.NewReader(body))
req.Header.Set("X-EBAY-API-CALL-NAME", "GetBestOffers")
req.Header.Set("Content-Type", "text/xml")`,

    python: `# Trading API: GetBestOffers
# BestOfferStatus: Active (default) | All | Accepted | Declined | Expired
import requests

body = """<?xml version="1.0" encoding="utf-8"?>
<GetBestOffersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <BestOfferStatus>All</BestOfferStatus>
  <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetBestOffersRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetBestOffers', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: sellerListings → ListingSuccess → listing.items → itemOfferOverview
// (旧 GetBestOffers の代替)
// 注意1: input は { listings: [{ listingId: "..." }] }  ← listingIds ではない
// 注意2: itemOfferOverview は listing.items[].itemOfferOverview の中にある
// 注意3: 現在1回のクエリで指定できる listingId は最大1件
$query = <<<'GQL'
query {
  sellerListings(input: { listings: [{ listingId: "123456789" }] }) {
    ... on ListingsSuccess {
      listings {
        ... on ListingSuccess {
          listingId
          listing {
            items {
              itemOfferOverview {
                negotiationCount
                negotiationHistory(filters: { statuses: [ACTIVE, ACCEPTED] }) {
                  negotiations {
                    negotiationId
                    latestOffer {
                      offerId
                      offerPrice { original { value currency } }
                      quantity
                      status
                      expiresAt
                      offerCreatorRole
                    }
                  }
                }
              }
            }
          }
        }
        ... on ListingPartialSuccess {
          listingId
          errors { errorId message }
        }
      }
    }
    ... on ListingIdsMaxLimitError { errorCode errorMessage }
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

    ruby: `# GraphQL: sellerListings → ListingSuccess → listing.items → itemOfferOverview
# 注意1: input は { listings: [{ listingId: "..." }] }  ← listingIds ではない
# 注意2: itemOfferOverview は listing.items[].itemOfferOverview にある
# scope: sell.offer.read
require 'net/http'; require 'json'

query = <<~GQL
  query {
    sellerListings(input: { listings: [{ listingId: "123456789" }] }) {
      ... on ListingsSuccess {
        listings {
          ... on ListingSuccess {
            listingId
            listing {
              items {
                itemOfferOverview {
                  negotiationCount
                  negotiationHistory(filters: { statuses: [ACTIVE, ACCEPTED] }) {
                    negotiations {
                      negotiationId
                      latestOffer {
                        offerId
                        offerPrice { original { value currency } }
                        quantity status expiresAt offerCreatorRole
                      }
                    }
                  }
                }
              }
            }
          }
          ... on ListingPartialSuccess { listingId errors { errorId message } }
        }
      }
      ... on ListingIdsMaxLimitError { errorCode errorMessage }
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

    java: `// GraphQL: sellerListings → ListingSuccess → listing.items → itemOfferOverview
// 注意: input は { listings: [{ listingId: "..." }] }  — listingIds ではない
// scope: sell.offer.read
String query = """
    query {
      sellerListings(input: { listings: [{ listingId: \\"123456789\\" }] }) {
        ... on ListingsSuccess {
          listings {
            ... on ListingSuccess {
              listingId
              listing {
                items {
                  itemOfferOverview {
                    negotiationCount
                    negotiationHistory(filters: { statuses: [ACTIVE, ACCEPTED] }) {
                      negotiations {
                        negotiationId
                        latestOffer {
                          offerId
                          offerPrice { original { value currency } }
                          quantity status expiresAt offerCreatorRole
                        }
                      }
                    }
                  }
                }
              }
            }
            ... on ListingPartialSuccess { listingId errors { errorId message } }
          }
        }
        ... on ListingIdsMaxLimitError { errorCode errorMessage }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: sellerListings → ListingSuccess → listing.items → itemOfferOverview
// 注意: input は { listings: [{ listingId: "..." }] }  — listingIds ではない
// scope: sell.offer.read
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`query {
    sellerListings(input: { listings: [{ listingId: "123456789" }] }) {
      ... on ListingsSuccess {
        listings {
          ... on ListingSuccess {
            listingId
            listing {
              items {
                itemOfferOverview {
                  negotiationCount
                  negotiationHistory(filters: { statuses: [ACTIVE, ACCEPTED] }) {
                    negotiations {
                      negotiationId
                      latestOffer {
                        offerId
                        offerPrice { original { value currency } }
                        quantity status expiresAt offerCreatorRole
                      }
                    }
                  }
                }
              }
            }
          }
          ... on ListingPartialSuccess { listingId errors { errorId message } }
        }
      }
      ... on ListingIdsMaxLimitError { errorCode errorMessage }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL: sellerListings → ListingSuccess → listing.items → itemOfferOverview
// 注意: input は { listings: [{ listingId: "..." }] }  — listingIds ではない
body := \`{"query":"query { sellerListings(input: { listings: [{ listingId: \\"123456789\\" }] }) { ... on ListingsSuccess { listings { ... on ListingSuccess { listingId listing { items { itemOfferOverview { negotiationCount negotiationHistory(filters: { statuses: [ACTIVE, ACCEPTED] }) { negotiations { negotiationId latestOffer { offerId offerPrice { original { value currency } } quantity status expiresAt offerCreatorRole } } } } } } } ... on ListingPartialSuccess { listingId errors { errorId message } } } } ... on ListingIdsMaxLimitError { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: sellerListings → ListingSuccess → listing.items → itemOfferOverview
# 注意1: input は { listings: [{ listingId: "..." }] }  ← listingIds ではない
# 注意2: itemOfferOverview は listing.items[].itemOfferOverview にある
# scope: sell.offer.read
import requests

query = """query {
  sellerListings(input: { listings: [{ listingId: "123456789" }] }) {
    ... on ListingsSuccess {
      listings {
        ... on ListingSuccess {
          listingId
          listing {
            items {
              itemOfferOverview {
                negotiationCount
                negotiationHistory(filters: { statuses: [ACTIVE, ACCEPTED] }) {
                  negotiations {
                    negotiationId
                    latestOffer {
                      offerId
                      offerPrice { original { value currency } }
                      quantity status expiresAt offerCreatorRole
                    }
                  }
                }
              }
            }
          }
        }
        ... on ListingPartialSuccess { listingId errors { errorId message } }
      }
    }
    ... on ListingIdsMaxLimitError { errorCode errorMessage }
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

// ─── RespondToBestOffer → acceptOffer / counterOffer / declineOffer ────────────
// Old: Trading API RespondToBestOffer
//   Required: Action (Accept|Counter|Decline), BestOfferID (1..*), ItemID
//   Conditional (Counter only): CounterOfferPrice currencyID=USD, CounterOfferQuantity
// New: GraphQL acceptOffer / counterOffer / declineOffer
//   acceptOffer:   { itemId, offerId, message? }
//   counterOffer:  { itemId, offerId, proposedPrice: AmountInput, quantity?, message? }
//   declineOffer:  { itemId, offerId, message? }

export const respondToBestOffer: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: RespondToBestOffer (Accept)
// Action: Accept | Counter | Decline
// BestOfferID と ItemID は必須。Counter の場合は CounterOfferPrice, CounterOfferQuantity も必須
$body = '<?xml version="1.0" encoding="utf-8"?>
<RespondToBestOfferRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <BestOfferID>OFFER-ID-456</BestOfferID>
  <Action>Accept</Action>
  <SellerResponse>Thank you! Your offer has been accepted.</SellerResponse>
</RespondToBestOfferRequest>';

$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'X-EBAY-API-SITEID: 0',
        'X-EBAY-API-CALL-NAME: RespondToBestOffer',
        'X-EBAY-API-APP-NAME: YOUR_APP_ID',
        'X-EBAY-API-CERT-NAME: YOUR_CERT_ID',
        'X-EBAY-API-DEV-NAME: YOUR_DEV_ID',
        'Content-Type: text/xml',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
curl_exec($ch); curl_close($ch);

// Counter offer の場合 (Action=Counter):
// <CounterOfferPrice currencyID="USD">90.00</CounterOfferPrice>
// <CounterOfferQuantity>1</CounterOfferQuantity>`,

    ruby: `# Trading API: RespondToBestOffer (Accept)
# Action: Accept | Counter | Decline
# Counter の場合: CounterOfferPrice + CounterOfferQuantity が必須
body = <<~XML
  <?xml version="1.0" encoding="utf-8"?>
  <RespondToBestOfferRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ItemID>123456789</ItemID>
    <BestOfferID>OFFER-ID-456</BestOfferID>
    <Action>Accept</Action>
    <SellerResponse>Accepted!</SellerResponse>
  </RespondToBestOfferRequest>
XML
# POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: RespondToBestOffer`,

    java: `// Trading API: RespondToBestOffer (Accept)
// Action: Accept | Counter | Decline
// Counter の場合: CounterOfferPrice + CounterOfferQuantity が必須
String body = """
    <?xml version="1.0" encoding="utf-8"?>
    <RespondToBestOfferRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ItemID>123456789</ItemID>
      <BestOfferID>OFFER-ID-456</BestOfferID>
      <Action>Accept</Action>
      <SellerResponse>Accepted!</SellerResponse>
    </RespondToBestOfferRequest>""";
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: RespondToBestOffer`,

    nodejs: `// Trading API: RespondToBestOffer (Accept)
// Action: Accept | Counter | Decline
// Counter の場合: CounterOfferPrice + CounterOfferQuantity が必須
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: {
    'X-EBAY-API-SITEID': '0',
    'X-EBAY-API-CALL-NAME': 'RespondToBestOffer',
    'X-EBAY-API-APP-NAME': 'YOUR_APP_ID',
    'Content-Type': 'text/xml',
  },
  body: \`<?xml version="1.0" encoding="utf-8"?>
<RespondToBestOfferRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <BestOfferID>OFFER-ID-456</BestOfferID>
  <Action>Accept</Action>
  <SellerResponse>Accepted!</SellerResponse>
</RespondToBestOfferRequest>\`,
});`,

    go: `// Trading API: RespondToBestOffer (Accept)
// Action: Accept | Counter | Decline
// Counter の場合: CounterOfferPrice + CounterOfferQuantity が必須
body := \`<?xml version="1.0" encoding="utf-8"?>
<RespondToBestOfferRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <BestOfferID>OFFER-ID-456</BestOfferID>
  <Action>Accept</Action>
</RespondToBestOfferRequest>\`
req, _ := http.NewRequest("POST", "https://api.ebay.com/ws/api.dll",
    strings.NewReader(body))
req.Header.Set("X-EBAY-API-CALL-NAME", "RespondToBestOffer")
req.Header.Set("Content-Type", "text/xml")`,

    python: `# Trading API: RespondToBestOffer (Accept)
# Action: Accept | Counter | Decline
# Counter の場合: CounterOfferPrice + CounterOfferQuantity が必須
import requests
body = """<?xml version="1.0" encoding="utf-8"?>
<RespondToBestOfferRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <BestOfferID>OFFER-ID-456</BestOfferID>
  <Action>Accept</Action>
  <SellerResponse>Accepted!</SellerResponse>
</RespondToBestOfferRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'RespondToBestOffer', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: acceptOffer / counterOffer / declineOffer
// acceptOffer:  { itemId, offerId, message? }
// counterOffer: { itemId, offerId, proposedPrice: { value, currency }, quantity?, message? }
// declineOffer: { itemId, offerId, message? }

// --- Accept ---
$acceptQuery = <<<'GQL'
mutation {
  acceptOffer(input: {
    itemId: "ITEM-ID-123"
    offerId: "OFFER-ID-456"
    message: "Thank you! Your offer has been accepted."
  }) {
    ... on AcceptOfferSent {
      offer { offerId status offerPrice { original { value currency } } }
    }
    ... on OfferBusinessRulesViolated { errorCode errorMessage }
    ... on ReferenceArgumentsNotFound { errorCode errorMessage }
  }
}
GQL;

// --- Counter ---
$counterQuery = <<<'GQL'
mutation {
  counterOffer(input: {
    itemId: "ITEM-ID-123"
    offerId: "OFFER-ID-456"
    proposedPrice: { value: "90.00", currency: USD }
    quantity: 1
  }) {
    ... on CounterOfferSent { offer { offerId status offerPrice { original { value currency } } } }
    ... on OfferBusinessRulesViolated { errorCode errorMessage }
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
    CURLOPT_POSTFIELDS => json_encode(['query' => $acceptQuery]),
]);
curl_exec($ch); curl_close($ch);`,

    ruby: `# GraphQL: acceptOffer / counterOffer / declineOffer
# scope: sell.offer

# Accept:
accept_query = <<~GQL
  mutation {
    acceptOffer(input: {
      itemId: "ITEM-ID-123"
      offerId: "OFFER-ID-456"
      message: "Accepted!"
    }) {
      ... on AcceptOfferSent {
        offer { offerId status offerPrice { original { value currency } } }
      }
      ... on OfferBusinessRulesViolated { errorCode errorMessage }
    }
  }
GQL

# Counter:
counter_query = <<~GQL
  mutation {
    counterOffer(input: {
      itemId: "ITEM-ID-123"
      offerId: "OFFER-ID-456"
      proposedPrice: { value: "90.00", currency: USD }
      quantity: 1
    }) {
      ... on CounterOfferSent { offer { offerId status } }
    }
  }
GQL
# POST https://graphqlapi.ebay.com/graphql`,

    java: `// GraphQL: acceptOffer — scope: sell.offer
String acceptQuery = """
    mutation {
      acceptOffer(input: {
        itemId: \\"ITEM-ID-123\\"
        offerId: \\"OFFER-ID-456\\"
        message: \\"Accepted!\\"
      }) {
        ... on AcceptOfferSent {
          offer { offerId status offerPrice { original { value currency } } }
        }
        ... on OfferBusinessRulesViolated { errorCode errorMessage }
      }
    }""";

// Counter offer:
String counterQuery = """
    mutation {
      counterOffer(input: {
        itemId: \\"ITEM-ID-123\\"
        offerId: \\"OFFER-ID-456\\"
        proposedPrice: { value: \\"90.00\\", currency: USD }
        quantity: 1
      }) {
        ... on CounterOfferSent { offer { offerId status } }
        ... on OfferBusinessRulesViolated { errorCode errorMessage }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: acceptOffer / counterOffer / declineOffer — scope: sell.offer
const gql = (q) => fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: q }),
}).then(r => r.json());

// Accept:
await gql(\`mutation {
  acceptOffer(input: { itemId: "ITEM-ID-123", offerId: "OFFER-ID-456", message: "Accepted!" }) {
    ... on AcceptOfferSent { offer { offerId status offerPrice { original { value currency } } } }
    ... on OfferBusinessRulesViolated { errorCode errorMessage }
  }
}\`);

// Counter:
await gql(\`mutation {
  counterOffer(input: {
    itemId: "ITEM-ID-123", offerId: "OFFER-ID-456"
    proposedPrice: { value: "90.00", currency: USD }
    quantity: 1
  }) {
    ... on CounterOfferSent { offer { offerId status } }
  }
}\`);`,

    go: `// GraphQL: acceptOffer — scope: sell.offer
accept := \`{"query":"mutation { acceptOffer(input: { itemId: \\"ITEM-ID-123\\" offerId: \\"OFFER-ID-456\\" message: \\"Accepted!\\" }) { ... on AcceptOfferSent { offer { offerId status offerPrice { original { value currency } } } } ... on OfferBusinessRulesViolated { errorCode errorMessage } } }"}\`

// Counter offer:
counter := \`{"query":"mutation { counterOffer(input: { itemId: \\"ITEM-ID-123\\" offerId: \\"OFFER-ID-456\\" proposedPrice: { value: \\"90.00\\" currency: USD } quantity: 1 }) { ... on CounterOfferSent { offer { offerId status } } } }"}\`

for _, body := range []string{accept, counter} {
    req, _ := http.NewRequest("POST", "https://graphqlapi.ebay.com/graphql", strings.NewReader(body))
    req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    req.Header.Set("Content-Type", "application/json")
    http.DefaultClient.Do(req)
}`,

    python: `# GraphQL: acceptOffer / counterOffer / declineOffer — scope: sell.offer
import requests

def gql(query):
    return requests.post('https://graphqlapi.ebay.com/graphql',
        headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
                 'Content-Type': 'application/json'},
        json={'query': query}).json()

# Accept:
gql("""mutation {
  acceptOffer(input: {
    itemId: "ITEM-ID-123"
    offerId: "OFFER-ID-456"
    message: "Accepted!"
  }) {
    ... on AcceptOfferSent { offer { offerId status offerPrice { original { value currency } } } }
    ... on OfferBusinessRulesViolated { errorCode errorMessage }
  }
}""")

# Counter:
gql("""mutation {
  counterOffer(input: {
    itemId: "ITEM-ID-123"
    offerId: "OFFER-ID-456"
    proposedPrice: { value: "90.00", currency: USD }
    quantity: 1
  }) {
    ... on CounterOfferSent { offer { offerId status } }
  }
}""")`,
  } as Record<Lang, string>,
};

// ─── Map: oldApi name → snippet ──────────────────────────────────────────────

export const offersSnippetByOldApi: Record<string, ApiCallSnippet> = {
  "GetBestOffers":              getBestOffers,
  "RespondToBestOffer (Accept)":  respondToBestOffer,
  "RespondToBestOffer (Counter)": respondToBestOffer,
  "RespondToBestOffer (Decline)": respondToBestOffer,
};
