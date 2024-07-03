'use client'
import Link from "next/link"
import React, { useState, useEffect } from 'react';
import ApiService from "@/app/services/apiService";

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

function ProcessApiData(apiResponse: any, day: string, metric: string): ActivityMetrics {
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