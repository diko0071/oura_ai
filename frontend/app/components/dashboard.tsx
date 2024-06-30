'use client'
import Link from "next/link"
import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  File,
  Home,
  ListFilter,
  MoreVertical,
  Package,
  PanelLeft,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import ApiService from "@/app/services/apiService";


export type MetricScore = {
  days: string[]
  scores: number[]
  metric: string
}

export type UnifiedData = {
  readiness: MetricScore
  sleep: MetricScore
  activity: MetricScore
  stress: MetricScore
}

function processApiData(apiResponse: any, metric: string): MetricScore {
  return {
    days: apiResponse.days,
    scores: apiResponse.scores,
    metric: metric,
  }
}

function generateMockData(): UnifiedData {
  const mockMetricData = (metric: string): MetricScore => ({
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    scores: [75, 80, 78, 82, 77, 85, 79],
    metric: metric
  });

  return {
    readiness: mockMetricData('Readiness Score'),
    sleep: mockMetricData('Sleep Score'),
    activity: mockMetricData('Activity Score'),
    stress: mockMetricData('Stress Score')
  };
}

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<UnifiedData | null>(null);

  React.useEffect(() => {
    setLoading(true);
    const fetchReadiness = ApiService.get('/api/oura/daily_readiness/');
    const fetchSleep = ApiService.get('/api/oura/daily_sleep/');
    const fetchActivity = ApiService.get('/api/oura/daily_activity/');
    const fetchStress = ApiService.get('/api/oura/daily_stress/');

    Promise.all([fetchReadiness, fetchSleep, fetchActivity, fetchStress])
      .then(([readinessData, sleepData, activityData, stressData]) => {
        const readinessScore = processApiData(readinessData, 'Readiness Score');
        const sleepScore = processApiData(sleepData, 'Sleep Score');
        const activityScore = processApiData(activityData, 'Activity Score');
        const stressScore = processApiData(stressData, 'Stress Score');

        setData({
          readiness: readinessScore,
          sleep: sleepScore,
          activity: activityScore,
          stress: stressScore,
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch data:', error);
        const mockData = generateMockData();
        setData(mockData);
        setLoading(false);
      });
  }, []);

  const chartData = data?.readiness.days.map((day, index) => ({
    day,
    score: data.readiness.scores[index],
  })) || [];

  return (
<div className="flex min-h-screen w-full flex-col">
  <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-col items-start space-y-2">
          <CardTitle className="font-semibold">
            {data?.readiness.metric}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Readiness scores for the week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
              >
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="day" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
                <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => value !== 0 ? value : ''} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#0F172A" dot={true} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">No data available.</p>
          )}
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-0-insights">
        <CardHeader className="flex flex-col items-start space-y-2">
          <CardTitle className="font-semibold">
            Readiness Insights
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Insights based on your readiness scores.
          </CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-1">
        <CardHeader className="flex flex-col items-start space-y-2">
          <CardTitle className="font-semibold">
            {data?.sleep.metric}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Comparison of your sleep scores across the week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.sleep.days.length ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={data.sleep.days.map((day, index) => ({ name: day, score: data.sleep.scores[index] }))}
                margin={{ top: 5, right: 20, left: -15, bottom: 5 }}
              >
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
                <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => value !== 0 ? value : ''} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#0F172A" dot={true} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">No data available.</p>
          )}
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-1-insights">
        <CardHeader className="flex flex-col items-start space-y-2">
          <CardTitle className="font-semibold">
            Sleep Insights
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Insights based on your sleep scores.
          </CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-2">
  <CardHeader className="flex flex-col items-start space-y-2">
    <CardTitle className="font-semibold">
      {data?.activity.metric}
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Comparison of your activity scores across the week.
    </CardDescription>
  </CardHeader>
  <CardContent>
    {data?.activity.days.length ? (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data.activity.days.map((day, index) => ({ name: day, score: data.activity.scores[index] }))}
          margin={{ top: 5, right: 20, left: -15, bottom: 5 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
          <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => value !== 0 ? value : ''} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#0F172A" dot={true} />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-sm text-muted-foreground">No data available.</p>
    )}
  </CardContent>
</Card>
<Card x-chunk="dashboard-01-chunk-2-insights">
  <CardHeader className="flex flex-col items-start space-y-2">
    <CardTitle className="font-semibold">
      Activity Insights
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Insights based on your activity scores.
    </CardDescription>
  </CardHeader>
  <CardContent>
  </CardContent>
</Card>
<Card x-chunk="dashboard-01-chunk-3">
  <CardHeader className="flex flex-col items-start space-y-2">
    <CardTitle className="font-semibold">
      {data?.stress.metric}
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Comparison of your stress scores across the week.
    </CardDescription>
  </CardHeader>
  <CardContent>
    {data?.stress.days.length ? (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data.stress.days.map((day, index) => ({ name: day, score: data.stress.scores[index] }))}
          margin={{ top: 5, right: 20, left: -15, bottom: 5 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
          <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => value !== 0 ? value : ''} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#0F172A" dot={true} />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-sm text-muted-foreground">No data available.</p>
    )}
  </CardContent>
</Card>
<Card x-chunk="dashboard-01-chunk-3-insights">
  <CardHeader className="flex flex-col items-start space-y-2">
    <CardTitle className="font-semibold">
      Stress Insights
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Insights based on your stress scores.
    </CardDescription>
  </CardHeader>
  <CardContent>
  </CardContent>
</Card>
        </div>
      </main>
    </div>
  )
}