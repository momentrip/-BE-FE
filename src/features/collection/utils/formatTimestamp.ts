/** "10월 4일 오후 10:12" 형식으로 저장 시각을 표시한다. */
export function formatTimestamp(isoDate: string): string {
  const date = new Date(isoDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour24 = date.getHours();
  const ampm = hour24 < 12 ? "오전" : "오후";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${month}월 ${day}일 ${ampm} ${hour12}:${minute}`;
}
