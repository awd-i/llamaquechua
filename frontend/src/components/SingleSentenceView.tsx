import React, { useState } from 'react';
import api from '../utils/api';
import { ConsoleButton, ConsoleInput } from './ConsoleControls';

interface SingleSentenceViewProps {
    onMetricsUpdate: (kl: number) => void;
}

const SingleSentenceView: React.FC<SingleSentenceViewProps> = ({ onMetricsUpdate }) => {
    const [sentence, setSentence] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleTranslate = async () => {
        if (!sentence.trim()) return;
        setLoading(true);
        try {
            const res = await api.get('/translate', { params: { sentence } });
            setResult(res.data);
            onMetricsUpdate(res.data.metrics.klDivergenceBits);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const TokenizedText = ({ text, otherText, label }: { text: string, otherText: string, label: string }) => {
        const tokens = text.split(' ');
        const otherTokens = otherText.split(' ');

        return (
            <div className="mb-4">
                <div className="text-[10px] uppercase text-green-700 mb-1">{label}</div>
                <div className="flex flex-wrap gap-x-1 gap-y-1 font-mono text-sm">
                    {tokens.map((t, i) => {
                        const match = otherTokens[i] === t;
                        return (
                            <span key={i} className={`${match ? 'text-green-400' : 'text-red-500 bg-red-900/20 px-1'}`}>
                                {t}{i < tokens.length - 1 ? ' ' : ''}
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-col gap-4">
                <ConsoleInput
                    label="Input Sequence"
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    placeholder="ENTER TEXT..."
                />

                <ConsoleButton
                    onClick={handleTranslate}
                    disabled={loading}
                    active={loading}
                    className="w-full"
                >
                    {loading ? 'PROCESSING...' : 'TRANSMIT'}
                </ConsoleButton>
            </div>

            {result ? (
                <div className="flex-1 flex flex-col gap-4 border-t border-green-500/30 pt-4">
                    <TokenizedText label="Reference (Google)" text={result.googleQuechua} otherText={result.chatgptQuechua} />
                    <TokenizedText label="Subject (ChatGPT)" text={result.chatgptQuechua} otherText={result.googleQuechua} />

                    <div className="mt-auto grid grid-cols-2 gap-4 border-t border-green-500/30 pt-4">
                        <MetricRow label="Entropy" value={result.metrics.entropyGoogle.toFixed(3)} />
                        <MetricRow label="KL Div" value={result.metrics.klDivergenceBits.toFixed(3)} highlight />
                        <MetricRow label="Accuracy" value={(result.metrics.tokenMatchAccuracy * 100).toFixed(1) + "%"} />
                        <MetricRow label="X-Ent" value={result.metrics.crossEntropy.toFixed(3)} />
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-green-900 text-xs uppercase tracking-widest">
                    Ready for Input
                </div>
            )}
        </div>
    );
};

const MetricRow = ({ label, value, highlight = false }: any) => (
    <div className="flex justify-between items-baseline">
        <span className="text-[10px] uppercase text-green-700">{label}</span>
        <span className={`font-mono font-bold ${highlight ? 'text-green-300' : 'text-green-500'}`}>{value}</span>
    </div>
);

export default SingleSentenceView;
