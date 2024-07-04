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

type DetailViewActivityMetricsProps = {
    day: string;
  }

type ActivityMetrics = {
    days: string[];
    scores: number[];
    active_calories: number[];
    target_calories: number[];
    total_calories: number[];
    equivalent_walking_distance: number[];
    total_steps: number[];
    inactivity_alerts: number[];
    meet_daily_targets: number[];
    steps: number[];
    move_every_hour: number[];
    recovery_time: number[];
    training_frequency: number[];
    training_volume: number[];
    stay_active: number[];
}

function ProcessApiData(apiResponse: any): ActivityMetrics {
    return {
        days: apiResponse.days,
        scores: apiResponse.scores,
        active_calories: apiResponse.active_calories,
        target_calories: apiResponse.target_calories,
        total_calories: apiResponse.total_calories,
        equivalent_walking_distance: apiResponse.equivalent_walking_distance,
        total_steps: apiResponse.total_steps,
        inactivity_alerts: apiResponse.inactivity_alerts,
        meet_daily_targets: apiResponse.meet_daily_targets,
        steps: apiResponse.steps,
        move_every_hour: apiResponse.move_every_hour,
        recovery_time: apiResponse.recovery_time,
        training_frequency: apiResponse.training_frequency,
        training_volume: apiResponse.training_volume,
        stay_active: apiResponse.stay_active,
    }
}

export default function DetailViewActivityMetrics({ day }: DetailViewActivityMetricsProps) {

    const [metrics, setMetrics] = useState<ActivityMetrics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
  
    useEffect(() => {
      setLoading(true);
      const fetchActivityMetrics = ApiService.get('/api/oura/daily_activity_row_for_week/');
  
      fetchActivityMetrics
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
                                      Active and Target Calories
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
                          <BarChart
                              data={metrics?.days.map((day, index) => ({
                                  name: day,
                                  active_calories: metrics.active_calories[index],
                                  target_calories: metrics.target_calories[index]
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
                              <Bar dataKey="active_calories" fill="#4A4741" />
                              <Bar dataKey="target_calories" fill="#4A47" />
                          </BarChart>
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
                                      Meet Daily Targets
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
                                  meet_daily_targets: metrics.meet_daily_targets[index],
                              }))}
                              margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
                          >
                              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                              <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
                              <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => (value !== 0 ? value : '')} />
                              <Tooltip />
                              <Line type="monotone" dataKey="meet_daily_targets" stroke="#4A4741" dot={(props) => {
                                  const { cx, cy, index, value } = props;
                                  const isSelectedDate = isSameDay(new Date(metrics.days[index]), new Date(day));
                                  return (
                                      <g key={`dot-meet_daily_targets-${index}-${value}`}>
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
                                      Daily Steps
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
                          <BarChart
                              data={metrics?.days.map((day, index) => ({
                                  name: day,
                                  steps: metrics.steps[index],
                              }))}
                              margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
                          >
                              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                              <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
                              <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => (value !== 0 ? value : '')} />
                              <Tooltip />
                              <Bar dataKey="steps" fill="#4A4741" />
                          </BarChart>
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