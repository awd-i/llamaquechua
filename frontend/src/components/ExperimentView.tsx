import React, { useState } from 'react';
import api from '../utils/api';
import { ConsoleButton } from './ConsoleControls';
import Histogram from './Histogram';

interface ExperimentViewProps {
    onMetricsUpdate: (kl: number) => void;
}

const ExperimentView: React.FC<ExperimentViewProps> = ({ onMetricsUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);

    const runExperiment = async () => {
        setLoading(true);
        try {
            const res = await api.post('/experiment', { numSentences: 100 });
            setResults(res.data);
            onMetricsUpdate(res.data.klDivergenceBits);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex justify-end border-b border-green-500/30 pb-4">
                <ConsoleButton
                    onClick={runExperiment}
                    disabled={loading}
                    active={loading}
                >
                    {loading ? 'INITIALIZING...' : 'RUN EXPERIMENT'}
                </ConsoleButton>
            </div>

            {!results && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-green-900 font-mono tracking-widest uppercase text-xs">
                    <div>Awaiting Matrix Initialization...</div>
                </div>
            )}

            {results && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full animate-fade-in">
                    {/* Left: Stats List */}
                    <div className="col-span-1 md:col-span-4 border-r border-green-500/30 pr-4 flex flex-col gap-4">
                        <h3 className="text-[10px] uppercase tracking-widest text-green-700 mb-2">Telemetry</h3>
                        <StatRow label="Total Samples" value="100" />
                        <StatRow label="Entropy" value={results.entropyGoogle.toFixed(3)} />
                        <StatRow label="Cross-Ent" value={results.crossEntropy.toFixed(3)} />
                        <StatRow label="KL Div" value={results.klDivergenceBits.toFixed(3)} highlight />
                        <StatRow label="Accuracy" value={(results.tokenMatchAccuracy * 100).toFixed(1) + "%"} />

                        <div className="mt-4 pt-4 border-t border-green-500/30">
                            <div className="text-[10px] uppercase text-green-700 mb-1">95% Conf. Interval</div>
                            <div className="font-mono text-green-400">
                                {`[${(results.tokenMatchCI[0] * 100).toFixed(1)}% - ${(results.tokenMatchCI[1] * 100).toFixed(1)}%]`}
                            </div>
                        </div>

                        {/* KL Divergence Histogram */}
                        {results.perSentenceKL && results.perSentenceKL.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-green-500/30">
                                <Histogram
                                    data={results.perSentenceKL}
                                    bins={8}
                                    title="KL Divergence Distribution"
                                />
                            </div>
                        )}
                    </div>

                    {/* Right: All Confusions List */}
                    <div className="col-span-1 md:col-span-8 flex flex-col">
                        <h3 className="text-[10px] uppercase tracking-widest text-green-700 mb-2">
                            Top Word Confusions ({results.topConfusions.length})
                        </h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                            {results.topConfusions.map((confusion: any, index: number) => (
                                <div key={index} className="flex justify-between items-center p-2 border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-green-700 w-6">#{index + 1}</span>
                                        <span className="text-[11px] font-mono text-green-400">
                                            {confusion.googleWord} → {confusion.chatGPTWord}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-mono font-bold text-green-300">
                                        {confusion.count}x
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatRow = ({ label, value, highlight = false }: any) => (
    <div className="flex justify-between items-center p-2 border border-green-500/20 bg-green-500/5">
        <span className="text-[10px] uppercase text-green-700">{label}</span>
        <span className={`font-mono font-bold ${highlight ? 'text-green-300' : 'text-green-500'}`}>{value}</span>
    </div>
);

export default ExperimentView;
