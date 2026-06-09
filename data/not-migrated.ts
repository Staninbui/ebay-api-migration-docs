export interface NotMigratedEntry {
  id: string;
  oldApi: string;
  category: string;
  alternativeKey: string; // i18n key for alternative description
}

export const notMigratedApis: NotMigratedEntry[] = [
  {
    id: "add-to-item-description",
    oldApi: "AddToItemDescription",
    category: "listing",
    alternativeKey: "useUpdateListing",
  },
  {
    id: "get-description-templates",
    oldApi: "GetDescriptionTemplates",
    category: "listing",
    alternativeKey: "templatesSunset",
  },
  {
    id: "get-user-contact-details",
    oldApi: "GetUserContactDetails",
    category: "account",
    alternativeKey: "piiRemoved",
  },
  {
    id: "get-message-preferences",
    oldApi: "GetMessagePreferences",
    category: "messaging",
    alternativeKey: "asqTopicsRemoved",
  },
  {
    id: "set-message-preferences",
    oldApi: "SetMessagePreferences",
    category: "messaging",
    alternativeKey: "asqTopicsRemoved",
  },
  {
    id: "revise-my-messages-folders",
    oldApi: "ReviseMyMessagesFolders",
    category: "messaging",
    alternativeKey: "folderManagementRemoved",
  },
  {
    id: "check-cancellation-eligibility",
    oldApi: "Check Cancellation Eligibility",
    category: "cancellation",
    alternativeKey: "eligibilityViaError",
  },
];
