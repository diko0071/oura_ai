'use client'
import Link from "next/link"
import React, { useState, useEffect } from 'react';
import ApiService from "@/app/services/apiService";

type ReadinessMetrics = {
    day: string;
    score: number;
    temperature_deviation: number;
    temperature_trend_deviation: number;
    activity_balance: number;
    body_temperature: number;
    hrv_balance: number;
    previous_day_activity: number;
    previous_night: number;
    recovery_index: number;
    resting_heart_rate: number;
    sleep_balance: number;
}

function ProcessApiData(apiResponse: any, day: string, metric: string): ReadinessMetrics {
    return {
        day: day,
        score: apiResponse.score,
        ...apiResponse,
    }
}

export default function DetailViewMetrics() {

    return (
        <div>
            <h1>Detail View Metrics</h1>
        </div>
    );
}