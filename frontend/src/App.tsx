import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleSentenceView from './components/SingleSentenceView';
import ExperimentView from './components/ExperimentView';
import ConsoleLayout from './components/ConsoleLayout';
import ConsoleLlama from './components/ConsoleLlama';
import { ConsoleCard } from './components/ConsoleControls';

function App() {
  const navigate = useNavigate();
  const [klDivergence, setKlDivergence] = useState<number | null>(null);

  const getLlamaMessage = () => {
    if (klDivergence === null) return "SSYSTEM ONLINE. AWAITING INPUT STREAM";
    if (klDivergence < 0.1) return "MMATCH CONFIRMED. HIGH FIDELITY TRANSLATION.";
    if (klDivergence < 0.5) return "VVARIANCE DETECTED. WITHIN ACCEPTABLE PARAMETERS.";
    return "CCRITICAL DIVERGENCE. HALLUCINATION PROBABILITY: HIGH.";
  };

  return (
    <ConsoleLayout>
      {/* Left Column: System Status & Input */}
      <div className="col-span-1 md:col-span-12 lg:col-span-4 flex flex-col gap-4 h-full">
        {/* Llama Avatar / Status */}
        <ConsoleCard title="System Status" className="shrink-0">
          <ConsoleLlama message={getLlamaMessage()} />
          <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] uppercase text-green-700">
            <div>CPU: 12%</div>
            <div>RAM: 4.2GB</div>
            <div>PID: 8821</div>
            <div>MODE: HYBRID</div>
          </div>
        </ConsoleCard>

        {/* Single Sentence Input */}
        <ConsoleCard title="Input Terminal" className="flex-1 min-h-[400px]">
          <SingleSentenceView onMetricsUpdate={setKlDivergence} />
        </ConsoleCard>
      </div>

      {/* Right Column: Experiment Data */}
      <div className="col-span-1 md:col-span-12 lg:col-span-8 flex flex-col gap-4 h-full">
        <ConsoleCard title="Experiment Matrix & Telemetry" className="h-full min-h-[500px]">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => navigate('/system-logic')}
              className="text-[10px] uppercase tracking-widest text-green-700 hover:text-green-500 hover:underline"
            >
              [ View System Logic ]
            </button>
          </div>
          <ExperimentView onMetricsUpdate={setKlDivergence} />
        </ConsoleCard>
      </div>
    </ConsoleLayout>
  );
}

export default App;
