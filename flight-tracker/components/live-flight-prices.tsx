"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Plane } from "lucide-react"

type FlightPrice = {
  id: number
  from: string
  to: string
  price: number
  currency: string
  change: number
  airline: string
}

const initialFlightPrices: FlightPrice[] = [
  { id: 1, from: "NYC", to: "LAX", price: 299, currency: "USD", change: -12, airline: "Delta" },
  { id: 2, from: "LHR", to: "JFK", price: 450, currency: "USD", change: 15, airline: "British Airways" },
  { id: 3, from: "SFO", to: "TYO", price: 875, currency: "USD", change: -25, airline: "ANA" },
  { id: 4, from: "DXB", to: "SIN", price: 420, currency: "USD", change: 8, airline: "Emirates" },
  { id: 5, from: "CDG", to: "MAD", price: 120, currency: "USD", change: -5, airline: "Air France" },
  { id: 6, from: "SYD", to: "HKG", price: 510, currency: "USD", change: 22, airline: "Cathay Pacific" },
  { id: 7, from: "BOS", to: "ORD", price: 175, currency: "USD", change: -8, airline: "United" },
  { id: 8, from: "MIA", to: "MEX", price: 280, currency: "USD", change: 10, airline: "American" },
  { id: 9, from: "SEA", to: "YVR", price: 110, currency: "USD", change: -3, airline: "Alaska" },
  { id: 10, from: "ATL", to: "DEN", price: 220, currency: "USD", change: 7, airline: "Southwest" },
]

export default function LiveFlightPrices() {
  const [flightPrices, setFlightPrices] = useState<FlightPrice[]>(initialFlightPrices)

  // Simulate price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setFlightPrices((prevPrices) =>
        prevPrices.map((flight) => {
          const changeAmount = Math.floor(Math.random() * 30) - 15
          return {
            ...flight,
            price: Math.max(50, flight.price + changeAmount),
            change: changeAmount,
          }
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="overflow-hidden">
      <div className="flex items-center space-x-6 animate-marquee">
        {flightPrices.map((flight) => (
          <div
            key={flight.id}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 min-w-[200px]"
          >
            <Plane className="h-4 w-4 text-blue-600" />
            <div className="flex-1">
              <div className="font-medium">
                {flight.from} → {flight.to}
              </div>
              <div className="text-xs text-gray-500">{flight.airline}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">${flight.price}</div>
              <div className={`text-xs flex items-center ${flight.change < 0 ? "text-green-600" : "text-red-600"}`}>
                {flight.change < 0 ? <ArrowDown className="h-3 w-3 mr-1" /> : <ArrowUp className="h-3 w-3 mr-1" />}
                {Math.abs(flight.change)}
              </div>
            </div>
          </div>
        ))}

        {/* Duplicate for seamless looping */}
        {flightPrices.map((flight) => (
          <div
            key={`dup-${flight.id}`}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 min-w-[200px]"
          >
            <Plane className="h-4 w-4 text-blue-600" />
            <div className="flex-1">
              <div className="font-medium">
                {flight.from} → {flight.to}
              </div>
              <div className="text-xs text-gray-500">{flight.airline}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">${flight.price}</div>
              <div className={`text-xs flex items-center ${flight.change < 0 ? "text-green-600" : "text-red-600"}`}>
                {flight.change < 0 ? <ArrowDown className="h-3 w-3 mr-1" /> : <ArrowUp className="h-3 w-3 mr-1" />}
                {Math.abs(flight.change)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
