import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('th-TH').format(value);
}

// ฟังก์ชันนี้จะไม่แสดงสัญลักษณ์ ฿ (บาท) ข้างหน้าเลขเงิน
export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercentage(value: number | undefined | null, total: number | undefined | null): string {
  if (value === undefined || value === null || total === undefined || total === null || total === 0) return '-';
  return new Intl.NumberFormat('th-TH', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / total);
}
