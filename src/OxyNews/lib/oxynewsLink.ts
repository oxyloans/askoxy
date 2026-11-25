export const oxynewsPath = (item: {
  slug?: string | null;
  paperclipId: string;
  articleName?: string;
}) => {
  if (item.slug) return `/oxynews/${item.slug}`;
  return `/article/${item.paperclipId}`;
};
