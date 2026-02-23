import { motion } from "framer-motion";

export function RankedResults({ results, onFetch }: { results: any[], onFetch: () => void }) {
    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-lg text-[#E6EAF2]">Ranked Recommendations</h3>
                <button
                    onClick={onFetch}
                    className="px-3 py-1.5 rounded bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] 
                       text-[#9AA4BF] text-xs font-medium hover:bg-[rgba(255,255,255,0.08)] hover:text-[#E6EAF2] transition"
                >
                    Sync Ledgers
                </button>
            </div>

            <div className="grid gap-3">
                {results.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl text-[#6B7280] text-sm font-medium">
                        Awaiting proposal data from GenLayer IntContract
                    </div>
                ) : (
                    results.map((r, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={r.proposal_id}
                            className="bg-[#1A2030] border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.12)] transition-colors
                           rounded-lg p-5 flex justify-between items-center group cursor-default"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-[#6B7280] font-mono text-sm leading-none">0{idx + 1}</span>
                                    <p className="font-medium text-[#E6EAF2] leading-none">{r.proposal_id}</p>
                                </div>

                                <div className="flex gap-4 mt-3">
                                    <div className="text-xs text-[#9AA4BF]">
                                        Clarity <span className="font-mono ml-1 text-[#E6EAF2]">{r.scores?.clarity?.toFixed(1) || 0}</span>
                                    </div>
                                    <div className="text-xs text-[#9AA4BF]">
                                        Innovation <span className="font-mono ml-1 text-[#E6EAF2]">{r.scores?.innovation?.toFixed(1) || 0}</span>
                                    </div>
                                    <div className="text-xs text-[#9AA4BF]">
                                        Feasibility <span className="font-mono ml-1 text-[#E6EAF2]">{r.scores?.feasibility?.toFixed(1) || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right flex flex-col items-end">
                                <span className="font-mono text-2xl text-[#7C8CFF] leading-none mb-1">
                                    {r.total_score?.toFixed(1)}
                                </span>
                                <span className="text-[10px] tracking-wider uppercase font-semibold text-[#6B7280]">
                                    Aggregate
                                </span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </section>
    );
}
