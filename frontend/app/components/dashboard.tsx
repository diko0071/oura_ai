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


export type ReadinessScore = {
  days: string[]
  scores: number[]
  metric: string
}

function processApiData(apiResponse: any): ReadinessScore {
  return {
    days: apiResponse.days,
    scores: apiResponse.scores,
    metric: apiResponse.metric,
  }
}


export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ReadinessScore | null>(null);

  React.useEffect(() => {
    setLoading(true);
    ApiService.get('/api/oura/daily_readiness/').then(jsonData => {
      const readinessScore = processApiData(jsonData);
      setData(readinessScore);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to fetch readiness score:', error);
      setLoading(false);
    });
  }, []);


  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>{data?.metric}</h2>
        <div>
        </div>
      </div>
    </div>
  )



}