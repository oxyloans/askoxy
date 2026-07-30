import type { CommunityQuery } from "./communityApi";

const getCategoryText = (category: unknown): string => {
  if (typeof category === "string") return category.trim();
  if (typeof category === "number") return String(category);

  if (category && typeof category === "object") {
    const value = category as Record<string, unknown>;

    for (const key of ["categoryName", "name", "label", "title"]) {
      const text = value[key];
      if (typeof text === "string" && text.trim()) return text.trim();
    }
  }

  return "";
};

export const getCategoryLabel = (category: unknown) => {
  const value = getCategoryText(category);

  if (!value.includes("_")) return value;

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const getQueryCategoryLabel = (query: CommunityQuery) => {
  const runtimeQuery = query as unknown as Record<string, unknown>;
  const category =
    getCategoryText(runtimeQuery.otherCategoryName) ||
    getCategoryText(runtimeQuery.customCategory) ||
    getCategoryText(runtimeQuery.categoryName) ||
    getCategoryText(runtimeQuery.category);

  return getCategoryLabel(category || "Community");
};
