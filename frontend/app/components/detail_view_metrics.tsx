'use client'
import Link from "next/link"
import React, { useState, useEffect } from 'react';
import ApiService from "@/app/services/apiService";

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

type ActivityMetrics = {
    day: string;
    score: number;
    active_calories: number;
    target_calories: number;
    total_calories: number;
    equivalent_walking_distance: number;
    target_walking_distance: number;
    total_steps: number;
    inactivity_alerts: number;
    meet_daily_targets: number;
    steps: number;
    move_every_hour: number;
    recovery_time: number;
    training_frequency: number;
    training_volume: number;
    stay_active: number;
}

function ProcessApiData(apiResponse: any, day: string, metric: string): SleepMetrics | ReadinessMetrics | ActivityMetrics {
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