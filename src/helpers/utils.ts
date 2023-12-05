export function formatDate(date: string, size: number) {
  if (date.includes("T")) date = date.replace("T", " ");
  return date.slice(0, size);
}

export function textCut(str = "", cutSize = 60) {
  if (str.length <= cutSize) {
    return str;
  }
  return (
      `${str.slice(0, cutSize)}...`
  );
}

export function timeZone(date: Date, size = 10) {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return formatDate(date.toISOString(), size);
}
