"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Copy, Check, User, Plane } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

type ChatMessageProps = {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === "user"

  return (
    <div className={`flex items-start space-x-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <Avatar className="h-9 w-9 bg-blue-100 flex items-center justify-center">
          <Plane className="h-5 w-5 text-blue-600" />
        </Avatar>
      )}

      <div className={`max-w-[80%] ${isUser ? "order-1" : "order-2"}`}>
        <Card className={`p-3 ${isUser ? "bg-blue-600 text-white" : "bg-white"}`}>
          <div className="flex justify-between items-start">
            <div className="prose prose-sm max-w-none">{message.content}</div>

            {!isUser && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-2 text-gray-400 hover:text-gray-600"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            )}
          </div>
        </Card>

        <div className="text-xs text-gray-500 mt-1">{formatDistanceToNow(message.timestamp, { addSuffix: true })}</div>
      </div>

      {isUser && (
        <Avatar className="h-9 w-9 bg-gray-200 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-600" />
        </Avatar>
      )}
    </div>
  )
}
