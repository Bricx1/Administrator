"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, Minimize2, Bot, Zap, Navigation } from "lucide-react"

interface AIVoiceAssistantProps {
  onNavigate?: (path: string) => void
  currentPage?: string
  userRole?: "patient" | "staff" | "admin"
}

export function AIVoiceAssistant({ onNavigate, currentPage, userRole = "staff" }: AIVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ type: "user" | "ai"; message: string; timestamp: string }>
  >([])
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [confidence, setConfidence] = useState(0)

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<any>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          const confidence = event.results[i][0].confidence

          if (event.results[i].isFinal) {
            finalTranscript += transcript
            setConfidence(confidence * 100)
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript)
          processVoiceCommand(finalTranscript)
        } else {
          setTranscript(interimTranscript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      setTranscript("")
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speak = (text: string) => {
    if (synthRef.current && voiceEnabled) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true)
    const timestamp = new Date().toLocaleTimeString()

    // Add user message to history
    setConversationHistory((prev) => [...prev, { type: "user", message: command, timestamp }])

    try {
      // Process the command with AI
      const response = await fetch("/api/ai/voice-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: command.toLowerCase(),
          currentPage,
          userRole,
          context: {
            timestamp,
            confidence,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setAiResponse(data.response)
        setConversationHistory((prev) => [...prev, { type: "ai", message: data.response, timestamp }])

        // Handle navigation commands
        if (data.action === "navigate" && data.path && onNavigate) {
          onNavigate(data.path)
        }

        // Handle other actions
        if (data.action === "execute" && data.function) {
          executeSystemFunction(data.function, data.parameters)
        }

        // Speak the response
        if (voiceEnabled) {
          speak(data.response)
        }
      }
    } catch (error) {
      console.error("Error processing voice command:", error)
      const errorMessage = "I'm sorry, I couldn't process that command. Please try again."
      setAiResponse(errorMessage)
      if (voiceEnabled) {
        speak(errorMessage)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const executeSystemFunction = (functionName: string, parameters: any) => {
    switch (functionName) {
      case "search":
        // Implement search functionality
        console.log("Searching for:", parameters.query)
        break
      case "filter":
        // Implement filtering
        console.log("Applying filter:", parameters)
        break
      case "create":
        // Implement creation functions
        console.log("Creating:", parameters.type)
        break
      case "update":
        // Implement update functions
        console.log("Updating:", parameters)
        break
      default:
        console.log("Unknown function:", functionName)
    }
  }

  const clearConversation = () => {
    setConversationHistory([])
    setTranscript("")
    setAiResponse("")
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
        {isListening && (
          <div className="absolute -top-2 -right-2">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span className="font-medium">AI Assistant</span>
          {isProcessing && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="text-white hover:bg-white/20"
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-white/20"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant={isListening ? "default" : "secondary"} className="text-xs">
            {isListening ? "Listening..." : "Ready"}
          </Badge>
          {confidence > 0 && (
            <Badge variant="outline" className="text-xs">
              {Math.round(confidence)}% confidence
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Zap className="h-3 w-3 text-green-500" />
          <span className="text-xs text-gray-600">AI Powered</span>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {conversationHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Hi! I'm your AI assistant.</p>
            <p className="text-xs mt-1">Try saying:</p>
            <div className="mt-2 space-y-1 text-xs">
              <p>"Navigate to patient portal"</p>
              <p>"Show me OASIS records"</p>
              <p>"Create new complaint"</p>
              <p>"Search for Margaret Anderson"</p>
            </div>
          </div>
        ) : (
          conversationHistory.map((item, index) => (
            <div key={index} className={`flex ${item.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  item.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                <p className="text-sm">{item.message}</p>
                <p className="text-xs opacity-70 mt-1">{item.timestamp}</p>
              </div>
            </div>
          ))
        )}

        {/* Current transcript */}
        {transcript && (
          <div className="flex justify-end">
            <div className="max-w-[80%] p-3 rounded-lg bg-blue-100 border border-blue-200">
              <p className="text-sm text-blue-800">{transcript}</p>
              <p className="text-xs text-blue-600 mt-1">Speaking...</p>
            </div>
          </div>
        )}

        {/* AI processing indicator */}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">Processing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Button
              variant={isListening ? "destructive" : "default"}
              size="sm"
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isListening ? "Stop" : "Talk"}
            </Button>
            <Button variant="outline" size="sm" onClick={clearConversation}>
              Clear
            </Button>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Navigation className="h-3 w-3" />
            <span>Hands-free navigation</span>
          </div>
        </div>

        {/* Quick Commands */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-transparent"
            onClick={() => processVoiceCommand("show dashboard")}
          >
            Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-transparent"
            onClick={() => processVoiceCommand("show patients")}
          >
            Patients
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-transparent"
            onClick={() => processVoiceCommand("show oasis qa")}
          >
            OASIS QA
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-transparent"
            onClick={() => processVoiceCommand("show complaints")}
          >
            Complaints
          </Button>
        </div>
      </div>
    </div>
  )
}
