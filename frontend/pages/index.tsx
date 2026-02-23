import { useState } from 'react';
// import { GenLayer } from 'genlayer-js'; // Placeholder for GenLayer SDK initialization

export default function Home() {
    const [proposals, setProposals] = useState([]);
    const [newProposalText, setNewProposalText] = useState("");
    const [newProposalId, setNewProposalId] = useState("");

    const submitProposal = async () => {
        // Example of how we will wire this up later using genlayer SDK:
        // try {
        //   await genlayer.contract.write("submit_proposal", { proposal_id: newProposalId, text: newProposalText });
        // } catch (e) { ... }
        console.log("Submitting proposal to contract:", newProposalId);
        alert("Simulation: " + newProposalId + " submitted bounds via genlayer.contract.write()");
    };

    const getRankings = async () => {
        // Example of checking read data bounds:
        // const ranks = await genlayer.contract.read("rank_all");
        // setProposals(ranks);
        console.log("Fetching rankings from GenLayer...");
        setProposals([
            {
                proposal_id: "DEMO-XYZ-01",
                status: "MULTI_SCORED",
                total_score: 24.5,
                scores: { clarity: 8.5, innovation: 9.0, feasibility: 7.0 }
            }
        ] as any);
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
            <header className="max-w-4xl mx-auto flex items-center justify-between mb-12 border-b border-neutral-800 pb-6">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Autonomous Grant Evaluator
                    </h1>
                    <p className="text-neutral-400 mt-2">Powered by GenLayer Intelligent Contracts & AI Reasoning</p>
                </div>
                <div className="text-right">
                    <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Connected Contract</span>
                    <div className="font-mono text-sm bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-md mt-1 text-emerald-400">
                        0xb87E7682FFDED20398DF913e3019dDD43f56bb46
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto space-y-12">
                {/* Submission Section */}
                <section className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-700 backdrop-blur-sm">
                    <h2 className="text-2xl font-semibold mb-4 text-emerald-300">Submit an Evaluation</h2>
                    <div className="space-y-4">
                        <input
                            className="w-full bg-neutral-900 border border-neutral-700 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Proposal ID (e.g. PR-100)"
                            value={newProposalId}
                            onChange={(e) => setNewProposalId(e.target.value)}
                        />
                        <textarea
                            className="w-full bg-neutral-900 border border-neutral-700 p-3 rounded-lg h-32 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Paste grant proposal text here..."
                            value={newProposalText}
                            onChange={(e) => setNewProposalText(e.target.value)}
                        />
                        <button
                            onClick={submitProposal}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg font-medium text-white shadow-lg shadow-blue-500/20"
                        >
                            Submit to GenVM Contract
                        </button>
                    </div>
                </section>

                {/* Dynamic Rankings View */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-emerald-300">Top Ranked Proposals</h2>
                        <button
                            onClick={getRankings}
                            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 transition-colors border border-neutral-700 rounded-lg text-sm text-neutral-300 font-medium"
                        >
                            Fetch Network Consensus
                        </button>
                    </div>

                    <div className="space-y-4">
                        {proposals.length === 0 ? (
                            <div className="text-center p-12 py-16 border border-dashed border-neutral-700 bg-neutral-800/20 rounded-2xl text-neutral-500">
                                No evaluated proposals found. Submit one above and call the ranking function.
                            </div>
                        ) : (
                            proposals.map((p: any, i) => (
                                <div key={i} className="p-6 bg-neutral-800/80 rounded-xl border border-neutral-700 flex justify-between items-center hover:border-neutral-500 transition-all shadow-sm">
                                    <div>
                                        <h3 className="font-bold text-xl text-white">{p.proposal_id}</h3>
                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-emerald-900 text-emerald-300 rounded-md border border-emerald-800">
                                            {p.status}
                                        </span>
                                        <div className="flex gap-4 mt-3 text-sm text-neutral-400 bg-black/20 p-2 rounded-lg inline-flex mt-4">
                                            <span>Clarity: <span className="text-white font-medium">{p.scores?.clarity?.toFixed(1) || 0}</span></span>
                                            <span>Innovation: <span className="text-white font-medium">{p.scores?.innovation?.toFixed(1) || 0}</span></span>
                                            <span>Feasibility: <span className="text-white font-medium">{p.scores?.feasibility?.toFixed(1) || 0}</span></span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                                            {p.total_score?.toFixed(1)}
                                        </span>
                                        <span className="text-sm font-bold text-neutral-500 block uppercase tracking-wide mt-1">Total Score</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
