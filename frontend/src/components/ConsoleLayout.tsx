import React from 'react';

interface ConsoleLayoutProps {
    children: React.ReactNode;
}

const ConsoleLayout: React.FC<ConsoleLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-green-500 font-mono p-4 md:p-8 flex flex-col gap-4 selection:bg-green-500/30 selection:text-green-100">
            {/* Header */}
            <header className="flex justify-between items-end border-b border-green-500/30 pb-2">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold uppercase tracking-widest">LlamaQuechua_OS</h1>
                    <div className="text-[10px] text-green-700 uppercase">v3.0.0 // STABLE</div>
                </div>
                <div className="text-right text-[10px] md:text-xs text-green-700">
                    <div>MEM: OK</div>
                    <div>NET: OK</div>
                    <div>UPTIME: {new Date().toLocaleTimeString()}</div>
                </div>
            </header>

            {/* Main Grid */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-green-500/30 pt-2 text-[10px] text-green-800 flex justify-between uppercase">
                <div>System Ready</div>
                <div>&copy; 2025 LlamaQuechua Corp</div>
            </footer>
        </div>
    );
};

export default ConsoleLayout;
