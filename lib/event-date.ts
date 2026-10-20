export const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
export const WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function daysUntil(iso: string, now = new Date()) {
  const d = new Date(iso + "T00:00:00");
  return Math.ceil((d.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86400000);
}

