import React from 'react';

// NOTE: This component is largely deprecated as the Llama logic is now handled
// directly in App.tsx to overlay the 3D scene. 
// Keeping this file as a placeholder or for potential future 2D fallback.

interface LlamaAssistantProps {
    klDivergence: number | null;
    mode: 'single' | 'experiment';
}

const LlamaAssistant: React.FC<LlamaAssistantProps> = () => {
    return null;
};

export default LlamaAssistant;
