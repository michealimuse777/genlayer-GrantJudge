interface Step {
    title: string;
    detail: string;
}

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
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
