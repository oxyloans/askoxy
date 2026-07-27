import type { CommunityCategory, CommunityQuery } from "./communityApi";

export const COMMUNITY_CATEGORIES: Array<{
  value: CommunityCategory;
  label: string;
}> = [
  { value: "LOANS_AND_INVESTMENTS", label: "Loans & Investments" },
  { value: "JOBS", label: "Jobs" },
  { value: "STUDY_ABROAD", label: "Study Abroad" },
  { value: "GOLD", label: "Gold" },
  { value: "FRACTIONAL_OWNERSHIP", label: "Fractional Ownership" },
  { value: "NINETY_DAY_JOB_PLAN", label: "90 Days Job Plan" },
  { value: "GCC_MATE", label: "GCC Mate" },
  { value: "FREELANCE_MARKETPLACE", label: "Freelance Marketplace" },
  { value: "NYAYA_GPT", label: "Nyaya GPT" },
  { value: "CA_AND_CS", label: "CA & CS" },
  { value: "BLOCKCHAIN_AND_CRYPTO", label: "Blockchain & Crypto" },
  { value: "GLMS", label: "GLMS" },
  { value: "OTHER", label: "Others" },
];

export const COMMUNITY_FILTER_CATEGORIES: Array<{
  value: CommunityCategory | "";
  label: string;
}> = [{ value: "", label: "All Topics" }, ...COMMUNITY_CATEGORIES];

export const getCategoryLabel = (
  category: CommunityCategory | string,
  customCategoryName?: string | null
) => {
  if (category === "OTHER" && customCategoryName?.trim()) {
    return customCategoryName.trim();
  }

  return (
    COMMUNITY_CATEGORIES.find((item) => item.value === category)?.label ||
    category
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
};

export const getQueryCategoryLabel = (query: CommunityQuery) =>
  getCategoryLabel(
    query.category,
    query.otherCategoryName || query.customCategory || query.categoryName
  );