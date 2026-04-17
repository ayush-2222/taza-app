export const NewsModel = {
  table: "news",
  searchableFields: ["title", "description", "content"],
  filterableFields: ["category", "state"]
} as const;

