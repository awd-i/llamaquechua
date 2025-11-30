import React, { useState, useEffect } from 'react';

const ASCII_LLAMA = `
⠀⠀⣀⣀⠀⠀⠀⠀⠀⣀⣀⠀⠀
⠀⢰⡏⢹⡆⠀⠀⠀⢰⡏⢹⡆⠀
⠀⢸⡇⣸⡷⠟⠛⠻⢾⣇⣸⡇⠀
⢠⡾⠛⠉⠁⠀⠀⠀⠈⠉⠛⢷⡄
⣿⠀⢀⣄⢀⣠⣤⣄⡀⣠⡀⠀⣿
⢻⣄⠘⠋⡞⠉⢤⠉⢳⠙⠃⢠⡿
⣼⠃⠀⠀⠳⠤⠬⠤⠞⠀⠀⠘⣷
⢿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡿
⢸⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇
⢸⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡿
`;

interface ConsoleLlamaProps {
    message: string;
}

const ConsoleLlama: React.FC<ConsoleLlamaProps> = ({ message }) => {
    const [displayedMessage, setDisplayedMessage] = useState('');

    useEffect(() => {
        let i = 0;
        // Add a zero-width space at the start to prevent clipping
        setDisplayedMessage('\u200B');
        const interval = setInterval(() => {
            if (i < message.length) {
                setDisplayedMessage((prev) => prev + message.charAt(i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 30);
        return () => clearInterval(interval);
    }, [message]);

    return (
        <div className="border border-green-500/50 bg-black text-green-500 font-mono text-xs md:text-sm -mx-4 px-8 py-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center">
                    <pre className="leading-none font-bold text-green-400">
                        {ASCII_LLAMA.trim()}
                    </pre>
                </div>
                <div className="w-full">
                    <div className="uppercase tracking-widest text-[10px] mb-2 text-green-700 text-center">System Avatar</div>
                    <div className="min-h-[3em] flex justify-center">
                        <p className="whitespace-normal break-words leading-relaxed text-center max-w-full">
                            {displayedMessage}
                            <span className="animate-pulse ml-1">_</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsoleLlama;
