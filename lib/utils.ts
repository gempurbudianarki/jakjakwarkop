import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface UserLevel {
  label: string;
  color: string;
  next: number | null;
}

export function getUserLevel(points: number): UserLevel {
  if (points >= 200) return { label: "Legend",   color: "#fbbf24", next: null };
  if (points >= 100) return { label: "Regular",  color: "#818cf8", next: 200  };
  return                      { label: "Explorer", color: "#10b981", next: 100  };
}
