'use client'
import Link from "next/link"
import React, { useState, useEffect } from 'react';
import ApiService from "@/app/services/apiService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, CartesianGrid, Cell } from 'recharts';

type SleepMetrics = {
    day: string;
    score: number;
    deep_sleep: number;
    efficiency: number;
    latency: number;
    rem_sleep: number;
    restfulness: number;
    timing: number;
    total_sleep: number;
}

function ProcessApiData(apiResponse: any[], day: string): SleepMetrics {
    const data = apiResponse[0];
    return {
        day: day,
        score: data.score,
        deep_sleep: data.deep_sleep,
        efficiency: data.efficiency,
        latency: data.latency,
        rem_sleep: data.rem_sleep,
        restfulness: data.restfulness,
        timing: data.timing,
        total_sleep: data.total_sleep,
    }
}

export default function DetailViewMetrics({ date }: { date: string }) {
    const [metrics, setMetrics] = useState<SleepMetrics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const fetchSleepMetrics = ApiService.getWithParam('/api/oura/daily_sleep_row_for_day/', `date=${formattedDate}`);

        fetchSleepMetrics
            .then(response => {
                const data = ProcessApiData(response, formattedDate);
                setMetrics(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [date]);

    const renderBarChart = (dataKey: string, name: string, value: number) => (
        <BarChart
            width={600}
            height={50}
            data={[{ name, value, max: 100 }]}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid stroke="transparent" /> {/* Remove dotted lines */}
            <XAxis type="number" domain={[0, 100]} ticks={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
            <Bar dataKey="max" fill="#D3D3D3"> {/* Continuation plot in gray */}
                <LabelList dataKey="max" position="center" fill="transparent" />
            </Bar>
            <Bar dataKey="value" fill="#000000"> {/* Chart color black */}
                <LabelList dataKey="value" position="center" fill="#FFFFFF" style={{ fontSize: 14 }} /> {/* Value white */}
                <Cell key="value" fill="#000000" />
            </Bar>
            <text x={300} y={-10} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 16, fill: '#000000' }}>
                {name}
            </text> {/* Metric name centered above the chart */}
        </BarChart>
    );
    
    return (
        <div>
            <h1>Detail View Metrics</h1>
            {loading ? (
                <p>Loading...</p>
            ) : metrics ? (
                <div>
                    <p>Day: {metrics.day}</p>
                    {renderBarChart('score', 'Score', metrics.score)}
                    {renderBarChart('deep_sleep', 'Deep Sleep', metrics.deep_sleep)}
                    {renderBarChart('efficiency', 'Efficiency', metrics.efficiency)}
                    {renderBarChart('latency', 'Latency', metrics.latency)}
                    {renderBarChart('rem_sleep', 'REM Sleep', metrics.rem_sleep)}
                    {renderBarChart('restfulness', 'Restfulness', metrics.restfulness)}
                    {renderBarChart('timing', 'Timing', metrics.timing)}
                    {renderBarChart('total_sleep', 'Total Sleep', metrics.total_sleep)}
                </div>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}