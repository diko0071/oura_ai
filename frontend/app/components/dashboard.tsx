'use client'
import Link from "next/link"
import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
  Activity,
  CircleHelp,
  MessageSquareShare,
  BarChartHorizontal,
} from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

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
  MessageSquare,
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

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { addDays, subDays, isToday, isYesterday, format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { secondaryMetricsDefinitions } from "@/app/metrics";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { toast } from "sonner"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import DetailViewSleepMetrics from "./detail_view_metrics_sleep";
import DetailViewReadinessMetrics from "./detail_view_metrics_readiness";
import DetailViewActivityMetrics from "./detail_view_metrics_activity";
import { Tooltip as TooltipUI, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
}

function processApiData(apiResponse: any, metric: string): MetricScore {
  return {
    days: apiResponse.days,
    scores: apiResponse.scores,
    metric: metric,
  }
}

const metricDefinitions = {
  readiness: "Readiness Score — score that indicates how well you are prepared for work or other tasks. It is a measure of your physical and mental well-being.",
  sleep: "Sleep Score — score that indicates the quality and duration of your sleep. It helps you understand your sleep patterns.",
  activity: "Activity Score — score that measures your physical activity levels throughout the day. It helps you track your fitness progress.",
  stress: "Stress Score — score that indicates your stress levels. It helps you manage and reduce stress for better well-being."
};

const metricInsights = {
  readiness: [
    "Your readiness score is highest on Wednesday. Consider scheduling important tasks on this day. But HRV still big.",
    "Your readiness score drops on Friday. Ensure you get enough rest on Thursday night."
  ],
  sleep: [
    "You have the best sleep quality on Tuesday. Try to replicate your Tuesday night routine.",
    "Your sleep quality is lowest on Sunday. Consider relaxing activities before bed on Saturday night. Reduce sleep latency."
  ],
  activity: [
    "Your activity level peaks on Thursday. Keep up the good work!",
    "Your activity level is lowest on Monday. Try to incorporate a short walk or exercise session."
  ],
  stress: [
    "Your stress level is lowest on Saturday. Use this day to recharge.",
    "Your stress level peaks on Wednesday. Practice mindfulness or relaxation techniques mid-week."
  ]
};

const secondaryMetrics = {
  HRV: "HRV (Heart Rate Variability) — a measure of the variation in time between each heartbeat. It is an indicator of your autonomic nervous system activity.",
  "Sleep Score": "Sleep Score — a score that indicates the quality and duration of your sleep. It helps you understand your sleep patterns.",
  "No Activity Score": "No Activity Score — a score that indicates periods of inactivity. It helps you track sedentary behavior.",
  "Sleep Latency": "Sleep Latency — the amount of time it takes you to fall asleep. It is an indicator of your sleep onset.",
  "Stress Level": "Stress Level — a score that indicates your stress levels. It helps you manage and reduce stress for better well-being.",
  "Activity Level": "Activity Level — a score that measures your physical activity levels throughout the day. It helps you track your fitness progress.",
  "Sleep Quality": "Sleep Quality — a score that indicates the quality of your sleep. It helps you understand your sleep patterns."
};

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
  };
}

export type InsightFormat = {
  generated_insights_text: string
  metric: string
}

function processInsightsData(apiResponse: any): InsightFormat | null {
  if (!apiResponse || apiResponse.length === 0 || !apiResponse[0].generated_insights_text) {
    return null;
  }
  console.log('API Response in processInsightsData:', apiResponse);
  const insights = apiResponse[0];
  return {
    generated_insights_text: insights.generated_insights_text,
    metric: insights.metric,
  };
}

export default function Dashboard() {
  const [showDetailViewSleep, setShowDetailViewSleep] = useState<boolean>(false);
  const [showDetailViewReadiness, setShowDetailViewReadiness] = useState<boolean>(false);
  const [showDetailViewActivity, setShowDetailViewActivity] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<UnifiedData | null>(null);
  const [readinessInsights, setReadinessInsights] = useState<InsightFormat | null>(null);
  const [sleepInsights, setSleepInsights] = useState<InsightFormat | null>(null);
  const [activityInsights, setActivityInsights] = useState<InsightFormat | null>(null);
  const [insightsLoading, setInsightsLoading] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<string>(format(new Date(), "PPP"));
  const [isTraining, setIsTraining] = useState<boolean>(false);
  
  
  const handleTrainModel = async () => {
    setIsTraining(true);
    try {
      const response = await ApiService.post_auth('/api/oura/train_models_manually/', {});
      if (response.message === 'Error training model' || response.message === 'Error generating insights' || response.message === 'Models already trained and insights already generated today') {
        toast("Error training model", {
          description: response.message,
          action: {
            label: "Close",
            onClick: () => console.log("Toast closed"),
          },
        });
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to train model:', error);
      toast("Failed to train model", {
        description: "An unexpected error occurred. Please try again later.",
        action: {
          label: "Close",
          onClick: () => console.log("Toast closed"),
        },
      });
    } finally {
      setIsTraining(false);
    }
  };

  const wrapSecondaryMetrics = (text: string) => {
    const metrics = Object.keys(secondaryMetricsDefinitions);
    const regex = new RegExp(`\\b(${metrics.join('|')})\\b`, 'gi');
  
    return text.split(regex).map((part, index) => {
      const lowerPart = part.toLowerCase();
      const matchedMetric = metrics.find(metric => metric.toLowerCase() === lowerPart);
  
      if (matchedMetric) {
        return (
          <HoverCard key={index}>
            <HoverCardTrigger className="inline-flex items-center">
              <span className="cursor-pointer inline-flex items-center font-semibold">
                <CircleHelp className="mr-0.5" size={10} />
                {part}
              </span>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-sm text-muted-foreground">
                {secondaryMetricsDefinitions[matchedMetric as keyof typeof secondaryMetricsDefinitions]}
              </p>
            </HoverCardContent>
          </HoverCard>
        );
      }
      return part;
    });
  };

  const [date, setDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    setLoading(true);
    const fetchReadiness = ApiService.get('/api/oura/daily_readiness_score_for_week/');
    const fetchSleep = ApiService.get('/api/oura/daily_sleep_score_for_week/');
    const fetchActivity = ApiService.get('/api/oura/daily_activity_score_for_week/');
  
    Promise.all([fetchReadiness, fetchSleep, fetchActivity])
      .then(([readinessData, sleepData, activityData]) => {
  
        const readinessScore = processApiData(readinessData, 'Readiness Score');
        const sleepScore = processApiData(sleepData, 'Sleep Score');
        const activityScore = processApiData(activityData, 'Activity Score');
  
        setData({
          readiness: readinessScore,
          sleep: sleepScore,
          activity: activityScore,
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

  React.useEffect(() => {
    setInsightsLoading(true);
    const formattedDate = date.toISOString().split('T')[0];

    const fetchReadinessInsights = ApiService.getWithParam('/api/oura/get_generated_insights_for_readiness_for_day/', `date=${formattedDate}`);
    const fetchSleepInsights = ApiService.getWithParam('/api/oura/get_generated_insights_for_sleep_for_day/', `date=${formattedDate}`);
    const fetchActivityInsights = ApiService.getWithParam('/api/oura/get_generated_insights_for_activity_for_day/', `date=${formattedDate}`);
  
    Promise.all([fetchReadinessInsights, fetchSleepInsights, fetchActivityInsights])
      .then(([readinessInsightsData, sleepInsightsData, activityInsightsData]) => {
  
        const readinessInsightsProcessed = processInsightsData(readinessInsightsData);
        const sleepInsightsProcessed = processInsightsData(sleepInsightsData);
        const activityInsightsProcessed = processInsightsData(activityInsightsData);
  
        setReadinessInsights(readinessInsightsProcessed);
        setSleepInsights(sleepInsightsProcessed);
        setActivityInsights(activityInsightsProcessed);
  
        setInsightsLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch insights:', error);
        setInsightsLoading(false);
      });
  }, [date]);

  const handlePrevDay = () => {
    const newDate = subDays(date, 1);
    setDate(newDate);
    setSelectedDay(format(newDate, "PPP"));
  };
  const handleNextDay = () => {
    const newDate = addDays(date, 1);
    setDate(newDate);
    setSelectedDay(format(newDate, "PPP"));
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "PPP");
  };


  const [panelWidth, setPanelWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const panelElement = document.querySelector('.resizable-panel');
  
    const handleResize = () => {
      if (panelElement) {
        const width = panelElement.clientWidth;
        console.log('Panel width:', width);
        setPanelWidth(width);
      } else {
        console.log('Panel element not found');
      }
    };
  
    const resizeObserver = new ResizeObserver(handleResize);
  
    if (panelElement) {
      resizeObserver.observe(panelElement);
    }
  
    window.addEventListener('resize', handleResize);
    handleResize();
  
    return () => {
      window.removeEventListener('resize', handleResize);
      if (panelElement) {
        resizeObserver.unobserve(panelElement);
      }
    };
  }, []);

  const formattedSelectedDay = format(date, "yyyy-MM-dd");

  return (
<div className="flex min-h-screen w-full flex-col">
<ResizablePanelGroup className="flex flex-1 w-full" direction="horizontal">
<ResizablePanel className="flex flex-col resizable-panel" id="main-panel" order={1}>
  <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-8">
  <div className="flex flex-row items-center justify-between gap-2">
    <div className="flex flex-row items-center gap-2">
    <Button variant="outline" onClick={handleTrainModel} disabled={isTraining}>
    {isTraining ? 'Generating...' : 'Generate Insights'}
  </Button>
  <HoverCard>
          <HoverCardTrigger>
            <CardTitle className="font-semibold underline underline-offset-4 decoration-dotted cursor-pointer">
              <CircleHelp className="h-4 w-4" />
            </CardTitle>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm text-muted-foreground">It will take till 3 min to train model and generate new insights for you.
      Because we do not know what time you wake up (it is important to be able generate insights about sleep). 
      We will ask you click this button and wait a little bit.</p>
          </HoverCardContent>
        </HoverCard>
  </div>
  <div className="flex flex-row items-center gap-2">
    <Button variant="outline" onClick={handlePrevDay}>
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[200px] justify-start text-left font-normal", 
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getDateLabel(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
              setSelectedDay(format(selectedDate, "yyyy-MM-dd"));
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    <Button variant="outline" onClick={handleNextDay} disabled={isToday(date)}>
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
</div>
    <div className={`grid gap-4 ${panelWidth < 850 ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
  <Card x-chunk="dashboard-01-chunk-0">
  <CardHeader className="flex flex-col items-start space-y-2">
    <div className="flex items-start justify-between w-full">
      <div>
        <HoverCard>
          <HoverCardTrigger>
            <CardTitle className="font-semibold underline underline-offset-4 decoration-dotted cursor-pointer">
              {data?.readiness.metric}
            </CardTitle>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm text-muted-foreground">{metricDefinitions.readiness}</p>
          </HoverCardContent>
        </HoverCard>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Readiness scores for the week.
        </CardDescription>
      </div>
      <div className="flex space-x-2 self-start">
      <Button size="icon" variant="outline" onClick={() => setShowDetailViewReadiness(prev => !prev)}>
          <BarChartHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </CardHeader>
  <CardContent>
          {data?.readiness.days.length ? (
    <ResponsiveContainer width="100%" height={350}>
    <LineChart
      data={data?.readiness.days.map((day, index) => ({ name: day, score: data.readiness.scores[index] }))}
      margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
        <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => (value !== 0 ? value : '')} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#0F172A"
          dot={(props) => {
            const { cx, cy, index, value } = props;
            const isSelectedDate = isSameDay(new Date(data.readiness.days[index]), date);
            return (
              <g key={`dot-${index}-${value}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelectedDate ? 12 : 3}
                  fill={isSelectedDate ? '#4A4741' : '#4A4741'}
                  style={{ transition: 'r 0.2s ease-in-out, fill 0.2s ease-in-out' }}
                />
                {isSelectedDate && (
                  <text x={cx} y={cy} textAnchor="middle" fill="white" fontSize="10px" dy=".3em">
                    {value}
                  </text>
                )}
              </g>
            );
        }}
      />
    </LineChart>
  </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">No data available.</p>
          )}
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-0-insights">
  <CardHeader className="flex flex-col items-start space-y-2">
  <div className="flex items-start justify-between w-full">
  <div>
    <CardTitle className="font-semibold">
      Readiness Insights
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground mt-1">
      Insights based on your readiness scores.
    </CardDescription>
  </div>
</div>
  </CardHeader>
  <CardContent>
    {insightsLoading ? (
      <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ) : (
      <ul>
        {readinessInsights?.generated_insights_text ? (
          readinessInsights.generated_insights_text.split('\n\n').map((insight, index) => (
            <li key={index} className="text-sm text-muted-foreground mb-2 flex items-start">
              <Activity className="mr-2 mt-1 flex-shrink-0 align-middle" size={13} />
              <span className="flex-1 align-middle">{wrapSecondaryMetrics(insight)}</span>
            </li>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No insights available for {date.toISOString().split('T')[0]}.</p>
        )}
      </ul>
    )}
  </CardContent>
</Card>
<Card x-chunk="dashboard-01-chunk-1">
<CardHeader className="flex flex-col items-start space-y-2">
    <div className="flex items-start justify-between w-full">
      <div>
        <HoverCard>
          <HoverCardTrigger>
            <CardTitle className="font-semibold underline underline-offset-4 decoration-dotted cursor-pointer">
              {data?.sleep.metric}
            </CardTitle>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm text-muted-foreground">{metricDefinitions.sleep}</p>
          </HoverCardContent>
        </HoverCard>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Sleep scores for the week.
        </CardDescription>
      </div>
      <div className="flex space-x-2 self-start">
      <Button size="icon" variant="outline" onClick={() => setShowDetailViewSleep(prev => !prev)}>
          <BarChartHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </CardHeader>
        <CardContent>
          {data?.sleep.days.length ? (
    <ResponsiveContainer width="100%" height={350}>
    <LineChart
      data={data?.sleep.days.map((day, index) => ({ name: day, score: data.sleep.scores[index] }))}
      margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
        <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => (value !== 0 ? value : '')} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#0F172A"
          dot={(props) => {
            const { cx, cy, index, value } = props;
            const isSelectedDate = isSameDay(new Date(data.sleep.days[index]), date);
            return (
              <g key={`dot-${index}-${value}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelectedDate ? 12 : 3}
                  fill={isSelectedDate ? '#4A4741' : '#4A4741'}
                  style={{ transition: 'r 0.2s ease-in-out, fill 0.2s ease-in-out' }}
                />
                {isSelectedDate && (
                  <text x={cx} y={cy} textAnchor="middle" fill="white" fontSize="10px" dy=".3em">
                    {value}
                  </text>
                )}
              </g>
            );
        }}
      />
    </LineChart>
  </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">No data available.</p>
          )}
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-1-insights">
      <CardHeader className="flex flex-col items-start space-y-2">
  <div className="flex items-start justify-between w-full">
  <div>
    <CardTitle className="font-semibold">
      Sleep Insights
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground mt-1">
      Insights based on your sleep scores.
    </CardDescription>
  </div>
        </div>
      </CardHeader>
      <CardContent>
    {insightsLoading ? (
      <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ) : (
      <ul>
        {sleepInsights?.generated_insights_text ? (
          sleepInsights.generated_insights_text.split('\n\n').map((insight, index) => (
            <li key={index} className="text-sm text-muted-foreground mb-2 flex items-start">
              <Activity className="mr-2 mt-1 flex-shrink-0 align-middle" size={13} />
              <span className="flex-1 align-middle">{wrapSecondaryMetrics(insight)}</span>
            </li>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No insights available for {date.toISOString().split('T')[0]}.</p>
        )}
      </ul>
    )}
  </CardContent>
</Card>
<Card x-chunk="dashboard-01-chunk-2">
<CardHeader className="flex flex-col items-start space-y-2">
    <div className="flex items-start justify-between w-full">
      <div>
        <HoverCard>
          <HoverCardTrigger>
            <CardTitle className="font-semibold underline underline-offset-4 decoration-dotted cursor-pointer">
              {data?.activity.metric}
            </CardTitle>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm text-muted-foreground">{metricDefinitions.activity}</p>
          </HoverCardContent>
        </HoverCard>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Activity scores for the week.
        </CardDescription>
      </div>
      <div className="flex space-x-2 self-start">
        <Button size="icon" variant="outline" onClick={() => setShowDetailViewActivity(prev => !prev)}>
          <BarChartHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </CardHeader>
        <CardContent>
          {data?.activity.days.length ? (
    <ResponsiveContainer width="100%" height={350}>
    <LineChart
      data={data?.activity.days.map((day, index) => ({ name: day, score: data.activity.scores[index] }))}
      margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
        <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => (value !== 0 ? value : '')} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#0F172A"
          dot={(props) => {
            const { cx, cy, index, value } = props;
            const isSelectedDate = isSameDay(new Date(data.activity.days[index]), date);
            return (
              <g key={`dot-${index}-${value}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelectedDate ? 12 : 3}
                  fill={isSelectedDate ? '#4A4741' : '#4A4741'}
                  style={{ transition: 'r 0.2s ease-in-out, fill 0.2s ease-in-out' }}
                />
                {isSelectedDate && (
                  <text x={cx} y={cy} textAnchor="middle" fill="white" fontSize="10px" dy=".3em">
                    {value}
                  </text>
                )}
              </g>
            );
        }}
      />
    </LineChart>
  </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">No data available.</p>
          )}
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-2-insights">
      <CardHeader className="flex flex-col items-start space-y-2">
  <div className="flex items-start justify-between w-full">
  <div>
    <CardTitle className="font-semibold">
      Activity Insights
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground mt-1">
      Insights based on your activity scores.
    </CardDescription>
  </div>
</div>
  </CardHeader>
  <CardContent>
    {insightsLoading ? (
      <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ) : (
      <ul>
        {activityInsights?.generated_insights_text ? (
          activityInsights.generated_insights_text.split('\n\n').map((insight, index) => (
            <li key={index} className="text-sm text-muted-foreground mb-2 flex items-start">
              <Activity className="mr-2 mt-1 flex-shrink-0 align-middle" size={13} />
              <span className="flex-1 align-middle">{wrapSecondaryMetrics(insight)}</span>
            </li>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No insights available for {date.toISOString().split('T')[0]}.</p>
        )}
      </ul>
    )}
  </CardContent>
</Card>
        </div>
      </main>
      </ResizablePanel>
        {showDetailViewSleep && (
          <>
            <ResizableHandle />
            <ResizablePanel className="flex flex-col" id="detail-panel" order={2}>
              <div className="p-4 min-h-screen">
                <DetailViewSleepMetrics day={formattedSelectedDay} />
              </div>
            </ResizablePanel>
          </>
        )}
        {showDetailViewReadiness && (
          <>
            <ResizableHandle />
            <ResizablePanel className="flex flex-col" id="detail-panel" order={2}>
              <div className="p-4 min-h-screen">
                <DetailViewReadinessMetrics day={formattedSelectedDay} />
              </div>
            </ResizablePanel>
          </>
        )}
        {showDetailViewActivity && (
          <>
            <ResizableHandle />
            <ResizablePanel className="flex flex-col" id="detail-panel" order={2}>
              <div className="p-4 min-h-screen">
                <DetailViewActivityMetrics day={formattedSelectedDay} />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  )
}