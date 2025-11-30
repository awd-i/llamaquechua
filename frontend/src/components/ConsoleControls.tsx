import React from 'react';

// --- Console Button ---
interface ConsoleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

export const ConsoleButton: React.FC<ConsoleButtonProps> = ({
    children,
    active = false,
    className = '',
    ...props
}) => {
    return (
        <button
            className={`
                px-4 py-2 font-mono text-sm uppercase tracking-widest border transition-all
                ${active
                    ? 'bg-green-500 text-black border-green-500 font-bold'
                    : 'bg-black text-green-500 border-green-500/50 hover:bg-green-500/10 hover:border-green-500'}
                ${className}
            `}
            {...props}
        >
            [{children}]
        </button>
    );
};

// --- Console Input ---
interface ConsoleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const ConsoleInput: React.FC<ConsoleInputProps> = ({ label, className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && <label className="text-[10px] uppercase tracking-widest text-green-700 font-bold">{label}</label>}
            <input
                className="w-full bg-black border border-green-500/50 px-3 py-2 text-green-500 font-mono text-sm focus:outline-none focus:border-green-400 placeholder-green-900"
                {...props}
            />
        </div>
    );
};

// --- Console Card ---
interface ConsoleCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const ConsoleCard: React.FC<ConsoleCardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`border border-green-500/30 bg-black/50 flex flex-col ${className}`}>
            <div className="bg-green-500/10 px-3 py-1 border-b border-green-500/30 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest font-bold text-green-400">{title}</span>
                <div className="w-2 h-2 bg-green-500/50 rounded-full animate-pulse" />
            </div>
            <div className="p-4 flex-1 overflow-auto custom-scrollbar overflow-x-visible">
                {children}
            </div>
        </div>
    );
};
