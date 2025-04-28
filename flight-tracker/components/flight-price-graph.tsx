"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function FlightPriceGraph() {
  // Updated price trend data with focus on Dubai routes
  const priceData = [
    { month: "Jan", dxb_lhr: 620, nyc_lax: 320, dxb_bom: 280, lhr_jfk: 480, dxb_sin: 410 },
    { month: "Feb", dxb_lhr: 600, nyc_lax: 310, dxb_bom: 270, lhr_jfk: 460, dxb_sin: 420 },
    { month: "Mar", dxb_lhr: 630, nyc_lax: 340, dxb_bom: 290, lhr_jfk: 490, dxb_sin: 430 },
    { month: "Apr", dxb_lhr: 650, nyc_lax: 360, dxb_bom: 300, lhr_jfk: 510, dxb_sin: 440 },
    { month: "May", dxb_lhr: 670, nyc_lax: 380, dxb_bom: 310, lhr_jfk: 530, dxb_sin: 450 },
    { month: "Jun", dxb_lhr: 700, nyc_lax: 420, dxb_bom: 330, lhr_jfk: 550, dxb_sin: 470 },
    { month: "Jul", dxb_lhr: 730, nyc_lax: 450, dxb_bom: 350, lhr_jfk: 580, dxb_sin: 490 },
    { month: "Aug", dxb_lhr: 720, nyc_lax: 440, dxb_bom: 340, lhr_jfk: 570, dxb_sin: 480 },
    { month: "Sep", dxb_lhr: 680, nyc_lax: 400, dxb_bom: 320, lhr_jfk: 540, dxb_sin: 460 },
    { month: "Oct", dxb_lhr: 650, nyc_lax: 370, dxb_bom: 300, lhr_jfk: 520, dxb_sin: 440 },
    { month: "Nov", dxb_lhr: 630, nyc_lax: 350, dxb_bom: 290, lhr_jfk: 500, dxb_sin: 430 },
    { month: "Dec", dxb_lhr: 670, nyc_lax: 390, dxb_bom: 310, lhr_jfk: 530, dxb_sin: 450 },
  ]

  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Global Flight Price Trends</h3>
          <p className="text-sm text-gray-600">
            Average flight prices by month (in USD) for popular international routes
          </p>
        </div>

        <ChartContainer
          config={{
            dxb_lhr: {
              label: "Dubai to London",
              color: "hsl(221.2, 83.2%, 53.3%)",
            },
            nyc_lax: {
              label: "NYC to LAX",
              color: "hsl(355.7, 100%, 54.7%)",
            },
            dxb_bom: {
              label: "Dubai to Mumbai",
              color: "hsl(47.9, 95.8%, 53.1%)",
            },
            lhr_jfk: {
              label: "London to NYC",
              color: "hsl(262.1, 83.3%, 57.8%)",
            },
            dxb_sin: {
              label: "Dubai to Singapore",
              color: "hsl(174.3, 80.4%, 40.6%)",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="dxb_lhr"
                stroke="var(--color-dxb_lhr)"
                name="Dubai to London"
                strokeWidth={2}
              />
              <Line type="monotone" dataKey="nyc_lax" stroke="var(--color-nyc_lax)" name="NYC to LAX" strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="dxb_bom"
                stroke="var(--color-dxb_bom)"
                name="Dubai to Mumbai"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="lhr_jfk"
                stroke="var(--color-lhr_jfk)"
                name="London to NYC"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="dxb_sin"
                stroke="var(--color-dxb_sin)"
                name="Dubai to Singapore"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2">Price Insights</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Dubai to London prices peak during summer months</li>
              <li>• NYC to LAX shows consistent pricing with slight summer increase</li>
              <li>• Dubai to Mumbai offers the best value year-round</li>
              <li>• February typically has the lowest prices across most routes</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2">Booking Recommendations</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Book Dubai routes 2-3 months in advance for best prices</li>
              <li>• For summer travel, book in January-February</li>
              <li>• Consider shoulder seasons (Apr-May, Sep-Oct) for better deals</li>
              <li>• Set price alerts for sudden drops in high-demand routes</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
