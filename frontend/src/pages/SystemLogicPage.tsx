import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { ConsoleButton } from '../components/ConsoleControls';

const SystemLogicPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-green-500 p-6 font-mono">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-green-500/30 bg-green-500/10 mb-6">
                    <h1 className="text-2xl font-bold uppercase text-green-400 tracking-widest">
                        System Logic // Probability Core
                    </h1>
                    <ConsoleButton onClick={() => navigate('/')}>
                        ← BACK TO MAIN
                    </ConsoleButton>
                </div>

                {/* Content */}
                <div className="space-y-8 text-sm">
                    <section>
                        <h3 className="text-green-300 font-bold uppercase mb-2 border-l-2 border-green-500 pl-2">
                            1. Multinomial Distribution & MLE
                        </h3>
                        <p className="mb-4 opacity-80">
                            We model Quechua word generation as drawing tokens from a Multinomial distribution.
                            Given counts <InlineMath math="n_G(w)" />, we estimate probabilities using Maximum
                            Likelihood Estimation (MLE) with Laplace smoothing:
                        </p>
                        <div className="bg-green-900/10 p-4 border border-green-500/20 rounded">
                            <BlockMath math="\hat{p}_G(w) = \frac{n_G(w) + \lambda}{N_G + \lambda|V|}" />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-green-300 font-bold uppercase mb-2 border-l-2 border-green-500 pl-2">
                            2. Entropy & Surprise
                        </h3>
                        <p className="mb-4 opacity-80">
                            Entropy measures the inherent uncertainty in Google's translations:
                        </p>
                        <div className="bg-green-900/10 p-4 border border-green-500/20 rounded">
                            <BlockMath math="H(G) = -\sum_{w \in V} \hat{p}_G(w) \log_2 \hat{p}_G(w)" />
                        </div>
                        <p className="mt-4 mb-4 opacity-80">
                            Cross-entropy measures the average surprise when we expect Google but get ChatGPT:
                        </p>
                        <div className="bg-green-900/10 p-4 border border-green-500/20 rounded">
                            <BlockMath math="H(G, C) = -\sum_{w \in V} \hat{p}_G(w) \log_2 \hat{p}_C(w)" />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-green-300 font-bold uppercase mb-2 border-l-2 border-green-500 pl-2">
                            3. KL Divergence (Hallucination Score)
                        </h3>
                        <p className="mb-4 opacity-80">
                            The Kullback-Leibler (KL) divergence quantifies the "extra surprise" or information
                            loss when using ChatGPT instead of Google. This is our proxy for hallucination risk.
                        </p>
                        <div className="bg-green-900/10 p-4 border border-green-500/20 rounded">
                            <BlockMath math="D_{KL}(G||C) = H(G, C) - H(G)" />
                        </div>
                        <p className="mt-4 mb-4 opacity-80">
                            Interpretation:
                        </p>
                        <ul className="list-disc list-inside space-y-2 opacity-80 ml-4">
                            <li><InlineMath math="D_{KL} \approx 0" />: ChatGPT matches Google's distribution closely</li>
                            <li><InlineMath math="D_{KL} > 0.5" />: Significant divergence, potential hallucinations</li>
                            <li><InlineMath math="D_{KL} > 1.0" />: High divergence, hallucination likely</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-green-300 font-bold uppercase mb-2 border-l-2 border-green-500 pl-2">
                            4. Confidence Intervals (CLT)
                        </h3>
                        <p className="mb-4 opacity-80">
                            We treat word matches as Bernoulli trials. By the Central Limit Theorem (CLT), the
                            sample accuracy <InlineMath math="\hat{p}" /> is approximately Normal for large{' '}
                            <InlineMath math="n" />:
                        </p>
                        <div className="bg-green-900/10 p-4 border border-green-500/20 rounded">
                            <BlockMath math="\hat{p} \sim \mathcal{N}\left(p, \frac{p(1-p)}{n}\right)" />
                        </div>
                        <p className="mt-4 opacity-80">
                            We construct a 95% confidence interval using:
                        </p>
                        <div className="bg-green-900/10 p-4 border border-green-500/20 rounded mt-2">
                            <BlockMath math="\text{CI}_{95\%} = \hat{p} \pm 1.96 \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}" />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-green-300 font-bold uppercase mb-2 border-l-2 border-green-500 pl-2">
                            5. Implementation Notes
                        </h3>
                        <ul className="list-disc list-inside space-y-2 opacity-80 ml-4">
                            <li>Laplace smoothing parameter: <InlineMath math="\lambda = 1.0" /></li>
                            <li>All logarithms are base 2 (measuring information in bits)</li>
                            <li>Vocabulary <InlineMath math="V" /> is the union of all unique words from both translators</li>
                            <li>Minimum sample size for CLT approximation: <InlineMath math="n \geq 30" /></li>
                        </ul>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-green-500/30 flex justify-center">
                    <ConsoleButton onClick={() => navigate('/')}>
                        ← RETURN TO TERMINAL
                    </ConsoleButton>
                </div>
            </div>
        </div>
    );
};

export default SystemLogicPage;
