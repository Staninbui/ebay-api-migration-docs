import type { Lang } from "@/components/CodeTabs";

export interface ApiCallSnippet {
  old: Record<Lang, string>;
  new: Record<Lang, string>;
}

// ─── GetCategories → getCategoryTree ─────────────────────────────────────────
// Old: Trading API GetCategories
//   CategorySiteID / LevelLimit / ViewAllNodes / CategoryParent
// New: Taxonomy API  two-step:
//   Step 1: GET /commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US
//   Step 2: GET /commerce/taxonomy/v1/category_tree/{category_tree_id}  (use gzip)
//   marketplace_id values: EBAY_US / EBAY_GB / EBAY_DE / EBAY_JP / EBAY_AU / EBAY_FR / EBAY_IT / EBAY_ES

export const getCategories: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetCategories
// LevelLimit: 返すカテゴリ階層の最大深さ (1=トップレベルのみ)
// ViewAllNodes: true=全ノード / false=葉ノードのみ
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetCategoriesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CategorySiteID>0</CategorySiteID>
  <LevelLimit>1</LevelLimit>
  <ViewAllNodes>true</ViewAllNodes>
  <DetailLevel>ReturnAll</DetailLevel>
</GetCategoriesRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetCategories`,

    ruby: `# Trading API: GetCategories
# LevelLimit: 返す階層の最大深さ / ViewAllNodes: true=全ノード
body = <<~XML
  <GetCategoriesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <CategorySiteID>0</CategorySiteID>
    <LevelLimit>1</LevelLimit>
    <ViewAllNodes>true</ViewAllNodes>
    <DetailLevel>ReturnAll</DetailLevel>
  </GetCategoriesRequest>
XML
# X-EBAY-API-CALL-NAME: GetCategories`,

    java: `// Trading API: GetCategories
// LevelLimit: 返す階層の最大深さ / ViewAllNodes: true=全ノード
String body = """
    <GetCategoriesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <CategorySiteID>0</CategorySiteID>
      <LevelLimit>1</LevelLimit>
      <ViewAllNodes>true</ViewAllNodes>
      <DetailLevel>ReturnAll</DetailLevel>
    </GetCategoriesRequest>""";
// X-EBAY-API-CALL-NAME: GetCategories`,

    nodejs: `// Trading API: GetCategories
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetCategories', 'Content-Type': 'text/xml' },
  body: \`<GetCategoriesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CategorySiteID>0</CategorySiteID>
  <LevelLimit>1</LevelLimit>
  <ViewAllNodes>true</ViewAllNodes>
  <DetailLevel>ReturnAll</DetailLevel>
</GetCategoriesRequest>\`,
});`,

    go: `// Trading API: GetCategories
body := \`<GetCategoriesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CategorySiteID>0</CategorySiteID>
  <LevelLimit>1</LevelLimit>
  <ViewAllNodes>true</ViewAllNodes>
  <DetailLevel>ReturnAll</DetailLevel>
</GetCategoriesRequest>\`
// X-EBAY-API-CALL-NAME: GetCategories`,

    python: `# Trading API: GetCategories
import requests
body = """<GetCategoriesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CategorySiteID>0</CategorySiteID>
  <LevelLimit>1</LevelLimit>
  <ViewAllNodes>true</ViewAllNodes>
  <DetailLevel>ReturnAll</DetailLevel>
</GetCategoriesRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetCategories', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Taxonomy API: getCategoryTree (2ステップ)
// Step 1: marketplace_id で category_tree_id を取得
// marketplace_id: EBAY_US / EBAY_GB / EBAY_DE / EBAY_JP / EBAY_AU / EBAY_FR / EBAY_IT / EBAY_ES
$treeRes = json_decode(file_get_contents(
    'https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US',
    false,
    stream_context_create(['http' => ['header' => 'Authorization: Bearer YOUR_ACCESS_TOKEN']])
), true);
$treeId = $treeRes['categoryTreeId'];

// Step 2: 全カテゴリ木を取得 (gzip 推奨 — ペイロードが大きいため)
$context = stream_context_create(['http' => [
    'header' => "Authorization: Bearer YOUR_ACCESS_TOKEN\r\nAccept-Encoding: gzip",
]]);
$raw = file_get_contents(
    "https://api.ebay.com/commerce/taxonomy/v1/category_tree/{$treeId}",
    false, $context
);
$categoryTree = json_decode(gzdecode($raw), true);`,

    ruby: `# Taxonomy API: getCategoryTree (2ステップ)
# marketplace_id: EBAY_US / EBAY_GB / EBAY_DE / EBAY_JP / EBAY_AU など
require 'net/http'; require 'json'; require 'zlib'

# Step 1: category_tree_id を取得
uri1 = URI('https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US')
req1 = Net::HTTP::Get.new(uri1)
req1['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
res1 = Net::HTTP.start(uri1.host, 443, use_ssl: true) { |h| h.request(req1) }
tree_id = JSON.parse(res1.body)['categoryTreeId']

# Step 2: 全カテゴリ木を取得 (gzip 推奨)
uri2 = URI("https://api.ebay.com/commerce/taxonomy/v1/category_tree/#{tree_id}")
req2 = Net::HTTP::Get.new(uri2)
req2['Authorization']    = 'Bearer YOUR_ACCESS_TOKEN'
req2['Accept-Encoding']  = 'gzip'
res2 = Net::HTTP.start(uri2.host, 443, use_ssl: true) { |h| h.request(req2) }
category_tree = JSON.parse(Zlib::GzipReader.new(StringIO.new(res2.body)).read)`,

    java: `// Taxonomy API: getCategoryTree (2ステップ)
// marketplace_id: EBAY_US / EBAY_GB / EBAY_DE / EBAY_JP / EBAY_AU など
// Step 1: category_tree_id を取得
HttpRequest req1 = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .GET().build();
String treeId = new JSONObject(http.send(req1, HttpResponse.BodyHandlers.ofString()).body())
    .getString("categoryTreeId");

// Step 2: 全カテゴリ木を取得 (gzip 推奨)
HttpRequest req2 = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/commerce/taxonomy/v1/category_tree/" + treeId))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Accept-Encoding", "gzip")
    .GET().build();
http.send(req2, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Taxonomy API: getCategoryTree (2ステップ)
// marketplace_id: EBAY_US / EBAY_GB / EBAY_DE / EBAY_JP / EBAY_AU など
const headers = { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN' };

// Step 1: category_tree_id を取得
const { categoryTreeId } = await fetch(
  'https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US',
  { headers }
).then(r => r.json());

// Step 2: 全カテゴリ木を取得 (gzip 推奨)
const categoryTree = await fetch(
  \`https://api.ebay.com/commerce/taxonomy/v1/category_tree/\${categoryTreeId}\`,
  { headers: { ...headers, 'Accept-Encoding': 'gzip' } }
).then(r => r.json());`,

    go: `// Taxonomy API: getCategoryTree (2ステップ)
// marketplace_id: EBAY_US / EBAY_GB / EBAY_DE / EBAY_JP / EBAY_AU など
// Step 1: category_tree_id を取得
req1, _ := http.NewRequest("GET",
    "https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US", nil)
req1.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
resp1, _ := http.DefaultClient.Do(req1)
// treeId := jsonParse(resp1)["categoryTreeId"]

// Step 2: 全カテゴリ木を取得 (gzip 推奨)
req2, _ := http.NewRequest("GET",
    "https://api.ebay.com/commerce/taxonomy/v1/category_tree/"+treeId, nil)
req2.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req2.Header.Set("Accept-Encoding", "gzip")
http.DefaultClient.Do(req2)`,

    python: `# Taxonomy API: getCategoryTree (2ステップ)
# marketplace_id: EBAY_US / EBAY_GB / EBAY_DE / EBAY_JP / EBAY_AU など
import requests

headers = {'Authorization': 'Bearer YOUR_ACCESS_TOKEN'}

# Step 1: category_tree_id を取得
res1 = requests.get(
    'https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id',
    params={'marketplace_id': 'EBAY_US'},
    headers=headers,
)
tree_id = res1.json()['categoryTreeId']

# Step 2: 全カテゴリ木を取得 (gzip 推奨 — ペイロードが大きい)
res2 = requests.get(
    f'https://api.ebay.com/commerce/taxonomy/v1/category_tree/{tree_id}',
    headers={**headers, 'Accept-Encoding': 'gzip'},
)
category_tree = res2.json()`,
  } as Record<Lang, string>,
};

// ─── GetCategoryFeatures → Metadata API ──────────────────────────────────────
// Old: Trading API GetCategoryFeatures
//   CategoryID, FeatureID (optional, repeatable), AllFeaturesForCategory, DetailLevel=ReturnAll
// New: Sell Metadata REST API
//   GET /sell/metadata/v1/marketplace/{marketplace_id}/get_item_condition_policies
//   GET /sell/metadata/v1/marketplace/{marketplace_id}/get_return_policies
//   Optional: filter=categoryIds:{id1|id2}  (max 50 categories)

export const getCategoryFeatures: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetCategoryFeatures (アイテムコンディション・返品ポリシー等の取得)
// FeatureID で絞り込み可。省略すると全特性メタデータを返す
// AllFeaturesForCategory=true で指定カテゴリの全特性を返す
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetCategoryFeaturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CategoryID>9355</CategoryID>
  <AllFeaturesForCategory>true</AllFeaturesForCategory>
  <DetailLevel>ReturnAll</DetailLevel>
</GetCategoryFeaturesRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetCategoryFeatures`,

    ruby: `# Trading API: GetCategoryFeatures
# AllFeaturesForCategory=true で指定カテゴリの全特性を取得
body = <<~XML
  <GetCategoryFeaturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <CategoryID>9355</CategoryID>
    <AllFeaturesForCategory>true</AllFeaturesForCategory>
    <DetailLevel>ReturnAll</DetailLevel>
  </GetCategoryFeaturesRequest>
XML
# X-EBAY-API-CALL-NAME: GetCategoryFeatures`,

    java: `// Trading API: GetCategoryFeatures
String body = """
    <GetCategoryFeaturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <CategoryID>9355</CategoryID>
      <AllFeaturesForCategory>true</AllFeaturesForCategory>
      <DetailLevel>ReturnAll</DetailLevel>
    </GetCategoryFeaturesRequest>""";
// X-EBAY-API-CALL-NAME: GetCategoryFeatures`,

    nodejs: `// Trading API: GetCategoryFeatures
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetCategoryFeatures', 'Content-Type': 'text/xml' },
  body: \`<GetCategoryFeaturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CategoryID>9355</CategoryID>
  <AllFeaturesForCategory>true</AllFeaturesForCategory>
  <DetailLevel>ReturnAll</DetailLevel>
</GetCategoryFeaturesRequest>\`,
});`,

    go: `// Trading API: GetCategoryFeatures
body := \`<GetCategoryFeaturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CategoryID>9355</CategoryID>
  <AllFeaturesForCategory>true</AllFeaturesForCategory>
  <DetailLevel>ReturnAll</DetailLevel>
</GetCategoryFeaturesRequest>\`
// X-EBAY-API-CALL-NAME: GetCategoryFeatures`,

    python: `# Trading API: GetCategoryFeatures
import requests
body = """<GetCategoryFeaturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <CategoryID>9355</CategoryID>
  <AllFeaturesForCategory>true</AllFeaturesForCategory>
  <DetailLevel>ReturnAll</DetailLevel>
</GetCategoryFeaturesRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetCategoryFeatures', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Sell Metadata REST API: getItemConditionPolicies / getReturnPolicies
// GET /sell/metadata/v1/marketplace/{marketplace_id}/get_item_condition_policies
// filter=categoryIds:{id1|id2}  で最大 50 カテゴリに絞り込み可
$marketplaceId = 'EBAY_US';

// アイテムコンディションポリシー
$params = http_build_query(['filter' => 'categoryIds:{9355}']);
$ch = curl_init("https://api.ebay.com/sell/metadata/v1/marketplace/{$marketplaceId}/get_item_condition_policies?{$params}");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer YOUR_ACCESS_TOKEN'],
]);
$conditionPolicies = json_decode(curl_exec($ch), true);
curl_close($ch);

// 返品ポリシー
$ch2 = curl_init("https://api.ebay.com/sell/metadata/v1/marketplace/{$marketplaceId}/get_return_policies?{$params}");
curl_setopt_array($ch2, [CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer YOUR_ACCESS_TOKEN']]);
$returnPolicies = json_decode(curl_exec($ch2), true);
curl_close($ch2);`,

    ruby: `# Sell Metadata REST API: getItemConditionPolicies / getReturnPolicies
# filter=categoryIds:{id} で最大 50 カテゴリに絞り込み可
require 'net/http'

marketplace_id = 'EBAY_US'
filter = 'categoryIds:{9355}'

# アイテムコンディションポリシー
uri = URI("https://api.ebay.com/sell/metadata/v1/marketplace/#{marketplace_id}/get_item_condition_policies?filter=#{URI.encode_www_form_component(filter)}")
req = Net::HTTP::Get.new(uri)
req['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN'
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
condition_policies = JSON.parse(res.body)`,

    java: `// Sell Metadata REST API: getItemConditionPolicies / getReturnPolicies
// filter=categoryIds:{id} で最大 50 カテゴリに絞り込み可
String marketplaceId = "EBAY_US";
String filter = "categoryIds:{9355}";

// アイテムコンディションポリシー
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/sell/metadata/v1/marketplace/" + marketplaceId +
        "/get_item_condition_policies?filter=" + URLEncoder.encode(filter, "UTF-8")))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .GET().build();
http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Sell Metadata REST API: getItemConditionPolicies / getReturnPolicies
// filter=categoryIds:{id} で最大 50 カテゴリに絞り込み可
const marketplaceId = 'EBAY_US';
const headers = { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN' };
const filter = encodeURIComponent('categoryIds:{9355}');

// アイテムコンディションポリシー
const conditionPolicies = await fetch(
  \`https://api.ebay.com/sell/metadata/v1/marketplace/\${marketplaceId}/get_item_condition_policies?filter=\${filter}\`,
  { headers }
).then(r => r.json());

// 返品ポリシー
const returnPolicies = await fetch(
  \`https://api.ebay.com/sell/metadata/v1/marketplace/\${marketplaceId}/get_return_policies?filter=\${filter}\`,
  { headers }
).then(r => r.json());`,

    go: `// Sell Metadata REST API: getItemConditionPolicies / getReturnPolicies
// filter=categoryIds:{id} で最大 50 カテゴリに絞り込み可
marketplaceId := "EBAY_US"
filter := url.QueryEscape("categoryIds:{9355}")

req, _ := http.NewRequest("GET",
    "https://api.ebay.com/sell/metadata/v1/marketplace/"+marketplaceId+
        "/get_item_condition_policies?filter="+filter, nil)
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
http.DefaultClient.Do(req)`,

    python: `# Sell Metadata REST API: getItemConditionPolicies / getReturnPolicies
# filter=categoryIds:{id} で最大 50 カテゴリに絞り込み可
import requests
from urllib.parse import quote

marketplace_id = 'EBAY_US'
headers = {'Authorization': 'Bearer YOUR_ACCESS_TOKEN'}
base = f'https://api.ebay.com/sell/metadata/v1/marketplace/{marketplace_id}'

# アイテムコンディションポリシー
condition_policies = requests.get(
    f'{base}/get_item_condition_policies',
    params={'filter': 'categoryIds:{9355}'},
    headers=headers,
).json()

# 返品ポリシー
return_policies = requests.get(
    f'{base}/get_return_policies',
    params={'filter': 'categoryIds:{9355}'},
    headers=headers,
).json()`,
  } as Record<Lang, string>,
};

// ─── findProducts → Catalog API search ───────────────────────────────────────
// Old: Trading API findProducts (keyword search for catalog products)
// New: Catalog API  GET /commerce/catalog/v1_beta/product_summary/search?q=...
//   Required: q OR category_ids OR gtin OR mpn (at least one)
//   Optional: category_ids, fieldgroups (MATCHING_PRODUCTS/ASPECT_REFINEMENTS/FULL), limit (max 200)

export const findProducts: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: findProducts (カタログ商品検索)
$body = '<?xml version="1.0" encoding="utf-8"?>
<findProductsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <QueryKeywords>iPhone 15 Pro Max 256GB</QueryKeywords>
  <MaxEntries>10</MaxEntries>
  <PageNumber>1</PageNumber>
</findProductsRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: findProducts`,

    ruby: `# Trading API: findProducts (カタログ商品検索)
body = <<~XML
  <findProductsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <QueryKeywords>iPhone 15 Pro Max 256GB</QueryKeywords>
    <MaxEntries>10</MaxEntries>
    <PageNumber>1</PageNumber>
  </findProductsRequest>
XML
# X-EBAY-API-CALL-NAME: findProducts`,

    java: `// Trading API: findProducts (カタログ商品検索)
String body = """
    <findProductsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <QueryKeywords>iPhone 15 Pro Max 256GB</QueryKeywords>
      <MaxEntries>10</MaxEntries>
      <PageNumber>1</PageNumber>
    </findProductsRequest>""";
// X-EBAY-API-CALL-NAME: findProducts`,

    nodejs: `// Trading API: findProducts
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'findProducts', 'Content-Type': 'text/xml' },
  body: \`<findProductsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <QueryKeywords>iPhone 15 Pro Max 256GB</QueryKeywords>
  <MaxEntries>10</MaxEntries>
</findProductsRequest>\`,
});`,

    go: `// Trading API: findProducts (カタログ商品検索)
body := \`<findProductsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <QueryKeywords>iPhone 15 Pro Max 256GB</QueryKeywords>
  <MaxEntries>10</MaxEntries>
</findProductsRequest>\`
// X-EBAY-API-CALL-NAME: findProducts`,

    python: `# Trading API: findProducts (カタログ商品検索)
import requests
body = """<findProductsRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <QueryKeywords>iPhone 15 Pro Max 256GB</QueryKeywords>
  <MaxEntries>10</MaxEntries>
</findProductsRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'findProducts', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Catalog REST API: search (product_summary/search)
// 必須: q / category_ids / gtin / mpn のいずれか一つ以上
// fieldgroups: MATCHING_PRODUCTS(デフォルト) / ASPECT_REFINEMENTS / FULL
// limit: max 200 (default 50)
$params = http_build_query([
    'q'           => 'iPhone 15 Pro Max 256GB',
    'category_ids'=> '9355',
    'fieldgroups' => 'MATCHING_PRODUCTS',
    'limit'       => 10,
]);
$ch = curl_init("https://api.ebay.com/commerce/catalog/v1_beta/product_summary/search?{$params}");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
    ],
]);
$data = json_decode(curl_exec($ch), true);
$products = $data['productSummaries'];
curl_close($ch);`,

    ruby: `# Catalog REST API: product_summary/search
# 必須: q / category_ids / gtin / mpn のいずれか
# fieldgroups: MATCHING_PRODUCTS / ASPECT_REFINEMENTS / FULL
require 'net/http'
uri = URI('https://api.ebay.com/commerce/catalog/v1_beta/product_summary/search')
uri.query = URI.encode_www_form(
  q: 'iPhone 15 Pro Max 256GB', category_ids: '9355',
  fieldgroups: 'MATCHING_PRODUCTS', limit: 10
)
req = Net::HTTP::Get.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }
products = JSON.parse(res.body)['productSummaries']`,

    java: `// Catalog REST API: product_summary/search
// 必須: q / category_ids / gtin / mpn のいずれか / limit: max 200
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/commerce/catalog/v1_beta/product_summary/search" +
        "?q=iPhone+15+Pro+Max+256GB&category_ids=9355&fieldgroups=MATCHING_PRODUCTS&limit=10"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .GET().build();
http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Catalog REST API: product_summary/search
// 必須: q / category_ids / gtin / mpn のいずれか / limit: max 200
const params = new URLSearchParams({
  q: 'iPhone 15 Pro Max 256GB',
  category_ids: '9355',
  fieldgroups: 'MATCHING_PRODUCTS',
  limit: '10',
});
const { productSummaries } = await fetch(
  \`https://api.ebay.com/commerce/catalog/v1_beta/product_summary/search?\${params}\`,
  { headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US' } }
).then(r => r.json());`,

    go: `// Catalog REST API: product_summary/search
// 必須: q / category_ids / gtin / mpn のいずれか / limit: max 200
req, _ := http.NewRequest("GET",
    "https://api.ebay.com/commerce/catalog/v1_beta/product_summary/search"+
        "?q=iPhone+15+Pro+Max+256GB&category_ids=9355&fieldgroups=MATCHING_PRODUCTS&limit=10",
    nil)
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
http.DefaultClient.Do(req)`,

    python: `# Catalog REST API: product_summary/search
# 必須: q / category_ids / gtin / mpn のいずれか / limit: max 200
import requests
res = requests.get(
    'https://api.ebay.com/commerce/catalog/v1_beta/product_summary/search',
    params={
        'q': 'iPhone 15 Pro Max 256GB',
        'category_ids': '9355',
        'fieldgroups': 'MATCHING_PRODUCTS',
        'limit': 10,
    },
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    },
)
products = res.json()['productSummaries']`,
  } as Record<Lang, string>,
};

// ─── Map: oldApi name → snippet ──────────────────────────────────────────────

export const metadataSnippetByOldApi: Record<string, ApiCallSnippet> = {
  "GetCategories":                                   getCategories,
  "GetCategoryFeatures (item conditions)":            getCategoryFeatures,
  "GetCategoryFeatures (return policies)":            getCategoryFeatures,
  "GetCategoryFeatures (Best Offer)":                getCategoryFeatures,
  "GetCategoryFeatures (aspects/GTIN)":              getCategoryFeatures,
  "GeteBayDetails (ShippingServiceDetails)":         getCategoryFeatures,
  "GeteBayDetails (ShippingCarrierDetails)":         getCategoryFeatures,
  "GeteBayDetails (CurrencyDetails)":                getCategoryFeatures,
  "findProducts":                                    findProducts,
  "getProductDetails":                               findProducts,
};
