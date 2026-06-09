import type { Lang } from "@/components/CodeTabs";

export interface ApiCallSnippet {
  old: Record<Lang, string>;
  new: Record<Lang, string>;
}

// ─── AddMemberMessageAAQToPartner → sendMessage ───────────────────────────────
// Old: Trading API AddMemberMessageAAQToPartner
//   Required: ItemID, MemberMessage.Body (max 2000), MemberMessage.RecipientID, MemberMessage.Subject, MemberMessage.QuestionType
//   QuestionType: General / Payment / Shipping
// New: Commerce Message REST API  POST /commerce/message/v1/send_message
//   Required: messageText (max 2000), conversationId OR otherPartyUsername
//   Optional: messageMedia[] (max 5), reference.referenceType (LISTING), reference.referenceId

export const sendMessage: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: AddMemberMessageAAQToPartner
// QuestionType: General / Payment / Shipping
// Body: max 2000 文字 / HTML 不可
$body = '<?xml version="1.0" encoding="utf-8"?>
<AddMemberMessageAAQToPartnerRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <MemberMessage>
    <Subject>Question about your item</Subject>
    <Body>Hi, I have a question about the shipping options for this item.</Body>
    <QuestionType>Shipping</QuestionType>
    <RecipientID>seller_username</RecipientID>
  </MemberMessage>
</AddMemberMessageAAQToPartnerRequest>';

$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'X-EBAY-API-SITEID: 0',
        'X-EBAY-API-CALL-NAME: AddMemberMessageAAQToPartner',
        'X-EBAY-API-APP-NAME: YOUR_APP_ID',
        'X-EBAY-API-CERT-NAME: YOUR_CERT_ID',
        'X-EBAY-API-DEV-NAME: YOUR_DEV_ID',
        'Content-Type: text/xml',
    ],
    CURLOPT_POSTFIELDS => $body,
]);
curl_exec($ch); curl_close($ch);`,

    ruby: `# Trading API: AddMemberMessageAAQToPartner
# QuestionType: General / Payment / Shipping
# Body: max 2000 文字、HTML 不可
body = <<~XML
  <?xml version="1.0" encoding="utf-8"?>
  <AddMemberMessageAAQToPartnerRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <ItemID>123456789</ItemID>
    <MemberMessage>
      <Subject>Question about your item</Subject>
      <Body>Hi, I have a question about the shipping options.</Body>
      <QuestionType>Shipping</QuestionType>
      <RecipientID>seller_username</RecipientID>
    </MemberMessage>
  </AddMemberMessageAAQToPartnerRequest>
XML
# POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: AddMemberMessageAAQToPartner`,

    java: `// Trading API: AddMemberMessageAAQToPartner
// QuestionType: General / Payment / Shipping
String body = """
    <?xml version="1.0" encoding="utf-8"?>
    <AddMemberMessageAAQToPartnerRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <ItemID>123456789</ItemID>
      <MemberMessage>
        <Subject>Question about your item</Subject>
        <Body>Hi, I have a question about shipping options.</Body>
        <QuestionType>Shipping</QuestionType>
        <RecipientID>seller_username</RecipientID>
      </MemberMessage>
    </AddMemberMessageAAQToPartnerRequest>""";
// X-EBAY-API-CALL-NAME: AddMemberMessageAAQToPartner`,

    nodejs: `// Trading API: AddMemberMessageAAQToPartner
// QuestionType: General / Payment / Shipping
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'AddMemberMessageAAQToPartner', 'Content-Type': 'text/xml' },
  body: \`<?xml version="1.0" encoding="utf-8"?>
<AddMemberMessageAAQToPartnerRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <MemberMessage>
    <Subject>Question about your item</Subject>
    <Body>Hi, I have a question about shipping options.</Body>
    <QuestionType>Shipping</QuestionType>
    <RecipientID>seller_username</RecipientID>
  </MemberMessage>
</AddMemberMessageAAQToPartnerRequest>\`,
});`,

    go: `// Trading API: AddMemberMessageAAQToPartner
// QuestionType: General / Payment / Shipping
body := \`<?xml version="1.0" encoding="utf-8"?>
<AddMemberMessageAAQToPartnerRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <MemberMessage>
    <Subject>Question about your item</Subject>
    <Body>Hi, I have a question about shipping.</Body>
    <QuestionType>Shipping</QuestionType>
    <RecipientID>seller_username</RecipientID>
  </MemberMessage>
</AddMemberMessageAAQToPartnerRequest>\`
// X-EBAY-API-CALL-NAME: AddMemberMessageAAQToPartner`,

    python: `# Trading API: AddMemberMessageAAQToPartner
# QuestionType: General / Payment / Shipping
import requests
body = """<?xml version="1.0" encoding="utf-8"?>
<AddMemberMessageAAQToPartnerRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <ItemID>123456789</ItemID>
  <MemberMessage>
    <Subject>Question about your item</Subject>
    <Body>Hi, I have a question about the shipping options for this item.</Body>
    <QuestionType>Shipping</QuestionType>
    <RecipientID>seller_username</RecipientID>
  </MemberMessage>
</AddMemberMessageAAQToPartnerRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'AddMemberMessageAAQToPartner', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Commerce Message REST API: sendMessage
// POST https://api.ebay.com/commerce/message/v1/send_message
// 必須: messageText (max 2000文字)
// 必須: conversationId (既存会話) または otherPartyUsername (新規会話) のどちらか一方
// reference.referenceType は現在 LISTING のみ対応
$body = json_encode([
    'messageText'       => 'Hi, I have a question about the shipping options for this item.',
    'otherPartyUsername'=> 'seller_username',
    'reference'         => ['referenceType' => 'LISTING', 'referenceId' => '123456789'],
]);
$ch = curl_init('https://api.ebay.com/commerce/message/v1/send_message');
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
curl_exec($ch); curl_close($ch);`,

    ruby: `# Commerce Message REST API: sendMessage
# messageText: 必須 (max 2000文字)
# otherPartyUsername: 新規会話 / conversationId: 既存会話への返信
require 'net/http'; require 'json'

uri = URI('https://api.ebay.com/commerce/message/v1/send_message')
req = Net::HTTP::Post.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
req['Content-Type']            = 'application/json'
req.body = {
  messageText:        'Hi, I have a question about the shipping options.',
  otherPartyUsername: 'seller_username',
  reference:          { referenceType: 'LISTING', referenceId: '123456789' }
}.to_json
Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// Commerce Message REST API: sendMessage
// messageText 必須、otherPartyUsername(新規) または conversationId(既存返信) のどちらか
String body = """
    {
      "messageText": "Hi, I have a question about shipping.",
      "otherPartyUsername": "seller_username",
      "reference": {"referenceType": "LISTING", "referenceId": "123456789"}
    }""";
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/commerce/message/v1/send_message"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();`,

    nodejs: `// Commerce Message REST API: sendMessage
// messageText 必須、otherPartyUsername(新規) または conversationId(既存返信) のどちらか
const res = await fetch('https://api.ebay.com/commerce/message/v1/send_message', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messageText: 'Hi, I have a question about the shipping options.',
    otherPartyUsername: 'seller_username',
    reference: { referenceType: 'LISTING', referenceId: '123456789' },
  }),
});`,

    go: `// Commerce Message REST API: sendMessage
// messageText 必須、otherPartyUsername(新規) または conversationId(既存返信)
body := \`{
  "messageText": "Hi, I have a question about shipping.",
  "otherPartyUsername": "seller_username",
  "reference": {"referenceType": "LISTING", "referenceId": "123456789"}
}\`
req, _ := http.NewRequest("POST",
    "https://api.ebay.com/commerce/message/v1/send_message",
    strings.NewReader(body))
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
req.Header.Set("Content-Type", "application/json")
http.DefaultClient.Do(req)`,

    python: `# Commerce Message REST API: sendMessage
# messageText: 必須 (max 2000文字)
# otherPartyUsername: 新規会話 / conversationId: 既存会話への返信 (どちらか必須)
import requests

requests.post(
    'https://api.ebay.com/commerce/message/v1/send_message',
    headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
    },
    json={
        'messageText': 'Hi, I have a question about the shipping options for this item.',
        'otherPartyUsername': 'seller_username',
        'reference': {'referenceType': 'LISTING', 'referenceId': '123456789'},
    },
)`,
  } as Record<Lang, string>,
};

// ─── GetMyMessages → getConversations ─────────────────────────────────────────
// Old: Trading API GetMyMessages
// New: Commerce Message REST API  GET /commerce/message/v1/conversation
//   Required: conversation_type (FROM_EBAY / FROM_MEMBERS)
//   Optional: conversation_status (ACTIVE/ARCHIVE/DELETE/READ/UNREAD), reference_id, reference_type (LISTING)

export const getMessages: ApiCallSnippet = {
  old: {
    php: `<?php
// Trading API: GetMyMessages
// FolderID=0 が受信トレイ / FolderID=1 が送信済み
// DetailLevel=ReturnAll が必要
$body = '<?xml version="1.0" encoding="utf-8"?>
<GetMyMessagesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <DetailLevel>ReturnAll</DetailLevel>
  <Pagination>
    <EntriesPerPage>25</EntriesPerPage>
    <PageNumber>1</PageNumber>
  </Pagination>
</GetMyMessagesRequest>';
// POST api.ebay.com/ws/api.dll, X-EBAY-API-CALL-NAME: GetMyMessages`,

    ruby: `# Trading API: GetMyMessages
body = <<~XML
  <GetMyMessagesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
    <DetailLevel>ReturnAll</DetailLevel>
    <Pagination><EntriesPerPage>25</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
  </GetMyMessagesRequest>
XML
# X-EBAY-API-CALL-NAME: GetMyMessages`,

    java: `// Trading API: GetMyMessages
String body = """
    <GetMyMessagesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
      <DetailLevel>ReturnAll</DetailLevel>
      <Pagination><EntriesPerPage>25</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
    </GetMyMessagesRequest>""";
// X-EBAY-API-CALL-NAME: GetMyMessages`,

    nodejs: `// Trading API: GetMyMessages
await fetch('https://api.ebay.com/ws/api.dll', {
  method: 'POST',
  headers: { 'X-EBAY-API-CALL-NAME': 'GetMyMessages', 'Content-Type': 'text/xml' },
  body: \`<GetMyMessagesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <DetailLevel>ReturnAll</DetailLevel>
  <Pagination><EntriesPerPage>25</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetMyMessagesRequest>\`,
});`,

    go: `// Trading API: GetMyMessages
body := \`<GetMyMessagesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <DetailLevel>ReturnAll</DetailLevel>
  <Pagination><EntriesPerPage>25</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetMyMessagesRequest>\`
// X-EBAY-API-CALL-NAME: GetMyMessages`,

    python: `# Trading API: GetMyMessages
import requests
body = """<GetMyMessagesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>YOUR_TOKEN</eBayAuthToken></RequesterCredentials>
  <DetailLevel>ReturnAll</DetailLevel>
  <Pagination><EntriesPerPage>25</EntriesPerPage><PageNumber>1</PageNumber></Pagination>
</GetMyMessagesRequest>"""
requests.post('https://api.ebay.com/ws/api.dll', data=body, headers={
    'X-EBAY-API-CALL-NAME': 'GetMyMessages', 'Content-Type': 'text/xml',
})`,
  } as Record<Lang, string>,

  new: {
    php: `<?php
// Commerce Message REST API: getConversations
// GET https://api.ebay.com/commerce/message/v1/conversation
// conversation_type 必須: FROM_MEMBERS (会員間) / FROM_EBAY (eBayからの通知)
// conversation_status: ACTIVE / ARCHIVE / DELETE / READ / UNREAD
$params = http_build_query([
    'conversation_type'   => 'FROM_MEMBERS',
    'conversation_status' => 'ACTIVE',
    'limit'               => 25,
    'offset'              => 0,
]);
$ch = curl_init("https://api.ebay.com/commerce/message/v1/conversation?{$params}");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_ACCESS_TOKEN',
        'X-EBAY-C-MARKETPLACE-ID: EBAY_US',
    ],
]);
$data = json_decode(curl_exec($ch), true);
curl_close($ch);`,

    ruby: `# Commerce Message REST API: getConversations
# conversation_type 必須: FROM_MEMBERS / FROM_EBAY
# conversation_status: ACTIVE / ARCHIVE / DELETE / READ / UNREAD
require 'net/http'
uri = URI('https://api.ebay.com/commerce/message/v1/conversation')
uri.query = URI.encode_www_form(
  conversation_type:   'FROM_MEMBERS',
  conversation_status: 'ACTIVE',
  limit: 25, offset: 0
)
req = Net::HTTP::Get.new(uri)
req['Authorization']           = 'Bearer YOUR_ACCESS_TOKEN'
req['X-EBAY-C-MARKETPLACE-ID'] = 'EBAY_US'
res = Net::HTTP.start(uri.host, 443, use_ssl: true) { |h| h.request(req) }`,

    java: `// Commerce Message REST API: getConversations
// conversation_type 必須: FROM_MEMBERS / FROM_EBAY
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.ebay.com/commerce/message/v1/conversation" +
        "?conversation_type=FROM_MEMBERS&conversation_status=ACTIVE&limit=25&offset=0"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
    .GET()
    .build();
http.send(req, HttpResponse.BodyHandlers.ofString());`,

    nodejs: `// Commerce Message REST API: getConversations
// conversation_type 必須: FROM_MEMBERS / FROM_EBAY
// conversation_status: ACTIVE / ARCHIVE / DELETE / READ / UNREAD
const params = new URLSearchParams({
  conversation_type: 'FROM_MEMBERS',
  conversation_status: 'ACTIVE',
  limit: '25',
  offset: '0',
});
const { conversations } = await fetch(
  \`https://api.ebay.com/commerce/message/v1/conversation?\${params}\`,
  { headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US' } }
).then(r => r.json());`,

    go: `// Commerce Message REST API: getConversations
// conversation_type 必須: FROM_MEMBERS / FROM_EBAY
req, _ := http.NewRequest("GET",
    "https://api.ebay.com/commerce/message/v1/conversation"+
        "?conversation_type=FROM_MEMBERS&conversation_status=ACTIVE&limit=25",
    nil)
req.Header.Set("Authorization", "Bearer YOUR_ACCESS_TOKEN")
req.Header.Set("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
http.DefaultClient.Do(req)`,

    python: `# Commerce Message REST API: getConversations
# conversation_type 必須: FROM_MEMBERS / FROM_EBAY
# conversation_status: ACTIVE / ARCHIVE / DELETE / READ / UNREAD
import requests
res = requests.get(
    'https://api.ebay.com/commerce/message/v1/conversation',
    params={
        'conversation_type': 'FROM_MEMBERS',
        'conversation_status': 'ACTIVE',
        'limit': 25,
        'offset': 0,
    },
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'},
)
conversations = res.json()`,
  } as Record<Lang, string>,
};

// ─── Map: oldApi name → snippet ──────────────────────────────────────────────

export const messagingSnippetByOldApi: Record<string, ApiCallSnippet> = {
  "AddMemberMessageAAQToPartner":    sendMessage,
  "AddMemberMessageRTQ":             sendMessage,
  "AddMemberMessagesAAQToBidder":    sendMessage,
  "GetMyMessages":                   getMessages,
  "GetMemberMessages":               getMessages,
  "ReviseMyMessages":                getMessages,
  "DeleteMyMessages":                getMessages,
};
