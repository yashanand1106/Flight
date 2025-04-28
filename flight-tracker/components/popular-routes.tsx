"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Plane, ArrowRight, TrendingDown, TrendingUp } from "lucide-react"

export default function PopularRoutes() {
  // Sample data for popular routes
  const popularRoutes = [
    {
      id: 1,
      from: "Dubai",
      fromCode: "DXB",
      to: "London",
      toCode: "LHR",
      price: "$650",
      trend: "down",
      percent: "8%",
      popularity: "Very High",
    },
    {
      id: 2,
      from: "New York",
      fromCode: "JFK",
      to: "Los Angeles",
      toCode: "LAX",
      price: "$320",
      trend: "up",
      percent: "5%",
      popularity: "High",
    },
    {
      id: 3,
      from: "Dubai",
      fromCode: "DXB",
      to: "Mumbai",
      toCode: "BOM",
      price: "$280",
      trend: "down",
      percent: "12%",
      popularity: "Very High",
    },
    {
      id: 4,
      from: "London",
      fromCode: "LHR",
      to: "New York",
      toCode: "JFK",
      price: "$490",
      trend: "up",
      percent: "3%",
      popularity: "High",
    },
    {
      id: 5,
      from: "Singapore",
      fromCode: "SIN",
      to: "Dubai",
      toCode: "DXB",
      price: "$420",
      trend: "down",
      percent: "6%",
      popularity: "Medium",
    },
    {
      id: 6,
      from: "Dubai",
      fromCode: "DXB",
      to: "Bangkok",
      toCode: "BKK",
      price: "$380",
      trend: "down",
      percent: "4%",
      popularity: "High",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {popularRoutes.map((route) => (
        <Card key={route.id} className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Plane className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Popular Route</div>
                  <div className="font-medium">
                    {route.fromCode} <ArrowRight className="inline h-3 w-3" /> {route.toCode}
                  </div>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  route.trend === "down" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {route.trend === "down" ? (
                  <TrendingDown className="inline h-3 w-3 mr-1" />
                ) : (
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                )}
                {route.percent}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-500">From</div>
              <div className="font-medium">
                {route.from} ({route.fromCode})
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-500">To</div>
              <div className="font-medium">
                {route.to} ({route.toCode})
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <div className="text-sm text-gray-500">Average Price</div>
                <div className="text-2xl font-bold">{route.price}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Popularity</div>
                <div className="font-medium">{route.popularity}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
