interface Step {
    title: string;
    detail: string;
    txHash?: string;
}

const EXPLORER_URL = "https://studio.genlayer.com/transactions";

export function EvaluationTimeline({ steps }: { steps: Step[] }) {
    if (!steps || steps.length === 0) return null;

    return (
        <section className="bg-[#141923] rounded-xl border border-[rgba(255,255,255,0.06)] p-5 sm:p-6">
            <h3 className="font-serif text-lg mb-6 text-[#E6EAF2]">Evaluation Process</h3>
            <ol className="space-y-6 relative before:absolute before:inset-y-0 before:left-[3px] before:w-[2px] before:bg-[rgba(255,255,255,0.06)]">
                {steps.map((step, i) => (
                    <li
                        key={i}
                        className="flex gap-4 items-start text-sm text-[#9AA4BF] relative"
                    >
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#7C8CFF] shrink-0 border-2 border-[#141923] box-content relative z-10" />
                        <div>
                            <p className="font-medium text-[#E6EAF2] leading-none mb-1">{step.title}</p>
                            <p className="text-[#9AA4BF] leading-relaxed">{step.detail}</p>
                            {step.txHash && (
                                <a
                                    href={`${EXPLORER_URL}/${step.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-[#7C8CFF] hover:text-[#A5B0FF] transition-colors font-mono"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                    {step.txHash.slice(0, 10)}...{step.txHash.slice(-6)}
                                </a>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
