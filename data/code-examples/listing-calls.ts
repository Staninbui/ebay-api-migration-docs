import type { Lang } from "@/components/CodeTabs";

export interface ApiCallSnippet {
  old: Record<Lang, string>;
  new: Record<Lang, string>;
}

// ─── AddItem / AddFixedPriceItem → createListing ────────────────────────────

export const createListing: ApiCallSnippet = {
  old: {
    php: `<?php
// 必須フィールド: Country / Currency / Location / ShippingDetails / ReturnPolicy
// ListingDuration: 固定価格は GTC (Good Till Cancelled) が標準
$body = '<?xml version="1.0" encoding="utf-8"?>
<AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Item>
    <Title>Apple iPhone 15 Pro Max 256GB Natural Titanium</Title>
    <Description>&lt;p&gt;Brand new, factory sealed. Ships same day.&lt;/p&gt;</Description>
    <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
    <StartPrice currencyID="USD">1199.00</StartPrice>
    <Quantity>5</Quantity>
    <ListingType>FixedPriceItem</ListingType>
    <ListingDuration>GTC</ListingDuration>
    <ConditionID>1000</ConditionID>
    <Country>US</Country>
    <Currency>USD</Currency>
    <Location>San Jose, CA</Location>
    <PostalCode>95125</PostalCode>
    <DispatchTimeMax>1</DispatchTimeMax>
    <PictureDetails>
      <PictureURL>https://i.ebayimg.com/s-l1600.jpg</PictureURL>
    </PictureDetails>
    <ItemSpecifics>
      <NameValueList><Name>Brand</Name><Value>Apple</Value></NameValueList>
      <NameValueList><Name>Model</Name><Value>iPhone 15 Pro Max</Value></NameValueList>
      <NameValueList><Name>Storage Capacity</Name><Value>256 GB</Value></NameValueList>
    </ItemSpecifics>
    <ShippingDetails>
      <ShippingType>Flat</ShippingType>
      <ShippingServiceOptions>
        <ShippingServicePriority>1</ShippingServicePriority>
        <ShippingService>USPSPriority</ShippingService>
        <ShippingServiceCost currencyID="USD">5.99</ShippingServiceCost>
      </ShippingServiceOptions>
    </ShippingDetails>
    <ReturnPolicy>
      <ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption>
      <RefundOption>MoneyBack</RefundOption>
      <ReturnsWithinOption>Days_30</ReturnsWithinOption>
      <ShippingCostPaidByOption>Buyer</ShippingCostPaidByOption>
    </ReturnPolicy>
  </Item>
</AddItemRequest>';

$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'X-EBAY-API-SITEID: 0',
        'X-EBAY-API-CALL-NAME: AddItem',
        'X-EBAY-API-APP-NAME: YOUR_APP_ID',
        'X-EBAY-API-CERT-NAME: YOUR_CERT_ID',
        'X-EBAY-API-DEV-NAME: YOUR_DEV_ID',
        'Content-Type: text/xml',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
$response = curl_exec($ch); curl_close($ch);`,

    ruby: `require 'net/http'

# 必須: Country / Currency / Location / ShippingDetails / ReturnPolicy
body = <<~XML
  <?xml version="1.0" encoding="utf-8"?>
  <AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <Item>
      <Title>Apple iPhone 15 Pro Max 256GB Natural Titanium</Title>
      <Description>&lt;p&gt;Brand new, factory sealed.&lt;/p&gt;</Description>
      <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
      <StartPrice currencyID="USD">1199.00</StartPrice>
      <Quantity>5</Quantity>
      <ListingType>FixedPriceItem</ListingType>
      <ListingDuration>GTC</ListingDuration>
      <ConditionID>1000</ConditionID>
      <Country>US</Country>
      <Currency>USD</Currency>
      <Location>San Jose, CA</Location>
      <PostalCode>95125</PostalCode>
      <DispatchTimeMax>1</DispatchTimeMax>
      <PictureDetails>
        <PictureURL>https://i.ebayimg.com/s-l1600.jpg</PictureURL>
      </PictureDetails>
      <ItemSpecifics>
        <NameValueList><Name>Brand</Name><Value>Apple</Value></NameValueList>
        <NameValueList><Name>Model</Name><Value>iPhone 15 Pro Max</Value></NameValueList>
      </ItemSpecifics>
      <ShippingDetails>
        <ShippingType>Flat</ShippingType>
        <ShippingServiceOptions>
          <ShippingServicePriority>1</ShippingServicePriority>
          <ShippingService>USPSPriority</ShippingService>
          <ShippingServiceCost currencyID="USD">5.99</ShippingServiceCost>
        </ShippingServiceOptions>
      </ShippingDetails>
      <ReturnPolicy>
        <ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption>
        <RefundOption>MoneyBack</RefundOption>
        <ReturnsWithinOption>Days_30</ReturnsWithinOption>
        <ShippingCostPaidByOption>Buyer</ShippingCostPaidByOption>
      </ReturnPolicy>
    </Item>
  </AddItemRequest>
XML

uri = URI('https://api.ebay.com/ws/api.dll')
req = Net::HTTP::Post.new(uri)
req['X-EBAY-API-SITEID']    = '0'
req['X-EBAY-API-CALL-NAME'] = 'AddItem'
req['X-EBAY-API-APP-NAME']  = 'YOUR_APP_ID'
req['X-EBAY-API-CERT-NAME'] = 'YOUR_CERT_ID'
req['Content-Type']         = 'text/xml'
req.body = body
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// Trading API: AddItem — 必須: Country/Currency/Location/ShippingDetails/ReturnPolicy
String body = """
    <?xml version="1.0" encoding="utf-8"?>
    <AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <Item>
        <Title>Apple iPhone 15 Pro Max 256GB Natural Titanium</Title>
        <Description>&lt;p&gt;Brand new, factory sealed.&lt;/p&gt;</Description>
        <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
        <StartPrice currencyID="USD">1199.00</StartPrice>
        <Quantity>5</Quantity>
        <ListingType>FixedPriceItem</ListingType>
        <ListingDuration>GTC</ListingDuration>
        <ConditionID>1000</ConditionID>
        <Country>US</Country>
        <Currency>USD</Currency>
        <Location>San Jose, CA</Location>
        <PostalCode>95125</PostalCode>
        <DispatchTimeMax>1</DispatchTimeMax>
        <PictureDetails>
          <PictureURL>https://i.ebayimg.com/s-l1600.jpg</PictureURL>
        </PictureDetails>
        <ItemSpecifics>
          <NameValueList><Name>Brand</Name><Value>Apple</Value></NameValueList>
          <NameValueList><Name>Model</Name><Value>iPhone 15 Pro Max</Value></NameValueList>
        </ItemSpecifics>
        <ShippingDetails>
          <ShippingType>Flat</ShippingType>
          <ShippingServiceOptions>
            <ShippingServicePriority>1</ShippingServicePriority>
            <ShippingService>USPSPriority</ShippingService>
            <ShippingServiceCost currencyID="USD">5.99</ShippingServiceCost>
          </ShippingServiceOptions>
        </ShippingDetails>
        <ReturnPolicy>
          <ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption>
          <RefundOption>MoneyBack</RefundOption>
          <ReturnsWithinOption>Days_30</ReturnsWithinOption>
          <ShippingCostPaidByOption>Buyer</ShippingCostPaidByOption>
        </ReturnPolicy>
      </Item>
    </AddItemRequest>""";

HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/ws/api.dll"))
    .header("X-EBAY-API-SITEID", "0")
    .header("X-EBAY-API-CALL-NAME", "AddItem")
    .header("X-EBAY-API-APP-NAME", "YOUR_APP_ID")
    .header("X-EBAY-API-CERT-NAME", "YOUR_CERT_ID")
    .header("Content-Type", "text/xml")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();
HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Trading API: AddItem — 必須: Country/Currency/Location/ShippingDetails/ReturnPolicy
const body = \`<?xml version="1.0" encoding="utf-8"?>
<AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Item>
    <Title>Apple iPhone 15 Pro Max 256GB Natural Titanium</Title>
    <Description>&lt;p&gt;Brand new, factory sealed.&lt;/p&gt;</Description>
    <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
    <StartPrice currencyID="USD">1199.00</StartPrice>
    <Quantity>5</Quantity>
    <ListingType>FixedPriceItem</ListingType>
    <ListingDuration>GTC</ListingDuration>
    <ConditionID>1000</ConditionID>
    <Country>US</Country>
    <Currency>USD</Currency>
    <Location>San Jose, CA</Location>
    <PostalCode>95125</PostalCode>
    <DispatchTimeMax>1</DispatchTimeMax>
    <PictureDetails>
      <PictureURL>https://i.ebayimg.com/s-l1600.jpg</PictureURL>
    </PictureDetails>
    <ItemSpecifics>
      <NameValueList><Name>Brand</Name><Value>Apple</Value></NameValueList>
      <NameValueList><Name>Model</Name><Value>iPhone 15 Pro Max</Value></NameValueList>
    </ItemSpecifics>
    <ShippingDetails>
      <ShippingType>Flat</ShippingType>
      <ShippingServiceOptions>
        <ShippingServicePriority>1</ShippingServicePriority>
        <ShippingService>USPSPriority</ShippingService>
        <ShippingServiceCost currencyID="USD">5.99</ShippingServiceCost>
      </ShippingServiceOptions>
    </ShippingDetails>
    <ReturnPolicy>
      <ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption>
      <RefundOption>MoneyBack</RefundOption>
      <ReturnsWithinOption>Days_30</ReturnsWithinOption>
      <ShippingCostPaidByOption>Buyer</ShippingCostPaidByOption>
    </ReturnPolicy>
  </Item>
</AddItemRequest>\`;

await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: {
    'X-EBAY-API-SITEID': '0',
    'X-EBAY-API-CALL-NAME': 'AddItem',
    'X-EBAY-API-APP-NAME': 'YOUR_APP_ID',
    'X-EBAY-API-CERT-NAME': 'YOUR_CERT_ID',
    'Content-Type': 'text/xml',
  },
  body,
});`,

    go: `// Trading API: AddItem — 必須: Country/Currency/Location/ShippingDetails/ReturnPolicy
body := \`<?xml version="1.0" encoding="utf-8"?>
<AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Item>
    <Title>Apple iPhone 15 Pro Max 256GB Natural Titanium</Title>
    <Description>&lt;p&gt;Brand new, factory sealed.&lt;/p&gt;</Description>
    <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
    <StartPrice currencyID="USD">1199.00</StartPrice>
    <Quantity>5</Quantity>
    <ListingType>FixedPriceItem</ListingType>
    <ListingDuration>GTC</ListingDuration>
    <ConditionID>1000</ConditionID>
    <Country>US</Country>
    <Currency>USD</Currency>
    <Location>San Jose, CA</Location>
    <PostalCode>95125</PostalCode>
    <DispatchTimeMax>1</DispatchTimeMax>
    <PictureDetails>
      <PictureURL>https://i.ebayimg.com/s-l1600.jpg</PictureURL>
    </PictureDetails>
    <ItemSpecifics>
      <NameValueList><Name>Brand</Name><Value>Apple</Value></NameValueList>
      <NameValueList><Name>Model</Name><Value>iPhone 15 Pro Max</Value></NameValueList>
    </ItemSpecifics>
    <ShippingDetails>
      <ShippingType>Flat</ShippingType>
      <ShippingServiceOptions>
        <ShippingServicePriority>1</ShippingServicePriority>
        <ShippingService>USPSPriority</ShippingService>
        <ShippingServiceCost currencyID="USD">5.99</ShippingServiceCost>
      </ShippingServiceOptions>
    </ShippingDetails>
    <ReturnPolicy>
      <ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption>
      <RefundOption>MoneyBack</RefundOption>
      <ReturnsWithinOption>Days_30</ReturnsWithinOption>
      <ShippingCostPaidByOption>Buyer</ShippingCostPaidByOption>
    </ReturnPolicy>
  </Item>
</AddItemRequest>\`

req, _ := http.NewRequest("POST", "https://api.ebay.com/ws/api.dll",
    strings.NewReader(body))
req.Header.Set("X-EBAY-API-SITEID", "0")
req.Header.Set("X-EBAY-API-CALL-NAME", "AddItem")
req.Header.Set("X-EBAY-API-APP-NAME", "YOUR_APP_ID")
req.Header.Set("Content-Type", "text/xml")
http.DefaultClient.Do(req)`,

    python: `# Trading API: AddItem — 必須: Country/Currency/Location/ShippingDetails/ReturnPolicy
import requests

body = """<?xml version="1.0" encoding="utf-8"?>
<AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Item>
    <Title>Apple iPhone 15 Pro Max 256GB Natural Titanium</Title>
    <Description>&lt;p&gt;Brand new, factory sealed.&lt;/p&gt;</Description>
    <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
    <StartPrice currencyID="USD">1199.00</StartPrice>
    <Quantity>5</Quantity>
    <ListingType>FixedPriceItem</ListingType>
    <ListingDuration>GTC</ListingDuration>
    <ConditionID>1000</ConditionID>
    <Country>US</Country>
    <Currency>USD</Currency>
    <Location>San Jose, CA</Location>
    <PostalCode>95125</PostalCode>
    <DispatchTimeMax>1</DispatchTimeMax>
    <PictureDetails>
      <PictureURL>https://i.ebayimg.com/s-l1600.jpg</PictureURL>
    </PictureDetails>
    <ItemSpecifics>
      <NameValueList><Name>Brand</Name><Value>Apple</Value></NameValueList>
      <NameValueList><Name>Model</Name><Value>iPhone 15 Pro Max</Value></NameValueList>
    </ItemSpecifics>
    <ShippingDetails>
      <ShippingType>Flat</ShippingType>
      <ShippingServiceOptions>
        <ShippingServicePriority>1</ShippingServicePriority>
        <ShippingService>USPSPriority</ShippingService>
        <ShippingServiceCost currencyID="USD">5.99</ShippingServiceCost>
      </ShippingServiceOptions>
    </ShippingDetails>
    <ReturnPolicy>
      <ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption>
      <RefundOption>MoneyBack</RefundOption>
      <ReturnsWithinOption>Days_30</ReturnsWithinOption>
      <ShippingCostPaidByOption>Buyer</ShippingCostPaidByOption>
    </ReturnPolicy>
  </Item>
</AddItemRequest>"""

requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-SITEID': '0',
    'X-EBAY-API-CALL-NAME': 'AddItem',
    'X-EBAY-API-APP-NAME': 'YOUR_APP_ID',
    'X-EBAY-API-CERT-NAME': 'YOUR_CERT_ID',
    'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL Listing API: createListing
$query = <<<'GQL'
mutation {
  createListing(input: {
    marketplace: EBAY_US
    product: {
      title: "Apple iPhone 15 Pro Max 256GB"
      description: "<p>Brand new, factory sealed.</p>"
      categories: { primary: { id: "9355" } }
      imageUrls: ["https://i.ebayimg.com/s-l1600.jpg"]
      itemCondition: { conditionId: "1000" }
      aspects: [
        { name: "Brand", values: ["Apple"] }
        { name: "Model", values: ["iPhone 15 Pro Max"] }
      ]
    }
    items: [{ price: { value: "1199.00", currency: USD } quantity: 5 }]
    terms: {
      listingFormat: FIXED_PRICE
      listingDurationInDays: 30
      fulfillmentTerms: { shippingTerms: { fulfillmentPolicyId: "POLICY_ID" } }
      returnTerms: { returnPolicyId: "POLICY_ID" }
      paymentTerms: { paymentPolicyId: "POLICY_ID" }
    }
  }) {
    listingId
    errors { errorId message }
  }
}
GQL;

$ch = curl_init('https://graphqlapi.ebay.com/graphql');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode(['query' => $query]),
]);
$data = json_decode(curl_exec($ch), true);
curl_close($ch);
echo $data['data']['createListing']['listingId'];`,

    ruby: `require 'net/http'
require 'json'

# GraphQL Listing API: createListing
query = <<~GQL
  mutation {
    createListing(input: {
      marketplace: EBAY_US
      product: {
        title: "Apple iPhone 15 Pro Max 256GB"
        description: "<p>Brand new, factory sealed.</p>"
        categories: { primary: { id: "9355" } }
        imageUrls: ["https://i.ebayimg.com/s-l1600.jpg"]
        itemCondition: { conditionId: "1000" }
        aspects: [{ name: "Brand", values: ["Apple"] }]
      }
      items: [{ price: { value: "1199.00", currency: USD } quantity: 5 }]
      terms: {
        listingFormat: FIXED_PRICE
        listingDurationInDays: 30
        fulfillmentTerms: { shippingTerms: { fulfillmentPolicyId: "POLICY_ID" } }
        returnTerms: { returnPolicyId: "POLICY_ID" }
        paymentTerms: { paymentPolicyId: "POLICY_ID" }
      }
    }) { listingId errors { errorId message } }
  }
GQL

uri = URI('https://graphqlapi.ebay.com/graphql')
req = Net::HTTP::Post.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req['Content-Type']            = 'application/json'
req.body = { query: query }.to_json
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
data = JSON.parse(res.body)
puts data['data']['createListing']['listingId']`,

    java: `// GraphQL Listing API: createListing
String query = """
    {
      "query": "mutation { createListing(input: {
        marketplace: EBAY_US
        product: {
          title: \\"Apple iPhone 15 Pro Max 256GB\\"
          categories: { primary: { id: \\"9355\\" } }
          imageUrls: [\\"https://i.ebayimg.com/s-l1600.jpg\\"]
          itemCondition: { conditionId: \\"1000\\" }
          aspects: [{ name: \\"Brand\\", values: [\\"Apple\\"] }]
        }
        items: [{ price: { value: \\"1199.00\\", currency: USD } quantity: 5 }]
        terms: {
          listingFormat: FIXED_PRICE
          listingDurationInDays: 30
          fulfillmentTerms: { shippingTerms: { fulfillmentPolicyId: \\"POLICY_ID\\" } }
          returnTerms: { returnPolicyId: \\"POLICY_ID\\" }
          paymentTerms: { paymentPolicyId: \\"POLICY_ID\\" }
        }
      }) { listingId errors { errorId message } } }"
    }""";

HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://graphqlapi.ebay.com/graphql"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(query))
    .build();
HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// GraphQL Listing API: createListing
const query = \`
  mutation {
    createListing(input: {
      marketplace: EBAY_US
      product: {
        title: "Apple iPhone 15 Pro Max 256GB"
        description: "<p>Brand new, factory sealed.</p>"
        categories: { primary: { id: "9355" } }
        imageUrls: ["https://i.ebayimg.com/s-l1600.jpg"]
        itemCondition: { conditionId: "1000" }
        aspects: [
          { name: "Brand", values: ["Apple"] }
          { name: "Model", values: ["iPhone 15 Pro Max"] }
        ]
      }
      items: [{ price: { value: "1199.00", currency: USD } quantity: 5 }]
      terms: {
        listingFormat: FIXED_PRICE
        listingDurationInDays: 30
        fulfillmentTerms: { shippingTerms: { fulfillmentPolicyId: "POLICY_ID" } }
        returnTerms: { returnPolicyId: "POLICY_ID" }
        paymentTerms: { paymentPolicyId: "POLICY_ID" }
      }
    }) { listingId errors { errorId message } }
  }
\`;

const res = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query }),
});
const { data } = await res.json();
console.log(data.createListing.listingId);`,

    go: `// GraphQL Listing API: createListing
import (
    "bytes"; "encoding/json"; "io"; "net/http"
)

query := \`{
  "query": "mutation { createListing(input: {
    marketplace: EBAY_US
    product: {
      title: \\"Apple iPhone 15 Pro Max 256GB\\"
      categories: { primary: { id: \\"9355\\" } }
      imageUrls: [\\"https://i.ebayimg.com/s-l1600.jpg\\"]
      itemCondition: { conditionId: \\"1000\\" }
    }
    items: [{ price: { value: \\"1199.00\\", currency: USD } quantity: 5 }]
    terms: {
      listingFormat: FIXED_PRICE listingDurationInDays: 30
      fulfillmentTerms: { shippingTerms: { fulfillmentPolicyId: \\"POLICY_ID\\" } }
      returnTerms: { returnPolicyId: \\"POLICY_ID\\" }
      paymentTerms: { paymentPolicyId: \\"POLICY_ID\\" }
    }
  }) { listingId errors { errorId message } } }"
}\`

req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    bytes.NewBufferString(query))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)`,

    python: `# GraphQL Listing API: createListing
import requests

query = """
mutation {
  createListing(input: {
    marketplace: EBAY_US
    product: {
      title: "Apple iPhone 15 Pro Max 256GB"
      description: "<p>Brand new, factory sealed.</p>"
      categories: { primary: { id: "9355" } }
      imageUrls: ["https://i.ebayimg.com/s-l1600.jpg"]
      itemCondition: { conditionId: "1000" }
      aspects: [
        { name: "Brand", values: ["Apple"] }
        { name: "Model", values: ["iPhone 15 Pro Max"] }
      ]
    }
    items: [{ price: { value: "1199.00", currency: USD } quantity: 5 }]
    terms: {
      listingFormat: FIXED_PRICE
      listingDurationInDays: 30
      fulfillmentTerms: { shippingTerms: { fulfillmentPolicyId: "POLICY_ID" } }
      returnTerms: { returnPolicyId: "POLICY_ID" }
      paymentTerms: { paymentPolicyId: "POLICY_ID" }
    }
  }) { listingId errors { errorId message } }
}
"""

res = requests.post(
    'https://graphqlapi.ebay.com/graphql',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
    },
    json={'query': query}
)
data = res.json()
print(data['data']['createListing']['listingId'])`,
  } as Record<Lang, string>,
};

// ─── ReviseItem → updateListing ─────────────────────────────────────────────

export const updateListing: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: ReviseItem — 変更したいフィールドと ItemID だけ送る
// 注意1: ShippingDetails を更新する場合はサブフィールドを全て含める必要がある
// 注意2: オプションフィールドを削除するには <DeletedField> を使う
//        例: <DeletedField>Item.PictureDetails.PictureURL</DeletedField>
// 注意3: 落札者がいる・終了12時間以内のオークションは Title/Category 変更不可
$body = '<?xml version="1.0" encoding="utf-8"?>
<ReviseItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Item>
    <ItemID>123456789</ItemID>
    <StartPrice currencyID="USD">999.00</StartPrice>
    <Quantity>3</Quantity>
  </Item>
</ReviseItemRequest>';

$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'X-EBAY-API-SITEID: 0', 'X-EBAY-API-CALL-NAME: ReviseItem',
        'X-EBAY-API-APP-NAME: YOUR_APP_ID', 'Content-Type: text/xml',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
curl_exec($ch); curl_close($ch);`,

    ruby: `# Trading API: ReviseItem (SOAP/XML)
require 'net/http'
body = <<~XML
  <?xml version="1.0" encoding="utf-8"?>
  <ReviseItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <Item>
      <ItemID>123456789</ItemID>
      <StartPrice currencyID="USD">999.00</StartPrice>
      <Quantity>3</Quantity>
    </Item>
  </ReviseItemRequest>
XML
# POST https://api.ebay.com/ws/api.dll
# X-EBAY-API-CALL-NAME: ReviseItem`,

    java: `// Trading API: ReviseItem (SOAP/XML)
String body = """
    <?xml version="1.0" encoding="utf-8"?>
    <ReviseItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <Item>
        <ItemID>123456789</ItemID>
        <StartPrice currencyID="USD">999.00</StartPrice>
        <Quantity>3</Quantity>
      </Item>
    </ReviseItemRequest>""";
// POST https://api.ebay.com/ws/api.dll
// X-EBAY-API-CALL-NAME: ReviseItem`,

    nodejs: `// Trading API: ReviseItem (SOAP/XML)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: {
    'X-EBAY-API-SITEID': '0',
    'X-EBAY-API-CALL-NAME': 'ReviseItem',
    'X-EBAY-API-APP-NAME': 'YOUR_APP_ID',
    'Content-Type': 'text/xml',
  },
  body: \`<?xml version="1.0" encoding="utf-8"?>
<ReviseItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Item>
    <ItemID>123456789</ItemID>
    <StartPrice currencyID="USD">999.00</StartPrice>
    <Quantity>3</Quantity>
  </Item>
</ReviseItemRequest>\`,
});`,

    go: `// Trading API: ReviseItem (SOAP/XML)
body := \`<?xml version="1.0" encoding="utf-8"?>
<ReviseItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Item>
    <ItemID>123456789</ItemID>
    <StartPrice currencyID="USD">999.00</StartPrice>
    <Quantity>3</Quantity>
  </Item>
</ReviseItemRequest>\`
req, _ := http.NewRequest("POST", "https://api.ebay.com/ws/api.dll",
    strings.NewReader(body))
req.Header.Set("X-EBAY-API-CALL-NAME", "ReviseItem")
req.Header.Set("Content-Type", "text/xml")`,

    python: `# Trading API: ReviseItem (SOAP/XML)
import requests
body = """<?xml version="1.0" encoding="utf-8"?>
<ReviseItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Item>
    <ItemID>123456789</ItemID>
    <StartPrice currencyID="USD">999.00</StartPrice>
    <Quantity>3</Quantity>
  </Item>
</ReviseItemRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'ReviseItem', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL Listing API: updateListing
// 注意: imageUrls などの配列は全置換（差分更新ではない）
$query = <<<'GQL'
mutation {
  updateListing(input: {
    listingIdentifier: { listingId: "123456789" }
    items: [{
      price: { value: "999.00", currency: USD }
      quantity: 3
    }]
  }) {
    listingId
    errors { errorId message }
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

    ruby: `# GraphQL Listing API: updateListing
# 注意: imageUrls などの配列は全置換
require 'net/http'; require 'json'

query = <<~GQL
  mutation {
    updateListing(input: {
      listingIdentifier: { listingId: "123456789" }
      items: [{ price: { value: "999.00", currency: USD } quantity: 3 }]
    }) { listingId errors { errorId message } }
  }
GQL

uri = URI('https://graphqlapi.ebay.com/graphql')
req = Net::HTTP::Post.new(uri)
req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req['Content-Type'] = 'application/json'
req.body = { query: query }.to_json
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// GraphQL Listing API: updateListing — 配列は全置換
String query = """
    { "query": "mutation { updateListing(input: {
      listingIdentifier: { listingId: \\"123456789\\" }
      items: [{ price: { value: \\"999.00\\", currency: USD } quantity: 3 }]
    }) { listingId errors { errorId message } } }" }""";

HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://graphqlapi.ebay.com/graphql"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(query))
    .build();`,

    nodejs: `// GraphQL Listing API: updateListing
// 注意: imageUrls などの配列は全置換（差分ではない）
const res = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: \`mutation {
      updateListing(input: {
        listingIdentifier: { listingId: "123456789" }
        items: [{ price: { value: "999.00", currency: USD } quantity: 3 }]
      }) { listingId errors { errorId message } }
    }\`,
  }),
});
const { data } = await res.json();`,

    go: `// GraphQL Listing API: updateListing — 配列は全置換
query := \`{ "query": "mutation { updateListing(input: {
  listingIdentifier: { listingId: \\"123456789\\" }
  items: [{ price: { value: \\"999.00\\", currency: USD } quantity: 3 }]
}) { listingId errors { errorId message } } }" }\`

req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(query))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")
http.DefaultClient.Do(req)`,

    python: `# GraphQL Listing API: updateListing
# 注意: imageUrls などの配列は全置換
import requests

query = """mutation {
  updateListing(input: {
    listingIdentifier: { listingId: "123456789" }
    items: [{ price: { value: "999.00", currency: USD } quantity: 3 }]
  }) { listingId errors { errorId message } }
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

// ─── EndItem → endListing ────────────────────────────────────────────────────

export const endListing: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: EndItem
// EndingReason の有効値:
//   NotAvailable       - 商品が入手不可
//   LostOrBroken       - 紛失または破損
//   OtherListingError  - カテゴリ間違い等
//   SellToHighBidder   - 最高入札者に売却（オークション専用）
// ※ 落札者がいるオークションは終了12時間以内に EndItem 不可
$body = '<?xml version="1.0" encoding="utf-8"?>
<EndItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <EndingReason>NotAvailable</EndingReason>
</EndItemRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: EndItem`,

    ruby: `# Trading API: EndItem
# EndingReason: NotAvailable / LostOrBroken / OtherListingError / SellToHighBidder
body = <<~XML
  <?xml version="1.0" encoding="utf-8"?>
  <EndItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ItemID>123456789</ItemID>
    <EndingReason>NotAvailable</EndingReason>
  </EndItemRequest>
XML
# POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: EndItem`,

    java: `// Trading API: EndItem
String body = """
    <EndItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ItemID>123456789</ItemID>
      <EndingReason>NotAvailable</EndingReason>
    </EndItemRequest>""";
// X-EBAY-API-CALL-NAME: EndItem`,

    nodejs: `// Trading API: EndItem
const body = \`<?xml version="1.0" encoding="utf-8"?>
<EndItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <EndingReason>NotAvailable</EndingReason>
</EndItemRequest>\`;
// fetch('https://api.ebay.com/ws/api.dll', { method:'POST', body, headers:{...} })`,

    go: `// Trading API: EndItem
body := \`<EndItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <EndingReason>NotAvailable</EndingReason>
</EndItemRequest>\`
// X-EBAY-API-CALL-NAME: EndItem`,

    python: `# Trading API: EndItem
body = """<?xml version="1.0" encoding="utf-8"?>
<EndItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <EndingReason>NotAvailable</EndingReason>
</EndItemRequest>"""
# requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={...})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL Listing API: endListing
// endListingReason 対応 (旧EndingReason → 新endListingReason):
//   NotAvailable      → NOT_AVAILABLE
//   LostOrBroken      → LOST_OR_BROKEN
//   OtherListingError → OTHER
//   SellToHighBidder  → SOLD_EXTERNALLY (最も近い値)
$query = 'mutation {
  endListing(input: {
    listingIdentifier: { listingId: "123456789" }
    endListingReason: NOT_AVAILABLE
  }) { listingId errors { errorId message } }
}';

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
curl_exec($ch); curl_close($ch);`,

    ruby: `# GraphQL Listing API: endListing
# endListingReason が必須
query = 'mutation {
  endListing(input: {
    listingIdentifier: { listingId: "123456789" }
    endListingReason: NOT_AVAILABLE
  }) { listingId errors { errorId message } }
}'
# POST https://graphqlapi.ebay.com/graphql
# Authorization: Bearer YOUR_ACCESS_TOKEN`,

    java: `// GraphQL Listing API: endListing — endListingReason が必須
String query = "{ \\"query\\": \\"mutation { endListing(input: {" +
    "listingIdentifier: { listingId: \\\\"123456789\\\\" }" +
    "endListingReason: NOT_AVAILABLE" +
    "}) { listingId errors { errorId message } } }\\" }";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL Listing API: endListing — endListingReason が必須
// NOT_AVAILABLE | LOST_OR_BROKEN | SOLD_EXTERNALLY | OTHER
await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`mutation {
    endListing(input: {
      listingIdentifier: { listingId: "123456789" }
      endListingReason: NOT_AVAILABLE
    }) { listingId errors { errorId message } }
  }\` }),
});`,

    go: `// GraphQL Listing API: endListing — endListingReason が必須
query := \`{ "query": "mutation { endListing(input: {
  listingIdentifier: { listingId: \\"123456789\\" }
  endListingReason: NOT_AVAILABLE
}) { listingId errors { errorId message } } }" }\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(query))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL Listing API: endListing — endListingReason が必須
# NOT_AVAILABLE | LOST_OR_BROKEN | SOLD_EXTERNALLY | OTHER
import requests
requests.post('https://graphqlapi.ebay.com/graphql',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
    },
    json={'query': '''mutation {
  endListing(input: {
    listingIdentifier: { listingId: "123456789" }
    endListingReason: NOT_AVAILABLE
  }) { listingId errors { errorId message } }
}'''})`,
  } as Record<Lang, string>,
};

// ─── GetItem → sellerListings ────────────────────────────────────────────────

export const getItem: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetItem
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <IncludeItemSpecifics>true</IncludeItemSpecifics>
</GetItemRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetItem`,

    ruby: `# Trading API: GetItem
body = <<~XML
  <GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ItemID>123456789</ItemID>
    <IncludeItemSpecifics>true</IncludeItemSpecifics>
  </GetItemRequest>
XML
# POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetItem`,

    java: `// Trading API: GetItem
String body = """
    <GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ItemID>123456789</ItemID>
      <IncludeItemSpecifics>true</IncludeItemSpecifics>
    </GetItemRequest>""";
// X-EBAY-API-CALL-NAME: GetItem`,

    nodejs: `// Trading API: GetItem
const body = \`<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <IncludeItemSpecifics>true</IncludeItemSpecifics>
</GetItemRequest>\`;
// fetch('https://api.ebay.com/ws/api.dll', { method:'POST', body, headers:{...} })`,

    go: `// Trading API: GetItem
body := \`<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetItemRequest>\`
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetItem`,

    python: `# Trading API: GetItem
body = """<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <IncludeItemSpecifics>true</IncludeItemSpecifics>
</GetItemRequest>"""
# requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={...})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL Listing API: sellerListings
// input: { listings: [{ listingId: "..." }] }  ← listingIds ではない
// 注意: 現在1回のクエリで指定できる listingId は最大1件 (2件以上は ListingIdsMaxLimitError)
// scope: sell.listing (read/write 両対応 — sell.listing.read は不要)
// onHold 出品は ListingPartialSuccess で返る場合あり
$query = <<<'GQL'
query {
  sellerListings(input: { listings: [{ listingId: "123456789" }] }) {
    ... on ListingsSuccess {
      listings {
        ... on ListingSuccess {
          listingId
          listing {
            listingId
            product {
              title
              description
              imageUrls
              aspects { name values }
            }
            items { price { original { value currency } } quantity }
          }
        }
        ... on ListingPartialSuccess {
          listingId
          errors { errorId message }
        }
      }
    }
    ... on ListingIdsMaxLimitError {
      errorCode
      errorMessage
    }
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

    ruby: `# GraphQL Listing API: sellerListings
# input: { listings: [{ listingId: "..." }] }  ← listingIds ではない
# 注意: 現在1回のクエリで指定できる listingId は最大1件
# scope: sell.listing (read/write 両対応)
require 'net/http'; require 'json'

query = <<~GQL
  query {
    sellerListings(input: { listings: [{ listingId: "123456789" }] }) {
      ... on ListingsSuccess {
        listings {
          ... on ListingSuccess {
            listingId
            listing {
              listingId
              product { title imageUrls aspects { name values } }
              items { price { original { value currency } } quantity }
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
GQL

uri = URI('https://graphqlapi.ebay.com/graphql')
req = Net::HTTP::Post.new(uri)
req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req['Content-Type'] = 'application/json'
req.body = { query: query }.to_json
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
data = JSON.parse(res.body)`,

    java: `// GraphQL Listing API: sellerListings
// input: { listings: [{ listingId: "..." }] }  ← listingIds ではない
// 注意: 現在1回のクエリで指定できる listingId は最大1件
// scope: sell.listing (read/write 両対応)
String query = """
    query {
      sellerListings(input: { listings: [{ listingId: \\"123456789\\" }] }) {
        ... on ListingsSuccess {
          listings {
            ... on ListingSuccess {
              listingId
              listing {
                listingId
                product { title imageUrls aspects { name values } }
                items { price { original { value currency } } quantity }
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
    }""";

HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://graphqlapi.ebay.com/graphql"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\\"query\\":\\"" + query.replace("\\n"," ").replace("\\"","\\\\\\"") + "\\"}"
    ))
    .build();`,

    nodejs: `// GraphQL Listing API: sellerListings
// input: { listings: [{ listingId: "..." }] }  ← listingIds ではない
// 注意: 現在1回のクエリで指定できる listingId は最大1件
// scope: sell.listing (read/write 両対応)
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
              listingId
              product { title description imageUrls aspects { name values } }
              items { price { original { value currency } } quantity }
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
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL Listing API: sellerListings
// input: { listings: [{ listingId: "..." }] }  ← listingIds ではない
// 注意: 現在1回のクエリで指定できる listingId は最大1件
// scope: sell.listing (read/write 両対応)
body := \`{"query":"query { sellerListings(input: { listings: [{ listingId: \\"123456789\\" }] }) { ... on ListingsSuccess { listings { ... on ListingSuccess { listingId listing { listingId product { title imageUrls aspects { name values } } items { price { original { value currency } } quantity } } } ... on ListingPartialSuccess { listingId errors { errorId message } } } } ... on ListingIdsMaxLimitError { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL Listing API: sellerListings
# input: { listings: [{ listingId: "..." }] }  ← listingIds ではない
# 注意: 現在1回のクエリで指定できる listingId は最大1件
# scope: sell.listing (read/write 両対応 — sell.listing.read は不要)
import requests

query = """query {
  sellerListings(input: { listings: [{ listingId: "123456789" }] }) {
    ... on ListingsSuccess {
      listings {
        ... on ListingSuccess {
          listingId
          listing {
            listingId
            product { title description imageUrls aspects { name values } }
            items { price { original { value currency } } quantity }
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

// ─── GetOrders (paid) → orders ───────────────────────────────────────────────

export const getOrdersPaid: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetOrders (支払済み注文を取得)
// 旧 GetOrders は支払済み・未払いの区別なく返していたが、OrderStatus=Completed で絞り込むのが一般的
// 注意: CreateTimeFrom/CreateTimeTo の最大範囲は90日。90日超の場合は分割して呼び出すこと。
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CreateTimeFrom>2025-01-01T00:00:00Z</CreateTimeFrom>
  <CreateTimeTo>2025-03-31T23:59:59Z</CreateTimeTo>
  <OrderStatus>Completed</OrderStatus>
  <Pagination>
    <EntriesPerPage>20</EntriesPerPage>
    <PageNumber>1</PageNumber>
  </Pagination>
</GetOrdersRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetOrders`,

    ruby: `# Trading API: GetOrders (paid + unpaid mixed)
body = <<~XML
  <GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <CreateTimeFrom>2025-01-01T00:00:00Z</CreateTimeFrom>
    <OrderStatus>Completed</OrderStatus>
    <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
  </GetOrdersRequest>
XML
# X-EBAY-API-CALL-NAME: GetOrders`,

    java: `// Trading API: GetOrders (paid)
String body = """
    <GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <CreateTimeFrom>2025-01-01T00:00:00Z</CreateTimeFrom>
      <OrderStatus>Completed</OrderStatus>
      <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
    </GetOrdersRequest>""";
// X-EBAY-API-CALL-NAME: GetOrders`,

    nodejs: `// Trading API: GetOrders (paid)
const body = \`<?xml version="1.0" encoding="utf-8"?>
<GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CreateTimeFrom>2025-01-01T00:00:00Z</CreateTimeFrom>
  <OrderStatus>Completed</OrderStatus>
  <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetOrdersRequest>\`;
// fetch('https://api.ebay.com/ws/api.dll', { method:'POST', body, headers:{...} })`,

    go: `// Trading API: GetOrders (paid)
body := \`<GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CreateTimeFrom>2025-01-01T00:00:00Z</CreateTimeFrom>
  <OrderStatus>Completed</OrderStatus>
</GetOrdersRequest>\`
// X-EBAY-API-CALL-NAME: GetOrders`,

    python: `# Trading API: GetOrders (paid)
body = """<?xml version="1.0" encoding="utf-8"?>
<GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CreateTimeFrom>2025-01-01T00:00:00Z</CreateTimeFrom>
  <OrderStatus>Completed</OrderStatus>
  <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetOrdersRequest>"""
# requests.post('https://api.ebay.com/ws/api.dll', data=body, ...)`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL Order API: orders.sellerOrders (支払済みのみ。未払いは itemCommitments クエリ)
// 変更点: TransactionID廃止→orderLineItemId / lineItems→orderLineItems / limit→maxPageSize
$query = <<<'GQL'
query {
  orders {
    sellerOrders(input: {
      ordersFirstPage: {
        maxPageSize: 20
        filter: {
          dateRange: {
            dateTimeRange: {
              startDateTime: "2025-01-01T00:00:00Z"
              endDateTime: "2025-03-31T23:59:59Z"
            }
            dateType: CONFIRMED
          }
          filter: { includeConfirmed: true }
          sort: { sortField: CONFIRMED_AT, sortOrder: DESC }
        }
      }
    }) {
      orders {
        orderId
        orderState { ... on OrderConfirmed { confirmedAt } ... on OrderCancelled { cancelledAt } }
        buyer { username }
        orderLineItems {
          orderLineItemId
          lineItemTotals { lineItemTotal { original { value currency } } }
        }
        totals { orderTotal { original { value currency } } }
      }
      pagination { nextCursor }
    }
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
$orders = $data['data']['orders']['sellerOrders']['orders'];
curl_close($ch);`,

    ruby: `# GraphQL Order API: orders.sellerOrders (支払済みのみ)
# TransactionID → orderLineItemId / lineItems → orderLineItems
require 'net/http'; require 'json'

query = <<~GQL
  query {
    orders {
      sellerOrders(input: {
        ordersFirstPage: {
          maxPageSize: 20
          filter: {
            dateRange: {
              dateTimeRange: {
                startDateTime: "2025-01-01T00:00:00Z"
                endDateTime: "2025-03-31T23:59:59Z"
              }
              dateType: CONFIRMED
            }
            filter: { includeConfirmed: true }
            sort: { sortField: CONFIRMED_AT, sortOrder: DESC }
          }
        }
      }) {
        orders {
          orderId
          orderState { ... on OrderConfirmed { confirmedAt } }
          buyer { username }
          orderLineItems { orderLineItemId lineItemTotals { lineItemTotal { original { value currency } } } }
          totals { orderTotal { original { value currency } } }
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
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
orders = JSON.parse(res.body)['data']['orders']['sellerOrders']['orders']`,

    java: `// GraphQL Order API: orders.sellerOrders — 支払済みのみ
// TransactionID → orderLineItemId / lineItems → orderLineItems / limit → maxPageSize
String query = """
    query {
      orders {
        sellerOrders(input: {
          ordersFirstPage: {
            maxPageSize: 20
            filter: {
              dateRange: {
                dateTimeRange: {
                  startDateTime: \\"2025-01-01T00:00:00Z\\"
                  endDateTime: \\"2025-03-31T23:59:59Z\\"
                }
                dateType: CONFIRMED
              }
              filter: { includeConfirmed: true }
              sort: { sortField: CONFIRMED_AT, sortOrder: DESC }
            }
          }
        }) {
          orders {
            orderId
            orderState { ... on OrderConfirmed { confirmedAt } }
            buyer { username }
            orderLineItems { orderLineItemId lineItemTotals { lineItemTotal { original { value currency } } } }
            totals { orderTotal { original { value currency } } }
          }
          pagination { nextCursor }
        }
      }
    }""";
// POST to https://graphqlapi.ebay.com/graphql with Authorization: Bearer YOUR_ACCESS_TOKEN`,

    nodejs: `// GraphQL Order API: orders.sellerOrders — 支払済みのみ
// TransactionID → orderLineItemId / lineItems → orderLineItems / limit → maxPageSize
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`query {
    orders {
      sellerOrders(input: {
        ordersFirstPage: {
          maxPageSize: 20
          filter: {
            dateRange: {
              dateTimeRange: {
                startDateTime: "2025-01-01T00:00:00Z"
                endDateTime: "2025-03-31T23:59:59Z"
              }
              dateType: CONFIRMED
            }
            filter: { includeConfirmed: true }
            sort: { sortField: CONFIRMED_AT, sortOrder: DESC }
          }
        }
      }) {
        orders {
          orderId
          orderState { ... on OrderConfirmed { confirmedAt } ... on OrderCancelled { cancelledAt } }
          buyer { username }
          orderLineItems { orderLineItemId lineItemTotals { lineItemTotal { original { value currency } } } }
          totals { orderTotal { original { value currency } } }
        }
        pagination { nextCursor }
      }
    }
  }\` }),
}).then(r => r.json());
const orders = data.orders.sellerOrders.orders;`,

    go: `// GraphQL Order API: orders.sellerOrders — 支払済みのみ
// TransactionID → orderLineItemId / lineItems → orderLineItems
body := \`{"query":"query { orders { sellerOrders(input: { ordersFirstPage: { maxPageSize: 20 filter: { dateRange: { dateTimeRange: { startDateTime: \\"2025-01-01T00:00:00Z\\" endDateTime: \\"2025-03-31T23:59:59Z\\" } dateType: CONFIRMED } filter: { includeConfirmed: true } sort: { sortField: CONFIRMED_AT sortOrder: DESC } } } }) { orders { orderId buyer { username } orderLineItems { orderLineItemId lineItemTotals { lineItemTotal { original { value currency } } } } totals { orderTotal { original { value currency } } } } pagination { nextCursor } } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL Order API: orders.sellerOrders — 支払済みのみ
# TransactionID → orderLineItemId / lineItems → orderLineItems
import requests

query = """query {
  orders {
    sellerOrders(input: {
      ordersFirstPage: {
        maxPageSize: 20
        filter: {
          dateRange: {
            dateTimeRange: {
              startDateTime: "2025-01-01T00:00:00Z"
              endDateTime: "2025-03-31T23:59:59Z"
            }
            dateType: CONFIRMED
          }
          filter: { includeConfirmed: true }
          sort: { sortField: CONFIRMED_AT, sortOrder: DESC }
        }
      }
    }) {
      orders {
        orderId
        orderState { ... on OrderConfirmed { confirmedAt } ... on OrderCancelled { cancelledAt } }
        buyer { username }
        orderLineItems { orderLineItemId lineItemTotals { lineItemTotal { original { value currency } } } }
        totals { orderTotal { original { value currency } } }
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
    json={'query': query})
orders = res.json()['data']['orders']['sellerOrders']['orders']`,
  } as Record<Lang, string>,
};

// ─── GetOrders (unpaid) → itemCommitments ────────────────────────────────────

export const getOrdersUnpaid: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetOrders で未払い注文を取得していた場合
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderStatus>Active</OrderStatus>
  <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetOrdersRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetOrders`,

    ruby: `# Trading API: GetOrders で未払い注文取得
body = <<~XML
  <GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <OrderStatus>Active</OrderStatus>
    <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
  </GetOrdersRequest>
XML
# X-EBAY-API-CALL-NAME: GetOrders`,

    java: `// Trading API: GetOrders — OrderStatus=Active で未払い取得
String body = """
    <GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <OrderStatus>Active</OrderStatus>
    </GetOrdersRequest>""";
// X-EBAY-API-CALL-NAME: GetOrders`,

    nodejs: `// Trading API: GetOrders (unpaid — OrderStatus=Active)
const body = \`<GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderStatus>Active</OrderStatus>
  <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetOrdersRequest>\`;`,

    go: `// Trading API: GetOrders — Active (unpaid)
body := \`<GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderStatus>Active</OrderStatus>
</GetOrdersRequest>\``,

    python: `# Trading API: GetOrders — OrderStatus=Active (未払い)
body = """<GetOrdersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderStatus>Active</OrderStatus>
  <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetOrdersRequest>"""`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: itemCommitments — 未払い専用 (orders クエリには出ない)
// 注意1: itemCommitments は入力なし → sellerItemCommitments(input:...) にパラメータを渡す
// 注意2: status → state / listingId → lineItem.item.itemId / quantity → lineItem.quantity
// 注意3: pageCursor.nextPageCursor → pagination.nextCursor
$query = <<<'GQL'
query {
  itemCommitments {
    sellerItemCommitments(input: {
      itemCommitmentsFirstPage: {
        maxPageSize: 20
        filter: {
          dateRange: {
            dateTimeRange: {
              startDateTime: "2025-01-01T00:00:00Z"
              endDateTime: "2025-03-31T23:59:59Z"
            }
            dateType: CREATED
          }
          filter: { includeActive: true }
          sort: { sortField: CREATED_AT, sortOrder: DESC }
        }
      }
    }) {
      itemCommitments {
        itemCommitmentId
        state
        buyer { username }
        lineItem {
          quantity
          item { itemId }
        }
      }
      pagination { nextCursor }
    }
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
$commitments = $data['data']['itemCommitments']['sellerItemCommitments']['itemCommitments'];
curl_close($ch);`,

    ruby: `# GraphQL: itemCommitments — 未払いのみ (orders には出ない)
# itemCommitments は入力なし → sellerItemCommitments(input:...) にパラメータを渡す
# state (旧: status) / lineItem.quantity / lineItem.item.itemId / pagination.nextCursor
require 'net/http'; require 'json'

query = <<~GQL
  query {
    itemCommitments {
      sellerItemCommitments(input: {
        itemCommitmentsFirstPage: {
          maxPageSize: 20
          filter: {
            dateRange: {
              dateTimeRange: {
                startDateTime: "2025-01-01T00:00:00Z"
                endDateTime: "2025-03-31T23:59:59Z"
              }
              dateType: CREATED
            }
            filter: { includeActive: true }
            sort: { sortField: CREATED_AT, sortOrder: DESC }
          }
        }
      }) {
        itemCommitments {
          itemCommitmentId state
          buyer { username }
          lineItem { quantity item { itemId } }
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
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
commitments = JSON.parse(res.body)['data']['itemCommitments']['sellerItemCommitments']['itemCommitments']`,

    java: `// GraphQL: itemCommitments — orders には未払いは返らない
// itemCommitments は入力なし → sellerItemCommitments(input:...) にパラメータを渡す
// state (旧: status) / lineItem.quantity / lineItem.item.itemId / pagination.nextCursor
String query = """
    query {
      itemCommitments {
        sellerItemCommitments(input: {
          itemCommitmentsFirstPage: {
            maxPageSize: 20
            filter: {
              dateRange: {
                dateTimeRange: {
                  startDateTime: \\"2025-01-01T00:00:00Z\\"
                  endDateTime: \\"2025-03-31T23:59:59Z\\"
                }
                dateType: CREATED
              }
              filter: { includeActive: true }
              sort: { sortField: CREATED_AT, sortOrder: DESC }
            }
          }
        }) {
          itemCommitments {
            itemCommitmentId state
            buyer { username }
            lineItem { quantity item { itemId } }
          }
          pagination { nextCursor }
        }
      }
    }""";
// POST to https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: itemCommitments — orders には未払いは返らない
// itemCommitments は入力なし → sellerItemCommitments(input:...) にパラメータを渡す
// state (旧: status) / lineItem.quantity / lineItem.item.itemId / pagination.nextCursor
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`query {
    itemCommitments {
      sellerItemCommitments(input: {
        itemCommitmentsFirstPage: {
          maxPageSize: 20
          filter: {
            dateRange: {
              dateTimeRange: {
                startDateTime: "2025-01-01T00:00:00Z"
                endDateTime: "2025-03-31T23:59:59Z"
              }
              dateType: CREATED
            }
            filter: { includeActive: true }
            sort: { sortField: CREATED_AT, sortOrder: DESC }
          }
        }
      }) {
        itemCommitments {
          itemCommitmentId state
          buyer { username }
          lineItem { quantity item { itemId } }
        }
        pagination { nextCursor }
      }
    }
  }\` }),
}).then(r => r.json());
const commitments = data.itemCommitments.sellerItemCommitments.itemCommitments;`,

    go: `// GraphQL: itemCommitments — orders には未払いは返らない
// itemCommitments は入力なし → sellerItemCommitments(input:...) にパラメータを渡す
body := \`{"query":"query { itemCommitments { sellerItemCommitments(input: { itemCommitmentsFirstPage: { maxPageSize: 20 filter: { dateRange: { dateTimeRange: { startDateTime: \\"2025-01-01T00:00:00Z\\" endDateTime: \\"2025-03-31T23:59:59Z\\" } dateType: CREATED } filter: { includeActive: true } sort: { sortField: CREATED_AT sortOrder: DESC } } } }) { itemCommitments { itemCommitmentId state buyer { username } lineItem { quantity item { itemId } } } pagination { nextCursor } } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: itemCommitments — 未払いのみ (orders には出ない)
# itemCommitments は入力なし → sellerItemCommitments(input:...) にパラメータを渡す
# state (旧: status) / lineItem.quantity / lineItem.item.itemId / pagination.nextCursor
import requests

query = """query {
  itemCommitments {
    sellerItemCommitments(input: {
      itemCommitmentsFirstPage: {
        maxPageSize: 20
        filter: {
          dateRange: {
            dateTimeRange: {
              startDateTime: "2025-01-01T00:00:00Z"
              endDateTime: "2025-03-31T23:59:59Z"
            }
            dateType: CREATED
          }
          filter: { includeActive: true }
          sort: { sortField: CREATED_AT, sortOrder: DESC }
        }
      }
    }) {
      itemCommitments {
        itemCommitmentId state
        buyer { username }
        lineItem { quantity item { itemId } }
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
    json={'query': query})
commitments = res.json()['data']['itemCommitments']['sellerItemCommitments']['itemCommitments']`,
  } as Record<Lang, string>,
};

// ─── RelistItem / RelistFixedPriceItem → relistListing ───────────────────────
// Old: Trading API RelistItem / RelistFixedPriceItem
//   Required: Item.ItemID (終了したリスティングの ID)
//   Optional: 変更したいフィールドを Item コンテナに含める (削除は DeletedField)
//   Returns: 新しい ItemID (常に新 ID が発行される)
// New: GraphQL relistListing
//   Required: listingIdentifier: { listingId }, marketplace: ListingMarketplace!
//   Optional: product / listingItems / listingTerms / options: { operationMode: EXECUTE|VALIDATE }
//   Returns: RelistListingOutput = RelistListingSuccess | RelistListingValidationError | RelistListingValidationSuccess
//   注意: 常に新しい listingId が発行される (旧 ItemID とは別 ID)

export const relistListing: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: RelistItem / RelistFixedPriceItem
// Required: Item.ItemID (終了したリスティングの ID)
// Optional: 変更したいフィールドを Item コンテナに含める
// Returns: 新しい ItemID (常に新 ID が発行される)
$body = '<?xml version="1.0" encoding="utf-8"?>
<RelistItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Item>
    <ItemID>123456789</ItemID>
    <!-- 変更したいフィールドのみ指定 (省略すると元の値を引き継ぐ) -->
    <StartPrice currencyID="USD">999.00</StartPrice>
  </Item>
</RelistItemRequest>';

$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'X-EBAY-API-SITEID: 0',
        'X-EBAY-API-CALL-NAME: RelistItem',
        'X-EBAY-API-APP-NAME: YOUR_APP_ID',
        'X-EBAY-API-CERT-NAME: YOUR_CERT_ID',
        'X-EBAY-API-DEV-NAME: YOUR_DEV_ID',
        'Content-Type: text/xml',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
$response = curl_exec($ch); curl_close($ch);
// 成功時: <ItemID>NEW_ITEM_ID</ItemID> が返る`,

    ruby: `# Trading API: RelistItem / RelistFixedPriceItem
# Required: Item.ItemID / Returns: 新しい ItemID (常に新 ID)
body = <<~XML
  <?xml version="1.0" encoding="utf-8"?>
  <RelistItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <Item>
      <ItemID>123456789</ItemID>
      <StartPrice currencyID="USD">999.00</StartPrice>
    </Item>
  </RelistItemRequest>
XML
# POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: RelistItem`,

    java: `// Trading API: RelistItem / RelistFixedPriceItem
// Required: Item.ItemID / Returns: 新しい ItemID (常に新 ID)
String body = """
    <?xml version="1.0" encoding="utf-8"?>
    <RelistItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <Item>
        <ItemID>123456789</ItemID>
        <StartPrice currencyID="USD">999.00</StartPrice>
      </Item>
    </RelistItemRequest>""";
// X-EBAY-API-CALL-NAME: RelistItem`,

    nodejs: `// Trading API: RelistItem / RelistFixedPriceItem
// Required: Item.ItemID / Returns: 新しい ItemID (常に新 ID)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: {
    'X-EBAY-API-SITEID': '0',
    'X-EBAY-API-CALL-NAME': 'RelistItem',
    'X-EBAY-API-APP-NAME': 'YOUR_APP_ID',
    'Content-Type': 'text/xml',
  },
  body: \`<?xml version="1.0" encoding="utf-8"?>
<RelistItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Item>
    <ItemID>123456789</ItemID>
    <StartPrice currencyID="USD">999.00</StartPrice>
  </Item>
</RelistItemRequest>\`,
});`,

    go: `// Trading API: RelistItem / RelistFixedPriceItem
// Required: Item.ItemID / Returns: 新しい ItemID (常に新 ID)
body := \`<?xml version="1.0" encoding="utf-8"?>
<RelistItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Item>
    <ItemID>123456789</ItemID>
    <StartPrice currencyID="USD">999.00</StartPrice>
  </Item>
</RelistItemRequest>\`
req, _ := http.NewRequest("POST", "https://api.ebay.com/ws/api.dll",
    strings.NewReader(body))
req.Header.Set("X-EBAY-API-CALL-NAME", "RelistItem")
req.Header.Set("Content-Type", "text/xml")`,

    python: `# Trading API: RelistItem / RelistFixedPriceItem
# Required: Item.ItemID / Returns: 新しい ItemID (常に新 ID)
import requests
body = """<?xml version="1.0" encoding="utf-8"?>
<RelistItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Item>
    <ItemID>123456789</ItemID>
    <StartPrice currencyID="USD">999.00</StartPrice>
  </Item>
</RelistItemRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'RelistItem', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL Listing API: relistListing
// Required: listingIdentifier (listingId), marketplace
// Optional: product / listingItems / listingTerms (変更したいフィールドのみ)
// options.operationMode: EXECUTE(デフォルト) / VALIDATE (VerifyRelistItem の代替)
// 注意: 常に新しい listingId が発行される
$query = <<<'GQL'
mutation {
  relistListing(input: {
    listingIdentifier: { listingId: "123456789" }
    marketplace: EBAY_US
    # 価格を変更する場合のみ listingItems を含める
    listingItems: {
      items: [{
        itemTerms: {
          pricingTerms: { fixedPrice: 999.00 }
          availability: { quantityAvailable: 5 }
        }
      }]
    }
    # options: { operationMode: VALIDATE }  # 検証のみ (VerifyRelistItem の代替)
  }) {
    ... on RelistListingSuccess {
      listing { listingId }
      listingFees { feeAmount { value currency } listingFeeType }
    }
    ... on RelistListingValidationSuccess {
      listing { listingId }
      listingFees { feeAmount { value currency } listingFeeType }
    }
    ... on RelistListingValidationError {
      errorCode errorMessage
      violations { violationCode violationDescription inputPath }
    }
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

    ruby: `# GraphQL Listing API: relistListing
# Required: listingIdentifier, marketplace
# options.operationMode: VALIDATE で VerifyRelistItem の代替
# 注意: 常に新しい listingId が発行される
require 'net/http'; require 'json'

query = <<~GQL
  mutation {
    relistListing(input: {
      listingIdentifier: { listingId: "123456789" }
      marketplace: EBAY_US
      listingItems: {
        items: [{
          itemTerms: {
            pricingTerms: { fixedPrice: 999.00 }
            availability: { quantityAvailable: 5 }
          }
        }]
      }
    }) {
      ... on RelistListingSuccess {
        listing { listingId }
        listingFees { feeAmount { value currency } listingFeeType }
      }
      ... on RelistListingValidationError {
        errorCode errorMessage
        violations { violationCode violationDescription }
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

    java: `// GraphQL Listing API: relistListing
// options.operationMode: VALIDATE で VerifyRelistItem の代替 / 常に新 listingId
String query = """
    mutation {
      relistListing(input: {
        listingIdentifier: { listingId: \\"123456789\\" }
        marketplace: EBAY_US
        listingItems: {
          items: [{
            itemTerms: {
              pricingTerms: { fixedPrice: 999.00 }
              availability: { quantityAvailable: 5 }
            }
          }]
        }
      }) {
        ... on RelistListingSuccess {
          listing { listingId }
          listingFees { feeAmount { value currency } listingFeeType }
        }
        ... on RelistListingValidationError {
          errorCode errorMessage
          violations { violationCode violationDescription }
        }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL Listing API: relistListing
// options.operationMode: VALIDATE で VerifyRelistItem の代替 / 常に新 listingId
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`mutation {
    relistListing(input: {
      listingIdentifier: { listingId: "123456789" }
      marketplace: EBAY_US
      listingItems: {
        items: [{
          itemTerms: {
            pricingTerms: { fixedPrice: 999.00 }
            availability: { quantityAvailable: 5 }
          }
        }]
      }
    }) {
      ... on RelistListingSuccess {
        listing { listingId }
        listingFees { feeAmount { value currency } listingFeeType }
      }
      ... on RelistListingValidationError { errorCode errorMessage }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL Listing API: relistListing
// options.operationMode: VALIDATE で VerifyRelistItem の代替 / 常に新 listingId
body := \`{"query":"mutation { relistListing(input: { listingIdentifier: { listingId: \\"123456789\\" } marketplace: EBAY_US listingItems: { items: [{ itemTerms: { pricingTerms: { fixedPrice: 999.00 } availability: { quantityAvailable: 5 } } }] } }) { ... on RelistListingSuccess { listing { listingId } listingFees { feeAmount { value currency } listingFeeType } } ... on RelistListingValidationError { errorCode errorMessage violations { violationCode violationDescription } } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL Listing API: relistListing
# options.operationMode: VALIDATE で VerifyRelistItem の代替 / 常に新 listingId
import requests

query = """mutation {
  relistListing(input: {
    listingIdentifier: { listingId: "123456789" }
    marketplace: EBAY_US
    listingItems: {
      items: [{
        itemTerms: {
          pricingTerms: { fixedPrice: 999.00 }
          availability: { quantityAvailable: 5 }
        }
      }]
    }
    # options: { operationMode: VALIDATE }  # 検証のみ
  }) {
    ... on RelistListingSuccess {
      listing { listingId }
      listingFees { feeAmount { value currency } listingFeeType }
    }
    ... on RelistListingValidationSuccess {
      listing { listingId }
      listingFees { feeAmount { value currency } listingFeeType }
    }
    ... on RelistListingValidationError {
      errorCode errorMessage
      violations { violationCode violationDescription inputPath }
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

// ─── AddSecondChanceItem → createSecondChanceListing ─────────────────────────
// Old: Trading API AddSecondChanceItem
//   Required: ItemID, RecipientBidderUserID, Duration (Days_1/Days_3/Days_5/Days_7)
//   Optional: BuyItNowPrice, SellerMessage (max 1000文字、HTML/*/引用符不可)
//   Returns: 新しい ItemID
// New: GraphQL createSecondChanceListing
//   Required: listingIdentifier, marketplace, recipientUserId, listingTerms.listingDuration
//   listingDuration: DAYS_1 | DAYS_3 | DAYS_5 | DAYS_7
//   Optional: listingTerms.fixedPrice, sellerMessage, options.operationMode

export const createSecondChanceListing: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: AddSecondChanceItem (オークション非落札者へのセカンドチャンスオファー)
// Required: ItemID, RecipientBidderUserID, Duration
// Duration: Days_1 / Days_3 / Days_5 / Days_7
// SellerMessage: max 1000文字、HTML/*/引用符不可
$body = '<?xml version="1.0" encoding="utf-8"?>
<AddSecondChanceItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <RecipientBidderUserID>buyer_username</RecipientBidderUserID>
  <Duration>Days_3</Duration>
  <SellerMessage>We have another unit available for you!</SellerMessage>
</AddSecondChanceItemRequest>';

$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'X-EBAY-API-SITEID: 0',
        'X-EBAY-API-CALL-NAME: AddSecondChanceItem',
        'X-EBAY-API-APP-NAME: YOUR_APP_ID',
        'X-EBAY-API-CERT-NAME: YOUR_CERT_ID',
        'X-EBAY-API-DEV-NAME: YOUR_DEV_ID',
        'Content-Type: text/xml',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
$response = curl_exec($ch); curl_close($ch);`,

    ruby: `# Trading API: AddSecondChanceItem
# Required: ItemID, RecipientBidderUserID, Duration (Days_1/3/5/7)
body = <<~XML
  <?xml version="1.0" encoding="utf-8"?>
  <AddSecondChanceItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ItemID>123456789</ItemID>
    <RecipientBidderUserID>buyer_username</RecipientBidderUserID>
    <Duration>Days_3</Duration>
    <SellerMessage>We have another unit available for you!</SellerMessage>
  </AddSecondChanceItemRequest>
XML
# X-EBAY-API-CALL-NAME: AddSecondChanceItem`,

    java: `// Trading API: AddSecondChanceItem
// Required: ItemID, RecipientBidderUserID, Duration (Days_1/3/5/7)
String body = """
    <?xml version="1.0" encoding="utf-8"?>
    <AddSecondChanceItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ItemID>123456789</ItemID>
      <RecipientBidderUserID>buyer_username</RecipientBidderUserID>
      <Duration>Days_3</Duration>
      <SellerMessage>We have another unit available!</SellerMessage>
    </AddSecondChanceItemRequest>""";
// X-EBAY-API-CALL-NAME: AddSecondChanceItem`,

    nodejs: `// Trading API: AddSecondChanceItem
// Required: ItemID, RecipientBidderUserID, Duration (Days_1/3/5/7)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: {
    'X-EBAY-API-SITEID': '0',
    'X-EBAY-API-CALL-NAME': 'AddSecondChanceItem',
    'X-EBAY-API-APP-NAME': 'YOUR_APP_ID',
    'Content-Type': 'text/xml',
  },
  body: \`<?xml version="1.0" encoding="utf-8"?>
<AddSecondChanceItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <RecipientBidderUserID>buyer_username</RecipientBidderUserID>
  <Duration>Days_3</Duration>
</AddSecondChanceItemRequest>\`,
});`,

    go: `// Trading API: AddSecondChanceItem
// Required: ItemID, RecipientBidderUserID, Duration (Days_1/3/5/7)
body := \`<?xml version="1.0" encoding="utf-8"?>
<AddSecondChanceItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <RecipientBidderUserID>buyer_username</RecipientBidderUserID>
  <Duration>Days_3</Duration>
</AddSecondChanceItemRequest>\`
// X-EBAY-API-CALL-NAME: AddSecondChanceItem`,

    python: `# Trading API: AddSecondChanceItem
# Required: ItemID, RecipientBidderUserID, Duration (Days_1/Days_3/Days_5/Days_7)
# SellerMessage: max 1000文字、HTML/*/引用符不可
import requests
body = """<?xml version="1.0" encoding="utf-8"?>
<AddSecondChanceItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <RecipientBidderUserID>buyer_username</RecipientBidderUserID>
  <Duration>Days_3</Duration>
  <SellerMessage>We have another unit available for you!</SellerMessage>
</AddSecondChanceItemRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'AddSecondChanceItem', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL Listing API: createSecondChanceListing
// Required: listingIdentifier, marketplace, recipientUserId, listingTerms.listingDuration
// listingDuration: DAYS_1 | DAYS_3 | DAYS_5 | DAYS_7
// Optional: listingTerms.fixedPrice (未指定時は最高入札額が設定される), sellerMessage
$query = <<<'GQL'
mutation {
  createSecondChanceListing(input: {
    listingIdentifier: { listingId: "123456789" }
    marketplace: EBAY_US
    recipientUserId: "buyer_username"
    listingTerms: {
      listingDuration: DAYS_3
      # fixedPrice: 900.00  # 省略時は最高入札額が適用される
    }
    sellerMessage: "We have another unit available for you!"
  }) {
    ... on CreateSecondChanceListingSuccess {
      listing { listingId }
    }
    ... on CreateSecondChanceListingValidationSuccess {
      listing { listingId }
    }
    ... on CreateSecondChanceListingValidationError {
      errorCode errorMessage
      violations { violationCode violationDescription }
    }
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

    ruby: `# GraphQL Listing API: createSecondChanceListing
# listingDuration: DAYS_1 | DAYS_3 | DAYS_5 | DAYS_7
# fixedPrice 省略時は最高入札額が設定される
require 'net/http'; require 'json'

query = <<~GQL
  mutation {
    createSecondChanceListing(input: {
      listingIdentifier: { listingId: "123456789" }
      marketplace: EBAY_US
      recipientUserId: "buyer_username"
      listingTerms: { listingDuration: DAYS_3 }
      sellerMessage: "We have another unit available!"
    }) {
      ... on CreateSecondChanceListingSuccess { listing { listingId } }
      ... on CreateSecondChanceListingValidationError { errorCode errorMessage }
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

    java: `// GraphQL Listing API: createSecondChanceListing
// listingDuration: DAYS_1 | DAYS_3 | DAYS_5 | DAYS_7
String query = """
    mutation {
      createSecondChanceListing(input: {
        listingIdentifier: { listingId: \\"123456789\\" }
        marketplace: EBAY_US
        recipientUserId: \\"buyer_username\\"
        listingTerms: { listingDuration: DAYS_3 }
        sellerMessage: \\"We have another unit available!\\"
      }) {
        ... on CreateSecondChanceListingSuccess { listing { listingId } }
        ... on CreateSecondChanceListingValidationError { errorCode errorMessage }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL Listing API: createSecondChanceListing
// listingDuration: DAYS_1 | DAYS_3 | DAYS_5 | DAYS_7
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`mutation {
    createSecondChanceListing(input: {
      listingIdentifier: { listingId: "123456789" }
      marketplace: EBAY_US
      recipientUserId: "buyer_username"
      listingTerms: { listingDuration: DAYS_3 }
      sellerMessage: "We have another unit available!"
    }) {
      ... on CreateSecondChanceListingSuccess { listing { listingId } }
      ... on CreateSecondChanceListingValidationError { errorCode errorMessage }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL Listing API: createSecondChanceListing
// listingDuration: DAYS_1 | DAYS_3 | DAYS_5 | DAYS_7
body := \`{"query":"mutation { createSecondChanceListing(input: { listingIdentifier: { listingId: \\"123456789\\" } marketplace: EBAY_US recipientUserId: \\"buyer_username\\" listingTerms: { listingDuration: DAYS_3 } sellerMessage: \\"We have another unit available!\\" }) { ... on CreateSecondChanceListingSuccess { listing { listingId } } ... on CreateSecondChanceListingValidationError { errorCode errorMessage violations { violationCode violationDescription } } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL Listing API: createSecondChanceListing
# listingDuration: DAYS_1 | DAYS_3 | DAYS_5 | DAYS_7
# fixedPrice 省略時は最高入札額が設定される
import requests

query = """mutation {
  createSecondChanceListing(input: {
    listingIdentifier: { listingId: "123456789" }
    marketplace: EBAY_US
    recipientUserId: "buyer_username"
    listingTerms: {
      listingDuration: DAYS_3
      # fixedPrice: 900.00
    }
    sellerMessage: "We have another unit available for you!"
  }) {
    ... on CreateSecondChanceListingSuccess { listing { listingId } }
    ... on CreateSecondChanceListingValidationSuccess { listing { listingId } }
    ... on CreateSecondChanceListingValidationError {
      errorCode errorMessage
      violations { violationCode violationDescription }
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

// ─── GetMyeBaySelling / GetSellerList / GetSellerEvents → sellerListingSearch ─
// Old: Trading API GetMyeBaySelling (ActiveList/ScheduledList/SoldList container)
//        GetSellerList (EndTimeFrom/EndTimeTo or StartTimeFrom/To)
//        GetSellerEvents (ModTimeFrom/ModTimeTo — 変更されたリスティング)
// New: GraphQL sellerListingSearch
//   sellerListingSearch takes no root input; call sub-fields:
//     activeListings(searchInput: { filters, pagination, sort })
//     endedListings(searchInput: ...)
//     scheduledListings(searchInput: ...)
//   filter fields: modifiedAtRange / marketplaces / formatType / listingIds / primaryCategoryIds
//   SellerListingSearchResult = SellerListingSearchInvalidInput | SellerListings
//   SellerListings { listings: [ListingReference { listingId, listing }], pagination }
//   scope: sell.listing (read/write 統合)

export const sellerListingSearch: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetMyeBaySelling (アクティブ・終了・スケジュール済みリスティング)
// GetSellerEvents の場合: ModTimeFrom / ModTimeTo で変更されたものを取得
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ActiveList>
    <Include>true</Include>
    <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
  </ActiveList>
  <ScheduledList>
    <Include>true</Include>
  </ScheduledList>
</GetMyeBaySellingRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetMyeBaySelling

// GetSellerEvents (変更されたリスティングを検索):
// <ModTimeFrom>2025-01-01T00:00:00Z</ModTimeFrom>
// <ModTimeTo>2025-01-31T23:59:59Z</ModTimeTo>  (最大30日)`,

    ruby: `# Trading API: GetMyeBaySelling / GetSellerEvents
body = <<~XML
  <GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ActiveList>
      <Include>true</Include>
      <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
    </ActiveList>
    <ScheduledList><Include>true</Include></ScheduledList>
  </GetMyeBaySellingRequest>
XML
# X-EBAY-API-CALL-NAME: GetMyeBaySelling`,

    java: `// Trading API: GetMyeBaySelling / GetSellerEvents
String body = """
    <GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ActiveList>
        <Include>true</Include>
        <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
      </ActiveList>
      <ScheduledList><Include>true</Include></ScheduledList>
    </GetMyeBaySellingRequest>""";
// X-EBAY-API-CALL-NAME: GetMyeBaySelling`,

    nodejs: `// Trading API: GetMyeBaySelling / GetSellerEvents
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetMyeBaySelling', 'Content-Type': 'text/xml' },
  body: \`<GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ActiveList>
    <Include>true</Include>
    <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
  </ActiveList>
  <ScheduledList><Include>true</Include></ScheduledList>
</GetMyeBaySellingRequest>\`,
});`,

    go: `// Trading API: GetMyeBaySelling / GetSellerEvents
body := \`<GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ActiveList>
    <Include>true</Include>
    <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
  </ActiveList>
  <ScheduledList><Include>true</Include></ScheduledList>
</GetMyeBaySellingRequest>\`
// X-EBAY-API-CALL-NAME: GetMyeBaySelling`,

    python: `# Trading API: GetMyeBaySelling / GetSellerEvents
# GetSellerEvents: ModTimeFrom/ModTimeTo で変更されたものを取得 (最大30日)
import requests
body = """<GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ActiveList>
    <Include>true</Include>
    <Pagination><EntriesPerPage>20</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
  </ActiveList>
  <ScheduledList><Include>true</Include></ScheduledList>
</GetMyeBaySellingRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetMyeBaySelling', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: sellerListingSearch (アクティブ・終了・スケジュール済み)
// GetSellerEvents 代替: modifiedAtRange フィルターを使う
// sellerListingSearch はルートに入力なし → activeListings/endedListings/scheduledListings を呼ぶ
$query = <<<'GQL'
query {
  sellerListingSearch {
    # アクティブリスティング (GetMyeBaySelling ActiveList / GetSellerList の代替)
    activeListings(searchInput: {
      filters: {
        marketplaces: [EBAY_US]
        formatType: FIXED_PRICE
        # GetSellerEvents 代替: modifiedAtRange で変更されたものを絞り込む
        # modifiedAtRange: { startAt: "2025-01-01T00:00:00Z" endAt: "2025-01-31T23:59:59Z" }
      }
      pagination: { maxPageSize: 20 }
    }) {
      ... on SellerListings {
        listings { listingId listing { sellerProduct { title } } }
        pagination { nextCursor totalElements }
      }
      ... on SellerListingSearchInvalidInput { errorCode errorMessage }
    }
    # スケジュール済み (GetMyeBaySelling ScheduledList の代替)
    scheduledListings {
      ... on SellerListings {
        listings { listingId }
        pagination { nextCursor totalElements }
      }
    }
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

    ruby: `# GraphQL: sellerListingSearch
# sellerListingSearch はルートに入力なし → sub-field で絞り込む
# modifiedAtRange で GetSellerEvents の代替が可能
require 'net/http'; require 'json'

query = <<~GQL
  query {
    sellerListingSearch {
      activeListings(searchInput: {
        filters: {
          marketplaces: [EBAY_US]
          # GetSellerEvents 代替:
          # modifiedAtRange: { startAt: "2025-01-01T00:00:00Z" endAt: "2025-01-31T23:59:59Z" }
        }
        pagination: { maxPageSize: 20 }
      }) {
        ... on SellerListings {
          listings { listingId listing { sellerProduct { title } } }
          pagination { nextCursor totalElements }
        }
        ... on SellerListingSearchInvalidInput { errorCode errorMessage }
      }
      scheduledListings {
        ... on SellerListings { listings { listingId } }
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

    java: `// GraphQL: sellerListingSearch — scope: sell.listing
// sellerListingSearch はルートに入力なし
// GetSellerEvents 代替: filters.modifiedAtRange を使う
String query = """
    query {
      sellerListingSearch {
        activeListings(searchInput: {
          filters: {
            marketplaces: [EBAY_US]
            # modifiedAtRange: { startAt: \\"2025-01-01T00:00:00Z\\" endAt: \\"2025-01-31T23:59:59Z\\" }
          }
          pagination: { maxPageSize: 20 }
        }) {
          ... on SellerListings {
            listings { listingId listing { sellerProduct { title } } }
            pagination { nextCursor totalElements }
          }
          ... on SellerListingSearchInvalidInput { errorCode errorMessage }
        }
        scheduledListings {
          ... on SellerListings { listings { listingId } }
        }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: sellerListingSearch — scope: sell.listing
// sellerListingSearch はルートに入力なし
// GetSellerEvents 代替: filters.modifiedAtRange を使う
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`query {
    sellerListingSearch {
      activeListings(searchInput: {
        filters: {
          marketplaces: [EBAY_US]
          # GetSellerEvents 代替:
          # modifiedAtRange: { startAt: "2025-01-01T00:00:00Z" endAt: "2025-01-31T23:59:59Z" }
        }
        pagination: { maxPageSize: 20 }
      }) {
        ... on SellerListings {
          listings { listingId listing { sellerProduct { title } } }
          pagination { nextCursor totalElements }
        }
        ... on SellerListingSearchInvalidInput { errorCode errorMessage }
      }
      scheduledListings {
        ... on SellerListings { listings { listingId } }
      }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL: sellerListingSearch — scope: sell.listing
// GetSellerEvents 代替: filters { modifiedAtRange } を使う
body := \`{"query":"query { sellerListingSearch { activeListings(searchInput: { filters: { marketplaces: [EBAY_US] } pagination: { maxPageSize: 20 } }) { ... on SellerListings { listings { listingId listing { sellerProduct { title } } } pagination { nextCursor totalElements } } ... on SellerListingSearchInvalidInput { errorCode errorMessage } } scheduledListings { ... on SellerListings { listings { listingId } } } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: sellerListingSearch — scope: sell.listing
# sellerListingSearch はルートに入力なし
# GetSellerEvents 代替: filters.modifiedAtRange を使う
import requests

query = """query {
  sellerListingSearch {
    activeListings(searchInput: {
      filters: {
        marketplaces: [EBAY_US]
        # GetSellerEvents 代替:
        # modifiedAtRange: { startAt: "2025-01-01T00:00:00Z" endAt: "2025-01-31T23:59:59Z" }
      }
      pagination: { maxPageSize: 20 }
    }) {
      ... on SellerListings {
        listings { listingId listing { sellerProduct { title } } }
        pagination { nextCursor totalElements }
      }
      ... on SellerListingSearchInvalidInput { errorCode errorMessage }
    }
    scheduledListings {
      ... on SellerListings { listings { listingId } }
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

// ─── GetAllBidders → itemBiddingActivity ─────────────────────────────────────
// Old: Trading API GetAllBidders
//   Required: ItemID (オークションリスティングの ItemID)
//   Returns: 入札者一覧 (UserID, 入札額等)
// New: GraphQL itemBiddingActivity
//   Required: itemId: ID!
//   Returns: AuctionData { activeBidHistoryRecords / cancelledBidHistoryRecords / bidStatistics }
//   scope: sell.auction.read

export const itemBiddingActivity: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetAllBidders (オークション入札者一覧)
// Required: ItemID
// 主な用途: セカンドチャンスオファー送付先の入札者リストを取得
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetAllBiddersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetAllBiddersRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetAllBidders`,

    ruby: `# Trading API: GetAllBidders (オークション入札者一覧)
# Required: ItemID / 主な用途: セカンドチャンスオファーの送付先取得
body = <<~XML
  <GetAllBiddersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ItemID>123456789</ItemID>
  </GetAllBiddersRequest>
XML
# X-EBAY-API-CALL-NAME: GetAllBidders`,

    java: `// Trading API: GetAllBidders (オークション入札者一覧)
String body = """
    <GetAllBiddersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ItemID>123456789</ItemID>
    </GetAllBiddersRequest>""";
// X-EBAY-API-CALL-NAME: GetAllBidders`,

    nodejs: `// Trading API: GetAllBidders (オークション入札者一覧)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetAllBidders', 'Content-Type': 'text/xml' },
  body: \`<GetAllBiddersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetAllBiddersRequest>\`,
});`,

    go: `// Trading API: GetAllBidders (オークション入札者一覧)
body := \`<GetAllBiddersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetAllBiddersRequest>\`
// X-EBAY-API-CALL-NAME: GetAllBidders`,

    python: `# Trading API: GetAllBidders (オークション入札者一覧)
# Required: ItemID / 主な用途: セカンドチャンスオファーの送付先取得
import requests
body = """<GetAllBiddersRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetAllBiddersRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetAllBidders', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: itemBiddingActivity (出品単位の入札履歴)
// Required: itemId
// Returns: AuctionData { activeBidHistoryRecords / cancelledBidHistoryRecords / bidStatistics }
// scope: sell.auction.read
$query = <<<'GQL'
query {
  itemBiddingActivity(input: { itemId: "ITEM-ID-123456789" }) {
    itemBiddingActivity {
      bidStatistics { userSubmittedBidCount }
      bidderAuctionDetails {
        leadingBid { bidder { username } }
      }
      activeBidHistoryRecords(paginationInput: { maxPageSize: 20 }) {
        bidHistoryRecords {
          bidder { username }
          bidAmount { original { value currency } }
          bidAt
        }
        pagination { nextCursor }
      }
    }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: sell.auction.read`,

    ruby: `# GraphQL: itemBiddingActivity — scope: sell.auction.read
query = <<~GQL
  query {
    itemBiddingActivity(input: { itemId: "ITEM-ID-123456789" }) {
      itemBiddingActivity {
        bidStatistics { userSubmittedBidCount }
        activeBidHistoryRecords(paginationInput: { maxPageSize: 20 }) {
          bidHistoryRecords {
            bidder { username }
            bidAmount { original { value currency } }
            bidAt
          }
          pagination { nextCursor }
        }
      }
    }
  }
GQL
# POST https://graphqlapi.ebay.com/graphql`,

    java: `// GraphQL: itemBiddingActivity — scope: sell.auction.read
String query = """
    query {
      itemBiddingActivity(input: { itemId: \\"ITEM-ID-123456789\\" }) {
        itemBiddingActivity {
          bidStatistics { userSubmittedBidCount }
          activeBidHistoryRecords(paginationInput: { maxPageSize: 20 }) {
            bidHistoryRecords {
              bidder { username }
              bidAmount { original { value currency } }
              bidAt
            }
            pagination { nextCursor }
          }
        }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: itemBiddingActivity — scope: sell.auction.read
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`query {
    itemBiddingActivity(input: { itemId: "ITEM-ID-123456789" }) {
      itemBiddingActivity {
        bidStatistics { userSubmittedBidCount }
        activeBidHistoryRecords(paginationInput: { maxPageSize: 20 }) {
          bidHistoryRecords {
            bidder { username }
            bidAmount { original { value currency } }
            bidAt
          }
          pagination { nextCursor }
        }
      }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL: itemBiddingActivity — scope: sell.auction.read
body := \`{"query":"query { itemBiddingActivity(input: { itemId: \\"ITEM-ID-123456789\\" }) { itemBiddingActivity { bidStatistics { userSubmittedBidCount } activeBidHistoryRecords(paginationInput: { maxPageSize: 20 }) { bidHistoryRecords { bidder { username } bidAmount { original { value currency } } bidAt } pagination { nextCursor } } } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: itemBiddingActivity — scope: sell.auction.read
import requests

query = """query {
  itemBiddingActivity(input: { itemId: "ITEM-ID-123456789" }) {
    itemBiddingActivity {
      bidStatistics { userSubmittedBidCount }
      bidderAuctionDetails {
        leadingBid { bidder { username } }
      }
      activeBidHistoryRecords(paginationInput: { maxPageSize: 20 }) {
        bidHistoryRecords {
          bidder { username }
          bidAmount { original { value currency } }
          bidAt
        }
        pagination { nextCursor }
      }
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

// ─── GetBidderList → userBiddingActivity ─────────────────────────────────────
// Old: Trading API GetBidderList (特定ユーザーが入札したオークション一覧)
// New: GraphQL userBiddingActivity
//   input: { filter: { activeAfter, activeBefore, paginationInput: { maxPageSize } } }
//   Returns: UserBiddingActivityOutput { auctions: [Item!]!, paginationOutput: Pagination! }
//   scope: buy.auction.read (買い手側スコープ)

export const userBiddingActivity: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetBidderList (特定ユーザーが入札したオークション一覧)
// UserID 省略で呼び出しユーザー自身
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetBidderListRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ActiveItemsOnly>true</ActiveItemsOnly>
  <EndTimeFrom>2025-01-01T00:00:00Z</EndTimeFrom>
  <EndTimeTo>2025-03-31T23:59:59Z</EndTimeTo>
</GetBidderListRequest>';
// X-EBAY-API-CALL-NAME: GetBidderList`,

    ruby: `# Trading API: GetBidderList (特定ユーザーが入札したオークション一覧)
body = <<~XML
  <GetBidderListRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ActiveItemsOnly>true</ActiveItemsOnly>
    <EndTimeFrom>2025-01-01T00:00:00Z</EndTimeFrom>
    <EndTimeTo>2025-03-31T23:59:59Z</EndTimeTo>
  </GetBidderListRequest>
XML
# X-EBAY-API-CALL-NAME: GetBidderList`,

    java: `// Trading API: GetBidderList
String body = """
    <GetBidderListRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ActiveItemsOnly>true</ActiveItemsOnly>
      <EndTimeFrom>2025-01-01T00:00:00Z</EndTimeFrom>
      <EndTimeTo>2025-03-31T23:59:59Z</EndTimeTo>
    </GetBidderListRequest>""";
// X-EBAY-API-CALL-NAME: GetBidderList`,

    nodejs: `// Trading API: GetBidderList
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetBidderList', 'Content-Type': 'text/xml' },
  body: \`<GetBidderListRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ActiveItemsOnly>true</ActiveItemsOnly>
  <EndTimeFrom>2025-01-01T00:00:00Z</EndTimeFrom>
  <EndTimeTo>2025-03-31T23:59:59Z</EndTimeTo>
</GetBidderListRequest>\`,
});`,

    go: `// Trading API: GetBidderList
body := \`<GetBidderListRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ActiveItemsOnly>true</ActiveItemsOnly>
  <EndTimeFrom>2025-01-01T00:00:00Z</EndTimeFrom>
  <EndTimeTo>2025-03-31T23:59:59Z</EndTimeTo>
</GetBidderListRequest>\`
// X-EBAY-API-CALL-NAME: GetBidderList`,

    python: `# Trading API: GetBidderList (特定ユーザーが入札したオークション一覧)
import requests
body = """<GetBidderListRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ActiveItemsOnly>true</ActiveItemsOnly>
  <EndTimeFrom>2025-01-01T00:00:00Z</EndTimeFrom>
  <EndTimeTo>2025-03-31T23:59:59Z</EndTimeTo>
</GetBidderListRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetBidderList', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: userBiddingActivity (認証ユーザーが入札したオークション一覧)
// scope: buy.auction.read
// filter.activeAfter / activeBefore で期間絞り込み可能
$query = <<<'GQL'
query {
  userBiddingActivity(input: {
    filter: {
      activeAfter: "2025-01-01T00:00:00Z"
      activeBefore: "2025-03-31T23:59:59Z"
      paginationInput: { maxPageSize: 20 }
    }
  }) {
    auctions {
      itemId
      itemTerms { pricingTerms { auctionPrice { startingBidPrice { original { value currency } } } } }
    }
    paginationOutput { nextCursor }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: buy.auction.read`,

    ruby: `# GraphQL: userBiddingActivity — scope: buy.auction.read
query = <<~GQL
  query {
    userBiddingActivity(input: {
      filter: {
        activeAfter: "2025-01-01T00:00:00Z"
        activeBefore: "2025-03-31T23:59:59Z"
        paginationInput: { maxPageSize: 20 }
      }
    }) {
      auctions { itemId }
      paginationOutput { nextCursor }
    }
  }
GQL
# POST https://graphqlapi.ebay.com/graphql`,

    java: `// GraphQL: userBiddingActivity — scope: buy.auction.read
String query = """
    query {
      userBiddingActivity(input: {
        filter: {
          activeAfter: \\"2025-01-01T00:00:00Z\\"
          activeBefore: \\"2025-03-31T23:59:59Z\\"
          paginationInput: { maxPageSize: 20 }
        }
      }) {
        auctions { itemId }
        paginationOutput { nextCursor }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: userBiddingActivity — scope: buy.auction.read
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: \`query {
    userBiddingActivity(input: {
      filter: {
        activeAfter: "2025-01-01T00:00:00Z"
        activeBefore: "2025-03-31T23:59:59Z"
        paginationInput: { maxPageSize: 20 }
      }
    }) {
      auctions { itemId }
      paginationOutput { nextCursor }
    }
  }\` }),
}).then(r => r.json());`,

    go: `// GraphQL: userBiddingActivity — scope: buy.auction.read
body := \`{"query":"query { userBiddingActivity(input: { filter: { activeAfter: \\"2025-01-01T00:00:00Z\\" activeBefore: \\"2025-03-31T23:59:59Z\\" paginationInput: { maxPageSize: 20 } } }) { auctions { itemId } paginationOutput { nextCursor } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")`,

    python: `# GraphQL: userBiddingActivity — scope: buy.auction.read
import requests

query = """query {
  userBiddingActivity(input: {
    filter: {
      activeAfter: "2025-01-01T00:00:00Z"
      activeBefore: "2025-03-31T23:59:59Z"
      paginationInput: { maxPageSize: 20 }
    }
  }) {
    auctions { itemId }
    paginationOutput { nextCursor }
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

// ─── UploadSiteHostedPictures → Media API createImageFromFile/Url ─────────────
// Old: Trading API UploadSiteHostedPictures
//   Binary: multipart/form-data with PictureData (base64)
//   URL:    ExternalPictureURL フィールドに HTTPS URL を指定
//   Returns: SiteHostedPictureDetails.FullURL (EPS URL)
// New: Commerce Media REST API  v1_beta
//   POST /commerce/media/v1_beta/image/create_image_from_file  (multipart/form-data)
//   POST /commerce/media/v1_beta/image/create_image_from_url   (JSON: { imageUrl })
//   Returns: Location header に image_id を含む URL
//   Rate limit: 50 req/5s
//   注意: 画像は 30 日未使用で自動削除 (リスティングに紐付けると期間延長)

export const uploadImage: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: UploadSiteHostedPictures (URL から EPS にアップロード)
// ExternalPictureURL: HTTPS URL のみ対応 / 1回につき1枚
// Returns: SiteHostedPictureDetails.FullURL に EPS URL
$body = '<?xml version="1.0" encoding="utf-8"?>
<UploadSiteHostedPicturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ExternalPictureURL>https://example.com/product-image.jpg</ExternalPictureURL>
  <PictureName>Product Image</PictureName>
  <PictureSet>Standard</PictureSet>
</UploadSiteHostedPicturesRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: UploadSiteHostedPictures`,

    ruby: `# Trading API: UploadSiteHostedPictures (URL から EPS にアップロード)
# ExternalPictureURL: HTTPS URL のみ / 1回1枚
# Returns: FullURL に EPS URL
body = <<~XML
  <UploadSiteHostedPicturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ExternalPictureURL>https://example.com/product-image.jpg</ExternalPictureURL>
    <PictureName>Product Image</PictureName>
    <PictureSet>Standard</PictureSet>
  </UploadSiteHostedPicturesRequest>
XML
# X-EBAY-API-CALL-NAME: UploadSiteHostedPictures`,

    java: `// Trading API: UploadSiteHostedPictures (URL から EPS)
// ExternalPictureURL: HTTPS のみ / 1回1枚
String body = """
    <UploadSiteHostedPicturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ExternalPictureURL>https://example.com/product-image.jpg</ExternalPictureURL>
      <PictureName>Product Image</PictureName>
      <PictureSet>Standard</PictureSet>
    </UploadSiteHostedPicturesRequest>""";
// X-EBAY-API-CALL-NAME: UploadSiteHostedPictures`,

    nodejs: `// Trading API: UploadSiteHostedPictures (URL から EPS)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'UploadSiteHostedPictures', 'Content-Type': 'text/xml' },
  body: \`<UploadSiteHostedPicturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ExternalPictureURL>https://example.com/product-image.jpg</ExternalPictureURL>
  <PictureSet>Standard</PictureSet>
</UploadSiteHostedPicturesRequest>\`,
});`,

    go: `// Trading API: UploadSiteHostedPictures (URL から EPS)
body := \`<UploadSiteHostedPicturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ExternalPictureURL>https://example.com/product-image.jpg</ExternalPictureURL>
  <PictureSet>Standard</PictureSet>
</UploadSiteHostedPicturesRequest>\`
// X-EBAY-API-CALL-NAME: UploadSiteHostedPictures`,

    python: `# Trading API: UploadSiteHostedPictures (URL から EPS にアップロード)
# ExternalPictureURL: HTTPS URL のみ対応 / 1回につき1枚
import requests
body = """<UploadSiteHostedPicturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ExternalPictureURL>https://example.com/product-image.jpg</ExternalPictureURL>
  <PictureName>Product Image</PictureName>
  <PictureSet>Standard</PictureSet>
</UploadSiteHostedPicturesRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'UploadSiteHostedPictures', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Commerce Media REST API: createImageFromUrl / createImageFromFile
// ベース URL: https://apim.ebay.com/commerce/media/v1_beta
// Rate limit: 50 req/5s
// 注意: Location ヘッダーに返る image_id を保存すること
// 未使用画像は 30 日後に自動削除

// --- URL から EPS にアップロード (推奨) ---
$ch = curl_init('https://apim.ebay.com/commerce/media/v1_beta/image/create_image_from_url');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,  // Location ヘッダーを取得するため
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode(['imageUrl' => 'https://example.com/product-image.jpg']),
]);
$response = curl_exec($ch);
// Location: https://apim.ebay.com/commerce/media/v1_beta/image/{image_id}
preg_match('/Location: ([^\r\n]+)/', $response, $m);
$imageId = basename(trim($m[1]));  // image_id を抽出
curl_close($ch);

// --- ファイルから EPS にアップロード (multipart/form-data) ---
$ch2 = curl_init('https://apim.ebay.com/commerce/media/v1_beta/image/create_image_from_file');
curl_setopt_array($ch2, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_HEADER => true,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer YOUR_ACCESS_TOKEN'],
    CURLOPT_POSTFIELDS => ['image' => new CURLFile('/path/to/product-image.jpg', 'image/jpeg')],
]);
curl_exec($ch2); curl_close($ch2);`,

    ruby: `# Commerce Media REST API: createImageFromUrl / createImageFromFile
# Rate limit: 50 req/5s / 未使用画像は 30 日後に自動削除
require 'net/http'; require 'json'

# URL から EPS にアップロード
uri = URI('https://apim.ebay.com/commerce/media/v1_beta/image/create_image_from_url')
req = Net::HTTP::Post.new(uri)
req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
req['Content-Type']  = 'application/json'
req.body = { imageUrl: 'https://example.com/product-image.jpg' }.to_json

res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
# Location ヘッダーから image_id を抽出
image_id = res['Location']&.split('/')&.last
puts "image_id: #{image_id}"`,

    java: `// Commerce Media REST API: createImageFromUrl — Rate limit: 50 req/5s
// 未使用画像は 30 日後に自動削除 / Location ヘッダーから image_id を保存
String body = """{"imageUrl":"https://example.com/product-image.jpg"}""";
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://apim.ebay.com/commerce/media/v1_beta/image/create_image_from_url"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();
HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
// Location ヘッダーから image_id を取得
String imageId = res.headers().firstValue("Location")
    .map(loc -> loc.substring(loc.lastIndexOf('/') + 1))
    .orElseThrow();`,

    nodejs: `// Commerce Media REST API: createImageFromUrl / createImageFromFile
// Rate limit: 50 req/5s / 未使用画像は 30 日後に自動削除
// URL から EPS にアップロード
const res = await fetch(
  'https://apim.ebay.com/commerce/media/v1_beta/image/create_image_from_url',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl: 'https://example.com/product-image.jpg' }),
  }
);
// Location ヘッダーから image_id を抽出 (201 Created)
const imageId = res.headers.get('Location')?.split('/').pop();

// ファイルから EPS にアップロード (multipart/form-data)
const form = new FormData();
form.append('image', imageFile, 'product.jpg');
const res2 = await fetch(
  'https://apim.ebay.com/commerce/media/v1_beta/image/create_image_from_file',
  { method: 'POST', headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN' }, body: form }
);
const fileImageId = res2.headers.get('Location')?.split('/').pop();`,

    go: `// Commerce Media REST API: createImageFromUrl
// Rate limit: 50 req/5s / 未使用画像は 30 日後に自動削除
body := \`{"imageUrl":"https://example.com/product-image.jpg"}\`
req, _ := http.NewRequest("POST",
    "https://apim.ebay.com/commerce/media/v1_beta/image/create_image_from_url",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
// Location ヘッダーから image_id を抽出
loc := resp.Header.Get("Location")
imageId := loc[strings.LastIndex(loc, "/")+1:]`,

    python: `# Commerce Media REST API: createImageFromUrl / createImageFromFile
# Rate limit: 50 req/5s / 未使用画像は 30 日後に自動削除
import requests

# URL から EPS にアップロード
res = requests.post(
    'https://apim.ebay.com/commerce/media/v1_beta/image/create_image_from_url',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={'imageUrl': 'https://example.com/product-image.jpg'},
)
# Location ヘッダーから image_id を抽出 (201 Created)
image_id = res.headers.get('Location', '').rsplit('/', 1)[-1]

# ファイルから EPS にアップロード (multipart/form-data)
with open('/path/to/product-image.jpg', 'rb') as f:
    res2 = requests.post(
        'https://apim.ebay.com/commerce/media/v1_beta/image/create_image_from_file',
        headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN'},
        files={'image': ('product.jpg', f, 'image/jpeg')},
    )
file_image_id = res2.headers.get('Location', '').rsplit('/', 1)[-1]`,
  } as Record<Lang, string>,
};

// ─── GetItemTransactions (paid, by listing) → orders with listingId filter ───
// Old: Trading API GetItemTransactions (ItemID で注文明細を取得)
// New: orders.sellerOrders の filter.listingId を使う
// OrdersFilterInput { listingId: ID, includeConfirmed: true } で絞り込み

export const getItemTransactionsByListing: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetItemTransactions (特定リスティングの注文明細取得)
// Required: ItemID / Optional: TransactionID で特定取引に絞り込み
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetItemTransactionsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetItemTransactionsRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetItemTransactions`,
    ruby: `# Trading API: GetItemTransactions
body = <<~XML
  <GetItemTransactionsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ItemID>123456789</ItemID>
  </GetItemTransactionsRequest>
XML
# X-EBAY-API-CALL-NAME: GetItemTransactions`,
    java: `// Trading API: GetItemTransactions
String body = """
    <GetItemTransactionsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ItemID>123456789</ItemID>
    </GetItemTransactionsRequest>""";`,
    nodejs: `// Trading API: GetItemTransactions
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetItemTransactions', 'Content-Type': 'text/xml' },
  body: \`<GetItemTransactionsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetItemTransactionsRequest>\`,
});`,
    go: `// Trading API: GetItemTransactions
body := \`<GetItemTransactionsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetItemTransactionsRequest>\`
// X-EBAY-API-CALL-NAME: GetItemTransactions`,
    python: `# Trading API: GetItemTransactions
import requests
body = """<GetItemTransactionsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetItemTransactionsRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetItemTransactions', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: sellerOrders に listingId フィルター (GetItemTransactions paid の代替)
// OrdersFilterInput.listingId で特定リスティングの注文に絞り込む
$query = <<<'GQL'
query {
  orders {
    sellerOrders(input: {
      ordersFirstPage: {
        maxPageSize: 20
        filter: {
          dateRange: {
            dateTimeRange: { startDateTime: "2025-01-01T00:00:00Z" endDateTime: "2025-03-31T23:59:59Z" }
            dateType: CONFIRMED
          }
          filter: { listingId: "LISTING-ID-123456789" includeConfirmed: true }
          sort: { sortField: CONFIRMED_AT sortOrder: DESC }
        }
      }
    }) {
      orders {
        orderId
        orderLineItems {
          orderLineItemId
          lineItemTotals { lineItemTotal { original { value currency } } }
        }
      }
      pagination { nextCursor }
    }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: sell.order.read`,
    ruby: `# GraphQL: sellerOrders に listingId フィルター (GetItemTransactions paid の代替)
query = <<~GQL
  query {
    orders {
      sellerOrders(input: {
        ordersFirstPage: {
          maxPageSize: 20
          filter: {
            dateRange: { dateTimeRange: { startDateTime: "2025-01-01T00:00:00Z" endDateTime: "2025-03-31T23:59:59Z" } dateType: CONFIRMED }
            filter: { listingId: "LISTING-ID-123456789" includeConfirmed: true }
            sort: { sortField: CONFIRMED_AT sortOrder: DESC }
          }
        }
      }) {
        orders { orderId orderLineItems { orderLineItemId } }
        pagination { nextCursor }
      }
    }
  }
GQL
# POST https://graphqlapi.ebay.com/graphql`,
    java: `// GraphQL: sellerOrders に listingId フィルター — scope: sell.order.read
String query = """
    query {
      orders {
        sellerOrders(input: {
          ordersFirstPage: {
            maxPageSize: 20
            filter: {
              dateRange: { dateTimeRange: { startDateTime: \\"2025-01-01T00:00:00Z\\" endDateTime: \\"2025-03-31T23:59:59Z\\" } dateType: CONFIRMED }
              filter: { listingId: \\"LISTING-ID-123456789\\" includeConfirmed: true }
              sort: { sortField: CONFIRMED_AT sortOrder: DESC }
            }
          }
        }) {
          orders { orderId orderLineItems { orderLineItemId } }
          pagination { nextCursor }
        }
      }
    }""";`,
    nodejs: `// GraphQL: sellerOrders に listingId フィルター — scope: sell.order.read
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: \`query {
    orders {
      sellerOrders(input: {
        ordersFirstPage: {
          maxPageSize: 20
          filter: {
            dateRange: { dateTimeRange: { startDateTime: "2025-01-01T00:00:00Z" endDateTime: "2025-03-31T23:59:59Z" } dateType: CONFIRMED }
            filter: { listingId: "LISTING-ID-123456789" includeConfirmed: true }
            sort: { sortField: CONFIRMED_AT sortOrder: DESC }
          }
        }
      }) {
        orders { orderId orderLineItems { orderLineItemId lineItemTotals { lineItemTotal { original { value currency } } } } }
        pagination { nextCursor }
      }
    }
  }\` }),
}).then(r => r.json());`,
    go: `// GraphQL: sellerOrders に listingId フィルター — scope: sell.order.read
body := \`{"query":"query { orders { sellerOrders(input: { ordersFirstPage: { maxPageSize: 20 filter: { dateRange: { dateTimeRange: { startDateTime: \\"2025-01-01T00:00:00Z\\" endDateTime: \\"2025-03-31T23:59:59Z\\" } dateType: CONFIRMED } filter: { listingId: \\"LISTING-ID-123456789\\" includeConfirmed: true } sort: { sortField: CONFIRMED_AT sortOrder: DESC } } } }) { orders { orderId orderLineItems { orderLineItemId } } pagination { nextCursor } } } }"}\`
req, _ := http.NewRequest("POST", "https://graphqlapi.ebay.com/graphql", strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")`,
    python: `# GraphQL: sellerOrders に listingId フィルター — scope: sell.order.read
import requests
query = """query {
  orders {
    sellerOrders(input: {
      ordersFirstPage: {
        maxPageSize: 20
        filter: {
          dateRange: { dateTimeRange: { startDateTime: "2025-01-01T00:00:00Z" endDateTime: "2025-03-31T23:59:59Z" } dateType: CONFIRMED }
          filter: { listingId: "LISTING-ID-123456789" includeConfirmed: true }
          sort: { sortField: CONFIRMED_AT sortOrder: DESC }
        }
      }
    }) {
      orders { orderId orderLineItems { orderLineItemId } }
      pagination { nextCursor }
    }
  }
}"""
res = requests.post('https://graphqlapi.ebay.com/graphql',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={'query': query})`,
  } as Record<Lang, string>,
};

// ─── GetItemTransactions (line items) → orderLineItemsByIds ───────────────────
// Old: Trading API GetItemTransactions (ItemID + TransactionID で特定取引)
// New: orderLineItemsByIds(input: { lineItemIds: [ID!]! }) — 最大100件

export const getOrderLineItemsByIds: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetItemTransactions (ItemID + TransactionID で特定取引)
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetItemTransactionsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <TransactionID>987654321</TransactionID>
</GetItemTransactionsRequest>';
// X-EBAY-API-CALL-NAME: GetItemTransactions`,
    ruby: `# Trading API: GetItemTransactions (ItemID + TransactionID で特定取引)
body = <<~XML
  <GetItemTransactionsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ItemID>123456789</ItemID>
    <TransactionID>987654321</TransactionID>
  </GetItemTransactionsRequest>
XML`,
    java: `// Trading API: GetItemTransactions (ItemID + TransactionID)
String body = """
    <GetItemTransactionsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ItemID>123456789</ItemID>
      <TransactionID>987654321</TransactionID>
    </GetItemTransactionsRequest>""";`,
    nodejs: `// Trading API: GetItemTransactions (ItemID + TransactionID)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetItemTransactions', 'Content-Type': 'text/xml' },
  body: \`<GetItemTransactionsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <TransactionID>987654321</TransactionID>
</GetItemTransactionsRequest>\`,
});`,
    go: `// Trading API: GetItemTransactions (ItemID + TransactionID)
body := \`<GetItemTransactionsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <TransactionID>987654321</TransactionID>
</GetItemTransactionsRequest>\``,
    python: `# Trading API: GetItemTransactions (ItemID + TransactionID)
body = """<GetItemTransactionsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <TransactionID>987654321</TransactionID>
</GetItemTransactionsRequest>"""`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: orderLineItemsByIds — 最大100件
// lineItemIds は orderLineItems[].orderLineItemId
$query = <<<'GQL'
query {
  orderLineItemsByIds(input: { lineItemIds: ["LINE-ITEM-ID-1", "LINE-ITEM-ID-2"] }) {
    ... on OrderLineItemsByIdsSuccess {
      lineItems {
        orderLineItemId
        lineItemTotals { lineItemTotal { original { value currency } } }
        lineItem { ... on ContractListingItem { item { itemId } quantity } }
      }
    }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: sell.order.read`,
    ruby: `# GraphQL: orderLineItemsByIds — 最大100件
# scope: sell.order.read
query = <<~GQL
  query {
    orderLineItemsByIds(input: { lineItemIds: ["LINE-ITEM-ID-1", "LINE-ITEM-ID-2"] }) {
      ... on OrderLineItemsByIdsSuccess {
        lineItems {
          orderLineItemId
          lineItemTotals { lineItemTotal { original { value currency } } }
        }
      }
    }
  }
GQL`,
    java: `// GraphQL: orderLineItemsByIds — 最大100件 — scope: sell.order.read
String query = """
    query {
      orderLineItemsByIds(input: { lineItemIds: [\\"LINE-ITEM-ID-1\\", \\"LINE-ITEM-ID-2\\"] }) {
        ... on OrderLineItemsByIdsSuccess {
          lineItems {
            orderLineItemId
            lineItemTotals { lineItemTotal { original { value currency } } }
          }
        }
      }
    }""";`,
    nodejs: `// GraphQL: orderLineItemsByIds — 最大100件 — scope: sell.order.read
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: \`query {
    orderLineItemsByIds(input: { lineItemIds: ["LINE-ITEM-ID-1", "LINE-ITEM-ID-2"] }) {
      ... on OrderLineItemsByIdsSuccess {
        lineItems { orderLineItemId lineItemTotals { lineItemTotal { original { value currency } } } }
      }
    }
  }\` }),
}).then(r => r.json());`,
    go: `// GraphQL: orderLineItemsByIds — 最大100件 — scope: sell.order.read
body := \`{"query":"query { orderLineItemsByIds(input: { lineItemIds: [\\"LINE-ITEM-ID-1\\", \\"LINE-ITEM-ID-2\\"] }) { ... on OrderLineItemsByIdsSuccess { lineItems { orderLineItemId lineItemTotals { lineItemTotal { original { value currency } } } } } } }"}\`
req, _ := http.NewRequest("POST", "https://graphqlapi.ebay.com/graphql", strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")`,
    python: `# GraphQL: orderLineItemsByIds — 最大100件 — scope: sell.order.read
import requests
query = """query {
  orderLineItemsByIds(input: { lineItemIds: ["LINE-ITEM-ID-1", "LINE-ITEM-ID-2"] }) {
    ... on OrderLineItemsByIdsSuccess {
      lineItems {
        orderLineItemId
        lineItemTotals { lineItemTotal { original { value currency } } }
      }
    }
  }
}"""
res = requests.post('https://graphqlapi.ebay.com/graphql',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={'query': query})`,
  } as Record<Lang, string>,
};

// ─── CompleteSale (mark paid) → markOrdersPaid / markItemCommitmentsPaid ──────
// Old: Trading API CompleteSale with Paid: true
// New: markOrdersPaid({ orderIds: [ID!]! }) / markItemCommitmentsPaid({ itemCommitmentIds: [ID!]! })
// markOrdersPaid scope: sell.order / markItemCommitmentsPaid scope: sell.commitment

export const markOrdersPaid: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: CompleteSale — オフライン支払い済みとしてマーク
// Paid: true で支払済み / OrderLineItemID か ItemID+TransactionID で指定
$body = '<?xml version="1.0" encoding="utf-8"?>
<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <Paid>true</Paid>
</CompleteSaleRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: CompleteSale`,
    ruby: `# Trading API: CompleteSale — Paid: true でオフライン支払い済みマーク
body = <<~XML
  <CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <OrderLineItemID>123456789-987654321</OrderLineItemID>
    <Paid>true</Paid>
  </CompleteSaleRequest>
XML`,
    java: `// Trading API: CompleteSale — Paid: true でオフライン支払い済みマーク
String body = """
    <CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <OrderLineItemID>123456789-987654321</OrderLineItemID>
      <Paid>true</Paid>
    </CompleteSaleRequest>""";`,
    nodejs: `// Trading API: CompleteSale — Paid: true でオフライン支払い済みマーク
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'CompleteSale', 'Content-Type': 'text/xml' },
  body: \`<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <Paid>true</Paid>
</CompleteSaleRequest>\`,
});`,
    go: `// Trading API: CompleteSale — Paid: true でオフライン支払い済みマーク
body := \`<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <Paid>true</Paid>
</CompleteSaleRequest>\``,
    python: `# Trading API: CompleteSale — Paid: true でオフライン支払い済みマーク
body = """<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <Paid>true</Paid>
</CompleteSaleRequest>"""`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: markOrdersPaid — 注文をオフライン支払い済みとしてマーク
// scope: sell.order / 複数注文を一括で処理可能
$query = <<<'GQL'
mutation {
  markOrdersPaid(input: { orderIds: ["ORDER-ID-1", "ORDER-ID-2"] }) {
    ... on MarkOrdersPaidSuccess {
      markPaidOrders { orderId }
    }
    ... on MarkOrdersPaidPartialFailure {
      errorCode errorMessage
    }
    ... on MarkOrdersPaidCompleteFailure {
      errorCode errorMessage
    }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: sell.order`,
    ruby: `# GraphQL: markOrdersPaid — scope: sell.order
query = <<~GQL
  mutation {
    markOrdersPaid(input: { orderIds: ["ORDER-ID-1", "ORDER-ID-2"] }) {
      ... on MarkOrdersPaidSuccess { markPaidOrders { orderId } }
      ... on MarkOrdersPaidPartialFailure { errorCode errorMessage }
      ... on MarkOrdersPaidCompleteFailure { errorCode errorMessage }
    }
  }
GQL`,
    java: `// GraphQL: markOrdersPaid — scope: sell.order
String query = """
    mutation {
      markOrdersPaid(input: { orderIds: [\\"ORDER-ID-1\\", \\"ORDER-ID-2\\"] }) {
        ... on MarkOrdersPaidSuccess { markPaidOrders { orderId } }
        ... on MarkOrdersPaidPartialFailure { errorCode errorMessage }
        ... on MarkOrdersPaidCompleteFailure { errorCode errorMessage }
      }
    }""";`,
    nodejs: `// GraphQL: markOrdersPaid — scope: sell.order
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: \`mutation {
    markOrdersPaid(input: { orderIds: ["ORDER-ID-1", "ORDER-ID-2"] }) {
      ... on MarkOrdersPaidSuccess { markPaidOrders { orderId } }
      ... on MarkOrdersPaidPartialFailure { errorCode errorMessage }
      ... on MarkOrdersPaidCompleteFailure { errorCode errorMessage }
    }
  }\` }),
}).then(r => r.json());`,
    go: `// GraphQL: markOrdersPaid — scope: sell.order
body := \`{"query":"mutation { markOrdersPaid(input: { orderIds: [\\"ORDER-ID-1\\", \\"ORDER-ID-2\\"] }) { ... on MarkOrdersPaidSuccess { markPaidOrders { orderId } } ... on MarkOrdersPaidPartialFailure { errorCode errorMessage } ... on MarkOrdersPaidCompleteFailure { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST", "https://graphqlapi.ebay.com/graphql", strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")`,
    python: `# GraphQL: markOrdersPaid — scope: sell.order
import requests
query = """mutation {
  markOrdersPaid(input: { orderIds: ["ORDER-ID-1", "ORDER-ID-2"] }) {
    ... on MarkOrdersPaidSuccess { markPaidOrders { orderId } }
    ... on MarkOrdersPaidPartialFailure { errorCode errorMessage }
    ... on MarkOrdersPaidCompleteFailure { errorCode errorMessage }
  }
}"""
res = requests.post('https://graphqlapi.ebay.com/graphql',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={'query': query})`,
  } as Record<Lang, string>,
};

// markItemCommitmentsPaid は markOrdersPaid と同じ旧 API から派生
export const markItemCommitmentsPaid: ApiCallSnippet = {
  old: markOrdersPaid.old,
  new: {
    php: `<?php
// GraphQL: markItemCommitmentsPaid — 未払い Item Commitment を支払済みとしてマーク
// scope: sell.commitment
$query = <<<'GQL'
mutation {
  markItemCommitmentsPaid(input: {
    itemCommitmentIds: ["ITEM-COMMITMENT-ID-1", "ITEM-COMMITMENT-ID-2"]
  }) {
    ... on MarkItemCommitmentsPaidSuccess {
      itemCommitments { itemCommitmentId state }
    }
    ... on MarkItemCommitmentsPaidCompleteFailure { errorCode errorMessage }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: sell.commitment`,
    ruby: `# GraphQL: markItemCommitmentsPaid — scope: sell.commitment
query = <<~GQL
  mutation {
    markItemCommitmentsPaid(input: { itemCommitmentIds: ["IC-ID-1", "IC-ID-2"] }) {
      ... on MarkItemCommitmentsPaidSuccess { itemCommitments { itemCommitmentId state } }
      ... on MarkItemCommitmentsPaidCompleteFailure { errorCode errorMessage }
    }
  }
GQL`,
    java: `// GraphQL: markItemCommitmentsPaid — scope: sell.commitment
String query = """
    mutation {
      markItemCommitmentsPaid(input: { itemCommitmentIds: [\\"IC-ID-1\\", \\"IC-ID-2\\"] }) {
        ... on MarkItemCommitmentsPaidSuccess { itemCommitments { itemCommitmentId state } }
        ... on MarkItemCommitmentsPaidCompleteFailure { errorCode errorMessage }
      }
    }""";`,
    nodejs: `// GraphQL: markItemCommitmentsPaid — scope: sell.commitment
await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: \`mutation {
    markItemCommitmentsPaid(input: { itemCommitmentIds: ["IC-ID-1", "IC-ID-2"] }) {
      ... on MarkItemCommitmentsPaidSuccess { itemCommitments { itemCommitmentId state } }
      ... on MarkItemCommitmentsPaidCompleteFailure { errorCode errorMessage }
    }
  }\` }),
});`,
    go: `// GraphQL: markItemCommitmentsPaid — scope: sell.commitment
body := \`{"query":"mutation { markItemCommitmentsPaid(input: { itemCommitmentIds: [\\"IC-ID-1\\", \\"IC-ID-2\\"] }) { ... on MarkItemCommitmentsPaidSuccess { itemCommitments { itemCommitmentId state } } ... on MarkItemCommitmentsPaidCompleteFailure { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST", "https://graphqlapi.ebay.com/graphql", strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")`,
    python: `# GraphQL: markItemCommitmentsPaid — scope: sell.commitment
import requests
query = """mutation {
  markItemCommitmentsPaid(input: { itemCommitmentIds: ["IC-ID-1", "IC-ID-2"] }) {
    ... on MarkItemCommitmentsPaidSuccess { itemCommitments { itemCommitmentId state } }
    ... on MarkItemCommitmentsPaidCompleteFailure { errorCode errorMessage }
  }
}"""
requests.post('https://graphqlapi.ebay.com/graphql',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={'query': query})`,
  } as Record<Lang, string>,
};

// ─── AddOrder / SendInvoice → createPurchaseQuote ─────────────────────────────
// Old: Trading API AddOrder (複数の Item Commitment を統合) / SendInvoice (請求書送付)
//   AddOrder: TransactionArray に ItemID+TransactionID を 2〜40 件指定
//   SendInvoice: ItemID+TransactionID か OrderID で指定
// New: createPurchaseQuote
//   Required: lineItems: [{ itemCommitmentId }], logisticsOptions: { shipping: [{ cost, shippingServiceCode }] }
//   scope: sell.purchase.quote

export const createPurchaseQuote: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: AddOrder (複数 Item Commitment を統合) / SendInvoice (請求書送付)
// AddOrder: 2〜40件の ItemID/TransactionID ペアを TransactionArray で指定
$body = '<?xml version="1.0" encoding="utf-8"?>
<AddOrderRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Order>
    <TransactionArray>
      <Transaction>
        <Item><ItemID>111111111</ItemID></Item>
        <TransactionID>TRANSACTION-ID-1</TransactionID>
      </Transaction>
      <Transaction>
        <Item><ItemID>222222222</ItemID></Item>
        <TransactionID>TRANSACTION-ID-2</TransactionID>
      </Transaction>
    </TransactionArray>
  </Order>
</AddOrderRequest>';
// X-EBAY-API-CALL-NAME: AddOrder`,
    ruby: `# Trading API: AddOrder / SendInvoice
# AddOrder: 2〜40件の ItemID/TransactionID ペアを TransactionArray で指定
body = <<~XML
  <AddOrderRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <Order>
      <TransactionArray>
        <Transaction><Item><ItemID>111111111</ItemID></Item><TransactionID>TXN-1</TransactionID></Transaction>
        <Transaction><Item><ItemID>222222222</ItemID></Item><TransactionID>TXN-2</TransactionID></Transaction>
      </TransactionArray>
    </Order>
  </AddOrderRequest>
XML`,
    java: `// Trading API: AddOrder — 複数 Item Commitment を統合
String body = """
    <AddOrderRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <Order>
        <TransactionArray>
          <Transaction><Item><ItemID>111111111</ItemID></Item><TransactionID>TXN-1</TransactionID></Transaction>
          <Transaction><Item><ItemID>222222222</ItemID></Item><TransactionID>TXN-2</TransactionID></Transaction>
        </TransactionArray>
      </Order>
    </AddOrderRequest>""";`,
    nodejs: `// Trading API: AddOrder — 複数 Item Commitment を統合
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'AddOrder', 'Content-Type': 'text/xml' },
  body: \`<AddOrderRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Order>
    <TransactionArray>
      <Transaction><Item><ItemID>111111111</ItemID></Item><TransactionID>TXN-1</TransactionID></Transaction>
      <Transaction><Item><ItemID>222222222</ItemID></Item><TransactionID>TXN-2</TransactionID></Transaction>
    </TransactionArray>
  </Order>
</AddOrderRequest>\`,
});`,
    go: `// Trading API: AddOrder — 複数 Item Commitment を統合
body := \`<AddOrderRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Order>
    <TransactionArray>
      <Transaction><Item><ItemID>111111111</ItemID></Item><TransactionID>TXN-1</TransactionID></Transaction>
      <Transaction><Item><ItemID>222222222</ItemID></Item><TransactionID>TXN-2</TransactionID></Transaction>
    </TransactionArray>
  </Order>
</AddOrderRequest>\``,
    python: `# Trading API: AddOrder — 複数 Item Commitment を統合
# SendInvoice の場合: ItemID+TransactionID か OrderID で既存注文に請求書送付
body = """<AddOrderRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <Order>
    <TransactionArray>
      <Transaction><Item><ItemID>111111111</ItemID></Item><TransactionID>TXN-1</TransactionID></Transaction>
      <Transaction><Item><ItemID>222222222</ItemID></Item><TransactionID>TXN-2</TransactionID></Transaction>
    </TransactionArray>
  </Order>
</AddOrderRequest>"""`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: createPurchaseQuote (AddOrder / SendInvoice の代替)
// 複数の Item Commitment を統合して Purchase Quote (請求書) を作成
// Required: lineItems (itemCommitmentId 一覧), logisticsOptions
// scope: sell.purchase.quote
$query = <<<'GQL'
mutation {
  createPurchaseQuote(input: {
    lineItems: [
      { itemCommitmentId: "ITEM-COMMITMENT-ID-1" }
      { itemCommitmentId: "ITEM-COMMITMENT-ID-2" }
    ]
    logisticsOptions: {
      shipping: [{ cost: { value: "10.00", currency: USD } shippingServiceCode: "USPSPriority" }]
    }
    messageToBuyer: "Thank you for your purchase! Items will ship together."
    emailCopyToSeller: false
  }) {
    ... on CreatePurchaseQuoteSuccess {
      purchaseQuote { purchaseQuoteId state totals { total { original { value currency } } } }
    }
    ... on CreatePurchaseQuoteBusinessError { errorCode errorMessage }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: sell.purchase.quote`,
    ruby: `# GraphQL: createPurchaseQuote — scope: sell.purchase.quote
# AddOrder/SendInvoice の代替 — 複数 Item Commitment を統合
require 'net/http'; require 'json'
query = <<~GQL
  mutation {
    createPurchaseQuote(input: {
      lineItems: [
        { itemCommitmentId: "IC-ID-1" }
        { itemCommitmentId: "IC-ID-2" }
      ]
      logisticsOptions: {
        shipping: [{ cost: { value: "10.00", currency: USD } shippingServiceCode: "USPSPriority" }]
      }
      messageToBuyer: "Items will ship together."
    }) {
      ... on CreatePurchaseQuoteSuccess { purchaseQuote { purchaseQuoteId state } }
      ... on CreatePurchaseQuoteBusinessError { errorCode errorMessage }
    }
  }
GQL`,
    java: `// GraphQL: createPurchaseQuote — scope: sell.purchase.quote
// AddOrder/SendInvoice の代替
String query = """
    mutation {
      createPurchaseQuote(input: {
        lineItems: [
          { itemCommitmentId: \\"IC-ID-1\\" }
          { itemCommitmentId: \\"IC-ID-2\\" }
        ]
        logisticsOptions: {
          shipping: [{ cost: { value: \\"10.00\\", currency: USD } shippingServiceCode: \\"USPSPriority\\" }]
        }
        messageToBuyer: \\"Items will ship together.\\"
      }) {
        ... on CreatePurchaseQuoteSuccess { purchaseQuote { purchaseQuoteId state } }
        ... on CreatePurchaseQuoteBusinessError { errorCode errorMessage }
      }
    }""";`,
    nodejs: `// GraphQL: createPurchaseQuote — scope: sell.purchase.quote
// AddOrder/SendInvoice の代替
const { data } = await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: \`mutation {
    createPurchaseQuote(input: {
      lineItems: [{ itemCommitmentId: "IC-ID-1" } { itemCommitmentId: "IC-ID-2" }]
      logisticsOptions: {
        shipping: [{ cost: { value: "10.00", currency: USD } shippingServiceCode: "USPSPriority" }]
      }
      messageToBuyer: "Items will ship together."
    }) {
      ... on CreatePurchaseQuoteSuccess { purchaseQuote { purchaseQuoteId state } }
      ... on CreatePurchaseQuoteBusinessError { errorCode errorMessage }
    }
  }\` }),
}).then(r => r.json());`,
    go: `// GraphQL: createPurchaseQuote — scope: sell.purchase.quote
body := \`{"query":"mutation { createPurchaseQuote(input: { lineItems: [{ itemCommitmentId: \\"IC-ID-1\\" } { itemCommitmentId: \\"IC-ID-2\\" }] logisticsOptions: { shipping: [{ cost: { value: \\"10.00\\" currency: USD } shippingServiceCode: \\"USPSPriority\\" }] } messageToBuyer: \\"Items will ship together.\\" }) { ... on CreatePurchaseQuoteSuccess { purchaseQuote { purchaseQuoteId state } } ... on CreatePurchaseQuoteBusinessError { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST", "https://graphqlapi.ebay.com/graphql", strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")`,
    python: `# GraphQL: createPurchaseQuote — scope: sell.purchase.quote
# AddOrder/SendInvoice の代替 — 複数 Item Commitment を統合して請求書作成
import requests
query = """mutation {
  createPurchaseQuote(input: {
    lineItems: [
      { itemCommitmentId: "IC-ID-1" }
      { itemCommitmentId: "IC-ID-2" }
    ]
    logisticsOptions: {
      shipping: [{ cost: { value: "10.00", currency: USD } shippingServiceCode: "USPSPriority" }]
    }
    messageToBuyer: "Items will ship together."
    emailCopyToSeller: false
  }) {
    ... on CreatePurchaseQuoteSuccess {
      purchaseQuote { purchaseQuoteId state totals { total { original { value currency } } } }
    }
    ... on CreatePurchaseQuoteBusinessError { errorCode errorMessage }
  }
}"""
res = requests.post('https://graphqlapi.ebay.com/graphql',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={'query': query})`,
  } as Record<Lang, string>,
};

// ─── SendInvoice (update existing) → bulkUpdatePurchaseQuotes ─────────────────
// Old: Trading API SendInvoice (既存注文の請求書更新)
// New: bulkUpdatePurchaseQuotes — 複数の Purchase Quote を一括更新
// Required: updates: [{ purchaseQuoteId, ...変更フィールド }]
// scope: sell.purchase.quote

export const bulkUpdatePurchaseQuotes: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: SendInvoice (既存注文の請求書更新・再送)
// OrderID か ItemID+TransactionID で既存注文を指定
$body = '<?xml version="1.0" encoding="utf-8"?>
<SendInvoiceRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderID>ORDER-ID-123</OrderID>
</SendInvoiceRequest>';
// X-EBAY-API-CALL-NAME: SendInvoice`,
    ruby: `# Trading API: SendInvoice (既存注文の請求書更新・再送)
body = <<~XML
  <SendInvoiceRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <OrderID>ORDER-ID-123</OrderID>
  </SendInvoiceRequest>
XML`,
    java: `// Trading API: SendInvoice (既存注文の請求書更新)
String body = """
    <SendInvoiceRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <OrderID>ORDER-ID-123</OrderID>
    </SendInvoiceRequest>""";`,
    nodejs: `// Trading API: SendInvoice (既存注文の請求書更新)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'SendInvoice', 'Content-Type': 'text/xml' },
  body: \`<SendInvoiceRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderID>ORDER-ID-123</OrderID>
</SendInvoiceRequest>\`,
});`,
    go: `// Trading API: SendInvoice (既存注文の請求書更新)
body := \`<SendInvoiceRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderID>ORDER-ID-123</OrderID>
</SendInvoiceRequest>\``,
    python: `# Trading API: SendInvoice (既存注文の請求書更新・再送)
body = """<SendInvoiceRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderID>ORDER-ID-123</OrderID>
</SendInvoiceRequest>"""`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: bulkUpdatePurchaseQuotes (SendInvoice 更新の代替)
// updates: [{ purchaseQuoteId, 変更フィールド }] で複数 Quote を一括更新
// scope: sell.purchase.quote
$query = <<<'GQL'
mutation {
  bulkUpdatePurchaseQuotes(input: {
    updates: [{
      purchaseQuoteId: "PURCHASE-QUOTE-ID-123"
      messageToBuyer: "Updated: items will ship on Monday."
      logisticsOptions: {
        shipping: [{ cost: { value: "8.00", currency: USD } shippingServiceCode: "USPSFirst" }]
      }
    }]
  }) {
    ... on BulkUpdatePurchaseQuotesSuccess {
      purchaseQuotes { purchaseQuoteId state }
    }
    ... on BulkUpdatePurchaseQuotesPartialFailure {
      errorCode errorMessage
    }
    ... on BulkUpdatePurchaseQuotesCompleteFailure {
      errorCode errorMessage
    }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: sell.purchase.quote`,
    ruby: `# GraphQL: bulkUpdatePurchaseQuotes — scope: sell.purchase.quote
query = <<~GQL
  mutation {
    bulkUpdatePurchaseQuotes(input: {
      updates: [{
        purchaseQuoteId: "PQ-ID-123"
        messageToBuyer: "Updated: ships Monday."
        logisticsOptions: {
          shipping: [{ cost: { value: "8.00", currency: USD } shippingServiceCode: "USPSFirst" }]
        }
      }]
    }) {
      ... on BulkUpdatePurchaseQuotesSuccess { purchaseQuotes { purchaseQuoteId state } }
      ... on BulkUpdatePurchaseQuotesPartialFailure { errorCode errorMessage }
      ... on BulkUpdatePurchaseQuotesCompleteFailure { errorCode errorMessage }
    }
  }
GQL`,
    java: `// GraphQL: bulkUpdatePurchaseQuotes — scope: sell.purchase.quote
String query = """
    mutation {
      bulkUpdatePurchaseQuotes(input: {
        updates: [{
          purchaseQuoteId: \\"PQ-ID-123\\"
          messageToBuyer: \\"Updated: ships Monday.\\"
        }]
      }) {
        ... on BulkUpdatePurchaseQuotesSuccess { purchaseQuotes { purchaseQuoteId state } }
        ... on BulkUpdatePurchaseQuotesCompleteFailure { errorCode errorMessage }
      }
    }""";`,
    nodejs: `// GraphQL: bulkUpdatePurchaseQuotes — scope: sell.purchase.quote
await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: \`mutation {
    bulkUpdatePurchaseQuotes(input: {
      updates: [{
        purchaseQuoteId: "PQ-ID-123"
        messageToBuyer: "Updated: ships Monday."
        logisticsOptions: {
          shipping: [{ cost: { value: "8.00", currency: USD } shippingServiceCode: "USPSFirst" }]
        }
      }]
    }) {
      ... on BulkUpdatePurchaseQuotesSuccess { purchaseQuotes { purchaseQuoteId state } }
      ... on BulkUpdatePurchaseQuotesCompleteFailure { errorCode errorMessage }
    }
  }\` }),
});`,
    go: `// GraphQL: bulkUpdatePurchaseQuotes — scope: sell.purchase.quote
body := \`{"query":"mutation { bulkUpdatePurchaseQuotes(input: { updates: [{ purchaseQuoteId: \\"PQ-ID-123\\" messageToBuyer: \\"Updated: ships Monday.\\" }] }) { ... on BulkUpdatePurchaseQuotesSuccess { purchaseQuotes { purchaseQuoteId state } } ... on BulkUpdatePurchaseQuotesCompleteFailure { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST", "https://graphqlapi.ebay.com/graphql", strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")`,
    python: `# GraphQL: bulkUpdatePurchaseQuotes — scope: sell.purchase.quote
import requests
query = """mutation {
  bulkUpdatePurchaseQuotes(input: {
    updates: [{
      purchaseQuoteId: "PQ-ID-123"
      messageToBuyer: "Updated: ships Monday."
      logisticsOptions: {
        shipping: [{ cost: { value: "8.00", currency: USD } shippingServiceCode: "USPSFirst" }]
      }
    }]
  }) {
    ... on BulkUpdatePurchaseQuotesSuccess { purchaseQuotes { purchaseQuoteId state } }
    ... on BulkUpdatePurchaseQuotesPartialFailure { errorCode errorMessage }
    ... on BulkUpdatePurchaseQuotesCompleteFailure { errorCode errorMessage }
  }
}"""
requests.post('https://graphqlapi.ebay.com/graphql',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={'query': query})`,
  } as Record<Lang, string>,
};

// ─── CompleteSale (leave feedback) — Feedback REST API (already in feedback-calls.ts)
// CompleteSale の FeedbackInfo コンテナ → leaveFeedback REST API
// ここでは CompleteSale 旧コードと新 REST の簡易リンクスニペットを提供

export const completeSaleFeedback: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: CompleteSale — FeedbackInfo でフィードバック付与
// CommentType: Positive のみ (売り手→買い手は Positive のみ可能)
$body = '<?xml version="1.0" encoding="utf-8"?>
<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <FeedbackInfo>
    <CommentText>Great buyer, fast payment!</CommentText>
    <CommentType>Positive</CommentType>
    <TargetUser>buyer_username</TargetUser>
  </FeedbackInfo>
</CompleteSaleRequest>';
// X-EBAY-API-CALL-NAME: CompleteSale`,
    ruby: `# Trading API: CompleteSale — FeedbackInfo でフィードバック付与
body = <<~XML
  <CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <OrderLineItemID>123456789-987654321</OrderLineItemID>
    <FeedbackInfo>
      <CommentText>Great buyer, fast payment!</CommentText>
      <CommentType>Positive</CommentType>
      <TargetUser>buyer_username</TargetUser>
    </FeedbackInfo>
  </CompleteSaleRequest>
XML`,
    java: `// Trading API: CompleteSale — FeedbackInfo でフィードバック付与
String body = """
    <CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <OrderLineItemID>123456789-987654321</OrderLineItemID>
      <FeedbackInfo>
        <CommentText>Great buyer!</CommentText>
        <CommentType>Positive</CommentType>
        <TargetUser>buyer_username</TargetUser>
      </FeedbackInfo>
    </CompleteSaleRequest>""";`,
    nodejs: `// Trading API: CompleteSale — FeedbackInfo でフィードバック付与
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'CompleteSale', 'Content-Type': 'text/xml' },
  body: \`<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <FeedbackInfo>
    <CommentText>Great buyer!</CommentText>
    <CommentType>Positive</CommentType>
    <TargetUser>buyer_username</TargetUser>
  </FeedbackInfo>
</CompleteSaleRequest>\`,
});`,
    go: `// Trading API: CompleteSale — FeedbackInfo でフィードバック付与
body := \`<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <FeedbackInfo>
    <CommentText>Great buyer!</CommentText>
    <CommentType>Positive</CommentType>
    <TargetUser>buyer_username</TargetUser>
  </FeedbackInfo>
</CompleteSaleRequest>\``,
    python: `# Trading API: CompleteSale — FeedbackInfo でフィードバック付与
body = """<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <FeedbackInfo>
    <CommentText>Great buyer, fast payment!</CommentText>
    <CommentType>Positive</CommentType>
    <TargetUser>buyer_username</TargetUser>
  </FeedbackInfo>
</CompleteSaleRequest>"""`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Commerce Feedback REST API: leaveFeedback (CompleteSale FeedbackInfo の代替)
// lineItemId: orderLineItems[].orderLineItemId
// ratingKey: OVERALL_EXPERIENCE / OVERALL_EXPERIENCE_COMMENT / ON_TIME_DELIVERY など
$body = json_encode([
    'lineItemId' => '123456789-987654321',
    'ratings' => [
        ['ratingKey' => 'OVERALL_EXPERIENCE',         'ratingValue' => 'POSITIVE'],
        ['ratingKey' => 'OVERALL_EXPERIENCE_COMMENT', 'ratingValue' => 'Great buyer, fast payment!'],
    ],
]);
$ch = curl_init('https://api.ebay.com/commerce/feedback/v1/feedback');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
curl_exec($ch); curl_close($ch);`,
    ruby: `# Commerce Feedback REST API: leaveFeedback — scope: commerce.feedback
# lineItemId: orderLineItems[].orderLineItemId
require 'net/http'; require 'json'
uri = URI('https://api.ebay.com/commerce/feedback/v1/feedback')
req = Net::HTTP::Post.new(uri)
req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
req['Content-Type']  = 'application/json'
req.body = {
  lineItemId: '123456789-987654321',
  ratings: [
    { ratingKey: 'OVERALL_EXPERIENCE',         ratingValue: 'POSITIVE' },
    { ratingKey: 'OVERALL_EXPERIENCE_COMMENT', ratingValue: 'Great buyer!' },
  ]
}.to_json
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,
    java: `// Commerce Feedback REST API: leaveFeedback — scope: commerce.feedback
String body = """
    {
      "lineItemId": "123456789-987654321",
      "ratings": [
        {"ratingKey": "OVERALL_EXPERIENCE",         "ratingValue": "POSITIVE"},
        {"ratingKey": "OVERALL_EXPERIENCE_COMMENT", "ratingValue": "Great buyer!"}
      ]
    }""";
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/commerce/feedback/v1/feedback"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body)).build();`,
    nodejs: `// Commerce Feedback REST API: leaveFeedback — scope: commerce.feedback
await fetch('https://api.ebay.com/commerce/feedback/v1/feedback', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lineItemId: '123456789-987654321',
    ratings: [
      { ratingKey: 'OVERALL_EXPERIENCE',         ratingValue: 'POSITIVE' },
      { ratingKey: 'OVERALL_EXPERIENCE_COMMENT', ratingValue: 'Great buyer, fast payment!' },
    ],
  }),
});`,
    go: `// Commerce Feedback REST API: leaveFeedback — scope: commerce.feedback
body := \`{"lineItemId":"123456789-987654321","ratings":[{"ratingKey":"OVERALL_EXPERIENCE","ratingValue":"POSITIVE"},{"ratingKey":"OVERALL_EXPERIENCE_COMMENT","ratingValue":"Great buyer!"}]}\`
req, _ := http.NewRequest("POST", "https://api.ebay.com/commerce/feedback/v1/feedback", strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")`,
    python: `# Commerce Feedback REST API: leaveFeedback — scope: commerce.feedback
import requests
requests.post('https://api.ebay.com/commerce/feedback/v1/feedback',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={
        'lineItemId': '123456789-987654321',
        'ratings': [
            {'ratingKey': 'OVERALL_EXPERIENCE',         'ratingValue': 'POSITIVE'},
            {'ratingKey': 'OVERALL_EXPERIENCE_COMMENT', 'ratingValue': 'Great buyer, fast payment!'},
        ],
    })`,
  } as Record<Lang, string>,
};

// ─── CompleteSale (tracking info) → createShippingFulfillment (REST) ──────────
// Old: Trading API CompleteSale — Shipment.ShipmentTrackingDetails
//   ShipmentTrackingNumber と ShippingCarrierUsed はセットで必須
// New: Sell Fulfillment REST API
//   POST /sell/fulfillment/v1/order/{orderId}/shipping_fulfillment
//   body: { lineItems: [{ lineItemId, quantity }], trackingNumber, shippingCarrierCode, shippedDate? }
//   trackingNumber と shippingCarrierCode はセットで必須

export const createShippingFulfillment: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: CompleteSale — 発送トラッキング情報の登録
// ShipmentTrackingNumber と ShippingCarrierUsed はセットで必須
$body = '<?xml version="1.0" encoding="utf-8"?>
<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <Shipped>true</Shipped>
  <Shipment>
    <ShipmentTrackingDetails>
      <ShipmentTrackingNumber>1Z999AA10123456784</ShipmentTrackingNumber>
      <ShippingCarrierUsed>UPS</ShippingCarrierUsed>
    </ShipmentTrackingDetails>
    <ShippedTime>2025-01-15T10:00:00Z</ShippedTime>
  </Shipment>
</CompleteSaleRequest>';
// X-EBAY-API-CALL-NAME: CompleteSale`,
    ruby: `# Trading API: CompleteSale — 発送トラッキング情報
# ShipmentTrackingNumber と ShippingCarrierUsed はセットで必須
body = <<~XML
  <CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <OrderLineItemID>123456789-987654321</OrderLineItemID>
    <Shipped>true</Shipped>
    <Shipment>
      <ShipmentTrackingDetails>
        <ShipmentTrackingNumber>1Z999AA10123456784</ShipmentTrackingNumber>
        <ShippingCarrierUsed>UPS</ShippingCarrierUsed>
      </ShipmentTrackingDetails>
    </Shipment>
  </CompleteSaleRequest>
XML`,
    java: `// Trading API: CompleteSale — 発送トラッキング情報
// ShipmentTrackingNumber と ShippingCarrierUsed はセットで必須
String body = """
    <CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <OrderLineItemID>123456789-987654321</OrderLineItemID>
      <Shipped>true</Shipped>
      <Shipment>
        <ShipmentTrackingDetails>
          <ShipmentTrackingNumber>1Z999AA10123456784</ShipmentTrackingNumber>
          <ShippingCarrierUsed>UPS</ShippingCarrierUsed>
        </ShipmentTrackingDetails>
      </Shipment>
    </CompleteSaleRequest>""";`,
    nodejs: `// Trading API: CompleteSale — 発送トラッキング情報
// ShipmentTrackingNumber と ShippingCarrierUsed はセットで必須
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'CompleteSale', 'Content-Type': 'text/xml' },
  body: \`<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <Shipped>true</Shipped>
  <Shipment>
    <ShipmentTrackingDetails>
      <ShipmentTrackingNumber>1Z999AA10123456784</ShipmentTrackingNumber>
      <ShippingCarrierUsed>UPS</ShippingCarrierUsed>
    </ShipmentTrackingDetails>
  </Shipment>
</CompleteSaleRequest>\`,
});`,
    go: `// Trading API: CompleteSale — 発送トラッキング情報
body := \`<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <Shipped>true</Shipped>
  <Shipment>
    <ShipmentTrackingDetails>
      <ShipmentTrackingNumber>1Z999AA10123456784</ShipmentTrackingNumber>
      <ShippingCarrierUsed>UPS</ShippingCarrierUsed>
    </ShipmentTrackingDetails>
  </Shipment>
</CompleteSaleRequest>\``,
    python: `# Trading API: CompleteSale — 発送トラッキング情報
# ShipmentTrackingNumber と ShippingCarrierUsed はセットで必須
body = """<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <Shipped>true</Shipped>
  <Shipment>
    <ShipmentTrackingDetails>
      <ShipmentTrackingNumber>1Z999AA10123456784</ShipmentTrackingNumber>
      <ShippingCarrierUsed>UPS</ShippingCarrierUsed>
    </ShipmentTrackingDetails>
  </Shipment>
</CompleteSaleRequest>"""`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Sell Fulfillment REST API: createShippingFulfillment
// POST /sell/fulfillment/v1/order/{orderId}/shipping_fulfillment
// trackingNumber と shippingCarrierCode はセットで必須
// lineItems[].lineItemId は orderLineItems[].orderLineItemId の値
$orderId = 'ORDER-ID-123';
$body = json_encode([
    'lineItems' => [['lineItemId' => 'LINE-ITEM-ID-1', 'quantity' => 1]],
    'trackingNumber'      => '1Z999AA10123456784',
    'shippingCarrierCode' => 'UPS',
    'shippedDate'         => '2025-01-15T10:00:00.000Z',
]);
$ch = curl_init("https://api.ebay.com/sell/fulfillment/v1/order/{$orderId}/shipping_fulfillment");
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
// 成功時: 201 Created / Location ヘッダーに fulfillmentId
curl_exec($ch); curl_close($ch);`,
    ruby: `# Sell Fulfillment REST API: createShippingFulfillment
# trackingNumber と shippingCarrierCode はセットで必須
# lineItemId は orderLineItems[].orderLineItemId
require 'net/http'; require 'json'

order_id = 'ORDER-ID-123'
uri = URI("https://api.ebay.com/sell/fulfillment/v1/order/#{order_id}/shipping_fulfillment")
req = Net::HTTP::Post.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req['Content-Type']            = 'application/json'
req.body = {
  lineItems:           [{ lineItemId: 'LINE-ITEM-ID-1', quantity: 1 }],
  trackingNumber:      '1Z999AA10123456784',
  shippingCarrierCode: 'UPS',
  shippedDate:         '2025-01-15T10:00:00.000Z',
}.to_json
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
# 201 Created / Location ヘッダーに fulfillmentId`,
    java: `// Sell Fulfillment REST API: createShippingFulfillment
// trackingNumber と shippingCarrierCode はセットで必須
String orderId = "ORDER-ID-123";
String body = """
    {
      "lineItems": [{"lineItemId": "LINE-ITEM-ID-1", "quantity": 1}],
      "trackingNumber": "1Z999AA10123456784",
      "shippingCarrierCode": "UPS",
      "shippedDate": "2025-01-15T10:00:00.000Z"
    }""";
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/sell/fulfillment/v1/order/" + orderId + "/shipping_fulfillment"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body)).build();
// 201 Created / Location ヘッダーに fulfillmentId`,
    nodejs: `// Sell Fulfillment REST API: createShippingFulfillment
// trackingNumber と shippingCarrierCode はセットで必須
const orderId = 'ORDER-ID-123';
const res = await fetch(
  \`https://api.ebay.com/sell/fulfillment/v1/order/\${orderId}/shipping_fulfillment\`,
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lineItems:           [{ lineItemId: 'LINE-ITEM-ID-1', quantity: 1 }],
      trackingNumber:      '1Z999AA10123456784',
      shippingCarrierCode: 'UPS',
      shippedDate:         '2025-01-15T10:00:00.000Z',
    }),
  }
);
// 201 Created / res.headers.get('Location') に fulfillmentId`,
    go: `// Sell Fulfillment REST API: createShippingFulfillment
// trackingNumber と shippingCarrierCode はセットで必須
orderId := "ORDER-ID-123"
body := \`{
  "lineItems": [{"lineItemId": "LINE-ITEM-ID-1", "quantity": 1}],
  "trackingNumber": "1Z999AA10123456784",
  "shippingCarrierCode": "UPS",
  "shippedDate": "2025-01-15T10:00:00.000Z"
}\`
req, _ := http.NewRequest("POST",
    "https://api.ebay.com/sell/fulfillment/v1/order/"+orderId+"/shipping_fulfillment",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")
resp, _ := http.DefaultClient.Do(req)
// 201 Created / resp.Header.Get("Location") に fulfillmentId`,
    python: `# Sell Fulfillment REST API: createShippingFulfillment
# trackingNumber と shippingCarrierCode はセットで必須
import requests

order_id = 'ORDER-ID-123'
res = requests.post(
    f'https://api.ebay.com/sell/fulfillment/v1/order/{order_id}/shipping_fulfillment',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
    },
    json={
        'lineItems':           [{'lineItemId': 'LINE-ITEM-ID-1', 'quantity': 1}],
        'trackingNumber':      '1Z999AA10123456784',
        'shippingCarrierCode': 'UPS',
        'shippedDate':         '2025-01-15T10:00:00.000Z',
    },
)
# 201 Created / res.headers.get('Location') に fulfillmentId`,
  } as Record<Lang, string>,
};

// ─── CompleteSale (INR tracking) → provideShipmentInfoForItemNotReceivedInquiry
// Already defined in inr-calls.ts — compact alias for order/page.tsx

export const completeSaleInrTracking: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: CompleteSale — INR (未着) ケース向けトラッキング情報登録
$body = '<?xml version="1.0" encoding="utf-8"?>
<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <Shipped>true</Shipped>
  <Shipment>
    <ShipmentTrackingDetails>
      <ShipmentTrackingNumber>1Z999AA10123456784</ShipmentTrackingNumber>
      <ShippingCarrierUsed>UPS</ShippingCarrierUsed>
    </ShipmentTrackingDetails>
  </Shipment>
</CompleteSaleRequest>';
// X-EBAY-API-CALL-NAME: CompleteSale`,
    ruby: `# Trading API: CompleteSale — INR ケース向けトラッキング情報
body = <<~XML
  <CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <OrderLineItemID>123456789-987654321</OrderLineItemID>
    <Shipment>
      <ShipmentTrackingDetails>
        <ShipmentTrackingNumber>1Z999AA10123456784</ShipmentTrackingNumber>
        <ShippingCarrierUsed>UPS</ShippingCarrierUsed>
      </ShipmentTrackingDetails>
    </Shipment>
  </CompleteSaleRequest>
XML`,
    java: `// Trading API: CompleteSale — INR ケース向けトラッキング
String body = """
    <CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <OrderLineItemID>123456789-987654321</OrderLineItemID>
      <Shipment><ShipmentTrackingDetails>
        <ShipmentTrackingNumber>1Z999AA10123456784</ShipmentTrackingNumber>
        <ShippingCarrierUsed>UPS</ShippingCarrierUsed>
      </ShipmentTrackingDetails></Shipment>
    </CompleteSaleRequest>""";`,
    nodejs: `// Trading API: CompleteSale — INR ケース向けトラッキング
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'CompleteSale', 'Content-Type': 'text/xml' },
  body: \`<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <Shipment><ShipmentTrackingDetails>
    <ShipmentTrackingNumber>1Z999AA10123456784</ShipmentTrackingNumber>
    <ShippingCarrierUsed>UPS</ShippingCarrierUsed>
  </ShipmentTrackingDetails></Shipment>
</CompleteSaleRequest>\`,
});`,
    go: `// Trading API: CompleteSale — INR ケース向けトラッキング
body := \`<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <Shipment><ShipmentTrackingDetails>
    <ShipmentTrackingNumber>1Z999AA10123456784</ShipmentTrackingNumber>
    <ShippingCarrierUsed>UPS</ShippingCarrierUsed>
  </ShipmentTrackingDetails></Shipment>
</CompleteSaleRequest>\``,
    python: `# Trading API: CompleteSale — INR ケース向けトラッキング
body = """<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <Shipment><ShipmentTrackingDetails>
    <ShipmentTrackingNumber>1Z999AA10123456784</ShipmentTrackingNumber>
    <ShippingCarrierUsed>UPS</ShippingCarrierUsed>
  </ShipmentTrackingDetails></Shipment>
</CompleteSaleRequest>"""`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: provideShipmentInfoForItemNotReceivedInquiry
// INR (未着) 照会に対してトラッキング情報を提供 (Order Inquiry API)
// trackings: [{ trackingNumber, shippingCarrier: { carrierCode } }]
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
      orderInquiry { inquiryId status { code displayText } }
    }
    ... on OrderInquiryNotFoundError { errorCode errorMessage }
    ... on ProvideShipmentInfoForInquiryInputValidationError { errorCode errorMessage }
  }
}
GQL;
// POST https://graphqlapi.ebay.com/graphql, scope: sell.inquiry`,
    ruby: `# GraphQL: provideShipmentInfoForItemNotReceivedInquiry — scope: sell.inquiry
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
GQL`,
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
    }""";`,
    nodejs: `// GraphQL: provideShipmentInfoForItemNotReceivedInquiry — scope: sell.inquiry
await fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: \`mutation {
    provideShipmentInfoForItemNotReceivedInquiry(input: {
      inquiryId: "INQUIRY-ID-123"
      trackings: [{ trackingNumber: "1Z999AA10123456784" shippingCarrier: { carrierCode: "UPS" } }]
    }) {
      ... on ProvideShipmentInfoForItemNotReceivedInquirySuccess {
        orderInquiry { inquiryId status { code displayText } }
      }
      ... on OrderInquiryNotFoundError { errorCode errorMessage }
    }
  }\` }),
});`,
    go: `// GraphQL: provideShipmentInfoForItemNotReceivedInquiry — scope: sell.inquiry
body := \`{"query":"mutation { provideShipmentInfoForItemNotReceivedInquiry(input: { inquiryId: \\"INQUIRY-ID-123\\" trackings: [{ trackingNumber: \\"1Z999AA10123456784\\" shippingCarrier: { carrierCode: \\"UPS\\" } }] }) { ... on ProvideShipmentInfoForItemNotReceivedInquirySuccess { orderInquiry { inquiryId status { code displayText } } } ... on OrderInquiryNotFoundError { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST", "https://graphqlapi.ebay.com/graphql", strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
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
  }
}"""
requests.post('https://graphqlapi.ebay.com/graphql',
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'},
    json={'query': query})`,
  } as Record<Lang, string>,
};

// ─── AddItems → createListing (1回1件) ───────────────────────────────────────
// Old: Trading API AddItems — 1回のリクエストで最大5件同時出品
//   AddItemRequestContainer を最大5つ含めた1リクエスト
// New: GraphQL createListing — 1件ずつ呼び出す必要がある
//   大量出品の場合は Sell Feed API (LMS bulk upload) を使うこと

export const addItems: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: AddItems (1リクエストで最大5件同時出品)
// 各 AddItemRequestContainer が1件の出品を定義
// MessageID で各アイテムをレスポンスと対応付ける
$body = '<?xml version="1.0" encoding="utf-8"?>
<AddItemsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <AddItemRequestContainer>
    <MessageID>item-1</MessageID>
    <Item>
      <Title>Apple iPhone 15 Pro Max 256GB</Title>
      <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
      <StartPrice currencyID="USD">1199.00</StartPrice>
      <Quantity>3</Quantity>
      <ListingType>FixedPriceItem</ListingType>
      <ListingDuration>GTC</ListingDuration>
      <ConditionID>1000</ConditionID>
      <Country>US</Country><Currency>USD</Currency><Location>San Jose, CA</Location>
      <DispatchTimeMax>1</DispatchTimeMax>
      <ShippingDetails><ShippingType>Flat</ShippingType></ShippingDetails>
      <ReturnPolicy><ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption></ReturnPolicy>
    </Item>
  </AddItemRequestContainer>
  <AddItemRequestContainer>
    <MessageID>item-2</MessageID>
    <Item>
      <Title>Samsung Galaxy S24 Ultra 256GB</Title>
      <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
      <StartPrice currencyID="USD">999.00</StartPrice>
      <Quantity>2</Quantity>
      <ListingType>FixedPriceItem</ListingType>
      <ListingDuration>GTC</ListingDuration>
      <ConditionID>1000</ConditionID>
      <Country>US</Country><Currency>USD</Currency><Location>San Jose, CA</Location>
      <DispatchTimeMax>1</DispatchTimeMax>
      <ShippingDetails><ShippingType>Flat</ShippingType></ShippingDetails>
      <ReturnPolicy><ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption></ReturnPolicy>
    </Item>
  </AddItemRequestContainer>
</AddItemsRequest>';

$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'X-EBAY-API-SITEID: 0',
        'X-EBAY-API-CALL-NAME: AddItems',
        'X-EBAY-API-APP-NAME: YOUR_APP_ID',
        'X-EBAY-API-CERT-NAME: YOUR_CERT_ID',
        'X-EBAY-API-DEV-NAME: YOUR_DEV_ID',
        'Content-Type: text/xml',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
$response = curl_exec($ch); curl_close($ch);`,

    ruby: `# Trading API: AddItems (1リクエストで最大5件同時出品)
# AddItemRequestContainer を最大5つ含める / MessageID で対応付ける
body = <<~XML
  <?xml version="1.0" encoding="utf-8"?>
  <AddItemsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <AddItemRequestContainer>
      <MessageID>item-1</MessageID>
      <Item>
        <Title>Apple iPhone 15 Pro Max 256GB</Title>
        <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
        <StartPrice currencyID="USD">1199.00</StartPrice>
        <Quantity>3</Quantity>
        <ListingType>FixedPriceItem</ListingType>
        <ListingDuration>GTC</ListingDuration>
        <ConditionID>1000</ConditionID>
        <Country>US</Country><Currency>USD</Currency><Location>San Jose, CA</Location>
        <DispatchTimeMax>1</DispatchTimeMax>
        <ShippingDetails><ShippingType>Flat</ShippingType></ShippingDetails>
        <ReturnPolicy><ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption></ReturnPolicy>
      </Item>
    </AddItemRequestContainer>
    <AddItemRequestContainer>
      <MessageID>item-2</MessageID>
      <Item>
        <Title>Samsung Galaxy S24 Ultra 256GB</Title>
        <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
        <StartPrice currencyID="USD">999.00</StartPrice>
        <Quantity>2</Quantity>
        <ListingType>FixedPriceItem</ListingType>
        <ListingDuration>GTC</ListingDuration>
        <ConditionID>1000</ConditionID>
        <Country>US</Country><Currency>USD</Currency><Location>San Jose, CA</Location>
        <DispatchTimeMax>1</DispatchTimeMax>
        <ShippingDetails><ShippingType>Flat</ShippingType></ShippingDetails>
        <ReturnPolicy><ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption></ReturnPolicy>
      </Item>
    </AddItemRequestContainer>
  </AddItemsRequest>
XML
# POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: AddItems`,

    java: `// Trading API: AddItems (1リクエストで最大5件同時出品)
// AddItemRequestContainer を複数含めることで複数件を一括出品
String body = """
    <?xml version="1.0" encoding="utf-8"?>
    <AddItemsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <AddItemRequestContainer>
        <MessageID>item-1</MessageID>
        <Item>
          <Title>Apple iPhone 15 Pro Max 256GB</Title>
          <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
          <StartPrice currencyID="USD">1199.00</StartPrice>
          <Quantity>3</Quantity>
          <ListingType>FixedPriceItem</ListingType>
          <ListingDuration>GTC</ListingDuration>
          <ConditionID>1000</ConditionID>
          <Country>US</Country><Currency>USD</Currency><Location>San Jose, CA</Location>
          <DispatchTimeMax>1</DispatchTimeMax>
        </Item>
      </AddItemRequestContainer>
      <AddItemRequestContainer>
        <MessageID>item-2</MessageID>
        <Item>
          <Title>Samsung Galaxy S24 Ultra 256GB</Title>
          <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
          <StartPrice currencyID="USD">999.00</StartPrice>
          <Quantity>2</Quantity>
          <ListingType>FixedPriceItem</ListingType>
          <ListingDuration>GTC</ListingDuration>
          <ConditionID>1000</ConditionID>
          <Country>US</Country><Currency>USD</Currency><Location>San Jose, CA</Location>
          <DispatchTimeMax>1</DispatchTimeMax>
        </Item>
      </AddItemRequestContainer>
    </AddItemsRequest>""";
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: AddItems`,

    nodejs: `// Trading API: AddItems (1リクエストで最大5件同時出品)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: {
    'X-EBAY-API-SITEID': '0',
    'X-EBAY-API-CALL-NAME': 'AddItems',
    'X-EBAY-API-APP-NAME': 'YOUR_APP_ID',
    'Content-Type': 'text/xml',
  },
  body: \`<?xml version="1.0" encoding="utf-8"?>
<AddItemsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <AddItemRequestContainer>
    <MessageID>item-1</MessageID>
    <Item>
      <Title>Apple iPhone 15 Pro Max 256GB</Title>
      <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
      <StartPrice currencyID="USD">1199.00</StartPrice>
      <Quantity>3</Quantity>
      <ListingType>FixedPriceItem</ListingType>
      <ListingDuration>GTC</ListingDuration>
      <ConditionID>1000</ConditionID>
      <Country>US</Country><Currency>USD</Currency><Location>San Jose, CA</Location>
    </Item>
  </AddItemRequestContainer>
  <AddItemRequestContainer>
    <MessageID>item-2</MessageID>
    <Item>
      <Title>Samsung Galaxy S24 Ultra 256GB</Title>
      <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
      <StartPrice currencyID="USD">999.00</StartPrice>
      <Quantity>2</Quantity>
      <ListingType>FixedPriceItem</ListingType>
      <ListingDuration>GTC</ListingDuration>
      <ConditionID>1000</ConditionID>
      <Country>US</Country><Currency>USD</Currency><Location>San Jose, CA</Location>
    </Item>
  </AddItemRequestContainer>
</AddItemsRequest>\`,
});`,

    go: `// Trading API: AddItems (1リクエストで最大5件同時出品)
body := \`<?xml version="1.0" encoding="utf-8"?>
<AddItemsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <AddItemRequestContainer>
    <MessageID>item-1</MessageID>
    <Item>
      <Title>Apple iPhone 15 Pro Max 256GB</Title>
      <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
      <StartPrice currencyID="USD">1199.00</StartPrice>
      <Quantity>3</Quantity>
      <ListingType>FixedPriceItem</ListingType>
      <ListingDuration>GTC</ListingDuration>
      <ConditionID>1000</ConditionID>
      <Country>US</Country><Currency>USD</Currency>
    </Item>
  </AddItemRequestContainer>
  <AddItemRequestContainer>
    <MessageID>item-2</MessageID>
    <Item>
      <Title>Samsung Galaxy S24 Ultra 256GB</Title>
      <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
      <StartPrice currencyID="USD">999.00</StartPrice>
      <Quantity>2</Quantity>
      <ListingType>FixedPriceItem</ListingType>
      <ListingDuration>GTC</ListingDuration>
      <ConditionID>1000</ConditionID>
      <Country>US</Country><Currency>USD</Currency>
    </Item>
  </AddItemRequestContainer>
</AddItemsRequest>\`
req, _ := http.NewRequest("POST", "https://api.ebay.com/ws/api.dll",
    strings.NewReader(body))
req.Header.Set("X-EBAY-API-CALL-NAME", "AddItems")
req.Header.Set("Content-Type", "text/xml")`,

    python: `# Trading API: AddItems (1リクエストで最大5件同時出品)
# AddItemRequestContainer を最大5つ含める
import requests
body = """<?xml version="1.0" encoding="utf-8"?>
<AddItemsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <AddItemRequestContainer>
    <MessageID>item-1</MessageID>
    <Item>
      <Title>Apple iPhone 15 Pro Max 256GB</Title>
      <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
      <StartPrice currencyID="USD">1199.00</StartPrice>
      <Quantity>3</Quantity>
      <ListingType>FixedPriceItem</ListingType>
      <ListingDuration>GTC</ListingDuration>
      <ConditionID>1000</ConditionID>
      <Country>US</Country><Currency>USD</Currency><Location>San Jose, CA</Location>
    </Item>
  </AddItemRequestContainer>
  <AddItemRequestContainer>
    <MessageID>item-2</MessageID>
    <Item>
      <Title>Samsung Galaxy S24 Ultra 256GB</Title>
      <PrimaryCategory><CategoryID>9355</CategoryID></PrimaryCategory>
      <StartPrice currencyID="USD">999.00</StartPrice>
      <Quantity>2</Quantity>
      <ListingType>FixedPriceItem</ListingType>
      <ListingDuration>GTC</ListingDuration>
      <ConditionID>1000</ConditionID>
      <Country>US</Country><Currency>USD</Currency><Location>San Jose, CA</Location>
    </Item>
  </AddItemRequestContainer>
</AddItemsRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'AddItems', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL Listing API: createListing (1件ずつ呼び出す)
// 注意: AddItems のような一括出品 mutation は存在しない
// 大量出品: Sell Feed API (LMS bulk upload) を使うこと
// 少数: createListing を繰り返し呼び出す

$items = [
    ['title' => 'Apple iPhone 15 Pro Max 256GB', 'price' => '1199.00', 'qty' => 3],
    ['title' => 'Samsung Galaxy S24 Ultra 256GB', 'price' => '999.00',  'qty' => 2],
];

$results = [];
foreach ($items as $item) {
    $query = <<<GQL
mutation {
  createListing(input: {
    marketplace: EBAY_US
    product: {
      title: "{$item['title']}"
      categories: { primary: { id: "9355" } }
      imageUrls: ["https://i.ebayimg.com/s-l1600.jpg"]
      itemCondition: { conditionId: "1000" }
    }
    items: [{ price: { value: "{$item['price']}", currency: USD } quantity: {$item['qty']} }]
    terms: {
      listingFormat: FIXED_PRICE
      listingDurationInDays: 30
      fulfillmentTerms: { shippingTerms: { fulfillmentPolicyId: "POLICY_ID" } }
      returnTerms: { returnPolicyId: "POLICY_ID" }
      paymentTerms: { paymentPolicyId: "POLICY_ID" }
    }
  }) {
    listingId
    errors { errorId message }
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
    $results[] = json_decode(curl_exec($ch), true);
    curl_close($ch);
}`,

    ruby: `# GraphQL: createListing を繰り返し呼び出し (AddItems の代替)
# 注意: 一括出品 mutation なし。大量は Sell Feed API を使うこと
require 'net/http'; require 'json'

items = [
  { title: 'Apple iPhone 15 Pro Max 256GB', price: '1199.00', qty: 3 },
  { title: 'Samsung Galaxy S24 Ultra 256GB', price: '999.00',  qty: 2 },
]

uri = URI('https://graphqlapi.ebay.com/graphql')
results = items.map do |item|
  query = <<~GQL
    mutation {
      createListing(input: {
        marketplace: EBAY_US
        product: {
          title: "#{item[:title]}"
          categories: { primary: { id: "9355" } }
          imageUrls: ["https://i.ebayimg.com/s-l1600.jpg"]
          itemCondition: { conditionId: "1000" }
        }
        items: [{ price: { value: "#{item[:price]}", currency: USD } quantity: #{item[:qty]} }]
        terms: {
          listingFormat: FIXED_PRICE
          listingDurationInDays: 30
          fulfillmentTerms: { shippingTerms: { fulfillmentPolicyId: "POLICY_ID" } }
          returnTerms: { returnPolicyId: "POLICY_ID" }
          paymentTerms: { paymentPolicyId: "POLICY_ID" }
        }
      }) { listingId errors { errorId message } }
    }
  GQL
  req = Net::HTTP::Post.new(uri)
  req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
  req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
  req['Content-Type'] = 'application/json'
  req.body = { query: query }.to_json
  JSON.parse(Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }.body)
end`,

    java: `// GraphQL: createListing を繰り返し呼び出し (AddItems の代替)
// 注意: 一括出品 mutation なし。大量は Sell Feed API を使うこと
// 並列リクエストで効率化するには CompletableFuture などを活用

record ItemData(String title, String price, int qty) {}

var items = List.of(
    new ItemData("Apple iPhone 15 Pro Max 256GB", "1199.00", 3),
    new ItemData("Samsung Galaxy S24 Ultra 256GB", "999.00",  2)
);

for (var item : items) {
    String query = """
        mutation {
          createListing(input: {
            marketplace: EBAY_US
            product: {
              title: \\"%s\\"
              categories: { primary: { id: \\"9355\\" } }
              imageUrls: [\\"https://i.ebayimg.com/s-l1600.jpg\\"]
              itemCondition: { conditionId: \\"1000\\" }
            }
            items: [{ price: { value: \\"%s\\", currency: USD } quantity: %d }]
            terms: {
              listingFormat: FIXED_PRICE
              listingDurationInDays: 30
              fulfillmentTerms: { shippingTerms: { fulfillmentPolicyId: \\"POLICY_ID\\" } }
              returnTerms: { returnPolicyId: \\"POLICY_ID\\" }
              paymentTerms: { paymentPolicyId: \\"POLICY_ID\\" }
            }
          }) { listingId errors { errorId message } }
        }
        """.formatted(item.title(), item.price(), item.qty());
    // http.send(buildRequest(query), ...)
}`,

    nodejs: `// GraphQL: createListing を並列呼び出し (AddItems の代替)
// 注意: 一括出品 mutation なし。大量は Sell Feed API を使うこと
const items = [
  { title: 'Apple iPhone 15 Pro Max 256GB', price: '1199.00', qty: 3 },
  { title: 'Samsung Galaxy S24 Ultra 256GB', price: '999.00',  qty: 2 },
];

const createListing = async (item) =>
  fetch('https://graphqlapi.ebay.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: \`mutation {
      createListing(input: {
        marketplace: EBAY_US
        product: {
          title: "\${item.title}"
          categories: { primary: { id: "9355" } }
          imageUrls: ["https://i.ebayimg.com/s-l1600.jpg"]
          itemCondition: { conditionId: "1000" }
        }
        items: [{ price: { value: "\${item.price}", currency: USD } quantity: \${item.qty} }]
        terms: {
          listingFormat: FIXED_PRICE
          listingDurationInDays: 30
          fulfillmentTerms: { shippingTerms: { fulfillmentPolicyId: "POLICY_ID" } }
          returnTerms: { returnPolicyId: "POLICY_ID" }
          paymentTerms: { paymentPolicyId: "POLICY_ID" }
        }
      }) { listingId errors { errorId message } }
    }\` }),
  }).then(r => r.json());

// 並列実行 (AddItems の 5件同時に相当)
const results = await Promise.all(items.map(createListing));`,

    go: `// GraphQL: createListing を繰り返し呼び出し (AddItems の代替)
// 注意: 一括出品 mutation なし。大量は Sell Feed API を使うこと
items := []struct{ title, price string; qty int }{
    {"Apple iPhone 15 Pro Max 256GB", "1199.00", 3},
    {"Samsung Galaxy S24 Ultra 256GB", "999.00",  2},
}

for _, item := range items {
    query := fmt.Sprintf(\`{"query":"mutation { createListing(input: { marketplace: EBAY_US product: { title: \\"%s\\" categories: { primary: { id: \\"9355\\" } } imageUrls: [\\"https://i.ebayimg.com/s-l1600.jpg\\"] itemCondition: { conditionId: \\"1000\\" } } items: [{ price: { value: \\"%s\\", currency: USD } quantity: %d }] terms: { listingFormat: FIXED_PRICE listingDurationInDays: 30 fulfillmentTerms: { shippingTerms: { fulfillmentPolicyId: \\"POLICY_ID\\" } } returnTerms: { returnPolicyId: \\"POLICY_ID\\" } paymentTerms: { paymentPolicyId: \\"POLICY_ID\\" } } }) { listingId errors { errorId message } } }"}\`,
        item.title, item.price, item.qty)
    req, _ := http.NewRequest("POST", "https://graphqlapi.ebay.com/graphql",
        strings.NewReader(query))
    req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    req.Header.Set("Content-Type", "application/json")
    http.DefaultClient.Do(req)
}`,

    python: `# GraphQL: createListing を繰り返し呼び出し (AddItems の代替)
# 注意: 一括出品 mutation なし。大量は Sell Feed API を使うこと
import requests
from concurrent.futures import ThreadPoolExecutor

items = [
    {'title': 'Apple iPhone 15 Pro Max 256GB', 'price': '1199.00', 'qty': 3},
    {'title': 'Samsung Galaxy S24 Ultra 256GB', 'price': '999.00',  'qty': 2},
]

def create_listing(item):
    return requests.post(
        'https://graphqlapi.ebay.com/graphql',
        headers={
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
            'Content-Type': 'application/json',
        },
        json={'query': f"""mutation {{
          createListing(input: {{
            marketplace: EBAY_US
            product: {{
              title: "{item['title']}"
              categories: {{ primary: {{ id: "9355" }} }}
              imageUrls: ["https://i.ebayimg.com/s-l1600.jpg"]
              itemCondition: {{ conditionId: "1000" }}
            }}
            items: [{{ price: {{ value: "{item['price']}", currency: USD }} quantity: {item['qty']} }}]
            terms: {{
              listingFormat: FIXED_PRICE
              listingDurationInDays: 30
              fulfillmentTerms: {{ shippingTerms: {{ fulfillmentPolicyId: "POLICY_ID" }} }}
              returnTerms: {{ returnPolicyId: "POLICY_ID" }}
              paymentTerms: {{ paymentPolicyId: "POLICY_ID" }}
            }}
          }}) {{ listingId errors {{ errorId message }} }}
        }}"""},
    ).json()

# 並列実行 (AddItems の 5件同時に相当)
with ThreadPoolExecutor(max_workers=5) as ex:
    results = list(ex.map(create_listing, items))`,
  } as Record<Lang, string>,
};

// ─── Map: oldApi name → snippet ──────────────────────────────────────────────

export const snippetByOldApi: Record<string, ApiCallSnippet> = {
  "AddItem":                         createListing,
  "AddFixedPriceItem":               createListing,
  "AddItems":                        addItems,
  "VerifyAddItem":                   createListing,
  "VerifyAddFixedPriceItem":         createListing,
  "ReviseItem":                      updateListing,
  "ReviseFixedPriceItem":            updateListing,
  "ReviseInventoryStatus":           updateListing,
  "RelistFixedPriceItem":            relistListing,
  "RelistItem":                      relistListing,
  "VerifyRelistItem":                relistListing,
  "AddSecondChanceItem":             createSecondChanceListing,
  "GetMyeBaySelling":                sellerListingSearch,
  "GetSellerList":                   sellerListingSearch,
  "GetSellerEvents":                 sellerListingSearch,
  "GetAllBidders":                   itemBiddingActivity,
  "GetBidderList":                   userBiddingActivity,
  "UploadSiteHostedPictures":        uploadImage,
  "EndItem":                         endListing,
  "EndFixedPriceItem":               endListing,
  "GetItem":                         getItem,
  "GetOrders (paid)":                getOrdersPaid,
  "GetSellerTransactions (paid)":    getOrdersPaid,
  "GetOrders by ID (paid)":          getOrdersPaid,
  "GetOrders (unpaid)":              getOrdersUnpaid,
  "GetSellerTransactions (unpaid)":  getOrdersUnpaid,
  "GetItemTransactions (unpaid, by listing)": getOrdersUnpaid,
  "GetItemTransactions (paid, by listing)":   getItemTransactionsByListing,
  "GetItemTransactions (line items)":         getOrderLineItemsByIds,
  "CompleteSale (mark offline paid)":         markOrdersPaid,
  "CompleteSale (mark commitments paid)":     markItemCommitmentsPaid,
  "AddOrder":                                 createPurchaseQuote,
  "SendInvoice":                              createPurchaseQuote,
  "SendInvoice (update existing)":            bulkUpdatePurchaseQuotes,
  "CompleteSale (leave feedback)":            completeSaleFeedback,
  "CompleteSale (tracking info)":             createShippingFulfillment,
  "CompleteSale (INR tracking)":              completeSaleInrTracking,
};
