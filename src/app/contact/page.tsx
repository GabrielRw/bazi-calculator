import { Mail, MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-jade/10 text-jade text-xs font-bold uppercase tracking-wider mb-2">
                    <Mail className="w-3 h-3" />
                    Get in Touch
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                    Contact True Bazi
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Have questions about your chart, feature requests, or business inquiries?
                    We'd love to hear from you.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Card */}
                <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                        <Mail className="w-32 h-32" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="w-12 h-12 rounded-xl bg-jade/10 flex items-center justify-center text-jade mb-4">
                            <MessageSquare className="w-6 h-6" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Direct Message</h3>
                            <p className="text-gray-400 text-sm">
                                For general inquiries, bug reports, and feedback. We typically respond within 24-48 hours.
                            </p>
                        </div>

                        <a
                            href="mailto:gabriel.naulleau@gmail.com"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-jade text-black font-bold hover:bg-jade-light transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            Send Email
                        </a>
                    </div>
                </div>

                {/* Social Card */}
                <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                        <ExternalLink className="w-32 h-32" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                            <ExternalLink className="w-6 h-6" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Follow Updates</h3>
                            <p className="text-gray-400 text-sm">
                                Follow our development journey and get daily astrology insights on our social channels.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="https://x.com/GabrielNolo"
                                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group/link"
                            >
                                <span className="text-sm font-medium text-gray-300">X (@GabrielNolo)</span>
                                <ExternalLink className="w-4 h-4 text-gray-500 group-hover/link:text-white transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
