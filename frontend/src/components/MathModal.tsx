import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { ConsoleButton } from './ConsoleControls';

interface MathModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MathModal: React.FC<MathModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            {/* Black Backdrop Overlay */}
            <div
                className="absolute inset-0 bg-black"
                onClick={onClose}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-3xl bg-black border border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)] flex flex-col max-h-[90vh] z-10">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-green-500/30 bg-green-500/10">
                    <h2 className="text-lg font-mono font-bold uppercase text-green-400 tracking-widest">
                        System Logic // Probability Core
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-green-500 hover:text-green-300 font-mono text-xl leading-none"
                    >
                        [X]
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar font-mono text-green-500 text-sm space-y-8">

                    <section>
                        <h3 className="text-green-300 font-bold uppercase mb-2 border-l-2 border-green-500 pl-2">1. Multinomial Distribution & MLE</h3>
                        <p className="mb-4 opacity-80">
                            We model Quechua word generation as drawing tokens from a Multinomial distribution. Given counts <InlineMath math="n_G(w)" />, we estimate probabilities using Maximum Likelihood Estimation (MLE) with Laplace smoothing:
                        </p>
                        <div className="bg-green-900/10 p-2 border border-green-500/20">
                            <BlockMath math="\hat{p}_G(w) = \frac{n_G(w) + \lambda}{N_G + \lambda|V|}" />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-green-300 font-bold uppercase mb-2 border-l-2 border-green-500 pl-2">2. Entropy & Surprise</h3>
                        <p className="mb-4 opacity-80">
                            Entropy measures the inherent uncertainty in Google's translations:
                        </p>
                        <div className="bg-green-900/10 p-2 border border-green-500/20">
                            <BlockMath math="H(G) = -\sum_{w \in V} \hat{p}_G(w) \log_2 \hat{p}_G(w)" />
                        </div>
                        <p className="mt-4 mb-4 opacity-80">
                            Cross-entropy measures the average surprise when we expect Google but get ChatGPT:
                        </p>
                        <div className="bg-green-900/10 p-2 border border-green-500/20">
                            <BlockMath math="H(G, C) = -\sum_{w \in V} \hat{p}_G(w) \log_2 \hat{p}_C(w)" />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-green-300 font-bold uppercase mb-2 border-l-2 border-green-500 pl-2">3. KL Divergence (Hallucination Score)</h3>
                        <p className="mb-4 opacity-80">
                            The Kullback-Leibler (KL) divergence quantifies the "extra surprise" or information loss when using ChatGPT instead of Google. This is our proxy for hallucination risk.
                        </p>
                        <div className="bg-green-900/10 p-2 border border-green-500/20">
                            <BlockMath math="D_{KL}(G||C) = H(G, C) - H(G)" />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-green-300 font-bold uppercase mb-2 border-l-2 border-green-500 pl-2">4. Confidence Intervals (CLT)</h3>
                        <p className="mb-4 opacity-80">
                            We treat word matches as Bernoulli trials. By the Central Limit Theorem (CLT), the sample accuracy <InlineMath math="\hat{p}" /> is approximately Normal for large <InlineMath math="n" />:
                        </p>
                        <div className="bg-green-900/10 p-2 border border-green-500/20">
                            <BlockMath math="\hat{p} \sim \mathcal{N}\left(p, \frac{p(1-p)}{n}\right)" />
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-green-500/30 bg-black flex justify-end">
                    <ConsoleButton onClick={onClose}>CLOSE TERMINAL</ConsoleButton>
                </div>
            </div>
        </div>
    );
};

export default MathModal;
