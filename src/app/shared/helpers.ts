export function randomString(length: number): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function dateDifference(before: any, after: any): number {
  const date1 = new Date(before);
  const date2 = new Date(after);
  const time = date2.getTime() - date1.getTime();
  return time / (1000 * 3600 * 24);
}
