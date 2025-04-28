"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Search, Bell, Sparkles } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: <MessageSquare className="h-10 w-10 text-blue-600" />,
      title: "Chat with Our AI",
      description:
        "Tell our Gemini-powered AI assistant about your travel plans. It understands natural language, so you can chat just like you would with a travel agent.",
      detail: "Example: 'I want to fly from New York to Tokyo in September'",
    },
    {
      icon: <Search className="h-10 w-10 text-blue-600" />,
      title: "AI Analyzes Prices",
      description:
        "Our AI searches through millions of flight options and analyzes historical price data to find the best deals for your trip.",
      detail: "The AI considers factors like seasonality, events, and historical pricing patterns",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-blue-600" />,
      title: "Get Smart Recommendations",
      description:
        "Receive personalized flight recommendations with price predictions and insights to help you make the best booking decision.",
      detail: "You'll see price trends, best booking times, and alternative options",
    },
    {
      icon: <Bell className="h-10 w-10 text-blue-600" />,
      title: "Track Price Changes",
      description:
        "Set up price alerts and our system will notify you when prices drop or when it's the optimal time to book your flight.",
      detail: "Never miss a deal with real-time price monitoring",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4">How Our AI Flight Tracker Works</h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Our advanced AI-powered system makes finding the best flight deals easier than ever before.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {steps.map((step, index) => (
          <Card key={index} className="border-none shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 w-full">{step.detail}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 p-6 rounded-xl">
        <h3 className="font-semibold text-xl mb-4 text-center">How Our Gemini AI Integration Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-blue-700 mb-2">Data Collection</h4>
            <p className="text-sm text-gray-600">
              Our system continuously collects flight pricing data from hundreds of airlines and travel sites.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-blue-700 mb-2">AI Analysis</h4>
            <p className="text-sm text-gray-600">
              Gemini AI analyzes patterns, seasonality, and historical trends to predict future price movements.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-blue-700 mb-2">Personalization</h4>
            <p className="text-sm text-gray-600">
              The AI learns from your preferences to provide increasingly personalized recommendations over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
