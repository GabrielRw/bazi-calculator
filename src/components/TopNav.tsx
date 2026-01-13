"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Sparkles, Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: "/", label: "Calculator", icon: Calculator },
        { href: "/famous-charts", label: "Famous Charts", icon: Sparkles },
        { href: "/contact", label: "Contact", icon: Mail },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:py-4">
            <div className="max-w-7xl mx-auto">
                <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between bg-black/40 backdrop-blur-md border border-white/10 shadow-xl">
                    {/* Logo/Brand */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-500">
                            <div className="absolute inset-0 bg-jade/20 blur-lg rounded-full" />
                            <img
                                src="/logo.png"
                                alt="True BaZi Logo"
                                className="relative w-full h-full object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white tracking-wide">TRUE BAZI</span>
                            <span className="text-[9px] text-zinc-400 font-medium tracking-[0.2em] uppercase">Calculator</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2
                                        ${isActive
                                            ? "text-jade bg-jade/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? "text-jade" : "text-zinc-500 group-hover:text-white"}`} />
                                    {label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 rounded-lg border border-jade/20 bg-jade/5"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="md:hidden pt-2 overflow-hidden"
                    >
                        <div className="glass-card rounded-2xl p-2 bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-1">
                            {links.map(({ href, label, icon: Icon }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setIsOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all
                                            ${isActive
                                                ? "bg-jade/15 text-jade border border-jade/20"
                                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? "text-jade" : "text-zinc-500"}`} />
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
