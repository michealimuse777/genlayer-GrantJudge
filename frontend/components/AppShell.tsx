import { ReactNode } from 'react';

export default function AppShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[#E6EAF2] font-sans">
            <header className="px-4 sm:px-8 py-6 border-b border-white/5">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-2xl sm:text-3xl tracking-tight text-white">
                            GrantJudge
                        </h1>
                        <p className="text-sm text-[#9AA4BF] mt-1">
                            Autonomous grant & bounty evaluation via GenLayer
                        </p>
                    </div>
                    <div className="hidden sm:block text-right">
                        <span className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Contract Status</span>
                        <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-[var(--bg-elevated)] border border-[rgba(255,255,255,0.06)] rounded whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                            <span className="font-mono text-xs text-[#9AA4BF]">0xb87E...bb46</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12">
                <div className="max-w-2xl mx-auto space-y-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
