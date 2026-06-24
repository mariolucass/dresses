import { unstable_cache as nextCache, revalidateTag } from "next/cache";

export const cache = <T, P extends any[]>(
  fn: (...args: P) => Promise<T>,
  keys: string[],
  tags: string[],
) => {
  return nextCache(fn, keys, { tags });
};

export const revalidate = (tag: string) => {
  revalidateTag(tag, "default");
};
