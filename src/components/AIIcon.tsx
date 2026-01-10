"use client";

import clsx from "clsx";

interface AIIconProps {
    className?: string;
    size?: number | string;
}

/**
 * Custom AI Icon component that uses loop.png as a mask.
 * This allows the icon to be colored using CSS background-color (e.g., bg-current or bg-jade).
 */
export default function AIIcon({ className, size = 22 }: AIIconProps) {
    const sizeStyle = typeof size === "number" ? `${size}px` : size;

    return (
        <div
            className={clsx("shrink-0", className)}
            style={{
                width: sizeStyle,
                height: sizeStyle,
                backgroundColor: "currentColor",
                maskImage: 'url("/loop.png")',
                maskSize: "contain",
                maskPosition: "center",
                maskRepeat: "no-repeat",
                WebkitMaskImage: 'url("/loop.png")',
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
            }}
        />
    );
}
