export type ApiType = "graphql" | "rest" | "not-migrated";

export interface MappingRow {
  oldApi: string;
  newOperation: string;
  type: ApiType;
  notes?: string;
}

export interface MappingSection {
  id: string;
  scope?: string;
  scopeRead?: string;
  rows: MappingRow[];
}

export const listingMapping: MappingSection = {
  id: "listing",
  scope: "https://api.ebay.com/oauth/api_scope/sell.listing",
  // sell.listing は read/write 両対応に変更。sell.listing.read は今後不要
  // scopeRead: "https://api.ebay.com/oauth/api_scope/sell.listing.read",
  rows: [
    { oldApi: "AddFixedPriceItem", newOperation: "createListing", type: "graphql" },
    { oldApi: "AddItem", newOperation: "createListing", type: "graphql" },
    { oldApi: "AddItems", newOperation: "createListing (one at a time)", type: "graphql", notes: "Bulk: use Sell Feed API" },
    { oldApi: "VerifyAddFixedPriceItem", newOperation: "createListing { options: { operationMode: VALIDATE } }", type: "graphql", notes: "No separate verify endpoint" },
    { oldApi: "VerifyAddItem", newOperation: "createListing { options: { operationMode: VALIDATE } }", type: "graphql" },
    { oldApi: "ReviseFixedPriceItem", newOperation: "updateListing", type: "graphql", notes: "Only send changed fields (except arrays — full replace)" },
    { oldApi: "ReviseItem", newOperation: "updateListing", type: "graphql" },
    { oldApi: "ReviseInventoryStatus", newOperation: "bulkUpdateInventory", type: "graphql", notes: "Price + quantity for up to 4 items" },
    { oldApi: "RelistFixedPriceItem", newOperation: "relistListing", type: "graphql", notes: "Always gets new listingId" },
    { oldApi: "RelistItem", newOperation: "relistListing", type: "graphql" },
    { oldApi: "VerifyRelistItem", newOperation: "relistListing { operationMode: VALIDATE }", type: "graphql" },
    { oldApi: "AddSecondChanceItem", newOperation: "createSecondChanceListing", type: "graphql" },
    { oldApi: "EndItem", newOperation: "endListing", type: "graphql", notes: "Must provide endListingReason" },
    { oldApi: "EndFixedPriceItem", newOperation: "endListing", type: "graphql" },
    { oldApi: "GetItem", newOperation: "sellerListings", type: "graphql" },
    { oldApi: "GetMyeBaySelling", newOperation: "sellerListingSearch", type: "graphql", notes: "Returns active/ended/scheduled arrays" },
    { oldApi: "GetSellerList", newOperation: "sellerListingSearch", type: "graphql" },
    { oldApi: "GetSellerEvents", newOperation: "sellerListingSearch", type: "graphql", notes: "Use modifiedAtRange filter" },
    { oldApi: "GetAllBidders", newOperation: "itemBiddingActivity", type: "graphql", notes: "Auction API" },
    { oldApi: "GetBidderList", newOperation: "userBiddingActivity", type: "graphql", notes: "Auction API" },
    { oldApi: "UploadSiteHostedPictures", newOperation: "createImageFromFile / createImageFromUrl", type: "rest", notes: "Media API — returns EPS URL" },
    { oldApi: "AddToItemDescription", newOperation: "—", type: "not-migrated", notes: "Use updateListing with full description" },
    { oldApi: "GetDescriptionTemplates", newOperation: "—", type: "not-migrated", notes: "Listing Designer templates no longer supported" },
  ],
};

export const orderPaidMapping: MappingSection = {
  id: "order-paid",
  scope: "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
  rows: [
    { oldApi: "GetOrders (paid)", newOperation: "orders", type: "graphql", notes: "Supports dateRange, listingId, status filters" },
    { oldApi: "GetSellerTransactions (paid)", newOperation: "orders", type: "graphql" },
    { oldApi: "GetOrders by ID (paid)", newOperation: "ordersByIds", type: "graphql", notes: "Up to 100 IDs" },
    { oldApi: "GetItemTransactions (paid, by listing)", newOperation: "orders { listingId filter + includeConfirmed: true }", type: "graphql" },
    { oldApi: "GetItemTransactions (line items)", newOperation: "orderLineItemsByIds", type: "graphql", notes: "Up to 100 IDs" },
    { oldApi: "CompleteSale (mark offline paid)", newOperation: "markOrdersPaid", type: "graphql" },
  ],
};

export const orderUnpaidMapping: MappingSection = {
  id: "order-unpaid",
  rows: [
    { oldApi: "GetOrders (unpaid)", newOperation: "itemCommitments", type: "graphql", notes: "Cursor-based pagination" },
    { oldApi: "GetSellerTransactions (unpaid)", newOperation: "itemCommitments", type: "graphql" },
    { oldApi: "GetItemTransactions (unpaid, by listing)", newOperation: "itemCommitments { listingId filter }", type: "graphql" },
    { oldApi: "CompleteSale (mark commitments paid)", newOperation: "markItemCommitmentsPaid", type: "graphql" },
  ],
};

export const orderInvoiceMapping: MappingSection = {
  id: "order-invoice",
  rows: [
    { oldApi: "AddOrder", newOperation: "createPurchaseQuote", type: "graphql", notes: "Combines multiple Item Commitments" },
    { oldApi: "SendInvoice", newOperation: "createPurchaseQuote", type: "graphql", notes: "Also for single-item payment reminders" },
    { oldApi: "SendInvoice (update existing)", newOperation: "bulkUpdatePurchaseQuotes", type: "graphql" },
    { oldApi: "CompleteSale (leave feedback)", newOperation: "leaveFeedback", type: "rest", notes: "Feedback API (REST)" },
    { oldApi: "CompleteSale (tracking info)", newOperation: "createShippingFulfillment", type: "rest", notes: "Fulfillment API (REST)" },
    { oldApi: "CompleteSale (INR tracking)", newOperation: "provideShipmentInfoForItemNotReceivedInquiry", type: "graphql", notes: "Order Inquiry API" },
  ],
};

export const cancellationMapping: MappingSection = {
  id: "cancellation",
  rows: [
    { oldApi: "Approve Cancellation", newOperation: "approveContractCancellation", type: "graphql" },
    { oldApi: "Create Cancellation Request (Item Commitments)", newOperation: "createItemCommitmentCancellation", type: "graphql" },
    { oldApi: "Create Cancellation Request (Orders)", newOperation: "createOrderCancellation", type: "graphql" },
    { oldApi: "Create Cancellation Request (Purchase Quotes)", newOperation: "createPurchaseQuoteCancellation", type: "graphql" },
    { oldApi: "Get Cancellation", newOperation: "contractCancellation", type: "graphql" },
    { oldApi: "Reject Cancellation", newOperation: "declineContractCancellation", type: "graphql" },
    { oldApi: "Search Cancellations", newOperation: "sellerContractCancellations", type: "graphql" },
    { oldApi: "Check Cancellation Eligibility", newOperation: "—", type: "not-migrated", notes: "A business error is returned if ineligible" },
  ],
};

export const returnsMapping: MappingSection = {
  id: "returns",
  rows: [
    { oldApi: "Get Return", newOperation: "orderReturn", type: "graphql", notes: "Also returns Case info if filed" },
    { oldApi: "Search Returns", newOperation: "sellerOrderReturns", type: "graphql" },
    { oldApi: "Get Return Preference", newOperation: "sellerReturnPreference", type: "graphql" },
    { oldApi: "Approve Return", newOperation: "approveReturn", type: "graphql" },
    { oldApi: "Decline Return", newOperation: "declineReturn", type: "graphql" },
    { oldApi: "Issue Refund", newOperation: "processReturnRefund", type: "graphql" },
    { oldApi: "Mark Return Received", newOperation: "recordReturnReceived", type: "graphql" },
    { oldApi: "Add Shipping Label (downloadable)", newOperation: "attachReturnShipmentLabel", type: "graphql", notes: "Use uploadPostOrderDocument (Media API) first" },
    { oldApi: "Add Shipping Label Info (offline)", newOperation: "recordReturnLabelSentOffline", type: "graphql" },
    { oldApi: "Propose Keep Item + Partial Refund", newOperation: "proposeKeepItemWithPartialRefund", type: "graphql" },
    { oldApi: "Provide RMA Number", newOperation: "provideRmaNumber", type: "graphql" },
    { oldApi: "Send Message", newOperation: "sendReturnMessage", type: "graphql" },
    { oldApi: "Set Return Preference", newOperation: "updateSellerRmaPreference", type: "graphql" },
    { oldApi: "Escalate to eBay (return case)", newOperation: "submitReturnReferral", type: "graphql" },
  ],
};

export const inrMapping: MappingSection = {
  id: "inr",
  rows: [
    { oldApi: "Get Inquiry", newOperation: "orderInquiry", type: "graphql", notes: "Returns Case info if filed" },
    { oldApi: "Search Inquiries", newOperation: "sellerOrderInquiries", type: "graphql" },
    { oldApi: "Provide Tracking (INR)", newOperation: "provideShipmentInfoForItemNotReceivedInquiry", type: "graphql" },
    { oldApi: "Issue Refund (INR)", newOperation: "processOrderInquiryRefund", type: "graphql" },
    { oldApi: "Send Message (INR)", newOperation: "sendOrderInquiryMessage", type: "graphql" },
    { oldApi: "Escalate to eBay (INR case)", newOperation: "submitOrderInquiryReferral", type: "graphql" },
  ],
};

export const accountMapping: MappingSection = {
  id: "account",
  rows: [
    { oldApi: "GetUser (Trading API)", newOperation: "user (User API GraphQL)", type: "graphql", notes: "More extensive than Identity API" },
    { oldApi: "GetAccount (listing fees)", newOperation: "getBillingActivities (Finances API)", type: "rest" },
    { oldApi: "GetAccount (transactions)", newOperation: "getTransactions (Finances API)", type: "rest" },
    { oldApi: "GetUserContactDetails", newOperation: "—", type: "not-migrated", notes: "PII for other users no longer accessible" },
    { oldApi: "SetUserNotes (add/update)", newOperation: "createOrReplaceUserNote (User Note API)", type: "graphql", notes: "By itemId or orderLineItemId" },
    { oldApi: "SetUserNotes (delete)", newOperation: "deleteUserNote (User Note API)", type: "graphql" },
    { oldApi: "GetStore", newOperation: "getStore (Stores API)", type: "rest" },
    { oldApi: "GetStore (category hierarchy)", newOperation: "getStoreCategories (Stores API)", type: "rest" },
    { oldApi: "SetStoreCategories (add)", newOperation: "addStoreCategory (Stores API)", type: "rest", notes: "Async" },
    { oldApi: "SetStoreCategories (rename)", newOperation: "renameStoreCategory (Stores API)", type: "rest", notes: "Sync" },
    { oldApi: "SetStoreCategories (delete)", newOperation: "deleteStoreCategory (Stores API)", type: "rest", notes: "Async" },
    { oldApi: "GetUserPreferences", newOperation: "getUserPreferences (Account API v2)", type: "rest" },
    { oldApi: "SetUserPreferences", newOperation: "setUserPreferences (Account API v2)", type: "rest" },
    { oldApi: "GetTaxTable", newOperation: "getSalesTaxes (Account API v1)", type: "rest", notes: "Only US and CA supported" },
    { oldApi: "SetTaxTable (single)", newOperation: "createOrReplaceSalesTax (Account API v1)", type: "rest" },
  ],
};

export const metadataMapping: MappingSection = {
  id: "metadata",
  rows: [
    { oldApi: "GetCategories", newOperation: "getCategoryTree (Taxonomy API)", type: "rest" },
    { oldApi: "GetCategoryFeatures (item conditions)", newOperation: "getItemConditionPolicies (Metadata API)", type: "rest" },
    { oldApi: "GetCategoryFeatures (return policies)", newOperation: "getReturnPolicies (Metadata API)", type: "rest" },
    { oldApi: "GetCategoryFeatures (Best Offer)", newOperation: "getNegotiatedPricePolicies (Metadata API)", type: "rest" },
    { oldApi: "GetCategoryFeatures (aspects/GTIN)", newOperation: "getItemAspectsForCategory (Taxonomy API)", type: "rest" },
    { oldApi: "GeteBayDetails (ShippingServiceDetails)", newOperation: "getShippingServices (Metadata API)", type: "rest" },
    { oldApi: "GeteBayDetails (ShippingCarrierDetails)", newOperation: "getShippingCarriers (Metadata API)", type: "rest" },
    { oldApi: "GeteBayDetails (CurrencyDetails)", newOperation: "getCurrencies (Metadata API)", type: "rest" },
    { oldApi: "findProducts", newOperation: "search (Catalog API)", type: "rest" },
    { oldApi: "getProductDetails", newOperation: "getProduct (Catalog API)", type: "rest", notes: "ePID as path param" },
  ],
};

export const offersMapping: MappingSection = {
  id: "offers",
  rows: [
    { oldApi: "GetBestOffers", newOperation: "sellerNegotiationHistory", type: "graphql", notes: "Filter by date range, status" },
    { oldApi: "RespondToBestOffer (Accept)", newOperation: "acceptOffer", type: "graphql" },
    { oldApi: "RespondToBestOffer (Counter)", newOperation: "counterOffer", type: "graphql" },
    { oldApi: "RespondToBestOffer (Decline)", newOperation: "declineOffer", type: "graphql" },
  ],
};

export const messagingMapping: MappingSection = {
  id: "messaging",
  rows: [
    { oldApi: "AddMemberMessageAAQToPartner", newOperation: "sendMessage", type: "rest" },
    { oldApi: "AddMemberMessageRTQ", newOperation: "sendMessage", type: "rest" },
    { oldApi: "AddMemberMessagesAAQToBidder", newOperation: "sendMessage", type: "rest" },
    { oldApi: "GetMyMessages", newOperation: "getConversations + getConversation", type: "rest", notes: "conversation_type required" },
    { oldApi: "GetMemberMessages", newOperation: "getConversations { FROM_EBAY type }", type: "rest" },
    { oldApi: "ReviseMyMessages", newOperation: "bulkUpdateConversation / updateConversation", type: "rest", notes: "Conversation-level, not message-level" },
    { oldApi: "DeleteMyMessages", newOperation: "bulkUpdateConversation { conversationStatus: DELETE }", type: "rest" },
    { oldApi: "GetMessagePreferences", newOperation: "—", type: "not-migrated", notes: "Custom ASQ topics no longer supported" },
    { oldApi: "SetMessagePreferences", newOperation: "—", type: "not-migrated" },
    { oldApi: "ReviseMyMessagesFolders", newOperation: "—", type: "not-migrated", notes: "eBay InBox folder management removed" },
  ],
};

export const feedbackMapping: MappingSection = {
  id: "feedback",
  rows: [
    { oldApi: "LeaveFeedback", newOperation: "leaveFeedback", type: "rest", notes: "Can attach up to 5 images" },
    { oldApi: "GetFeedback (entries)", newOperation: "getFeedback", type: "rest", notes: "feedback_type required (RECEIVED/SENT)" },
    { oldApi: "GetFeedback (metrics)", newOperation: "getFeedbackRatingSummary", type: "rest", notes: "ratingType filter required" },
    { oldApi: "GetItemsAwaitingFeedback", newOperation: "getItemsAwaitingFeedback", type: "rest" },
    { oldApi: "RespondToFeedback", newOperation: "respondToFeedback", type: "rest" },
  ],
};
