import type { Lang } from "@/components/CodeTabs";

export interface ApiCallSnippet {
  old: Record<Lang, string>;
  new: Record<Lang, string>;
}

// ─── LeaveFeedback → leaveFeedback ───────────────────────────────────────────
// Old: Trading API LeaveFeedback
//   Required: TargetUser, CommentType (Positive/Neutral/Negative), CommentText (max 500)
//   Required one of: OrderLineItemID  OR  (ItemID + TargetUser [+ TransactionID])
//   Note: Sellers cannot leave Neutral/Negative for buyers
//   Note: 60-day limit from order creation
// New: Commerce Feedback REST API  POST /commerce/feedback/v1/feedback
//   Required: lineItemId, ratings[]  (ratingKey + ratingValue)
//   ratingKey examples: OVERALL_EXPERIENCE, OVERALL_EXPERIENCE_COMMENT, ON_TIME_DELIVERY

export const leaveFeedback: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: LeaveFeedback
// CommentType: Positive / Neutral / Negative (売り手→買い手は Positive のみ)
// CommentText: max 500 文字
// OrderLineItemID は作成から 60 日以内のみ有効
$body = '<?xml version="1.0" encoding="utf-8"?>
<LeaveFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <CommentType>Positive</CommentType>
  <CommentText>Great buyer, fast payment! Highly recommended.</CommentText>
  <TargetUser>buyer_username</TargetUser>
</LeaveFeedbackRequest>';

$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'X-EBAY-API-SITEID: 0',
        'X-EBAY-API-CALL-NAME: LeaveFeedback',
        'X-EBAY-API-APP-NAME: YOUR_APP_ID',
        'X-EBAY-API-CERT-NAME: YOUR_CERT_ID',
        'X-EBAY-API-DEV-NAME: YOUR_DEV_ID',
        'Content-Type: text/xml',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
$response = curl_exec($ch); curl_close($ch);`,

    ruby: `# Trading API: LeaveFeedback
# CommentType: Positive / Neutral / Negative (売り手→買い手は Positive のみ)
# CommentText: max 500 文字 / 取引から 60 日以内
body = <<~XML
  <?xml version="1.0" encoding="utf-8"?>
  <LeaveFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <OrderLineItemID>123456789-987654321</OrderLineItemID>
    <CommentType>Positive</CommentType>
    <CommentText>Great buyer, fast payment! Highly recommended.</CommentText>
    <TargetUser>buyer_username</TargetUser>
  </LeaveFeedbackRequest>
XML
# POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: LeaveFeedback`,

    java: `// Trading API: LeaveFeedback
// CommentType: Positive / Neutral / Negative (売り手→買い手は Positive のみ)
// CommentText: max 500 文字 / 取引から 60 日以内
String body = """
    <?xml version="1.0" encoding="utf-8"?>
    <LeaveFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <OrderLineItemID>123456789-987654321</OrderLineItemID>
      <CommentType>Positive</CommentType>
      <CommentText>Great buyer, fast payment!</CommentText>
      <TargetUser>buyer_username</TargetUser>
    </LeaveFeedbackRequest>""";
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: LeaveFeedback`,

    nodejs: `// Trading API: LeaveFeedback
// CommentType: Positive / Neutral / Negative (売り手→買い手は Positive のみ)
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: {
    'X-EBAY-API-SITEID': '0',
    'X-EBAY-API-CALL-NAME': 'LeaveFeedback',
    'X-EBAY-API-APP-NAME': 'YOUR_APP_ID',
    'Content-Type': 'text/xml',
  },
  body: \`<?xml version="1.0" encoding="utf-8"?>
<LeaveFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <CommentType>Positive</CommentType>
  <CommentText>Great buyer, fast payment!</CommentText>
  <TargetUser>buyer_username</TargetUser>
</LeaveFeedbackRequest>\`,
});`,

    go: `// Trading API: LeaveFeedback
// CommentType: Positive / Neutral / Negative (売り手→買い手は Positive のみ)
body := \`<?xml version="1.0" encoding="utf-8"?>
<LeaveFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <CommentType>Positive</CommentType>
  <CommentText>Great buyer, fast payment!</CommentText>
  <TargetUser>buyer_username</TargetUser>
</LeaveFeedbackRequest>\`
req, _ := http.NewRequest("POST", "https://api.ebay.com/ws/api.dll",
    strings.NewReader(body))
req.Header.Set("X-EBAY-API-CALL-NAME", "LeaveFeedback")
req.Header.Set("Content-Type", "text/xml")`,

    python: `# Trading API: LeaveFeedback
# CommentType: Positive / Neutral / Negative (売り手→買い手は Positive のみ)
# CommentText: max 500 文字 / 取引から 60 日以内
import requests
body = """<?xml version="1.0" encoding="utf-8"?>
<LeaveFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <OrderLineItemID>123456789-987654321</OrderLineItemID>
  <CommentType>Positive</CommentType>
  <CommentText>Great buyer, fast payment! Highly recommended.</CommentText>
  <TargetUser>buyer_username</TargetUser>
</LeaveFeedbackRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'LeaveFeedback', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Commerce Feedback REST API: leaveFeedback
// POST https://api.ebay.com/commerce/feedback/v1/feedback
// 必須: lineItemId, ratings[]
// ratingKey: OVERALL_EXPERIENCE / OVERALL_EXPERIENCE_COMMENT / ON_TIME_DELIVERY / DSR_ITEM_AS_DESCRIBED
// OVERALL_EXPERIENCE value: POSITIVE / NEUTRAL / NEGATIVE
// OVERALL_EXPERIENCE_COMMENT value: テキスト (max 500文字)
// ON_TIME_DELIVERY value: "2"(Yes) / "3"(No)
$body = json_encode([
    'lineItemId' => '123456789-987654321',
    'ratings' => [
        ['ratingKey' => 'OVERALL_EXPERIENCE',         'ratingValue' => 'POSITIVE'],
        ['ratingKey' => 'OVERALL_EXPERIENCE_COMMENT', 'ratingValue' => 'Great buyer, fast payment!'],
        ['ratingKey' => 'ON_TIME_DELIVERY',           'ratingValue' => '2'],
    ],
]);
$ch = curl_init('https://api.ebay.com/commerce/feedback/v1/feedback');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
$data = json_decode(curl_exec($ch), true);
curl_close($ch);`,

    ruby: `# Commerce Feedback REST API: leaveFeedback
# ratingKey: OVERALL_EXPERIENCE / OVERALL_EXPERIENCE_COMMENT / ON_TIME_DELIVERY
# OVERALL_EXPERIENCE value: POSITIVE / NEUTRAL / NEGATIVE
# ON_TIME_DELIVERY value: "2"(Yes) / "3"(No)
require 'net/http'; require 'json'

uri = URI('https://api.ebay.com/commerce/feedback/v1/feedback')
req = Net::HTTP::Post.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req['Content-Type']            = 'application/json'
req.body = {
  lineItemId: '123456789-987654321',
  ratings: [
    { ratingKey: 'OVERALL_EXPERIENCE',         ratingValue: 'POSITIVE' },
    { ratingKey: 'OVERALL_EXPERIENCE_COMMENT', ratingValue: 'Great buyer, fast payment!' },
    { ratingKey: 'ON_TIME_DELIVERY',           ratingValue: '2' },
  ]
}.to_json
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// Commerce Feedback REST API: leaveFeedback
// ratingKey: OVERALL_EXPERIENCE / OVERALL_EXPERIENCE_COMMENT / ON_TIME_DELIVERY
String body = """
    {
      "lineItemId": "123456789-987654321",
      "ratings": [
        {"ratingKey": "OVERALL_EXPERIENCE",         "ratingValue": "POSITIVE"},
        {"ratingKey": "OVERALL_EXPERIENCE_COMMENT", "ratingValue": "Great buyer!"},
        {"ratingKey": "ON_TIME_DELIVERY",           "ratingValue": "2"}
      ]
    }""";
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/commerce/feedback/v1/feedback"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();`,

    nodejs: `// Commerce Feedback REST API: leaveFeedback
// ratingKey: OVERALL_EXPERIENCE / OVERALL_EXPERIENCE_COMMENT / ON_TIME_DELIVERY
const res = await fetch('https://api.ebay.com/commerce/feedback/v1/feedback', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    lineItemId: '123456789-987654321',
    ratings: [
      { ratingKey: 'OVERALL_EXPERIENCE',         ratingValue: 'POSITIVE' },
      { ratingKey: 'OVERALL_EXPERIENCE_COMMENT', ratingValue: 'Great buyer, fast payment!' },
      { ratingKey: 'ON_TIME_DELIVERY',           ratingValue: '2' },
    ],
  }),
});
const data = await res.json();`,

    go: `// Commerce Feedback REST API: leaveFeedback
// ratingKey: OVERALL_EXPERIENCE / OVERALL_EXPERIENCE_COMMENT / ON_TIME_DELIVERY
body := \`{
  "lineItemId": "123456789-987654321",
  "ratings": [
    {"ratingKey": "OVERALL_EXPERIENCE",         "ratingValue": "POSITIVE"},
    {"ratingKey": "OVERALL_EXPERIENCE_COMMENT", "ratingValue": "Great buyer!"},
    {"ratingKey": "ON_TIME_DELIVERY",           "ratingValue": "2"}
  ]
}\`
req, _ := http.NewRequest("POST",
    "https://api.ebay.com/commerce/feedback/v1/feedback",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")
http.DefaultClient.Do(req)`,

    python: `# Commerce Feedback REST API: leaveFeedback
# ratingKey: OVERALL_EXPERIENCE / OVERALL_EXPERIENCE_COMMENT / ON_TIME_DELIVERY
# OVERALL_EXPERIENCE value: POSITIVE / NEUTRAL / NEGATIVE
# ON_TIME_DELIVERY value: "2"(Yes) / "3"(No)
import requests

res = requests.post(
    'https://api.ebay.com/commerce/feedback/v1/feedback',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
    },
    json={
        'lineItemId': '123456789-987654321',
        'ratings': [
            {'ratingKey': 'OVERALL_EXPERIENCE',         'ratingValue': 'POSITIVE'},
            {'ratingKey': 'OVERALL_EXPERIENCE_COMMENT', 'ratingValue': 'Great buyer, fast payment!'},
            {'ratingKey': 'ON_TIME_DELIVERY',           'ratingValue': '2'},
        ],
    },
)`,
  } as Record<Lang, string>,
};

// ─── GetFeedback → getFeedback ────────────────────────────────────────────────
// Old: Trading API GetFeedback
//   FeedbackType: FeedbackReceived(default) / FeedbackLeft / FeedbackReceivedAsSeller / FeedbackReceivedAsBuyer
//   Pagination: EntriesPerPage (25/50/100/200), PageNumber. DetailLevel=ReturnAll required.
// New: Commerce Feedback REST API  GET /commerce/feedback/v1/feedback
//   filter: commentType (POSITIVE/NEUTRAL/NEGATIVE), role (SELLER/BUYER), period (days)

export const getFeedback: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetFeedback (売り手として受け取った評価)
// FeedbackType: FeedbackReceivedAsSeller / FeedbackReceivedAsBuyer / FeedbackLeft / FeedbackReceived
// DetailLevel=ReturnAll が必要 (詳細+Summaryを返す)
// EntriesPerPage: 25(デフォルト) / 50 / 100 / 200 のみ許可
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <FeedbackType>FeedbackReceivedAsSeller</FeedbackType>
  <DetailLevel>ReturnAll</DetailLevel>
  <Pagination>
    <EntriesPerPage>25</EntriesPerPage>
    <PageNumber>1</PageNumber>
  </Pagination>
</GetFeedbackRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetFeedback`,

    ruby: `# Trading API: GetFeedback
# FeedbackType: FeedbackReceivedAsSeller / FeedbackReceivedAsBuyer / FeedbackLeft / FeedbackReceived
# DetailLevel=ReturnAll が必要
body = <<~XML
  <GetFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <FeedbackType>FeedbackReceivedAsSeller</FeedbackType>
    <DetailLevel>ReturnAll</DetailLevel>
    <Pagination><EntriesPerPage>25</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
  </GetFeedbackRequest>
XML
# POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetFeedback`,

    java: `// Trading API: GetFeedback
// FeedbackType: FeedbackReceivedAsSeller / FeedbackReceivedAsBuyer / FeedbackLeft / FeedbackReceived
String body = """
    <GetFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <FeedbackType>FeedbackReceivedAsSeller</FeedbackType>
      <DetailLevel>ReturnAll</DetailLevel>
      <Pagination><EntriesPerPage>25</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
    </GetFeedbackRequest>""";
// X-EBAY-API-CALL-NAME: GetFeedback`,

    nodejs: `// Trading API: GetFeedback
// FeedbackType: FeedbackReceivedAsSeller / FeedbackReceivedAsBuyer / FeedbackLeft / FeedbackReceived
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetFeedback', 'Content-Type': 'text/xml' },
  body: \`<GetFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <FeedbackType>FeedbackReceivedAsSeller</FeedbackType>
  <DetailLevel>ReturnAll</DetailLevel>
  <Pagination><EntriesPerPage>25</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetFeedbackRequest>\`,
});`,

    go: `// Trading API: GetFeedback
// FeedbackType: FeedbackReceivedAsSeller / FeedbackReceivedAsBuyer / FeedbackLeft
body := \`<GetFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <FeedbackType>FeedbackReceivedAsSeller</FeedbackType>
  <DetailLevel>ReturnAll</DetailLevel>
  <Pagination><EntriesPerPage>25</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetFeedbackRequest>\`
// X-EBAY-API-CALL-NAME: GetFeedback`,

    python: `# Trading API: GetFeedback
# FeedbackType: FeedbackReceivedAsSeller / FeedbackReceivedAsBuyer / FeedbackLeft / FeedbackReceived
import requests
body = """<GetFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <FeedbackType>FeedbackReceivedAsSeller</FeedbackType>
  <DetailLevel>ReturnAll</DetailLevel>
  <Pagination><EntriesPerPage>25</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetFeedbackRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetFeedback', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Commerce Feedback REST API: getFeedback
// GET https://api.ebay.com/commerce/feedback/v1/feedback
// filter の role: SELLER / BUYER
// filter の commentType: POSITIVE / NEUTRAL / NEGATIVE
$params = http_build_query([
    'filter' => 'role:SELLER,commentType:POSITIVE',
    'limit'  => 25,
    'offset' => 0,
]);
$ch = curl_init("https://api.ebay.com/commerce/feedback/v1/feedback?{$params}");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
    ],
]);
$data = json_decode(curl_exec($ch), true);
curl_close($ch);`,

    ruby: `# Commerce Feedback REST API: getFeedback
# filter: role (SELLER/BUYER), commentType (POSITIVE/NEUTRAL/NEGATIVE)
require 'net/http'
uri = URI('https://api.ebay.com/commerce/feedback/v1/feedback')
uri.query = URI.encode_www_form(filter: 'role:SELLER,commentType:POSITIVE', limit: 25, offset: 0)
req = Net::HTTP::Get.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// Commerce Feedback REST API: getFeedback
// filter: role (SELLER/BUYER), commentType (POSITIVE/NEUTRAL/NEGATIVE)
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/commerce/feedback/v1/feedback" +
        "?filter=role:SELLER,commentType:POSITIVE&limit=25&offset=0"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .GET()
    .build();
http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Commerce Feedback REST API: getFeedback
// filter: role (SELLER/BUYER), commentType (POSITIVE/NEUTRAL/NEGATIVE)
const params = new URLSearchParams({
  filter: 'role:SELLER,commentType:POSITIVE',
  limit: '25',
  offset: '0',
});
const { feedbacks } = await fetch(
  \`https://api.ebay.com/commerce/feedback/v1/feedback?\${params}\`,
  { headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US' } }
).then(r => r.json());`,

    go: `// Commerce Feedback REST API: getFeedback
// filter: role (SELLER/BUYER), commentType (POSITIVE/NEUTRAL/NEGATIVE)
req, _ := http.NewRequest("GET",
    "https://api.ebay.com/commerce/feedback/v1/feedback?filter=role:SELLER,commentType:POSITIVE&limit=25",
    nil)
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
http.DefaultClient.Do(req)`,

    python: `# Commerce Feedback REST API: getFeedback
# filter: role (SELLER/BUYER), commentType (POSITIVE/NEUTRAL/NEGATIVE)
import requests
res = requests.get(
    'https://api.ebay.com/commerce/feedback/v1/feedback',
    params={'filter': 'role:SELLER,commentType:POSITIVE', 'limit': 25, 'offset': 0},
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'},
)
feedbacks = res.json()`,
  } as Record<Lang, string>,
};

// ─── RespondToFeedback → respondToFeedback ────────────────────────────────────
// Old: Trading API RespondToFeedback
//   Required: ResponseText (max 500), ResponseType (Reply/FollowUp), TargetUserID
//   Required one of: FeedbackID  OR  OrderLineItemID  OR  (ItemID + TransactionID)
// New: Commerce Feedback REST API  POST /commerce/feedback/v1/respond_to_feedback/{feedbackId}
//   Required: feedbackId (path), responseText (body)

export const respondToFeedback: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: RespondToFeedback
// ResponseType: Reply (相手のフィードバックへの返信) / FollowUp (自分が残したFBへのフォローアップ)
// ResponseText: max 500 文字
// FeedbackID は GetFeedback で取得
$body = '<?xml version="1.0" encoding="utf-8"?>
<RespondToFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <FeedbackID>FEEDBACK-ID-123</FeedbackID>
  <TargetUserID>buyer_username</TargetUserID>
  <ResponseType>Reply</ResponseType>
  <ResponseText>Thank you for your positive feedback!</ResponseText>
</RespondToFeedbackRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: RespondToFeedback`,

    ruby: `# Trading API: RespondToFeedback
# ResponseType: Reply / FollowUp
# ResponseText: max 500 文字
body = <<~XML
  <RespondToFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <FeedbackID>FEEDBACK-ID-123</FeedbackID>
    <TargetUserID>buyer_username</TargetUserID>
    <ResponseType>Reply</ResponseType>
    <ResponseText>Thank you for your positive feedback!</ResponseText>
  </RespondToFeedbackRequest>
XML
# X-EBAY-API-CALL-NAME: RespondToFeedback`,

    java: `// Trading API: RespondToFeedback
// ResponseType: Reply / FollowUp / ResponseText: max 500 文字
String body = """
    <RespondToFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <FeedbackID>FEEDBACK-ID-123</FeedbackID>
      <TargetUserID>buyer_username</TargetUserID>
      <ResponseType>Reply</ResponseType>
      <ResponseText>Thank you for your positive feedback!</ResponseText>
    </RespondToFeedbackRequest>""";
// X-EBAY-API-CALL-NAME: RespondToFeedback`,

    nodejs: `// Trading API: RespondToFeedback
// ResponseType: Reply / FollowUp / ResponseText: max 500 文字
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'RespondToFeedback', 'Content-Type': 'text/xml' },
  body: \`<RespondToFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <FeedbackID>FEEDBACK-ID-123</FeedbackID>
  <TargetUserID>buyer_username</TargetUserID>
  <ResponseType>Reply</ResponseType>
  <ResponseText>Thank you for your positive feedback!</ResponseText>
</RespondToFeedbackRequest>\`,
});`,

    go: `// Trading API: RespondToFeedback (ResponseType: Reply / FollowUp)
body := \`<RespondToFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <FeedbackID>FEEDBACK-ID-123</FeedbackID>
  <TargetUserID>buyer_username</TargetUserID>
  <ResponseType>Reply</ResponseType>
  <ResponseText>Thank you for your positive feedback!</ResponseText>
</RespondToFeedbackRequest>\`
// X-EBAY-API-CALL-NAME: RespondToFeedback`,

    python: `# Trading API: RespondToFeedback
# ResponseType: Reply (相手のFBへの返信) / FollowUp (自分のFBへのフォローアップ)
import requests
body = """<RespondToFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <FeedbackID>FEEDBACK-ID-123</FeedbackID>
  <TargetUserID>buyer_username</TargetUserID>
  <ResponseType>Reply</ResponseType>
  <ResponseText>Thank you for your positive feedback!</ResponseText>
</RespondToFeedbackRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'RespondToFeedback', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Commerce Feedback REST API: respondToFeedback
// POST https://api.ebay.com/commerce/feedback/v1/respond_to_feedback/{feedbackId}
// feedbackId は getFeedback で取得
$feedbackId = 'FEEDBACK-ID-123';
$ch = curl_init("https://api.ebay.com/commerce/feedback/v1/respond_to_feedback/{$feedbackId}");
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode(['responseText' => 'Thank you for your positive feedback!']),
]);
curl_exec($ch); curl_close($ch);`,

    ruby: `# Commerce Feedback REST API: respondToFeedback
# feedbackId は getFeedback で取得
require 'net/http'; require 'json'
uri = URI('https://api.ebay.com/commerce/feedback/v1/respond_to_feedback/FEEDBACK-ID-123')
req = Net::HTTP::Post.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req['Content-Type']            = 'application/json'
req.body = { responseText: 'Thank you for your positive feedback!' }.to_json
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// Commerce Feedback REST API: respondToFeedback
// feedbackId は getFeedback で取得
String body = """{"responseText": "Thank you for your positive feedback!"}""";
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/commerce/feedback/v1/respond_to_feedback/FEEDBACK-ID-123"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();`,

    nodejs: `// Commerce Feedback REST API: respondToFeedback
// feedbackId は getFeedback で取得
await fetch('https://api.ebay.com/commerce/feedback/v1/respond_to_feedback/FEEDBACK-ID-123', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ responseText: 'Thank you for your positive feedback!' }),
});`,

    go: `// Commerce Feedback REST API: respondToFeedback
body := \`{"responseText": "Thank you for your positive feedback!"}\`
req, _ := http.NewRequest("POST",
    "https://api.ebay.com/commerce/feedback/v1/respond_to_feedback/FEEDBACK-ID-123",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("Content-Type", "application/json")
http.DefaultClient.Do(req)`,

    python: `# Commerce Feedback REST API: respondToFeedback
# feedbackId は getFeedback で取得
import requests
requests.post(
    'https://api.ebay.com/commerce/feedback/v1/respond_to_feedback/FEEDBACK-ID-123',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
    },
    json={'responseText': 'Thank you for your positive feedback!'},
)`,
  } as Record<Lang, string>,
};

// ─── Map: oldApi name → snippet ──────────────────────────────────────────────

export const feedbackSnippetByOldApi: Record<string, ApiCallSnippet> = {
  "LeaveFeedback":             leaveFeedback,
  "GetFeedback (entries)":     getFeedback,
  "GetFeedback (metrics)":     getFeedback,
  "GetItemsAwaitingFeedback":  getFeedback,
  "RespondToFeedback":         respondToFeedback,
};
