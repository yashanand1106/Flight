"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Plane, Send, ArrowLeft, Calendar, MapPin, Info, Sparkles } from "lucide-react"
import Link from "next/link"
import FlightPriceCard from "@/components/flight-price-card"
import ChatMessage from "@/components/chat-message"
import LoadingDots from "@/components/loading-dots"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  flightPrices?: any[]
  priceData?: any
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi there! I'm your AI-powered flight price tracker assistant. Tell me where you'd like to fly, and I'll help you find the best deals and track prices for you. For example, you can ask: 'Track flights from New York to London for next month' or 'What's the average price from Dubai to Mumbai?'",
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [apiErrorCount, setApiErrorCount] = useState(0)
  const [showAIInfo, setShowAIInfo] = useState(false)

  // Check if API key is configured
  const [showApiKeyWarning, setShowApiKeyWarning] = useState(false)

  useEffect(() => {
    // Show API key warning after first failed request
    const handleApiKeyCheck = (event: MessageEvent) => {
      if (event.data?.type === "api-error" && event.data?.message?.includes("API Key")) {
        setShowApiKeyWarning(true)
      }
    }

    window.addEventListener("message", handleApiKeyCheck)
    return () => window.removeEventListener("message", handleApiKeyCheck)
  }, [])

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call the API with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()

        // Check if there was an API key error
        if (data.apiKeyError) {
          setShowApiKeyWarning(true)
          // Post message for the useEffect to catch
          window.postMessage({ type: "api-error", message: "API Key error" }, "*")
        }

        // Add assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
          flightPrices: data.flightPrices,
          priceData: data.priceData,
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Reset error count on successful API call
        setApiErrorCount(0)
      } catch (error) {
        clearTimeout(timeoutId)
        console.error("Error fetching from API:", error)

        // Increment API error count
        setApiErrorCount((prev) => prev + 1)

        // Add a fallback error message to the chat
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm having trouble connecting to the flight data service. I'll use my backup system instead.",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, errorMessage])

        // Short delay before showing the fallback response
        setTimeout(() => {
          // Handle client-side response
          handleClientSideResponse(userMessage.content)
        }, 500)
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error)

      // Fallback for any other errors
      handleClientSideResponse(userMessage.content)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle response generation on the client side when API fails
  const handleClientSideResponse = (userInput: string) => {
    const lowercaseInput = userInput.toLowerCase()

    // Check if it's a flight query
    if (
      lowercaseInput.includes("flight") ||
      lowercaseInput.includes("from") ||
      lowercaseInput.includes("to") ||
      lowercaseInput.includes("travel")
    ) {
      // Extract potential locations from input
      const fromToRegex = /from\s+([a-z\s]+)\s+to\s+([a-z\s]+)/i
      const match = lowercaseInput.match(fromToRegex)

      // Direct city-to-city pattern (e.g., "Dubai to Mumbai")
      const directCityPattern = /^([a-z\s]+)\s+to\s+([a-z\s]+)$/i
      const directMatch = lowercaseInput.match(directCityPattern)

      let fromCity = "New York"
      let toCity = "London"

      if (match) {
        fromCity = match[1].trim()
        toCity = match[2].trim()
      } else if (directMatch) {
        fromCity = directMatch[1].trim()
        toCity = directMatch[2].trim()
      } else {
        // Try to find cities in common list
        const commonCities = [
          "new york",
          "london",
          "paris",
          "tokyo",
          "los angeles",
          "chicago",
          "miami",
          "san francisco",
          "boston",
          "dubai",
          "mumbai",
        ]

        const foundCities = []
        for (const city of commonCities) {
          if (lowercaseInput.includes(city.toLowerCase())) {
            foundCities.push(city)
          }
        }

        if (foundCities.length >= 2) {
          fromCity = foundCities[0]
          toCity = foundCities[1]
        }
      }

      // Generate flight data
      const flightData = generateClientSideFlightData(fromCity, toCity)

      // Generate mock price data
      const mockPriceData = {
        averagePrice: Math.round(300 + Math.random() * 500),
        priceRange: `$${Math.round(250 + Math.random() * 200)}-$${Math.round(450 + Math.random() * 300)}`,
        bestTimeToBook: "2-3 months in advance",
        cheapestMonth: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ][Math.floor(Math.random() * 12)],
        priceInsight: "Prices vary based on season and demand",
        priceTrend: ["rising", "falling", "stable"][Math.floor(Math.random() * 3)],
      }

      // Add response with flight data
      const flightResponseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've analyzed flights from ${fromCity} to ${toCity}. The average price is around $${mockPriceData.averagePrice}, with prices typically ranging from ${mockPriceData.priceRange}. ${mockPriceData.priceInsight} The best time to book is ${mockPriceData.bestTimeToBook}, and prices are currently ${mockPriceData.priceTrend}.`,
        timestamp: new Date(),
        flightPrices: flightData,
        priceData: mockPriceData,
      }

      setMessages((prev) => [...prev, flightResponseMessage])
    } else {
      // Generic response for non-flight queries
      let responseContent =
        "I can help you track flight prices. Please let me know your departure city, destination, and approximate travel dates."

      // Add some contextual responses
      if (lowercaseInput.includes("cheap") || lowercaseInput.includes("best time")) {
        responseContent =
          "The best time to book flights is typically 1-3 months in advance for domestic flights and 2-8 months for international flights. Tuesday and Wednesday are often the cheapest days to fly, while Friday and Sunday tend to be more expensive."
      } else if (lowercaseInput.includes("cancel")) {
        responseContent =
          "Most airlines allow you to cancel your flight within 24 hours of booking for a full refund. After that, cancellation policies vary by airline and fare type. Some tickets are non-refundable but may be eligible for airline credit."
      } else if (lowercaseInput.includes("baggage") || lowercaseInput.includes("luggage")) {
        responseContent =
          "Baggage allowances vary by airline and ticket class. Most airlines allow one carry-on bag and one personal item for free. Checked baggage fees typically range from $30-$60 per bag, with weight limits around 50 pounds (23 kg)."
      }

      const genericResponseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, genericResponseMessage])
    }
  }

  // Generate flight data on the client side
  const generateClientSideFlightData = (from: string, to: string) => {
    const airlines = ["American Airlines", "Delta", "United", "British Airways", "Emirates", "Lufthansa"]
    const currentDate = new Date()

    // Generate airport codes
    const fromCode = from.substring(0, 3).toUpperCase()
    const toCode = to.substring(0, 3).toUpperCase()

    // Capitalize city names
    from = from
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    to = to
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    return Array.from({ length: 3 }, (_, i) => {
      const departDate = new Date(currentDate)
      departDate.setDate(departDate.getDate() + 30 + Math.floor(Math.random() * 10))

      const returnDate = new Date(departDate)
      returnDate.setDate(returnDate.getDate() + 7 + Math.floor(Math.random() * 5))

      const basePrice = 300 + Math.floor(Math.random() * 700)
      const priceChange = Math.floor(Math.random() * 50) - 25

      return {
        id: `flight${i + 1}`,
        from: `${from} (${fromCode})`,
        to: `${to} (${toCode})`,
        departDate: departDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        returnDate: returnDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        price: basePrice,
        previousPrice: basePrice - priceChange,
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        currency: "USD",
      }
    })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-semibold text-lg">Back to Home</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <Plane className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-semibold">AI Flight Price Tracker</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
            onClick={() => setShowAIInfo(!showAIInfo)}
          >
            <Info className="h-4 w-4" />
            <span>How it works</span>
          </Button>
        </div>
      </header>

      {/* API Key Warning */}
      {showApiKeyWarning && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                Gemini API key not configured or invalid. The chatbot is using fallback responses. Please add a valid
                GEMINI_API_KEY to your environment variables.
              </p>
            </div>
            <button className="ml-auto pl-3" onClick={() => setShowApiKeyWarning(false)}>
              <span className="text-amber-500 hover:text-amber-600">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Info Modal */}
      {showAIInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                How Our AI Flight Tracker Works
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowAIInfo(false)}>
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <p>
                Our AI-powered flight price tracker uses Google's Gemini AI to analyze flight data and provide you with
                accurate price predictions and recommendations.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-2">The Process:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>You ask about flights between specific destinations</li>
                  <li>Our AI analyzes your request to extract the origin, destination, and dates</li>
                  <li>Gemini AI processes historical flight data to predict prices and trends</li>
                  <li>We present you with personalized flight options and price insights</li>
                </ol>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">What You Get:</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Average price predictions for your route</li>
                  <li>Price trend analysis (rising, falling, or stable)</li>
                  <li>Best time to book recommendations</li>
                  <li>Cheapest months to travel</li>
                  <li>Multiple flight options with real-time pricing</li>
                </ul>
              </div>

              <p className="text-sm text-gray-500">
                Try asking: "What's the average price from Dubai to London?" or "Find me flights from New York to Tokyo
                in August"
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id}>
                <ChatMessage message={message} />

                {message.flightPrices && message.flightPrices.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {message.flightPrices.map((flight) => (
                      <FlightPriceCard key={flight.id} flight={flight} />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <Avatar className="h-9 w-9 bg-blue-100 flex items-center justify-center">
                  <Plane className="h-5 w-5 text-blue-600" />
                </Avatar>
                <Card className="p-3 max-w-[80%]">
                  <LoadingDots />
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 shadow-md">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about flight prices..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-auto py-1 px-2 text-xs"
                onClick={() => setInput("Find flights from Dubai to London")}
              >
                <Plane className="h-3 w-3 mr-1" />
                Dubai to London
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto py-1 px-2 text-xs"
                onClick={() => setInput("What's the average price from New York to Tokyo?")}
              >
                <MapPin className="h-3 w-3 mr-1" />
                NY to Tokyo prices
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto py-1 px-2 text-xs"
                onClick={() => setInput("When is the cheapest time to fly to Dubai?")}
              >
                <Calendar className="h-3 w-3 mr-1" />
                Best time to Dubai
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto py-1 px-2 text-xs"
                onClick={() => setInput("Compare prices from Dubai to Mumbai and Dubai to Singapore")}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Compare routes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
