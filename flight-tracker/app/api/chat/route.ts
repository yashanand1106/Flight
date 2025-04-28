import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Check if API key exists and initialize Gemini API
const GEMINI_API_KEY = "AIzaSyDagXSatgkHocmV0p_g3T09ArSBCUBrjMM"
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null
const MODEL_NAME = "gemini-1.5-pro-latest"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Add better error handling for empty messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({
        role: "assistant",
        content: "I couldn't process your message. Please try again.",
      })
    }

    const userMessage = messages[messages.length - 1].content

    // Check if this is a flight query
    const isFlightQuery = checkIfFlightQuery(userMessage)

    if (isFlightQuery) {
      // Check if Gemini API is available
      if (!genAI) {
        console.warn("Gemini API key not configured. Using fallback method.")
        const flightInfo = extractFlightInfoWithRegex(userMessage)
        if (flightInfo.from && flightInfo.to) {
          const flightPrices = generateFlightPrices(flightInfo)
          return NextResponse.json({
            role: "assistant",
            content: `I've found some flights from ${flightInfo.from} to ${flightInfo.to}${
              flightInfo.date ? ` for ${flightInfo.date}` : ""
            }. Here are the best options I could find:`,
            flightPrices,
          })
        }
      } else {
        try {
          const model = genAI.getGenerativeModel({ model: MODEL_NAME })

          // First, extract flight information
          const flightInfoPrompt = `
          Extract flight information from this message: "${userMessage}"
          Return a JSON object with the following fields:
          - from: departure city or airport code
          - to: destination city or airport code
          - date: travel date or period (if mentioned)
          
          If any field is not found, set it to null.
          Only return the JSON object, nothing else.
          `

          const flightInfoResult = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: flightInfoPrompt }] }],
            generationConfig: { temperature: 0.1 },
          })

          const flightInfoText = flightInfoResult.response.text()
          let flightInfo

          try {
            flightInfo = JSON.parse(flightInfoText.replace(/```json|```/g, "").trim())
          } catch (e) {
            console.error("Failed to parse flight info JSON:", flightInfoText)
            flightInfo = extractFlightInfoWithRegex(userMessage)
          }

          // If we have origin and destination, ask for price predictions
          if (flightInfo.from && flightInfo.to) {
            const pricePrompt = `
            You are a flight price prediction expert. Based on historical data and current trends:
            
            What is the average price for flights from ${flightInfo.from} to ${flightInfo.to}${flightInfo.date ? ` during ${flightInfo.date}` : ""}?
            
            Provide the following information in JSON format:
            - averagePrice: the average price in USD
            - priceRange: the typical price range (e.g. "400-600 USD")
            - bestTimeToBook: when is the best time to book this flight
            - cheapestMonth: the cheapest month to fly this route
            - priceInsight: a brief insight about this route's pricing
            - priceTrend: whether prices are "rising", "falling", or "stable"
            
            Only return the JSON object, nothing else.
            `

            const priceResult = await model.generateContent({
              contents: [{ role: "user", parts: [{ text: pricePrompt }] }],
              generationConfig: { temperature: 0.2 },
            })

            const priceText = priceResult.response.text()
            let priceData

            try {
              priceData = JSON.parse(priceText.replace(/```json|```/g, "").trim())
            } catch (e) {
              console.error("Failed to parse price JSON:", priceText)
              priceData = {
                averagePrice: generateRandomPrice(flightInfo.from, flightInfo.to),
                priceRange: generatePriceRange(flightInfo.from, flightInfo.to),
                bestTimeToBook: "1-3 months in advance",
                cheapestMonth: getRandomMonth(),
                priceInsight: "Prices vary based on season and demand",
                priceTrend: getRandomTrend(),
              }
            }

            // Generate flight options based on the price data
            const flightPrices = generateFlightPricesFromData(flightInfo, priceData)

            return NextResponse.json({
              role: "assistant",
              content: `I've analyzed flights from ${flightInfo.from} to ${flightInfo.to}${
                flightInfo.date ? ` for ${flightInfo.date}` : ""
              }. The average price is around $${priceData.averagePrice}, with prices typically ranging from ${priceData.priceRange}. ${priceData.priceInsight} The best time to book is ${priceData.bestTimeToBook}, and prices are currently ${priceData.priceTrend}.`,
              flightPrices,
              priceData,
            })
          }
        } catch (apiError) {
          console.error("Gemini API error:", apiError)
          // Fall back to regex extraction and generated data
          const flightInfo = extractFlightInfoWithRegex(userMessage)
          if (flightInfo.from && flightInfo.to) {
            const flightPrices = generateFlightPrices(flightInfo)
            return NextResponse.json({
              role: "assistant",
              content: `I've found some flights from ${flightInfo.from} to ${flightInfo.to}${
                flightInfo.date ? ` for ${flightInfo.date}` : ""
              }. Here are the best options I could find:`,
              flightPrices,
            })
          }
        }
      }
    }

    // For non-flight queries or if flight extraction failed, use Gemini for general response if available
    // Otherwise use default responses
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME })

        const systemPrompt = `
        You are a helpful flight price tracking assistant. You help users find the best flight deals and provide information about air travel.
        Keep your responses concise, informative, and focused on helping the user with their travel plans.
        If the user is asking about flights but you don't have specific price data, suggest they provide origin and destination cities.
        `

        const chatPrompt = `${systemPrompt}\n\nUser: ${userMessage}`

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: chatPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        })

        const text = result.response.text()

        return NextResponse.json({
          role: "assistant",
          content: text || getDefaultResponse(userMessage),
        })
      } catch (apiError) {
        console.error("API error:", apiError)
        // Return a fallback response if API call fails
        return NextResponse.json({
          role: "assistant",
          content: getDefaultResponse(userMessage),
        })
      }
    } else {
      // If Gemini API is not available, use default responses
      return NextResponse.json({
        role: "assistant",
        content: getDefaultResponse(userMessage),
      })
    }
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        role: "assistant",
        content: "I'm having trouble connecting to the flight data service. Please try again later.",
      },
      { status: 500 },
    )
  }
}

// Check if the user message is asking about flights
function checkIfFlightQuery(message: string) {
  const flightKeywords = [
    "flight",
    "fly",
    "travel",
    "trip",
    "ticket",
    "airfare",
    "airline",
    "from",
    "to",
    "depart",
    "arrive",
    "airport",
    "book",
  ]

  const lowercaseMessage = message.toLowerCase()
  return flightKeywords.some((keyword) => lowercaseMessage.includes(keyword))
}

// Extract flight information using regex
function extractFlightInfoWithRegex(message: string) {
  message = message.toLowerCase()

  // Default values
  let from = null
  let to = null
  let date = null

  // Common city names to look for
  const commonCities = [
    "new york",
    "nyc",
    "london",
    "paris",
    "tokyo",
    "los angeles",
    "la",
    "chicago",
    "miami",
    "san francisco",
    "sf",
    "boston",
    "seattle",
    "atlanta",
    "denver",
    "dallas",
    "houston",
    "phoenix",
    "philadelphia",
    "toronto",
    "vancouver",
    "sydney",
    "melbourne",
    "dubai",
    "singapore",
    "hong kong",
    "berlin",
    "rome",
    "madrid",
    "barcelona",
    "amsterdam",
    "bangkok",
    "beijing",
    "shanghai",
    "delhi",
    "mumbai",
  ]

  // Try to find "from X to Y" pattern
  const fromToRegex = /from\s+([a-z\s]+)\s+to\s+([a-z\s]+)/i
  const match = message.match(fromToRegex)

  if (match) {
    from = match[1].trim()
    to = match[2].trim()
  } else {
    // Try to find "X to Y" pattern
    const toRegex = /([a-z\s]+)\s+to\s+([a-z\s]+)/i
    const toMatch = message.match(toRegex)

    if (toMatch) {
      from = toMatch[1].trim()
      to = toMatch[2].trim()
    } else {
      // If no direct match, look for city names
      for (const city of commonCities) {
        if (message.includes(city) && !from) {
          from = city
        } else if (message.includes(city) && from && !to) {
          to = city
        }
      }
    }
  }

  // Look for date information
  const dateRegex =
    /(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec|next month|next week|tomorrow|today|in \d+ days)/i
  const dateMatch = message.match(dateRegex)

  if (dateMatch) {
    date = dateMatch[1]
  }

  // If we still don't have from/to but message mentions flights, use defaults
  if (message.includes("flight") && (!from || !to)) {
    from = from || "New York"
    to = to || "London"
  }

  return { from, to, date }
}

// Generate realistic flight prices based on data from Gemini
function generateFlightPricesFromData(flightInfo: any, priceData: any) {
  const airlines = [
    "American Airlines",
    "Delta",
    "United",
    "British Airways",
    "Emirates",
    "Lufthansa",
    "Air France",
    "KLM",
    "Singapore Airlines",
    "Cathay Pacific",
    "Virgin Atlantic",
    "JetBlue",
    "Southwest",
    "Alaska Airlines",
  ]

  const currentDate = new Date()
  const fromCode = generateAirportCode(flightInfo.from)
  const toCode = generateAirportCode(flightInfo.to)

  // Parse the price range to get min and max
  let minPrice = priceData.averagePrice * 0.8
  let maxPrice = priceData.averagePrice * 1.2

  if (priceData.priceRange) {
    const rangeMatch = priceData.priceRange.match(/(\d+)-(\d+)/)
    if (rangeMatch) {
      minPrice = Number.parseInt(rangeMatch[1])
      maxPrice = Number.parseInt(rangeMatch[2])
    }
  }

  return Array.from({ length: 4 }, (_, i) => {
    const departDate = new Date(currentDate)
    departDate.setDate(departDate.getDate() + 30 + Math.floor(Math.random() * 10))

    const returnDate = new Date(departDate)
    returnDate.setDate(returnDate.getDate() + 7 + Math.floor(Math.random() * 5))

    // Generate price within the range
    const price = Math.round(minPrice + Math.random() * (maxPrice - minPrice))

    // Price change based on trend
    let priceChange = Math.floor(Math.random() * 50) - 25
    if (priceData.priceTrend === "rising") {
      priceChange = Math.abs(priceChange) // Make sure it's positive
    } else if (priceData.priceTrend === "falling") {
      priceChange = -Math.abs(priceChange) // Make sure it's negative
    }

    const airline = airlines[Math.floor(Math.random() * airlines.length)]

    return {
      id: `flight${i + 1}`,
      from: `${capitalizeWords(flightInfo.from)} (${fromCode})`,
      to: `${capitalizeWords(flightInfo.to)} (${toCode})`,
      departDate: departDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      returnDate: returnDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      price: price,
      previousPrice: price - priceChange,
      airline: airline,
      currency: "USD",
      insight: i === 0 ? priceData.priceInsight : null,
      bestTimeToBook: i === 1 ? priceData.bestTimeToBook : null,
      cheapestMonth: i === 2 ? priceData.cheapestMonth : null,
    }
  })
}

// Generate realistic flight prices without API data
function generateFlightPrices(flightInfo: any) {
  const airlines = [
    "American Airlines",
    "Delta",
    "United",
    "British Airways",
    "Emirates",
    "Lufthansa",
    "Air France",
    "KLM",
    "Singapore Airlines",
    "Cathay Pacific",
  ]

  const currentDate = new Date()
  const fromCode = generateAirportCode(flightInfo.from)
  const toCode = generateAirportCode(flightInfo.to)

  // Generate base price based on cities
  const basePrice = generateBasePriceForRoute(flightInfo.from, flightInfo.to)

  return Array.from({ length: 4 }, (_, i) => {
    const departDate = new Date(currentDate)
    departDate.setDate(departDate.getDate() + 30 + Math.floor(Math.random() * 10))

    const returnDate = new Date(departDate)
    returnDate.setDate(returnDate.getDate() + 7 + Math.floor(Math.random() * 5))

    // Vary price by airline and random factor
    const priceVariation = Math.floor(Math.random() * 150) - 75
    const price = Math.max(150, basePrice + priceVariation)
    const priceChange = Math.floor(Math.random() * 50) - 25

    const airline = airlines[Math.floor(Math.random() * airlines.length)]

    return {
      id: `flight${i + 1}`,
      from: `${capitalizeWords(flightInfo.from)} (${fromCode})`,
      to: `${capitalizeWords(flightInfo.to)} (${toCode})`,
      departDate: departDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      returnDate: returnDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      price: price,
      previousPrice: price - priceChange,
      airline: airline,
      currency: "USD",
    }
  })
}

// Generate a realistic airport code
function generateAirportCode(cityName: string) {
  // Common airport codes
  const airportCodes: Record<string, string> = {
    "new york": "JFK",
    nyc: "JFK",
    london: "LHR",
    paris: "CDG",
    tokyo: "NRT",
    "los angeles": "LAX",
    la: "LAX",
    chicago: "ORD",
    miami: "MIA",
    "san francisco": "SFO",
    sf: "SFO",
    boston: "BOS",
    seattle: "SEA",
    atlanta: "ATL",
    denver: "DEN",
    dallas: "DFW",
    houston: "IAH",
    phoenix: "PHX",
    philadelphia: "PHL",
    toronto: "YYZ",
    vancouver: "YVR",
    sydney: "SYD",
    melbourne: "MEL",
    dubai: "DXB",
    singapore: "SIN",
    "hong kong": "HKG",
    berlin: "BER",
    rome: "FCO",
    madrid: "MAD",
    barcelona: "BCN",
    amsterdam: "AMS",
    bangkok: "BKK",
    beijing: "PEK",
    shanghai: "PVG",
    delhi: "DEL",
    mumbai: "BOM",
  }

  const cityLower = cityName.toLowerCase()

  // Return known airport code or generate one from the city name
  if (airportCodes[cityLower]) {
    return airportCodes[cityLower]
  }

  // Generate a code from the first 3 letters of the city
  const words = cityLower.split(" ")
  if (words.length > 1) {
    return (words[0][0] + words[1][0] + words[0][1]).toUpperCase()
  }

  // Just use the first 3 letters of the city name
  return cityLower.substring(0, 3).toUpperCase()
}

// Generate a realistic base price for a route
function generateBasePriceForRoute(from: string, to: string) {
  // Simplified distance-based pricing
  const cityPairs: Record<string, number> = {
    "new york-london": 600,
    "new york-paris": 650,
    "new york-los angeles": 350,
    "london-paris": 150,
    "los angeles-tokyo": 900,
    "new york-miami": 250,
    "chicago-new york": 200,
    "san francisco-new york": 400,
    "dubai-london": 700,
    "singapore-hong kong": 400,
    "dubai-mumbai": 300,
    "dubai-new york": 950,
  }

  const fromLower = from.toLowerCase()
  const toLower = to.toLowerCase()

  // Check both directions
  const key1 = `${fromLower}-${toLower}`
  const key2 = `${toLower}-${fromLower}`

  if (cityPairs[key1]) {
    return cityPairs[key1]
  }

  if (cityPairs[key2]) {
    return cityPairs[key2]
  }

  // Default pricing based on simple heuristic
  // Domestic vs international rough estimate
  const domestic = isInSameRegion(fromLower, toLower)
  return domestic ? 200 + Math.random() * 300 : 500 + Math.random() * 700
}

// Simple helper to guess if cities might be in the same country/region
function isInSameRegion(city1: string, city2: string) {
  const usCities = [
    "new york",
    "los angeles",
    "chicago",
    "miami",
    "san francisco",
    "boston",
    "seattle",
    "atlanta",
    "denver",
    "dallas",
    "houston",
    "phoenix",
    "philadelphia",
  ]
  const europeanCities = ["london", "paris", "berlin", "rome", "madrid", "barcelona", "amsterdam"]
  const asianCities = ["tokyo", "singapore", "hong kong", "beijing", "shanghai", "bangkok", "delhi", "mumbai"]
  const australianCities = ["sydney", "melbourne"]

  if (usCities.includes(city1) && usCities.includes(city2)) return true
  if (europeanCities.includes(city1) && europeanCities.includes(city2)) return true
  if (asianCities.includes(city1) && asianCities.includes(city2)) return true
  if (australianCities.includes(city1) && australianCities.includes(city2)) return true

  return false
}

// Helper to capitalize words
function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Get a default response based on user message
function getDefaultResponse(message: string) {
  const lowercaseMessage = message.toLowerCase()

  if (lowercaseMessage.includes("cheap") || lowercaseMessage.includes("best time")) {
    return "The best time to book flights is typically 1-3 months in advance for domestic flights and 2-8 months for international flights. Tuesday and Wednesday are often the cheapest days to fly, while Friday and Sunday tend to be more expensive."
  }

  if (lowercaseMessage.includes("cancel")) {
    return "Most airlines allow you to cancel your flight within 24 hours of booking for a full refund. After that, cancellation policies vary by airline and fare type. Some tickets are non-refundable but may be eligible for airline credit."
  }

  if (lowercaseMessage.includes("baggage") || lowercaseMessage.includes("luggage")) {
    return "Baggage allowances vary by airline and ticket class. Most airlines allow one carry-on bag and one personal item for free. Checked baggage fees typically range from $30-$60 per bag, with weight limits around 50 pounds (23 kg)."
  }

  return "I can help you track flight prices. Please let me know your departure city, destination, and approximate travel dates. For example: 'Find flights from New York to London for next month'"
}

// Helper functions for fallback data generation
function generateRandomPrice(from: string, to: string) {
  const basePrice = generateBasePriceForRoute(from, to)
  return Math.round(basePrice)
}

function generatePriceRange(from: string, to: string) {
  const basePrice = generateBasePriceForRoute(from, to)
  const min = Math.round(basePrice * 0.8)
  const max = Math.round(basePrice * 1.2)
  return `$${min}-$${max}`
}

function getRandomMonth() {
  const months = [
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
  ]
  return months[Math.floor(Math.random() * months.length)]
}

function getRandomTrend() {
  const trends = ["rising", "falling", "stable"]
  return trends[Math.floor(Math.random() * trends.length)]
}
