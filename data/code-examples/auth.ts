export const authExamples: Record<string, { old: string; new: string }> = {
  php: {
    old: `<?php
// Trading API: AppID + CertID を使った認証
$appID  = 'YOUR_APP_ID';
$certID = 'YOUR_CERT_ID';
$devID  = 'YOUR_DEV_ID';
$userToken = 'YOUR_USER_TOKEN'; // eBay Auth Token

$headers = [
    "X-EBAY-API-SITEID: 0",
    "X-EBAY-API-COMPATIBILITY-LEVEL: 967",
    "X-EBAY-API-CALL-NAME: GetItem",
    "X-EBAY-API-APP-NAME: {$appID}",
    "X-EBAY-API-CERT-NAME: {$certID}",
    "X-EBAY-API-DEV-NAME: {$devID}",
    "Content-Type: text/xml",
];

$body = '<?xml version="1.0" encoding="utf-8"?>
<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>' . $userToken . '</eBayAuthToken>
  </RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetItemRequest>';

$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);`,

    new: `<?php
// GraphQL API: OAuth 2.0 でトークン取得
function getOAuthToken(string $clientId, string $clientSecret): string {
    $credentials = base64_encode("{$clientId}:{$clientSecret}");
    $ch = curl_init('https://api.ebay.com/identity/v1/oauth2/token');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            "Authorization: Basic {$credentials}",
            "Content-Type: application/x-www-form-urlencoded",
        ],
        CURLOPT_POSTFIELDS => http_build_query([
            'grant_type' => 'client_credentials',
            'scope'      => 'https://api.ebay.com/oauth/api_scope/sell.listing',
        ]),
    ]);
    $res = json_decode(curl_exec($ch), true);
    curl_close($ch);
    return $res['access_token'];
}

$token = getOAuthToken('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET');

// GraphQL リクエスト
$query = <<<'GQL'
query {
  sellerListings(input: { listings: [{ listingId: "123456789" }] }) {
    ... on ListingsSuccess {
      listings {
        ... on ListingSuccess {
          listingId
          listing { product { title } }
        }
      }
    }
  }
}
GQL;

$ch = curl_init('https://graphqlapi.ebay.com/graphql');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        "Authorization: Bearer {$token}",
        "X-EBAY-C-MARKETPLACE-ID: EBAY_US",
        "Content-Type: application/json",
    ],
    CURLOPT_POSTFIELDS => json_encode(['query' => $query]),
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);`,
  },

  ruby: {
    old: `# Trading API: Savon gem を使った SOAP 認証
require 'savon'

client = Savon.client(
  wsdl: 'https://developer.ebay.com/webservices/latest/eBaySvc.wsdl',
  soap_header: {
    'RequesterCredentials' => {
      'eBayAuthToken' => 'YOUR_USER_TOKEN'
    }
  },
  namespaces: { 'xmlns' => 'urn:ebay:apis:eBLBaseComponents' },
  headers: {
    'X-EBAY-API-SITEID'              => '0',
    'X-EBAY-API-COMPATIBILITY-LEVEL' => '967',
    'X-EBAY-API-CALL-NAME'           => 'GetItem',
    'X-EBAY-API-APP-NAME'            => 'YOUR_APP_ID',
    'X-EBAY-API-CERT-NAME'           => 'YOUR_CERT_ID',
    'X-EBAY-API-DEV-NAME'            => 'YOUR_DEV_ID',
  }
)

response = client.call(:get_item, message: { item_id: '123456789' })`,

    new: `# GraphQL API: Net::HTTP で OAuth 2.0 認証
require 'net/http'
require 'json'
require 'base64'
require 'uri'

def get_oauth_token(client_id, client_secret)
  uri = URI('https://api.ebay.com/identity/v1/oauth2/token')
  req = Net::HTTP::Post.new(uri)
  req['Authorization'] = "Basic #{Base64.strict_encode64("#{client_id}:#{client_secret}")}"
  req['Content-Type']  = 'application/x-www-form-urlencoded'
  req.body = URI.encode_www_form(
    grant_type: 'client_credentials',
    scope: 'https://api.ebay.com/oauth/api_scope/sell.listing'
  )
  res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |h| h.request(req) }
  JSON.parse(res.body)['access_token']
end

token = get_oauth_token('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET')

# GraphQL リクエスト
query = <<~GQL
  query {
    sellerListings(input: { listings: [{ listingId: "123456789" }] }) {
      ... on ListingsSuccess {
        listings {
          ... on ListingSuccess {
            listingId
            listing { product { title } }
          }
        }
      }
    }
  }
GQL

uri = URI('https://graphqlapi.ebay.com/graphql')
req = Net::HTTP::Post.new(uri)
req['Authorization']           = "Bearer #{token}"
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req['Content-Type']            = 'application/json'
req.body = { query: query }.to_json

res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |h| h.request(req) }
data = JSON.parse(res.body)`,
  },

  java: {
    old: `// Trading API: SOAP XML リクエスト
import java.net.http.*;
import java.net.URI;

String appId    = "YOUR_APP_ID";
String certId   = "YOUR_CERT_ID";
String devId    = "YOUR_DEV_ID";
String userToken = "YOUR_USER_TOKEN";

String body = """
    <?xml version="1.0" encoding="utf-8"?>
    <GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials>
        <eBayAuthToken>""" + userToken + """</eBayAuthToken>
      </RequesterCredentials>
      <ItemID>123456789</ItemID>
    </GetItemRequest>""";

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/ws/api.dll"))
    .header("X-EBAY-API-SITEID", "0")
    .header("X-EBAY-API-CALL-NAME", "GetItem")
    .header("X-EBAY-API-APP-NAME", appId)
    .header("X-EBAY-API-CERT-NAME", certId)
    .header("X-EBAY-API-DEV-NAME", devId)
    .header("Content-Type", "text/xml")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();`,

    new: `// GraphQL API: OAuth 2.0 トークン取得 + GraphQL リクエスト
import java.net.http.*;
import java.net.URI;
import java.util.Base64;

// 1. OAuth トークン取得
String clientId     = "YOUR_CLIENT_ID";
String clientSecret = "YOUR_CLIENT_SECRET";
String credentials  = Base64.getEncoder().encodeToString(
    (clientId + ":" + clientSecret).getBytes()
);

HttpClient http = HttpClient.newHttpClient();
HttpRequest tokenReq = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/identity/v1/oauth2/token"))
    .header("Authorization", "Basic " + credentials)
    .header("Content-Type", "application/x-www-form-urlencoded")
    .POST(HttpRequest.BodyPublishers.ofString(
        "grant_type=client_credentials" +
        "&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope%2Fsell.listing"
    ))
    .build();

HttpResponse<String> tokenRes = http.send(tokenReq, HttpResponse.BodyHandlers.ofString());
// JSON から access_token を抽出（Jackson や Gson を使用）
String token = extractToken(tokenRes.body());

// 2. GraphQL リクエスト
String query = """
    {
      "query": "query { sellerListings(input: { listings: [{ listingId: \\"123456789\\" }] }) { ... on ListingsSuccess { listings { ... on ListingSuccess { listingId listing { product { title } } } } } } }"
    }""";

HttpRequest graphqlReq = HttpRequest.newBuilder()
    .uri(URI.create("https://graphqlapi.ebay.com/graphql"))
    .header("Authorization", "Bearer " + token)
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(query))
    .build();

HttpResponse<String> res = http.send(graphqlReq, HttpResponse.BodyHandlers.ofString());`,
  },

  nodejs: {
    old: `// Trading API: XML SOAP リクエスト (node-ebay-api 等)
const https = require('https');

const appId    = 'YOUR_APP_ID';
const certId   = 'YOUR_CERT_ID';
const devId    = 'YOUR_DEV_ID';
const userToken = 'YOUR_USER_TOKEN';

const body = \`<?xml version="1.0" encoding="utf-8"?>
<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>\${userToken}</eBayAuthToken>
  </RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetItemRequest>\`;

const options = {
  hostname: 'api.ebay.com',
  path: '/ws/api.dll',
  method: 'POST',
  headers: {
    'X-EBAY-API-SITEID': '0',
    'X-EBAY-API-CALL-NAME': 'GetItem',
    'X-EBAY-API-APP-NAME': appId,
    'X-EBAY-API-CERT-NAME': certId,
    'X-EBAY-API-DEV-NAME': devId,
    'Content-Type': 'text/xml',
  },
};`,

    new: `// GraphQL API: OAuth 2.0 + fetch (Node.js 18+)
const CLIENT_ID     = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

async function getOAuthToken() {
  const credentials = Buffer.from(\`\${CLIENT_ID}:\${CLIENT_SECRET}\`).toString('base64');
  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: \`Basic \${credentials}\`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'https://api.ebay.com/oauth/api_scope/sell.listing',
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function graphqlRequest(query, variables = {}) {
  const token = await getOAuthToken();
  const res = await fetch('https://graphqlapi.ebay.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${token}\`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

// 使用例
const data = await graphqlRequest(\`
  query {
    sellerListings(input: { listings: [{ listingId: "123456789" }] }) {
      ... on ListingsSuccess {
        listings {
          ... on ListingSuccess {
            listingId
            listing { product { title } }
          }
        }
      }
    }
  }
\`);`,
  },

  go: {
    old: `// Trading API: SOAP XML リクエスト
package main

import (
    "fmt"
    "io"
    "net/http"
    "strings"
)

func main() {
    appID     := "YOUR_APP_ID"
    certID    := "YOUR_CERT_ID"
    devID     := "YOUR_DEV_ID"
    userToken := "YOUR_USER_TOKEN"

    body := fmt.Sprintf(\`<?xml version="1.0" encoding="utf-8"?>
<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>%s</eBayAuthToken>
  </RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetItemRequest>\`, userToken)

    req, _ := http.NewRequest("POST", "https://api.ebay.com/ws/api.dll",
        strings.NewReader(body))
    req.Header.Set("X-EBAY-API-SITEID", "0")
    req.Header.Set("X-EBAY-API-CALL-NAME", "GetItem")
    req.Header.Set("X-EBAY-API-APP-NAME", appID)
    req.Header.Set("X-EBAY-API-CERT-NAME", certID)
    req.Header.Set("X-EBAY-API-DEV-NAME", devID)
    req.Header.Set("Content-Type", "text/xml")
}`,

    new: `// GraphQL API: OAuth 2.0 + GraphQL リクエスト
package main

import (
    "bytes"
    "encoding/base64"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "net/url"
    "strings"
)

func getOAuthToken(clientID, clientSecret string) (string, error) {
    credentials := base64.StdEncoding.EncodeToString(
        []byte(clientID + ":" + clientSecret),
    )
    form := url.Values{
        "grant_type": {"client_credentials"},
        "scope":      {"https://api.ebay.com/oauth/api_scope/sell.listing"},
    }
    req, _ := http.NewRequest("POST",
        "https://api.ebay.com/identity/v1/oauth2/token",
        strings.NewReader(form.Encode()))
    req.Header.Set("Authorization", "Basic "+credentials)
    req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

    res, _ := http.DefaultClient.Do(req)
    defer res.Body.Close()
    var result map[string]interface{}
    json.NewDecoder(res.Body).Decode(&result)
    return result["access_token"].(string), nil
}

func main() {
    token, _ := getOAuthToken("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET")

    query := \`{ "query": "query { sellerListings(input: { listings: [{ listingId: \\"123456789\\" }] }) { ... on ListingsSuccess { listings { ... on ListingSuccess { listingId listing { product { title } } } } } } }" }\`

    req, _ := http.NewRequest("POST",
        "https://graphqlapi.ebay.com/graphql",
        bytes.NewBufferString(query))
    req.Header.Set("Authorization", "Bearer "+token)
    req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    req.Header.Set("Content-Type", "application/json")

    res, _ := http.DefaultClient.Do(req)
    defer res.Body.Close()
    body, _ := io.ReadAll(res.Body)
    fmt.Println(string(body))
}`,
  },

  python: {
    old: `# Trading API: SOAP XML リクエスト
import requests

APP_ID    = 'YOUR_APP_ID'
CERT_ID   = 'YOUR_CERT_ID'
DEV_ID    = 'YOUR_DEV_ID'
USER_TOKEN = 'YOUR_USER_TOKEN'

body = f"""<?xml version="1.0" encoding="utf-8"?>
<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>{USER_TOKEN}</eBayAuthToken>
  </RequesterCredentials>
  <ItemID>123456789</ItemID>
</GetItemRequest>"""

headers = {
    'X-EBAY-API-SITEID': '0',
    'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
    'X-EBAY-API-CALL-NAME': 'GetItem',
    'X-EBAY-API-APP-NAME': APP_ID,
    'X-EBAY-API-CERT-NAME': CERT_ID,
    'X-EBAY-API-DEV-NAME': DEV_ID,
    'Content-Type': 'text/xml',
}

response = requests.post('https://api.ebay.com/ws/api.dll',
                         data=body, headers=headers)`,

    new: `# GraphQL API: OAuth 2.0 + GraphQL リクエスト
import base64
import requests

CLIENT_ID     = 'YOUR_CLIENT_ID'
CLIENT_SECRET = 'YOUR_CLIENT_SECRET'

def get_oauth_token():
    credentials = base64.b64encode(
        f'{CLIENT_ID}:{CLIENT_SECRET}'.encode()
    ).decode()
    res = requests.post(
        'https://api.ebay.com/identity/v1/oauth2/token',
        headers={
            'Authorization': f'Basic {credentials}',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data={
            'grant_type': 'client_credentials',
            'scope': 'https://api.ebay.com/oauth/api_scope/sell.listing',
        }
    )
    return res.json()['access_token']

def graphql_request(query, variables=None):
    token = get_oauth_token()
    res = requests.post(
        'https://graphqlapi.ebay.com/graphql',
        headers={
            'Authorization': f'Bearer {token}',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
            'Content-Type': 'application/json',
        },
        json={'query': query, 'variables': variables or {}}
    )
    return res.json()

# 使用例
data = graphql_request("""
  query {
    sellerListings(input: { listings: [{ listingId: "123456789" }] }) {
      ... on ListingsSuccess {
        listings {
          ... on ListingSuccess {
            listingId
            listing { product { title } }
          }
        }
      }
    }
  }
""")`,
  },
};
