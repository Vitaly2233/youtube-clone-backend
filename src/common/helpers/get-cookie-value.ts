export function getCookieValueByName(cookie: string, name: string): string {
  const match = cookie?.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : '';
}
