"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, TrendingUp, DollarSign, Plane, Globe, Calendar } from "lucide-react"

export default function FlightPriceStats() {
  // Enhanced statistics data with more Dubai routes
  const stats = [
    {
      title: "Best Value Route",
      route: "Dubai to Mumbai",
      price: "$280",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      color: "bg-green-100",
      textColor: "text-green-600",
      insight: "Prices down 12% this month",
    },
    {
      title: "Most Popular Route",
      route: "Dubai to London",
      price: "$650",
      icon: <Globe className="h-5 w-5 text-blue-600" />,
      color: "bg-blue-100",
      textColor: "text-blue-600",
      insight: "High demand year-round",
    },
    {
      title: "Biggest Price Drop",
      route: "New York to Paris",
      price: "$420",
      icon: <ArrowDown className="h-5 w-5 text-purple-600" />,
      color: "bg-purple-100",
      textColor: "text-purple-600",
      insight: "Down 15% from last month",
    },
    {
      title: "Rising Trend",
      route: "Singapore to Dubai",
      price: "$410",
      icon: <TrendingUp className="h-5 w-5 text-amber-600" />,
      color: "bg-amber-100",
      textColor: "text-amber-600",
      insight: "Increasing popularity",
    },
    {
      title: "Best Time to Book",
      route: "Dubai to Bangkok",
      price: "$380",
      icon: <Calendar className="h-5 w-5 text-indigo-600" />,
      color: "bg-indigo-100",
      textColor: "text-indigo-600",
      insight: "Book 2 months ahead",
    },
    {
      title: "Premium Deal",
      route: "London to Dubai",
      price: "$590",
      icon: <ArrowUp className="h-5 w-5 text-red-600" />,
      color: "bg-red-100",
      textColor: "text-red-600",
      insight: "Business class deals available",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-none shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{stat.title}</h3>
              <div className={`p-2 rounded-full ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Plane className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700 font-medium">{stat.route}</span>
            </div>
            <div className={`text-2xl font-bold mt-2 ${stat.textColor}`}>{stat.price}</div>
            <div className="mt-3 text-sm text-gray-600">{stat.insight}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
