import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HistogramProps {
    data: number[];
    bins?: number;
    title?: string;
}

const Histogram: React.FC<HistogramProps> = ({ data, bins = 10, title }) => {
    if (!data || data.length === 0) {
        return <div className="text-green-700 text-xs">No data available</div>;
    }

    // Calculate histogram bins
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;

    // Create bins
    const histogram = new Array(bins).fill(0);
    const binLabels: string[] = [];

    for (let i = 0; i < bins; i++) {
        const binStart = min + i * binWidth;
        const binEnd = binStart + binWidth;
        binLabels.push(`${binStart.toFixed(2)}-${binEnd.toFixed(2)}`);
    }

    // Fill histogram
    data.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        if (binIndex >= 0 && binIndex < bins) {
            histogram[binIndex]++;
        }
    });

    const chartData = {
        labels: binLabels,
        datasets: [
            {
                label: 'Frequency',
                data: histogram,
                backgroundColor: 'rgba(168, 85, 247, 0.6)', // purple-500 with transparency
                borderColor: 'rgba(168, 85, 247, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(192, 132, 252, 0.8)', // purple-400
                hoverBorderColor: 'rgba(192, 132, 252, 1)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#a855f7',
                bodyColor: '#c084fc',
                borderColor: '#a855f7',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    title: (context: any) => `Range: ${context[0].label}`,
                    label: (context: any) => `Count: ${context.parsed.y}`,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(168, 85, 247, 0.15)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#a855f7',
                    font: {
                        size: 10,
                        family: 'monospace',
                    },
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
            y: {
                grid: {
                    color: 'rgba(168, 85, 247, 0.15)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#a855f7',
                    font: {
                        size: 11,
                        family: 'monospace',
                    },
                    precision: 0,
                },
                beginAtZero: true,
            },
        },
    };

    const mean = data.reduce((a, b) => a + b, 0) / data.length;

    return (
        <div className="flex flex-col gap-3">
            {title && (
                <h4 className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">
                    {title}
                </h4>
            )}

            {/* Chart Container - Bigger */}
            <div className="h-56 bg-black/30 border border-purple-500/30 rounded p-3 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <Bar data={chartData} options={options} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-[9px] text-purple-700">
                <div className="flex justify-between border border-purple-500/20 bg-purple-500/5 p-1.5 rounded">
                    <span>Min:</span>
                    <span className="text-purple-400 font-bold">{min.toFixed(3)}</span>
                </div>
                <div className="flex justify-between border border-purple-500/20 bg-purple-500/5 p-1.5 rounded">
                    <span>Max:</span>
                    <span className="text-purple-400 font-bold">{max.toFixed(3)}</span>
                </div>
                <div className="flex justify-between border border-purple-500/20 bg-purple-500/5 p-1.5 rounded">
                    <span>Mean:</span>
                    <span className="text-purple-400 font-bold">{mean.toFixed(3)}</span>
                </div>
                <div className="flex justify-between border border-purple-500/20 bg-purple-500/5 p-1.5 rounded">
                    <span>N:</span>
                    <span className="text-purple-400 font-bold">{data.length}</span>
                </div>
            </div>
        </div>
    );
};

export default Histogram;
