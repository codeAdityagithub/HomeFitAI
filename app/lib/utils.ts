import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToCm(feet: number, inches: number): number {
  const feetToCm = feet * 30.48; // 1 foot = 30.48 cm
  const inchesToCm = inches * 2.54; // 1 inch = 2.54 cm
  return Math.round((feetToCm + inchesToCm) * 2) / 2;
}
export function convertToFeetInches(cm: number): {
  feet: number;
  inch: number;
} {
  const totalInches = cm / 2.54; // 1 inch = 2.54 cm
  const feet = Math.min(Math.floor(totalInches / 12), 8); // 1 foot = 12 inches
  const inch = Math.round(totalInches % 12);
  return { feet, inch };
}

export function convertToLbs(kg: number) {
  return Number((kg * 2.20462).toFixed(2));
}
export function convertToKg(lbs: number) {
  return Number((lbs * 0.453592).toFixed(2));
}

export function getImageFromVideoId(videoId: string) {
  return `https://img.youtube.com/vi/${videoId.split("?")[0]}/sddefault.jpg`;
}
