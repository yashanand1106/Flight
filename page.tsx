import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, TrendingUp, Shield, Sparkles, Star } from "lucide-react"
import FlightAnimation from "@/components/flight-animation"
import LiveFlightPrices from "@/components/live-flight-prices"
import FlightPriceStats from "@/components/flight-price-stats"
import FlightPriceGraph from "@/components/flight-price-graph"
import HowItWorks from "@/components/how-it-works"
import PopularRoutes from "@/components/popular-routes"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <FlightAnimation />
        </div>

        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 p-2 bg-blue-50 rounded-full">
              <div className="flex items-center space-x-2 px-4 py-1 bg-blue-100 rounded-full">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">AI-Powered Flight Tracking</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Track Flight Prices <span className="text-blue-600">Effortlessly</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Get real-time alerts when flight prices drop and find the perfect time to book your next adventure.
              Powered by Gemini AI for accurate price predictions.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/chat" className="flex items-center">
                  Start Tracking Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-blue-600" />
                <span>AI-Powered Price Predictions</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1 text-blue-600" />
                <span>Global Flight Coverage</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-blue-600" />
                <span>Personalized Recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Price Ticker */}
      <div className="bg-white py-8 border-y border-gray-200">
        <div className="container mx-auto">
          <LiveFlightPrices />
        </div>
      </div>

      {/* Flight Price Statistics */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Flight Price Insights</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our AI analyzes millions of flight prices daily to bring you the most accurate insights and predictions.
        </p>
        <FlightPriceStats />
      </div>

      {/* Popular Routes Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Popular Routes Worldwide</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover the most traveled flight routes around the world and their current price trends.
          </p>
          <PopularRoutes />
        </div>
      </div>

      {/* Flight Price Graph */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Global Price Trends</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Track how flight prices fluctuate throughout the year for major international routes.
        </p>
        <div className="max-w-4xl mx-auto">
          <FlightPriceGraph />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-24 bg-white">
        <HowItWorks />
      </div>

      {/* AI Integration Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Powered by Gemini AI</h2>
            <p className="text-lg mb-8">
              Our flight price tracker uses Google's Gemini AI to analyze historical flight data, predict price trends,
              and provide personalized recommendations for your travel plans.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-blue-700 p-6 rounded-xl">
                <TrendingUp className="h-8 w-8 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Price Prediction</h3>
                <p className="text-blue-100">
                  Gemini AI analyzes years of flight pricing data to predict when prices will rise or fall.
                </p>
              </div>
              <div className="bg-blue-700 p-6 rounded-xl">
                <Globe className="h-8 w-8 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Route Analysis</h3>
                <p className="text-blue-100">
                  Our AI identifies alternative routes and connection options that could save you money.
                </p>
              </div>
              <div className="bg-blue-700 p-6 rounded-xl">
                <Sparkles className="h-8 w-8 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Smart Recommendations</h3>
                <p className="text-blue-100">
                  Get personalized travel recommendations based on your preferences and budget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Flight Deal?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Start tracking flight prices now and never overpay for air travel again.
        </p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/chat" className="flex items-center">
            Chat with Our AI Assistant <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
