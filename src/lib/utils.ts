
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const ELEMENT_COLORS: Record<string, { text: string; bg: string; border: string; glow: string }> = {
    Wood: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-emerald-500/20" },
    Fire: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", glow: "shadow-red-500/20" },
    Earth: { text: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/20", glow: "shadow-amber-600/20" }, // Clay
    Metal: { text: "text-gray-300", bg: "bg-gray-400/10", border: "border-gray-400/20", glow: "shadow-gray-400/20" },
    Water: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-blue-500/20" },
};

export const POLARITY_ICONS: Record<string, string> = {
    Yang: "+",
    Yin: "-",
};

export function getElementColor(element: string) {
    return ELEMENT_COLORS[element] || ELEMENT_COLORS.Metal; // Fallback
}
