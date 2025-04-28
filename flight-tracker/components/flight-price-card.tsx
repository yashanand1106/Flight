"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Bell, Copy, Check, Plane, Calendar, Clock, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Flight = {
  id: string
  from: string
  to: string
  departDate: string
  returnDate: string
  price: number
  previousPrice: number
  airline: string
  currency: string
  insight?: string | null
  bestTimeToBook?: string | null
  cheapestMonth?: string | null
}

type FlightPriceCardProps = {
  flight: Flight
}

export default function FlightPriceCard({ flight }: FlightPriceCardProps) {
  const [tracking, setTracking] = useState(false)
  const [copied, setCopied] = useState(false)

  const priceChange = flight.price - flight.previousPrice
  const isPriceDown = priceChange < 0

  const copyFlightDetails = () => {
    const details = `Flight: ${flight.from} to ${flight.to}
Dates: ${flight.departDate} - ${flight.returnDate}
Airline: ${flight.airline}
Price: ${flight.currency} ${flight.price}`

    navigator.clipboard.writeText(details)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-600">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 p-1.5 rounded-full">
            <Plane className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-medium">{flight.airline}</span>
          {isPriceDown && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Price Drop
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={copyFlightDetails}>
            {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>

          <Button
            variant={tracking ? "default" : "outline"}
            size="sm"
            className={`h-8 text-xs ${tracking ? "bg-blue-600" : ""}`}
            onClick={() => setTracking(!tracking)}
          >
            <Bell className="h-3 w-3 mr-1" />
            {tracking ? "Tracking" : "Track Price"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500 flex items-center">
            <Calendar className="h-3 w-3 mr-1" /> Depart
          </div>
          <div className="font-medium">{flight.departDate}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 flex items-center">
            <Calendar className="h-3 w-3 mr-1" /> Return
          </div>
          <div className="font-medium">{flight.returnDate}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 flex items-center">
            <Plane className="h-3 w-3 mr-1" /> From
          </div>
          <div className="font-medium">{flight.from}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 flex items-center">
            <Plane className="h-3 w-3 mr-1 transform rotate-90" /> To
          </div>
          <div className="font-medium">{flight.to}</div>
        </div>
      </div>

      {(flight.insight || flight.bestTimeToBook || flight.cheapestMonth) && (
        <div className="mt-3 p-2 bg-blue-50 rounded-md text-sm text-blue-700">
          {flight.insight && (
            <p className="flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" /> {flight.insight}
            </p>
          )}
          {flight.bestTimeToBook && (
            <p className="flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Best time to book: {flight.bestTimeToBook}
            </p>
          )}
          {flight.cheapestMonth && (
            <p className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> Cheapest month: {flight.cheapestMonth}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-sm text-gray-500">Current Price</div>
          <div className="text-2xl font-bold">
            {flight.currency} {flight.price}
          </div>

          {priceChange !== 0 && (
            <div className={`text-sm flex items-center ${isPriceDown ? "text-green-600" : "text-red-600"}`}>
              {isPriceDown ? <ArrowDown className="h-3 w-3 mr-1" /> : <ArrowUp className="h-3 w-3 mr-1" />}
              {Math.abs(priceChange)} {isPriceDown ? "lower" : "higher"}
            </div>
          )}
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700">View Deal</Button>
      </div>
    </Card>
  )
}
