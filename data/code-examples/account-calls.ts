import type { Lang } from "@/components/CodeTabs";

export interface ApiCallSnippet {
  old: Record<Lang, string>;
  new: Record<Lang, string>;
}

// ─── GetUser → Identity API getUser ──────────────────────────────────────────
// Old: Trading API GetUser
//   Optional: UserID (他のユーザー情報取得可能), IncludeFeatureEligibility
// New: Commerce Identity REST API  GET /commerce/identity/v1/user/
//   No params — returns authenticated user only (cannot query other users)
//   Scope: commerce.identity.readonly

export const getUser: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetUser
// UserID 省略で呼び出しユーザー自身を返す / 指定すると他ユーザーの公開情報を取得
// IncludeFeatureEligibility=true で利用可能な販売機能リストを付加
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetUserRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <IncludeFeatureEligibility>true</IncludeFeatureEligibility>
</GetUserRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetUser`,

    ruby: `# Trading API: GetUser
# UserID 省略で呼び出しユーザー自身を返す
# IncludeFeatureEligibility=true で利用可能な販売機能リストを付加
body = <<~XML
  <GetUserRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <IncludeFeatureEligibility>true</IncludeFeatureEligibility>
  </GetUserRequest>
XML
# X-EBAY-API-CALL-NAME: GetUser`,

    java: `// Trading API: GetUser
// UserID 省略で呼び出しユーザー自身を返す
String body = """
    <GetUserRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <IncludeFeatureEligibility>true</IncludeFeatureEligibility>
    </GetUserRequest>""";
// X-EBAY-API-CALL-NAME: GetUser`,

    nodejs: `// Trading API: GetUser (UserID 省略で自身の情報)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetUser', 'Content-Type': 'text/xml' },
  body: \`<GetUserRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <IncludeFeatureEligibility>true</IncludeFeatureEligibility>
</GetUserRequest>\`,
});`,

    go: `// Trading API: GetUser (UserID 省略で自身の情報)
body := \`<GetUserRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <IncludeFeatureEligibility>true</IncludeFeatureEligibility>
</GetUserRequest>\`
// X-EBAY-API-CALL-NAME: GetUser`,

    python: `# Trading API: GetUser (UserID 省略で自身の情報)
import requests
body = """<GetUserRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <IncludeFeatureEligibility>true</IncludeFeatureEligibility>
</GetUserRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetUser', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Commerce Identity REST API: getUser
// GET https://apiz.ebay.com/commerce/identity/v1/user/
// 注意: 新APIは認証ユーザー自身の情報のみ。UserIDによる他ユーザー検索不可
// 返却内容は scope で制御。commerce.identity.readonly で基本情報
$ch = curl_init('https://apiz.ebay.com/commerce/identity/v1/user/');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
    ],
]);
$user = json_decode(curl_exec($ch), true);
echo $user['userId'] . ' / ' . $user['username'];
curl_close($ch);`,

    ruby: `# Commerce Identity REST API: getUser
# 注意: 新APIは認証ユーザー自身の情報のみ。他ユーザー検索不可
# scope: commerce.identity.readonly (基本情報) + name.readonly / email.readonly (要申請)
require 'net/http'; require 'json'
uri = URI('https://apiz.ebay.com/commerce/identity/v1/user/')
req = Net::HTTP::Get.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
user = JSON.parse(res.body)
puts "#{user['userId']} / #{user['username']}"`,

    java: `// Commerce Identity REST API: getUser
// 注意: 認証ユーザー自身のみ。scope: commerce.identity.readonly
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://apiz.ebay.com/commerce/identity/v1/user/"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .GET().build();
HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Commerce Identity REST API: getUser
// 注意: 認証ユーザー自身のみ。他ユーザー検索不可
// scope: commerce.identity.readonly
const user = await fetch('https://apiz.ebay.com/commerce/identity/v1/user/', {
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
  },
}).then(r => r.json());
console.log(user.userId, user.username);`,

    go: `// Commerce Identity REST API: getUser — scope: commerce.identity.readonly
// 注意: 認証ユーザー自身のみ。他ユーザー検索不可
req, _ := http.NewRequest("GET",
    "https://apiz.ebay.com/commerce/identity/v1/user/", nil)
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
http.DefaultClient.Do(req)`,

    python: `# Commerce Identity REST API: getUser
# 注意: 認証ユーザー自身のみ。他ユーザー検索不可
# scope: commerce.identity.readonly (基本) + 追加 scope で email/name 等
import requests
res = requests.get(
    'https://apiz.ebay.com/commerce/identity/v1/user/',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    },
)
user = res.json()
print(user['userId'], user['username'])`,
  } as Record<Lang, string>,
};

// ─── GetAccount (transactions) → Finances API getTransactions ────────────────
// Old: Trading API GetAccount (listing fees / account entries)
// New: Sell Finances REST API  GET /sell/finances/v1/transaction
//   filter examples: transactionDate:[2025-01-01T00:00:00Z..2025-03-31T23:59:59Z]
//                    transactionType:{SALE}
//   transactionType values: SALE / REFUND / RETURN / TRANSFER / etc.
//   Note: EU/UK sellers require Digital Signatures header

export const getTransactions: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetAccount (帳票・手数料明細取得)
// AccountEntrySortType: AccountEntryCreatedTimeAscending / AccountEntryCreatedTimeDescending
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetAccountRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <AccountHistorySelection>LastInvoice</AccountHistorySelection>
  <Pagination>
    <EntriesPerPage>200</EntriesPerPage>
    <PageNumber>1</PageNumber>
  </Pagination>
</GetAccountRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetAccount`,

    ruby: `# Trading API: GetAccount (帳票・手数料明細取得)
body = <<~XML
  <GetAccountRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <AccountHistorySelection>LastInvoice</AccountHistorySelection>
    <Pagination><EntriesPerPage>200</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
  </GetAccountRequest>
XML
# X-EBAY-API-CALL-NAME: GetAccount`,

    java: `// Trading API: GetAccount (帳票・手数料明細取得)
String body = """
    <GetAccountRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <AccountHistorySelection>LastInvoice</AccountHistorySelection>
      <Pagination><EntriesPerPage>200</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
    </GetAccountRequest>""";
// X-EBAY-API-CALL-NAME: GetAccount`,

    nodejs: `// Trading API: GetAccount (帳票・手数料明細取得)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetAccount', 'Content-Type': 'text/xml' },
  body: \`<GetAccountRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <AccountHistorySelection>LastInvoice</AccountHistorySelection>
  <Pagination><EntriesPerPage>200</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetAccountRequest>\`,
});`,

    go: `// Trading API: GetAccount (帳票・手数料明細取得)
body := \`<GetAccountRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <AccountHistorySelection>LastInvoice</AccountHistorySelection>
  <Pagination><EntriesPerPage>200</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetAccountRequest>\`
// X-EBAY-API-CALL-NAME: GetAccount`,

    python: `# Trading API: GetAccount (帳票・手数料明細取得)
import requests
body = """<GetAccountRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <AccountHistorySelection>LastInvoice</AccountHistorySelection>
  <Pagination><EntriesPerPage>200</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetAccountRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetAccount', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Sell Finances REST API: getTransactions
// GET https://apiz.ebay.com/sell/finances/v1/transaction
// filter: transactionDate / transactionType / transactionStatus / orderId / buyerUsername 等
// transactionType: SALE / REFUND / RETURN / TRANSFER / etc.
// 注意: EU/UK の場合は Digital Signatures ヘッダーが必要
$filter = 'transactionDate:[2025-01-01T00:00:00Z..2025-03-31T23:59:59Z]';
$params = http_build_query([
    'filter' => $filter,
    'limit'  => 200,
    'offset' => 0,
    'sort'   => 'transactionDate',
]);
$ch = curl_init("https://apiz.ebay.com/sell/finances/v1/transaction?{$params}");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
    ],
]);
$data = json_decode(curl_exec($ch), true);
$transactions = $data['transactions'];
curl_close($ch);`,

    ruby: `# Sell Finances REST API: getTransactions
# filter: transactionDate / transactionType / transactionStatus 等
# transactionType: SALE / REFUND / RETURN / TRANSFER / etc.
require 'net/http'; require 'json'
uri = URI('https://apiz.ebay.com/sell/finances/v1/transaction')
uri.query = URI.encode_www_form(
  filter: 'transactionDate:[2025-01-01T00:00:00Z..2025-03-31T23:59:59Z]',
  limit: 200, offset: 0
)
req = Net::HTTP::Get.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
transactions = JSON.parse(res.body)['transactions']`,

    java: `// Sell Finances REST API: getTransactions
// filter: transactionDate / transactionType / transactionStatus 等
// transactionType: SALE / REFUND / RETURN / TRANSFER / etc.
String filter = "transactionDate:[2025-01-01T00:00:00Z..2025-03-31T23:59:59Z]";
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://apiz.ebay.com/sell/finances/v1/transaction" +
        "?filter=" + URLEncoder.encode(filter, "UTF-8") + "&limit=200&offset=0"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .GET().build();
http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Sell Finances REST API: getTransactions
// filter: transactionDate / transactionType (SALE/REFUND/RETURN/TRANSFER) 等
const filter = 'transactionDate:[2025-01-01T00:00:00Z..2025-03-31T23:59:59Z]';
const params = new URLSearchParams({ filter, limit: '200', offset: '0' });
const { transactions } = await fetch(
  \`https://apiz.ebay.com/sell/finances/v1/transaction?\${params}\`,
  { headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US' } }
).then(r => r.json());`,

    go: `// Sell Finances REST API: getTransactions
// transactionType: SALE / REFUND / RETURN / TRANSFER / etc.
filter := url.QueryEscape("transactionDate:[2025-01-01T00:00:00Z..2025-03-31T23:59:59Z]")
req, _ := http.NewRequest("GET",
    "https://apiz.ebay.com/sell/finances/v1/transaction?filter="+filter+"&limit=200",
    nil)
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
http.DefaultClient.Do(req)`,

    python: `# Sell Finances REST API: getTransactions
# filter: transactionDate / transactionType / transactionStatus 等
# transactionType: SALE / REFUND / RETURN / TRANSFER / etc.
# 注意: EU/UK の場合は Digital Signatures ヘッダーが必要
import requests
res = requests.get(
    'https://apiz.ebay.com/sell/finances/v1/transaction',
    params={
        'filter': 'transactionDate:[2025-01-01T00:00:00Z..2025-03-31T23:59:59Z]',
        'limit': 200,
        'offset': 0,
    },
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    },
)
transactions = res.json()['transactions']`,
  } as Record<Lang, string>,
};

// ─── GetStore → Stores API getStore ──────────────────────────────────────────
// Old: Trading API GetStore
//   Optional: UserID, CategoryStructureOnly, LevelLimit (max 3), RootCategoryID
// New: Sell Stores REST API
//   GET /sell/stores/v1/store          — getStore
//   GET /sell/stores/v1/store/categories — getStoreCategories

export const getStore: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetStore + GetStoreCategories
// LevelLimit: 返す分類階層の最大深さ (1〜3)
// CategoryStructureOnly=true で分類構造のみ返す
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetStoreRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CategoryStructureOnly>false</CategoryStructureOnly>
  <LevelLimit>2</LevelLimit>
</GetStoreRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetStore`,

    ruby: `# Trading API: GetStore
# LevelLimit: 返す分類階層の最大深さ (1〜3)
body = <<~XML
  <GetStoreRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <CategoryStructureOnly>false</CategoryStructureOnly>
    <LevelLimit>2</LevelLimit>
  </GetStoreRequest>
XML
# X-EBAY-API-CALL-NAME: GetStore`,

    java: `// Trading API: GetStore
String body = """
    <GetStoreRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <CategoryStructureOnly>false</CategoryStructureOnly>
      <LevelLimit>2</LevelLimit>
    </GetStoreRequest>""";
// X-EBAY-API-CALL-NAME: GetStore`,

    nodejs: `// Trading API: GetStore
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetStore', 'Content-Type': 'text/xml' },
  body: \`<GetStoreRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CategoryStructureOnly>false</CategoryStructureOnly>
  <LevelLimit>2</LevelLimit>
</GetStoreRequest>\`,
});`,

    go: `// Trading API: GetStore
body := \`<GetStoreRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CategoryStructureOnly>false</CategoryStructureOnly>
  <LevelLimit>2</LevelLimit>
</GetStoreRequest>\`
// X-EBAY-API-CALL-NAME: GetStore`,

    python: `# Trading API: GetStore
import requests
body = """<GetStoreRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CategoryStructureOnly>false</CategoryStructureOnly>
  <LevelLimit>2</LevelLimit>
</GetStoreRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetStore', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Sell Stores REST API: getStore / getStoreCategories
// 注意: 新APIは自身の店舗のみ。UserID による他ユーザー店舗取得不可
$headers = ['Authorization: Bearer YOUR_ACCESS_TOKEN'];

// 店舗情報
$ch = curl_init('https://api.ebay.com/sell/stores/v1/store');
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => $headers]);
$store = json_decode(curl_exec($ch), true);
curl_close($ch);

// 店舗カスタム分類 (最大 3 階層)
$ch2 = curl_init('https://api.ebay.com/sell/stores/v1/store/categories');
curl_setopt_array($ch2, [CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => $headers]);
$categories = json_decode(curl_exec($ch2), true);
curl_close($ch2);`,

    ruby: `# Sell Stores REST API: getStore / getStoreCategories
# 注意: 自身の店舗のみ。UserID による他ユーザー取得不可
require 'net/http'; require 'json'

auth_header = 'Bearer YOUR_ACCESS_TOKEN'

# 店舗情報
uri = URI('https://api.ebay.com/sell/stores/v1/store')
req = Net::HTTP::Get.new(uri)
req['Authorization'] = auth_header
store = JSON.parse(Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }.body)

# 店舗カスタム分類 (最大 3 階層)
uri2 = URI('https://api.ebay.com/sell/stores/v1/store/categories')
req2 = Net::HTTP::Get.new(uri2)
req2['Authorization'] = auth_header
cats = JSON.parse(Net::HTTP.start(uri2.host, 443, use_ssl: true) { |h| h.request(req2) }.body)`,

    java: `// Sell Stores REST API: getStore / getStoreCategories
// 注意: 自身の店舗のみ
// 店舗情報
HttpRequest req1 = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/sell/stores/v1/store"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .GET().build();
HttpResponse<String> store = http.send(req1, HttpResponse.BodyHandlers.ofString());

// 店舗カスタム分類
HttpRequest req2 = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/sell/stores/v1/store/categories"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .GET().build();
HttpResponse<String> cats = http.send(req2, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Sell Stores REST API: getStore / getStoreCategories
// 注意: 自身の店舗のみ。UserID による他ユーザー取得不可
const headers = { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN' };

const [store, categories] = await Promise.all([
  fetch('https://api.ebay.com/sell/stores/v1/store',            { headers }).then(r => r.json()),
  fetch('https://api.ebay.com/sell/stores/v1/store/categories', { headers }).then(r => r.json()),
]);`,

    go: `// Sell Stores REST API: getStore / getStoreCategories — 自身のみ
auth := "Bearer YOUR_ACCESS_TOKEN"

for _, path := range []string{"/store", "/store/categories"} {
    req, _ := http.NewRequest("GET",
        "https://api.ebay.com/sell/stores/v1"+path, nil)
    req.Header.Set("Authorization", auth)
    http.DefaultClient.Do(req)
}`,

    python: `# Sell Stores REST API: getStore / getStoreCategories
# 注意: 自身の店舗のみ。UserID による他ユーザー取得不可
import requests
headers = {'Authorization': 'Bearer YOUR_ACCESS_TOKEN'}

store      = requests.get('https://api.ebay.com/sell/stores/v1/store',            headers=headers).json()
categories = requests.get('https://api.ebay.com/sell/stores/v1/store/categories', headers=headers).json()`,
  } as Record<Lang, string>,
};

// ─── GetTaxTable / SetTaxTable → Account API v1 sales_tax ───────────────────
// Old: Trading API GetTaxTable / SetTaxTable
// New: Sell Account REST API v1
//   GET /sell/account/v1/sales_tax?country_code=US   → getSalesTaxes (US と CA のみ対応)
//   PUT /sell/account/v1/sales_tax/{countryCode}/{jurisdictionId} → createOrReplaceSalesTax

export const salesTax: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetTaxTable (税率テーブル取得)
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetTaxTableRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <DetailLevel>ReturnAll</DetailLevel>
</GetTaxTableRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetTaxTable

// Trading API: SetTaxTable (税率テーブル更新)
$setBody = '<?xml version="1.0" encoding="utf-8"?>
<SetTaxTableRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <TaxTable>
    <TaxJurisdiction>
      <JurisdictionID>CA</JurisdictionID>
      <SalesTaxPercent>8.5</SalesTaxPercent>
      <ShippingIncludedInTax>false</ShippingIncludedInTax>
    </TaxJurisdiction>
  </TaxTable>
</SetTaxTableRequest>';
// X-EBAY-API-CALL-NAME: SetTaxTable`,

    ruby: `# Trading API: GetTaxTable / SetTaxTable
body = <<~XML
  <GetTaxTableRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <DetailLevel>ReturnAll</DetailLevel>
  </GetTaxTableRequest>
XML
# X-EBAY-API-CALL-NAME: GetTaxTable`,

    java: `// Trading API: GetTaxTable
String body = """
    <GetTaxTableRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <DetailLevel>ReturnAll</DetailLevel>
    </GetTaxTableRequest>""";
// X-EBAY-API-CALL-NAME: GetTaxTable`,

    nodejs: `// Trading API: GetTaxTable
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetTaxTable', 'Content-Type': 'text/xml' },
  body: \`<GetTaxTableRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <DetailLevel>ReturnAll</DetailLevel>
</GetTaxTableRequest>\`,
});`,

    go: `// Trading API: GetTaxTable
body := \`<GetTaxTableRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <DetailLevel>ReturnAll</DetailLevel>
</GetTaxTableRequest>\`
// X-EBAY-API-CALL-NAME: GetTaxTable`,

    python: `# Trading API: GetTaxTable / SetTaxTable
import requests
body = """<GetTaxTableRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <DetailLevel>ReturnAll</DetailLevel>
</GetTaxTableRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetTaxTable', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Sell Account API v1: getSalesTaxes / createOrReplaceSalesTax
// 注意: US と CA のみ対応 (country_code)
$headers = ['Authorization: Bearer YOUR_ACCESS_TOKEN'];

// 税率取得 (US の全 jurisdiction)
$ch = curl_init('https://api.ebay.com/sell/account/v1/sales_tax?country_code=US');
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => $headers]);
$taxes = json_decode(curl_exec($ch), true);
curl_close($ch);

// 税率設定 (PUT で upsert)
$ch2 = curl_init('https://api.ebay.com/sell/account/v1/sales_tax/US/CA');
curl_setopt_array($ch2, [
    CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => array_merge($headers, ['Content-Type: application/json']),
    CURLOPT_POSTFIELDS => json_encode([
        'salesTaxPercentage' => '8.5',
        'shippingAndHandlingTaxed' => false,
    ]),
]);
curl_exec($ch2); curl_close($ch2);`,

    ruby: `# Sell Account API v1: getSalesTaxes / createOrReplaceSalesTax
# 注意: US と CA のみ対応
require 'net/http'; require 'json'

# 税率取得
uri = URI('https://api.ebay.com/sell/account/v1/sales_tax?country_code=US')
req = Net::HTTP::Get.new(uri)
req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
taxes = JSON.parse(res.body)

# 税率設定 (CA 州: 8.5%)
uri2 = URI('https://api.ebay.com/sell/account/v1/sales_tax/US/CA')
req2 = Net::HTTP::Put.new(uri2)
req2['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
req2['Content-Type']  = 'application/json'
req2.body = { salesTaxPercentage: '8.5', shippingAndHandlingTaxed: false }.to_json
Net::HTTP.start(uri2.host, 443, use_ssl: true) { |h| h.request(req2) }`,

    java: `// Sell Account API v1: getSalesTaxes / createOrReplaceSalesTax
// 注意: country_code は US と CA のみ対応
// 税率取得
HttpRequest getReq = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/sell/account/v1/sales_tax?country_code=US"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .GET().build();
http.send(getReq, HttpResponse.BodyHandlers.ofString());

// 税率設定 (PUT で upsert: countryCode/jurisdictionId)
String body = """{"salesTaxPercentage":"8.5","shippingAndHandlingTaxed":false}""";
HttpRequest putReq = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/sell/account/v1/sales_tax/US/CA"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .PUT(HttpRequest.BodyPublishers.ofString(body)).build();
http.send(putReq, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Sell Account API v1: getSalesTaxes / createOrReplaceSalesTax
// 注意: country_code は US と CA のみ対応
const headers = { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN' };

// 税率取得
const { salesTaxes } = await fetch(
  'https://api.ebay.com/sell/account/v1/sales_tax?country_code=US',
  { headers }
).then(r => r.json());

// 税率設定 (PUT で upsert: /sales_tax/{countryCode}/{jurisdictionId})
await fetch('https://api.ebay.com/sell/account/v1/sales_tax/US/CA', {
  method: 'PUT',
  headers: { ...headers, 'Content-Type': 'application/json' },
  body: JSON.stringify({ salesTaxPercentage: '8.5', shippingAndHandlingTaxed: false }),
});`,

    go: `// Sell Account API v1: getSalesTaxes / createOrReplaceSalesTax
// 注意: country_code は US と CA のみ対応
auth := "Bearer YOUR_ACCESS_TOKEN"

// 税率取得
req, _ := http.NewRequest("GET",
    "https://api.ebay.com/sell/account/v1/sales_tax?country_code=US", nil)
req.Header.Set("Authorization", auth)
http.DefaultClient.Do(req)

// 税率設定 (PUT で upsert)
body := \`{"salesTaxPercentage":"8.5","shippingAndHandlingTaxed":false}\`
req2, _ := http.NewRequest("PUT",
    "https://api.ebay.com/sell/account/v1/sales_tax/US/CA", strings.NewReader(body))
req2.Header.Set("Authorization", auth)
req2.Header.Set("Content-Type", "application/json")
http.DefaultClient.Do(req2)`,

    python: `# Sell Account API v1: getSalesTaxes / createOrReplaceSalesTax
# 注意: country_code は US と CA のみ対応
import requests

headers = {'Authorization': 'Bearer YOUR_ACCESS_TOKEN'}

# 税率取得
taxes = requests.get(
    'https://api.ebay.com/sell/account/v1/sales_tax',
    params={'country_code': 'US'},
    headers=headers,
).json()

# 税率設定 (PUT で upsert: /sales_tax/{countryCode}/{jurisdictionId})
requests.put(
    'https://api.ebay.com/sell/account/v1/sales_tax/US/CA',
    headers={**headers, 'Content-Type': 'application/json'},
    json={'salesTaxPercentage': '8.5', 'shippingAndHandlingTaxed': False},
)`,
  } as Record<Lang, string>,
};

// ─── SetUserNotes → User Note API (GraphQL) ──────────────────────────────────
// Old: Trading API SetUserNotes
//   Action: AddOrUpdate (add/update) / Delete
//   ItemID required, TransactionID optional
// New: GraphQL createOrReplaceUserNote / deleteUserNote
//   createOrReplaceUserNote: { itemId: ID!, orderLineItemId: ID, userNote: String! }
//   deleteUserNote:           { itemId: ID!, orderLineItemId: ID }
//   Scope: commerce.usernote

export const setUserNotes: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: SetUserNotes
// Action: AddOrUpdate (追加・更新) / Delete (削除)
// ItemID は必須 / TransactionID は任意（複数取引がある場合に指定）
$body = '<?xml version="1.0" encoding="utf-8"?>
<SetUserNotesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <Action>AddOrUpdate</Action>
  <NoteText>Check return policy before shipping.</NoteText>
</SetUserNotesRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: SetUserNotes`,

    ruby: `# Trading API: SetUserNotes
# Action: AddOrUpdate / Delete
body = <<~XML
  <SetUserNotesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ItemID>123456789</ItemID>
    <Action>AddOrUpdate</Action>
    <NoteText>Check return policy before shipping.</NoteText>
  </SetUserNotesRequest>
XML
# X-EBAY-API-CALL-NAME: SetUserNotes`,

    java: `// Trading API: SetUserNotes (Action: AddOrUpdate / Delete)
String body = """
    <SetUserNotesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ItemID>123456789</ItemID>
      <Action>AddOrUpdate</Action>
      <NoteText>Check return policy before shipping.</NoteText>
    </SetUserNotesRequest>""";
// X-EBAY-API-CALL-NAME: SetUserNotes`,

    nodejs: `// Trading API: SetUserNotes (Action: AddOrUpdate / Delete)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'SetUserNotes', 'Content-Type': 'text/xml' },
  body: \`<SetUserNotesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <Action>AddOrUpdate</Action>
  <NoteText>Check return policy before shipping.</NoteText>
</SetUserNotesRequest>\`,
});`,

    go: `// Trading API: SetUserNotes (Action: AddOrUpdate / Delete)
body := \`<SetUserNotesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <Action>AddOrUpdate</Action>
  <NoteText>Check return policy before shipping.</NoteText>
</SetUserNotesRequest>\`
// X-EBAY-API-CALL-NAME: SetUserNotes`,

    python: `# Trading API: SetUserNotes (Action: AddOrUpdate / Delete)
import requests
body = """<SetUserNotesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <Action>AddOrUpdate</Action>
  <NoteText>Check return policy before shipping.</NoteText>
</SetUserNotesRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'SetUserNotes', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// GraphQL: createOrReplaceUserNote / deleteUserNote
// scope: commerce.usernote
// itemId: 必須 / orderLineItemId: 任意 / userNote: 必須 (add/update)

// 追加・更新
$addQuery = <<<'GQL'
mutation {
  createOrReplaceUserNote(input: {
    itemId: "123456789"
    userNote: "Check return policy before shipping."
  }) {
    ... on CreateOrReplaceUserNoteSuccess {
      userNote { note }
    }
    ... on ReferenceArgumentsNotFound { errorCode errorMessage }
  }
}
GQL;

// 削除
$deleteQuery = <<<'GQL'
mutation {
  deleteUserNote(input: { itemId: "123456789" }) {
    ... on DeleteUserNoteSuccess { userNote { note } }
    ... on ReferenceArgumentsNotFound { errorCode errorMessage }
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
    CURLOPT_POSTFIELDS => json_encode(['query' => $addQuery]),
]);
curl_exec($ch); curl_close($ch);`,

    ruby: `# GraphQL: createOrReplaceUserNote / deleteUserNote
# scope: commerce.usernote
require 'net/http'; require 'json'

# 追加・更新
add_query = <<~GQL
  mutation {
    createOrReplaceUserNote(input: {
      itemId: "123456789"
      userNote: "Check return policy before shipping."
    }) {
      ... on CreateOrReplaceUserNoteSuccess { userNote { note } }
      ... on ReferenceArgumentsNotFound { errorCode errorMessage }
    }
  }
GQL

uri = URI('https://graphqlapi.ebay.com/graphql')
req = Net::HTTP::Post.new(uri)
req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req['Content-Type'] = 'application/json'
req.body = { query: add_query }.to_json
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// GraphQL: createOrReplaceUserNote / deleteUserNote — scope: commerce.usernote
String addQuery = """
    mutation {
      createOrReplaceUserNote(input: {
        itemId: \\"123456789\\"
        userNote: \\"Check return policy before shipping.\\"
      }) {
        ... on CreateOrReplaceUserNoteSuccess { userNote { note } }
        ... on ReferenceArgumentsNotFound { errorCode errorMessage }
      }
    }""";

String deleteQuery = """
    mutation {
      deleteUserNote(input: { itemId: \\"123456789\\" }) {
        ... on DeleteUserNoteSuccess { userNote { note } }
        ... on ReferenceArgumentsNotFound { errorCode errorMessage }
      }
    }""";
// POST https://graphqlapi.ebay.com/graphql`,

    nodejs: `// GraphQL: createOrReplaceUserNote / deleteUserNote — scope: commerce.usernote
const gql = (q) => fetch('https://graphqlapi.ebay.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: q }),
}).then(r => r.json());

// 追加・更新
await gql(\`mutation {
  createOrReplaceUserNote(input: {
    itemId: "123456789"
    userNote: "Check return policy before shipping."
  }) {
    ... on CreateOrReplaceUserNoteSuccess { userNote { note } }
    ... on ReferenceArgumentsNotFound { errorCode errorMessage }
  }
}\`);

// 削除
await gql(\`mutation {
  deleteUserNote(input: { itemId: "123456789" }) {
    ... on DeleteUserNoteSuccess { userNote { note } }
    ... on ReferenceArgumentsNotFound { errorCode errorMessage }
  }
}\`);`,

    go: `// GraphQL: createOrReplaceUserNote / deleteUserNote — scope: commerce.usernote
addBody := \`{"query":"mutation { createOrReplaceUserNote(input: { itemId: \\"123456789\\" userNote: \\"Check return policy.\\" }) { ... on CreateOrReplaceUserNoteSuccess { userNote { note } } ... on ReferenceArgumentsNotFound { errorCode errorMessage } } }"}\`
req, _ := http.NewRequest("POST",
    "https://graphqlapi.ebay.com/graphql",
    strings.NewReader(addBody))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")
http.DefaultClient.Do(req)`,

    python: `# GraphQL: createOrReplaceUserNote / deleteUserNote — scope: commerce.usernote
import requests

def gql(query):
    return requests.post('https://graphqlapi.ebay.com/graphql',
        headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
                 'Content-Type': 'application/json'},
        json={'query': query}).json()

# 追加・更新
gql("""mutation {
  createOrReplaceUserNote(input: {
    itemId: "123456789"
    userNote: "Check return policy before shipping."
  }) {
    ... on CreateOrReplaceUserNoteSuccess { userNote { note } }
    ... on ReferenceArgumentsNotFound { errorCode errorMessage }
  }
}""")

# 削除
gql("""mutation {
  deleteUserNote(input: { itemId: "123456789" }) {
    ... on DeleteUserNoteSuccess { userNote { note } }
    ... on ReferenceArgumentsNotFound { errorCode errorMessage }
  }
}""")`,
  } as Record<Lang, string>,
};

// ─── SetStoreCategories → Stores API ─────────────────────────────────────────
// Old: Trading API SetStoreCategories (Action: Add/Rename/Delete/Move)
// New: Sell Stores REST API
//   POST   /sell/stores/v1/store/categories             → addStoreCategory (Async)
//   PUT    /sell/stores/v1/store/categories/{id}        → renameStoreCategory (Sync)
//   DELETE /sell/stores/v1/store/categories/{id}        → deleteStoreCategory (Async)
//   POST   /sell/stores/v1/store/categories/move_category → moveStoreCategory (Async)

export const setStoreCategories: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: SetStoreCategories
// Action: Add / Rename / Delete / Move
$body = '<?xml version="1.0" encoding="utf-8"?>
<SetStoreCategoriesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <StoreCategoryUpdateAction>Add</StoreCategoryUpdateAction>
  <StoreCategories>
    <StoreCategory>
      <Name>Electronics</Name>
    </StoreCategory>
  </StoreCategories>
</SetStoreCategoriesRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: SetStoreCategories`,

    ruby: `# Trading API: SetStoreCategories (Action: Add / Rename / Delete / Move)
body = <<~XML
  <SetStoreCategoriesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <StoreCategoryUpdateAction>Add</StoreCategoryUpdateAction>
    <StoreCategories>
      <StoreCategory><Name>Electronics</Name></StoreCategory>
    </StoreCategories>
  </SetStoreCategoriesRequest>
XML
# X-EBAY-API-CALL-NAME: SetStoreCategories`,

    java: `// Trading API: SetStoreCategories (Action: Add / Rename / Delete / Move)
String body = """
    <SetStoreCategoriesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <StoreCategoryUpdateAction>Add</StoreCategoryUpdateAction>
      <StoreCategories>
        <StoreCategory><Name>Electronics</Name></StoreCategory>
      </StoreCategories>
    </SetStoreCategoriesRequest>""";
// X-EBAY-API-CALL-NAME: SetStoreCategories`,

    nodejs: `// Trading API: SetStoreCategories (Action: Add / Rename / Delete / Move)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'SetStoreCategories', 'Content-Type': 'text/xml' },
  body: \`<SetStoreCategoriesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <StoreCategoryUpdateAction>Add</StoreCategoryUpdateAction>
  <StoreCategories>
    <StoreCategory><Name>Electronics</Name></StoreCategory>
  </StoreCategories>
</SetStoreCategoriesRequest>\`,
});`,

    go: `// Trading API: SetStoreCategories (Action: Add / Rename / Delete / Move)
body := \`<SetStoreCategoriesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <StoreCategoryUpdateAction>Add</StoreCategoryUpdateAction>
  <StoreCategories>
    <StoreCategory><Name>Electronics</Name></StoreCategory>
  </StoreCategories>
</SetStoreCategoriesRequest>\`
// X-EBAY-API-CALL-NAME: SetStoreCategories`,

    python: `# Trading API: SetStoreCategories (Action: Add / Rename / Delete / Move)
import requests
body = """<SetStoreCategoriesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <StoreCategoryUpdateAction>Add</StoreCategoryUpdateAction>
  <StoreCategories>
    <StoreCategory><Name>Electronics</Name></StoreCategory>
  </StoreCategories>
</SetStoreCategoriesRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'SetStoreCategories', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Sell Stores REST API: Add / Rename / Delete store category
// 注意: Add と Delete は非同期（タスクIDが返る）/ Rename は同期
$headers = [
    'Authorization: Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
    'Content-Type: application/json',
];

// カテゴリ追加 (非同期 - POST /store/categories)
$ch = curl_init('https://api.ebay.com/sell/stores/v1/store/categories');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_POSTFIELDS => json_encode(['categoryName' => 'Electronics']),
]);
$addResult = json_decode(curl_exec($ch), true); // taskId が返る
curl_close($ch);

// カテゴリ名変更 (同期 - PUT /store/categories/{category_id})
$categoryId = '12345';
$ch2 = curl_init("https://api.ebay.com/sell/stores/v1/store/categories/{$categoryId}");
curl_setopt_array($ch2, [
    CURLOPT_CUSTOMREQUEST => 'PUT', CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_POSTFIELDS => json_encode(['categoryName' => 'Consumer Electronics']),
]);
curl_exec($ch2); curl_close($ch2);

// カテゴリ削除 (非同期 - DELETE /store/categories/{category_id})
$ch3 = curl_init("https://api.ebay.com/sell/stores/v1/store/categories/{$categoryId}");
curl_setopt_array($ch3, [
    CURLOPT_CUSTOMREQUEST => 'DELETE', CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => $headers,
]);
curl_exec($ch3); curl_close($ch3);`,

    ruby: `# Sell Stores REST API: Add / Rename / Delete store category
# Add と Delete は非同期（taskId が返る）/ Rename は同期
require 'net/http'; require 'json'

auth   = 'Bearer YOUR_ACCESS_TOKEN'
base   = 'https://api.ebay.com/sell/stores/v1'

# 追加 (非同期)
uri = URI("#{base}/store/categories")
req = Net::HTTP::Post.new(uri)
req['Authorization'] = auth; req['Content-Type'] = 'application/json'
req.body = { categoryName: 'Electronics' }.to_json
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }

# 名前変更 (同期)
uri2 = URI("#{base}/store/categories/12345")
req2 = Net::HTTP::Put.new(uri2)
req2['Authorization'] = auth; req2['Content-Type'] = 'application/json'
req2.body = { categoryName: 'Consumer Electronics' }.to_json
Net::HTTP.start(uri2.host, 443, use_ssl: true) { |h| h.request(req2) }

# 削除 (非同期)
uri3 = URI("#{base}/store/categories/12345")
req3 = Net::HTTP::Delete.new(uri3)
req3['Authorization'] = auth
Net::HTTP.start(uri3.host, 443, use_ssl: true) { |h| h.request(req3) }`,

    java: `// Sell Stores REST API: Add / Rename / Delete store category
// Add と Delete は非同期（taskId が返る）/ Rename は同期
// 追加 (非同期)
HttpRequest addReq = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/sell/stores/v1/store/categories"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("""{"categoryName":"Electronics"}"""))
    .build();
http.send(addReq, HttpResponse.BodyHandlers.ofString());

// 名前変更 (同期)
HttpRequest renameReq = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/sell/stores/v1/store/categories/12345"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .PUT(HttpRequest.BodyPublishers.ofString("""{"categoryName":"Consumer Electronics"}"""))
    .build();
http.send(renameReq, HttpResponse.BodyHandlers.ofString());

// 削除 (非同期)
HttpRequest deleteReq = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/sell/stores/v1/store/categories/12345"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .DELETE().build();
http.send(deleteReq, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Sell Stores REST API: Add / Rename / Delete store category
// Add と Delete は非同期（taskId が返る）/ Rename は同期
const base = 'https://api.ebay.com/sell/stores/v1';
const headers = { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json' };

// 追加 (非同期)
const { taskId } = await fetch(\`\${base}/store/categories\`, {
  method: 'POST', headers,
  body: JSON.stringify({ categoryName: 'Electronics' }),
}).then(r => r.json());

// 名前変更 (同期)
await fetch(\`\${base}/store/categories/12345\`, {
  method: 'PUT', headers,
  body: JSON.stringify({ categoryName: 'Consumer Electronics' }),
});

// 削除 (非同期)
await fetch(\`\${base}/store/categories/12345\`, { method: 'DELETE', headers });`,

    go: `// Sell Stores REST API: Add / Rename / Delete store category
// Add と Delete は非同期（taskId が返る）/ Rename は同期
auth := "Bearer YOUR_ACCESS_TOKEN"
base := "https://api.ebay.com/sell/stores/v1"

// 追加 (非同期)
addReq, _ := http.NewRequest("POST", base+"/store/categories",
    strings.NewReader(\`{"categoryName":"Electronics"}\`))
addReq.Header.Set("Authorization", auth)
addReq.Header.Set("Content-Type", "application/json")
http.DefaultClient.Do(addReq)

// 名前変更 (同期)
renameReq, _ := http.NewRequest("PUT", base+"/store/categories/12345",
    strings.NewReader(\`{"categoryName":"Consumer Electronics"}\`))
renameReq.Header.Set("Authorization", auth)
renameReq.Header.Set("Content-Type", "application/json")
http.DefaultClient.Do(renameReq)

// 削除 (非同期)
deleteReq, _ := http.NewRequest("DELETE", base+"/store/categories/12345", nil)
deleteReq.Header.Set("Authorization", auth)
http.DefaultClient.Do(deleteReq)`,

    python: `# Sell Stores REST API: Add / Rename / Delete store category
# Add と Delete は非同期（taskId が返る）/ Rename は同期
import requests

base    = 'https://api.ebay.com/sell/stores/v1'
headers = {'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'Content-Type': 'application/json'}

# 追加 (非同期 → taskId で進捗確認)
add_res = requests.post(f'{base}/store/categories',
    headers=headers, json={'categoryName': 'Electronics'})
task_id = add_res.json().get('taskId')

# 名前変更 (同期)
requests.put(f'{base}/store/categories/12345',
    headers=headers, json={'categoryName': 'Consumer Electronics'})

# 削除 (非同期)
requests.delete(f'{base}/store/categories/12345', headers=headers)`,
  } as Record<Lang, string>,
};

// ─── GetUserPreferences / SetUserPreferences → Account API v2 ────────────────
// Old: Trading API GetUserPreferences / SetUserPreferences
//   GetUserPreferences は BidderNoticePreferences / OutOfStockControlPreferences /
//   SellerPaymentPreferences など多岐にわたる設定を一括返却していた。
// New: 設定ごとに異なる API に分散
//   支払設定 (中国本土セラーのみ): Account API v2 GET /sell/account/v2/payout_settings
//   その他の設定: 各機能 API または非対応 (廃止)

export const userPreferences: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetUserPreferences
// BidderNoticePreferences / OutOfStockControlPreferences /
// SellerPaymentPreferences 等、多岐にわたる設定を一括返却
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetUserPreferencesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ShowOutOfStockControlPreference>true</ShowOutOfStockControlPreference>
  <ShowSellerPaymentPreferences>true</ShowSellerPaymentPreferences>
</GetUserPreferencesRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetUserPreferences`,

    ruby: `# Trading API: GetUserPreferences
body = <<~XML
  <GetUserPreferencesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ShowOutOfStockControlPreference>true</ShowOutOfStockControlPreference>
    <ShowSellerPaymentPreferences>true</ShowSellerPaymentPreferences>
  </GetUserPreferencesRequest>
XML
# X-EBAY-API-CALL-NAME: GetUserPreferences`,

    java: `// Trading API: GetUserPreferences (多岐にわたる設定を一括返却)
String body = """
    <GetUserPreferencesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ShowOutOfStockControlPreference>true</ShowOutOfStockControlPreference>
      <ShowSellerPaymentPreferences>true</ShowSellerPaymentPreferences>
    </GetUserPreferencesRequest>""";
// X-EBAY-API-CALL-NAME: GetUserPreferences`,

    nodejs: `// Trading API: GetUserPreferences (多岐にわたる設定を一括返却)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetUserPreferences', 'Content-Type': 'text/xml' },
  body: \`<GetUserPreferencesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ShowOutOfStockControlPreference>true</ShowOutOfStockControlPreference>
</GetUserPreferencesRequest>\`,
});`,

    go: `// Trading API: GetUserPreferences (多岐にわたる設定を一括返却)
body := \`<GetUserPreferencesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ShowOutOfStockControlPreference>true</ShowOutOfStockControlPreference>
</GetUserPreferencesRequest>\`
// X-EBAY-API-CALL-NAME: GetUserPreferences`,

    python: `# Trading API: GetUserPreferences (多岐にわたる設定を一括返却)
import requests
body = """<GetUserPreferencesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ShowOutOfStockControlPreference>true</ShowOutOfStockControlPreference>
  <ShowSellerPaymentPreferences>true</ShowSellerPaymentPreferences>
</GetUserPreferencesRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetUserPreferences', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// 注意: GetUserPreferences の設定群は新 API では複数 API に分散し、一部は非対応
// 【支払設定】Account API v2: GET /sell/account/v2/payout_settings (中国本土セラーのみ)
// 【在庫不足制御】新 API に同等の設定なし (Listing API の createListing に統合)
// 【Out-of-stock control】新 API では listingFormat: FIXED_PRICE の GTC が同等機能

// 支払設定取得例 (Account API v2 payout_settings)
$ch = curl_init('https://api.ebay.com/sell/account/v2/payout_settings');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
    ],
]);
$settings = json_decode(curl_exec($ch), true);
curl_close($ch);
// $settings['paymentInstruments'] → 支払手段一覧 (instrumentId, type, status, payoutPercentage)`,

    ruby: `# 注意: GetUserPreferences は新 API では複数 API に分散 (一部非対応)
# 支払設定: Account API v2 /payout_settings (中国本土セラーのみ)
# 在庫不足制御 / BidderNoticePreferences: 新 API に同等設定なし
require 'net/http'; require 'json'
uri = URI('https://api.ebay.com/sell/account/v2/payout_settings')
req = Net::HTTP::Get.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
settings = JSON.parse(res.body)
# settings['paymentInstruments'] → 支払手段一覧`,

    java: `// 注意: GetUserPreferences は新 API では複数 API に分散 (一部非対応)
// 支払設定: Account API v2 payout_settings (中国本土セラーのみ)
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/sell/account/v2/payout_settings"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .GET().build();
http.send(req, HttpResponse.BodyHandlers.ofString());
// paymentInstruments[] → instrumentId / type / status / payoutPercentage`,

    nodejs: `// 注意: GetUserPreferences は新 API では複数 API に分散 (一部非対応)
// 支払設定: Account API v2 payout_settings (中国本土セラーのみ)
// 在庫不足制御 / BidderNoticePreferences: 新 API に同等設定なし
const settings = await fetch('https://api.ebay.com/sell/account/v2/payout_settings', {
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
  },
}).then(r => r.json());
// settings.paymentInstruments → 支払手段一覧`,

    go: `// 注意: GetUserPreferences は新 API では複数 API に分散 (一部非対応)
// 支払設定: Account API v2 payout_settings (中国本土セラーのみ)
req, _ := http.NewRequest("GET",
    "https://api.ebay.com/sell/account/v2/payout_settings", nil)
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
http.DefaultClient.Do(req)
// response.paymentInstruments → 支払手段一覧`,

    python: `# 注意: GetUserPreferences は新 API では複数 API に分散 (一部非対応)
# 支払設定: Account API v2 payout_settings (中国本土セラーのみ)
# 在庫不足制御 / BidderNoticePreferences: 新 API に同等設定なし
import requests
settings = requests.get(
    'https://api.ebay.com/sell/account/v2/payout_settings',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    },
).json()
# settings['paymentInstruments'] → 支払手段一覧`,
  } as Record<Lang, string>,
};

// ─── Map: oldApi name → snippet ──────────────────────────────────────────────

export const accountSnippetByOldApi: Record<string, ApiCallSnippet> = {
  "GetUser (Trading API)":           getUser,
  "GetAccount (listing fees)":       getTransactions,
  "GetAccount (transactions)":       getTransactions,
  "GetStore":                        getStore,
  "GetStore (category hierarchy)":   getStore,
  "SetUserNotes (add/update)":       setUserNotes,
  "SetUserNotes (delete)":           setUserNotes,
  "SetStoreCategories (add)":        setStoreCategories,
  "SetStoreCategories (rename)":     setStoreCategories,
  "SetStoreCategories (delete)":     setStoreCategories,
  "GetUserPreferences":              userPreferences,
  "SetUserPreferences":              userPreferences,
  "GetTaxTable":                     salesTax,
  "SetTaxTable (single)":            salesTax,
};
