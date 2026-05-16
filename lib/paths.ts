export const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/proplan-klima" : "";

export function asset(path: string) {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
