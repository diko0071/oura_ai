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

import { parse } from 'date-fns';

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

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
 
import ApiService from "@/app/services/apiService";


type WeeklySleepMetrics = {
    days: string[];
    scores: number[];
    deep_sleep: number[];
    efficiency: number[];
    latency: number[];
    rem_sleep: number[];
    restfulness: number[];
    timing: number[];
    total_sleep: number[];
    metric: string;
}

type DetailViewMetricsProps = {
  day: string;
}

function ProcessApiData(apiResponse: any): WeeklySleepMetrics {
    return {
        days: apiResponse.days,
        scores: apiResponse.scores,
        deep_sleep: apiResponse.deep_sleep,
        efficiency: apiResponse.efficiency,
        latency: apiResponse.latency,
        rem_sleep: apiResponse.rem_sleep,
        restfulness: apiResponse.restfulness,
        timing: apiResponse.timing,
        total_sleep: apiResponse.total_sleep,
        metric: apiResponse.metric,
    }
}

export default function DetailViewMetrics({ day }: DetailViewMetricsProps) {
  const [metrics, setMetrics] = useState<WeeklySleepMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    setLoading(true);
    const fetchSleepMetrics = ApiService.get('/api/oura/daily_sleep_row_for_week/');

    fetchSleepMetrics
      .then(response => {
        const data = ProcessApiData(response);
        setMetrics(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [day]);

  useEffect(() => {
    console.log("Selected day:", day);
  }, [day]);

    return (
        <div className="flex min-h-screen w-full flex-col">
  <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-8">
    <h1 className="text-2xl font-bold">Details for sleep for {day}</h1>
  <div className="grid gap-4 md:grid-cols-1 md:gap-8 lg:grid-cols-1">
<Card x-chunk="dashboard-01-chunk-0">
  <CardHeader className="flex flex-col items-start space-y-2">
    <div className="flex items-start justify-between w-full">
      <div>
        <HoverCard>
          <HoverCardTrigger>
            <CardTitle className="font-semibold underline underline-offset-4 decoration-dotted cursor-pointer">
              Total Sleep
            </CardTitle>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm text-muted-foreground">{}</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  </CardHeader>
  <CardContent>
          {metrics?.days.length ? (
                <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={metrics?.days.map((day, index) => ({ name: day, total_sleep: metrics.total_sleep[index] }))}
                  margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
                >
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
                  <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => (value !== 0 ? value : '')} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total_sleep"
                    stroke="#0F172A"
                    dot={(props) => {
                      const { cx, cy, index, value } = props;
                      const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
                      console.log("isSelectedDate:", isSelectedDate);
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
      <Card x-chunk="dashboard-01-chunk-1">
  <CardHeader className="flex flex-col items-start space-y-2">
    <div className="flex items-start justify-between w-full">
      <div>
        <HoverCard>
          <HoverCardTrigger>
            <CardTitle className="font-semibold underline underline-offset-4 decoration-dotted cursor-pointer">
              Sleep Latency
            </CardTitle>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm text-muted-foreground">{}</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  </CardHeader>
  <CardContent>
          {metrics?.days.length ? (
    <ResponsiveContainer width="100%" height={350}>
    <LineChart
      data={metrics?.days.map((day, index) => ({ name: day, latency: metrics.latency[index] }))}
      margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
        <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => (value !== 0 ? value : '')} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="latency"
          stroke="#0F172A"
          dot={(props) => {
            const { cx, cy, index, value } = props;
            const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
            console.log(day)
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
    <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-col items-start space-y-2">
                <div className="flex items-start justify-between w-full">
                    <div>
                        <HoverCard>
                            <HoverCardTrigger>
                                <CardTitle className="font-semibold underline underline-offset-4 decoration-dotted cursor-pointer">
                                    Restfulness and Efficiency
                                </CardTitle>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <p className="text-sm text-muted-foreground">{}</p>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {metrics?.days.length ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart
                            data={metrics?.days.map((day, index) => ({
                                name: day,
                                efficiency: metrics.efficiency[index],
                                restfulness: metrics.restfulness[index]
                            }))}
                            margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
                        >
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
                            <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => (value !== 0 ? value : '')} />
                            <Tooltip />
                            <Legend 
                                wrapperStyle={{ 
                                    textAlign: 'center', 
                                    fontSize: '0.6rem' 
                                }} 
                            /> 
                            <Line type="monotone" dataKey="efficiency" stroke="#4A4741" dot={(props) => {
                                const { cx, cy, index, value } = props;
                                const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
                                return (
                                    <g key={`dot-efficiency-${index}-${value}`}>
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
                            }} />
                            <Line type="monotone" dataKey="restfulness" stroke="#4A47" dot={(props) => {
                                const { cx, cy, index, value } = props;
                                const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
                                return (
                                    <g key={`dot-restfulness-${index}-${value}`}>
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={isSelectedDate ? 12 : 3}
                                            fill={isSelectedDate ? '#4A47' : '#4A47'}
                                            style={{ transition: 'r 0.2s ease-in-out, fill 0.2s ease-in-out' }}
                                        />
                                        {isSelectedDate && (
                                            <text x={cx} y={cy} textAnchor="middle" fill="white" fontSize="10px" dy=".3em">
                                                {value}
                                            </text>
                                        )}
                                    </g>
                                );
                            }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-muted-foreground">No data available.</p>
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
                                    Deep and REM 
                                </CardTitle>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <p className="text-sm text-muted-foreground">{}</p>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {metrics?.days.length ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart
                            data={metrics?.days.map((day, index) => ({
                                name: day,
                                deep_sleep: metrics.deep_sleep[index],
                                rem_sleep: metrics.rem_sleep[index]
                            }))}
                            margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
                        >
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
                            <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => (value !== 0 ? value : '')} />
                            <Tooltip />
                            <Legend 
                                wrapperStyle={{ 
                                    textAlign: 'center', 
                                    fontSize: '0.6rem' 
                                }} 
                            /> 
                            <Line type="monotone" dataKey="deep_sleep" stroke="#4A4741" dot={(props) => {
                                const { cx, cy, index, value } = props;
                                const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
                                return (
                                    <g key={`dot-deep_sleep-${index}-${value}`}>
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
                            }} />
                            <Line type="monotone" dataKey="rem_sleep" stroke="#4A47" dot={(props) => {
                                const { cx, cy, index, value } = props;
                                const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
                                return (
                                    <g key={`dot-rem_sleep-${index}-${value}`}>
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={isSelectedDate ? 12 : 3}
                                            fill={isSelectedDate ? '#4A47' : '#4A47'}
                                            style={{ transition: 'r 0.2s ease-in-out, fill 0.2s ease-in-out' }}
                                        />
                                        {isSelectedDate && (
                                            <text x={cx} y={cy} textAnchor="middle" fill="white" fontSize="10px" dy=".3em">
                                                {value}
                                            </text>
                                        )}
                                    </g>
                                );
                            }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-muted-foreground">No data available.</p>
                )}
            </CardContent>
        </Card>
    </main>
    </div>
    );
}