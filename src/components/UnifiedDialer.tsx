import { useState, useEffect } from "react"
import { Clock, Phone, Delete } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ScrollArea } from "./ui/scroll-area"
import { useCall } from "@/contexts/CallContext"
import { CallInterface } from "./CallInterface"

interface CallRecord {
  id: string
  name: string
  number: string
  avatar: string
  type: 'incoming' | 'outgoing' | 'missed'
  duration: string
  timestamp: string
}

interface UnifiedDialerProps {
  showRecentCalls?: boolean
  isGlobalDialer?: boolean
}

export function UnifiedDialer({ showRecentCalls = true, isGlobalDialer = false }: UnifiedDialerProps) {
  const [localDialedNumber, setLocalDialedNumber] = useState("")
  const { callState, initiateCall, maximizeCall } = useCall()

  const dialpadNumbers = [
    { number: "1", letters: "" },
    { number: "2", letters: "" },
    { number: "3", letters: "" },
    { number: "4", letters: "" },
    { number: "5", letters: "" },
    { number: "6", letters: "" },
    { number: "7", letters: "" },
    { number: "8", letters: "" },
    { number: "9", letters: "" },
    { number: "*", letters: "" },
    { number: "0", letters: "" },
    { number: "#", letters: "" },
  ]

  const callHistory: CallRecord[] = [
    {
      id: "1",
      name: "Sarah Wilson",
      number: "+1 (555) 123-4567",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=40&h=40&fit=crop&crop=face",
      type: "incoming",
      duration: "5:23",
      timestamp: "Today, 2:30 PM"
    },
    {
      id: "2",
      name: "Mike Johnson",
      number: "+1 (555) 987-6543",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      type: "outgoing",
      duration: "12:45",
      timestamp: "Today, 11:15 AM"
    },
    {
      id: "3",
      name: "Unknown",
      number: "+1 (555) 456-7890",
      avatar: "",
      type: "missed",
      duration: "",
      timestamp: "Yesterday, 4:20 PM"
    }
  ]

  const handleDialpadClick = (value: string) => {
    setLocalDialedNumber(prev => prev + value)
  }

  const handleCall = () => {
    if (localDialedNumber) {
      initiateCall(localDialedNumber, "Sarah Wilson", "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=128&h=128&fit=crop&crop=face")
      setLocalDialedNumber("")
    }
  }

  const handleBackspace = () => {
    setLocalDialedNumber(prev => prev.slice(0, -1))
  }

  const handleHistoryCall = (call: CallRecord) => {
    initiateCall(call.number, call.name, call.avatar)
  }

  // Handle keyboard input for dialer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle if not in call and not typing in an input field
      if (callState.isInCall || (event.target as HTMLElement)?.tagName === 'INPUT') return
      
      const key = event.key

      // Handle numeric keys (0-9)
      if (/^[0-9]$/.test(key)) {
        event.preventDefault()
        setLocalDialedNumber(prev => prev + key)
      }
      // Handle special characters (* and #)
      else if (key === '*' || key === '#') {
        event.preventDefault()
        setLocalDialedNumber(prev => prev + key)
      }
      // Handle backspace
      else if (key === 'Backspace') {
        event.preventDefault()
        setLocalDialedNumber(prev => prev.slice(0, -1))
      }
      // Handle Enter key to initiate call
      else if (key === 'Enter') {
        event.preventDefault()
        if (localDialedNumber) {
          handleCall()
        }
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [callState.isInCall, localDialedNumber, handleCall]) // Dependencies for keyboard shortcuts

  // If there's an active call and it's minimized, show the minimized interface
  if (callState.isInCall && callState.isCallMinimized) {
    return (
      <>
        {/* Show normal dialer interface if this is the main dialer section */}
        {!isGlobalDialer && (
          <div className="flex h-full flex-col sm:flex-row">
            <div className={`p-4 sm:p-6 flex flex-col ${showRecentCalls ? 'sm:w-80 md:w-96 sm:border-r border-border' : 'w-full max-w-md mx-auto'}`}>
              <div className="flex items-center justify-center flex-1">
                <div className="text-center">
                  <div className="text-lg text-muted-foreground mb-4">Call is minimized</div>
                  <Button 
                    onClick={maximizeCall}
                    className="gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Show Call
                  </Button>
                </div>
              </div>
            </div>
            {showRecentCalls && (
              <div className="flex-1 flex flex-col">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Recent Calls</h2>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-2">
                    {callHistory.map((call) => (
                      <div
                        key={call.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => handleHistoryCall(call)}
                      >
                        <Avatar className="w-12 h-12">
                          {call.avatar ? (
                            <AvatarImage src={call.avatar} />
                          ) : null}
                          <AvatarFallback>
                            {call.name === "Unknown" ? "?" : call.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{call.name}</h3>
                            {call.type === 'incoming' && (
                              <Phone className="w-4 h-4 text-green-500 rotate-180" />
                            )}
                            {call.type === 'outgoing' && (
                              <Phone className="w-4 h-4 text-blue-500" />
                            )}
                            {call.type === 'missed' && (
                              <Phone className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{call.number}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{call.timestamp}</span>
                            {call.duration && (
                              <>
                                <span>•</span>
                                <span>{call.duration}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation()
                          handleHistoryCall(call)
                        }}>
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
        
        {/* Always show minimized call widget */}
        <CallInterface variant="minimized" />
      </>
    )
  }

  // If there's an active call and it's not minimized, show full call interface
  if (callState.isInCall && !callState.isCallMinimized) {
    return <CallInterface variant="full" />
  }

  // Regular dialer interface when not in call
  return (
    <div className="flex h-full flex-col sm:flex-row">
      {/* Dialer */}
      <div className={`p-4 sm:p-6 flex flex-col ${showRecentCalls ? 'sm:w-80 md:w-96 sm:border-r border-border' : 'w-full max-w-md mx-auto'}`}>
        {/* Number Display */}
        <div className="mb-8">
          <div className="light:bg-input-background rounded-lg p-4 min-h-[60px] flex items-center">
            <span className="text-2xl font-mono flex-1 text-center">
              {localDialedNumber || "Enter number"}
            </span>
            {localDialedNumber && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackspace}
                className="ml-2"
              >
                <Delete className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Dialpad */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {dialpadNumbers.map((item) => (
            <Button
              key={item.number}
              variant="outline"
              className="h-12 sm:h-16 flex flex-col items-center justify-center hover:bg-accent"
              onClick={() => handleDialpadClick(item.number)}
            >
              <span className="text-xl font-semibold">{item.number}</span>
              {item.letters && (
                <span className="text-xs text-muted-foreground">{item.letters}</span>
              )}
            </Button>
          ))}
        </div>

        {/* Call Button */}
        <Button
          className="w-full h-12 sm:h-14 bg-green-500 hover:bg-green-600 text-white rounded-full"
          onClick={handleCall}
          disabled={!localDialedNumber}
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Call
        </Button>
      </div>

      {/* Call History - Only show if showRecentCalls is true */}
      {showRecentCalls && (
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Recent Calls</h2>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {callHistory.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleHistoryCall(call)}
                >
                  <Avatar className="w-12 h-12">
                    {call.avatar ? (
                      <AvatarImage src={call.avatar} />
                    ) : null}
                    <AvatarFallback>
                      {call.name === "Unknown" ? "?" : call.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{call.name}</h3>
                      {call.type === 'incoming' && (
                        <Phone className="w-4 h-4 text-green-500 rotate-180" />
                      )}
                      {call.type === 'outgoing' && (
                        <Phone className="w-4 h-4 text-blue-500" />
                      )}
                      {call.type === 'missed' && (
                        <Phone className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{call.number}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{call.timestamp}</span>
                      {call.duration && (
                        <>
                          <span>•</span>
                          <span>{call.duration}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation()
                    handleHistoryCall(call)
                  }}>
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
