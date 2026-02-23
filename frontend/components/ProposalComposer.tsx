import { motion } from "framer-motion";

interface Props {
    proposalId: string;
    setProposalId: (val: string) => void;
    proposalText: string;
    setProposalText: (val: string) => void;
    onSubmit: () => void;
}

export default function ProposalComposer({ proposalId, setProposalId, proposalText, setProposalText, onSubmit }: Props) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141923] rounded-xl border border-[rgba(255,255,255,0.06)] p-5 sm:p-6"
        >
            <h2 className="font-serif text-lg mb-4 text-[#E6EAF2]">
                Submit Proposal for Evaluation
            </h2>

            <input
                value={proposalId}
                onChange={e => setProposalId(e.target.value)}
                className="w-full bg-[#0E1117] text-[#E6EAF2] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-2 mb-3
                   focus:outline-none focus:ring-1 focus:ring-[#7C8CFF] focus:border-[#7C8CFF] transition placeholder-[#6B7280]"
                placeholder="Proposal ID (e.g. PR-104)"
            />

            <textarea
                value={proposalText}
                onChange={e => setProposalText(e.target.value)}
                rows={6}
                className="w-full bg-[#0E1117] text-[#E6EAF2] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-2
                   focus:outline-none focus:ring-1 focus:ring-[#7C8CFF] focus:border-[#7C8CFF] transition placeholder-[#6B7280]"
                placeholder="Paste the proposal text here…"
            />

            <div className="flex justify-end mt-4">
                <button
                    onClick={onSubmit}
                    className="px-4 py-2 rounded-md bg-[#7C8CFF] text-[#0E1117] hover:bg-[#687BE6]
                     transition text-sm font-semibold tracking-wide"
                >
                    Evaluate Proposal
                </button>
            </div>
        </motion.section>
    );
}
