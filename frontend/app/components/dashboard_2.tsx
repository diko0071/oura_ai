'use client'
import Link from "next/link"
import React, { useState, useEffect, useRef } from 'react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import ApiService from "@/app/services/apiService";

import 'react-resizable/css/styles.css';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import DetailViewMetrics from "./detail_view_metrics_sleep";


export function ResizableDemo() {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] max-w-md rounded-lg border"
      >
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full items-center justify-center p-6">
            <DetailViewMetrics />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }
  

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
  const [showDetailView, setShowDetailView] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<UnifiedData | null>(null);
  const [readinessInsights, setReadinessInsights] = useState<InsightFormat | null>(null);
  const [sleepInsights, setSleepInsights] = useState<InsightFormat | null>(null);
  const [activityInsights, setActivityInsights] = useState<InsightFormat | null>(null);
  const [insightsLoading, setInsightsLoading] = useState<boolean>(false);

  const wrapSecondaryMetrics = (text: string) => {
    const metrics = ["HRV", "Sleep Score", "No Activity Score", "Sleep Latency", "Stress Level", "Activity Level", "Sleep Quality"];
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

  const handlePrevDay = () => setDate(subDays(date, 1));
  const handleNextDay = () => setDate(addDays(date, 1));

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
  
    // Create a ResizeObserver to observe changes in the panel size
    const resizeObserver = new ResizeObserver(handleResize);
  
    if (panelElement) {
      resizeObserver.observe(panelElement);
    }
  
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set the width
  
    return () => {
      window.removeEventListener('resize', handleResize);
      if (panelElement) {
        resizeObserver.unobserve(panelElement);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ResizablePanelGroup className="flex flex-1 w-full" direction="horizontal">
      <ResizablePanel className="flex flex-col resizable-panel" id="main-panel" order={1}>
          <div className="flex flex-row items-center justify-end gap-2 p-4">
            <Button variant="outline" onClick={handlePrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={`w-[200px] justify-start text-left font-normal ${!date && 'text-muted-foreground'}`}
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

          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-8">
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
                        <HoverCardContent></HoverCardContent>
                      </HoverCard>
                      <CardDescription className="text-sm text-muted-foreground mt-1">
                        Readiness scores for the week.
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2 self-start">
                      <Button size="icon" variant="outline" onClick={() => setShowDetailView(true)}>
                        <BarChartHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {data?.readiness.days.length ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart
                        data={data?.readiness.days.map((day, index) => ({
                          name: day,
                          score: data.readiness.scores[index],
                        }))}
                        margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
                      >
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis
                          dataKey="name"
                          stroke="rgba(0, 0, 0, 0.5)"
                          tick={{ fontSize: '0.7rem' }}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="rgba(0, 0, 0, 0.5)"
                          tick={{ fontSize: '0.7rem' }}
                          tickLine={false}
                          tickFormatter={(value) => (value !== 0 ? value : '')}
                        />
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
            </div>
          </main>
        </ResizablePanel>
        {showDetailView && (
          <>
            <ResizableHandle />
            <ResizablePanel className="flex flex-col" id="detail-panel" order={2}>
              <div className="p-4 bg-gray-100 min-h-screen">
                <DetailViewMetrics/>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};