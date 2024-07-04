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

type DetailViewReadinessMetricsProps = {
    day: string;
  }
  

type ReadinessMetrics = {
    days: string[];
    scores: number[];
    temperature_deviation: number[];
    temperature_trend_deviation: number[];
    activity_balance: number[];
    body_temperature: number[];
    hrv_balance: number[];
    previous_day_activity: number[];
    previous_night: number[];
    recovery_index: number[];
    resting_heart_rate: number[];
    sleep_balance: number[];
}

function ProcessApiData(apiResponse: any): ReadinessMetrics {
    return {
        days: apiResponse.days,
        scores: apiResponse.scores,
        temperature_deviation: apiResponse.temperature_deviation,
        temperature_trend_deviation: apiResponse.temperature_trend_deviation,
        activity_balance: apiResponse.activity_balance,
        body_temperature: apiResponse.body_temperature,
        hrv_balance: apiResponse.hrv_balance,
        previous_day_activity: apiResponse.previous_day_activity,
        previous_night: apiResponse.previous_night,
        recovery_index: apiResponse.recovery_index,
        resting_heart_rate: apiResponse.resting_heart_rate,
        sleep_balance: apiResponse.sleep_balance,
    }
}

export default function DetailViewReadinessMetric({ day }: DetailViewReadinessMetricsProps) {

    const [metrics, setMetrics] = useState<ReadinessMetrics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
  
    useEffect(() => {
      setLoading(true);
      const fetchSleepMetrics = ApiService.get('/api/oura/daily_readiness_row_for_week/');
  
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
      <h1 className="text-2xl font-bold">Details for readiness for {day}</h1>
    <div className="grid gap-4 md:grid-cols-1 md:gap-8 lg:grid-cols-1">
      <Card x-chunk="dashboard-01-chunk-0">
              <CardHeader className="flex flex-col items-start space-y-2">
                  <div className="flex items-start justify-between w-full">
                      <div>
                          <HoverCard>
                              <HoverCardTrigger>
                                  <CardTitle className="font-semibold underline underline-offset-4 decoration-dotted cursor-pointer">
                                      Temperature Deviation and Trend
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
                                  temperature_deviation: metrics.temperature_deviation[index],
                                  temperature_trend_deviation: metrics.temperature_trend_deviation[index]
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
                              <Line type="monotone" dataKey="temperature_deviation" stroke="#4A4741" dot={(props) => {
                                  const { cx, cy, index, value } = props;
                                  const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
                                  return (
                                      <g key={`dot-temperature_deviation-${index}-${value}`}>
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
                              <Line type="monotone" dataKey="temperature_trend_deviation" stroke="#4A47" dot={(props) => {
                                  const { cx, cy, index, value } = props;
                                  const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
                                  return (
                                      <g key={`dot-temperature_trend_deviation-${index}-${value}`}>
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
                                      Activity and Body Balance
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
                                  activity_balance: metrics.activity_balance[index],
                                  body_temperature: metrics.body_temperature[index]
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
                              <Line type="monotone" dataKey="activity_balance" stroke="#4A4741" dot={(props) => {
                                  const { cx, cy, index, value } = props;
                                  const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
                                  return (
                                      <g key={`dot-activity_balance-${index}-${value}`}>
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
                              <Line type="monotone" dataKey="body_temperature" stroke="#4A47" dot={(props) => {
                                  const { cx, cy, index, value } = props;
                                  const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
                                  return (
                                      <g key={`dot-body_temperature-${index}-${value}`}>
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
                                      Previous Day Sleep and Activity
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
                                  previous_night: metrics.previous_night[index],
                                  previous_day_activity: metrics.previous_day_activity[index]
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
                              <Line type="monotone" dataKey="previous_night" stroke="#4A4741" dot={(props) => {
                                  const { cx, cy, index, value } = props;
                                  const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
                                  return (
                                      <g key={`dot-previous_night-${index}-${value}`}>
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
                              <Line type="monotone" dataKey="previous_day_activity" stroke="#4A47" dot={(props) => {
                                  const { cx, cy, index, value } = props;
                                  const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
                                  return (
                                      <g key={`dot-previous_day_activity-${index}-${value}`}>
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
          </div>
      </main>
      </div>
      );
  }