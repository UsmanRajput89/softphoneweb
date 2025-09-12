import { useState, useEffect } from "react"
import { 
  Phone, 
  PhoneOff, 
  Clock, 
  Video, 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  PhoneForwarded, 
  Users, 
  Volume2, 
  VolumeX
} from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"

interface CallRecord {
  id: string
  name: string
  number: string
  avatar: string
  type: 'incoming' | 'outgoing' | 'missed'
  duration: string
  timestamp: string
}

interface DialerSectionProps {
  showRecentCalls?: boolean
}

export function DialerSection({ showRecentCalls = true }: DialerSectionProps) {
  const [dialedNumber, setDialedNumber] = useState("")
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isOnHold, setIsOnHold] = useState(false)
  const [showInCallDialer, setShowInCallDialer] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)

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
    setDialedNumber(prev => prev + value)
  }

  const handleCall = () => {
    if (dialedNumber) {
      setIsInCall(true)
    }
  }

  const handleEndCall = () => {
    setIsInCall(false)
    setDialedNumber("")
    setCallDuration(0)
    setIsOnHold(false)
    setShowInCallDialer(false)
  }

  const formatCallDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleInCallDialpadClick = (value: string) => {
    setDialedNumber(prev => prev + value)
    // Here you would typically send DTMF tone
    console.log(`DTMF tone sent: ${value}`)
  }

  // Call timer effect
  useEffect(() => {
    let interval: number | undefined
    if (isInCall && !isOnHold) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isInCall, isOnHold])

  const handleBackspace = () => {
    setDialedNumber(prev => prev.slice(0, -1))
  }

  // Handle keyboard input for dialer and call screen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle call screen shortcuts
      if (isInCall) {
        // Only handle if not typing in an input field
        if ((event.target as HTMLElement)?.tagName === 'INPUT') return
        
        switch (event.key.toLowerCase()) {
          case 'm':
            event.preventDefault()
            setIsMuted(!isMuted)
            break
          case 'h':
            event.preventDefault()
            setIsOnHold(!isOnHold)
            break
          case 's':
            event.preventDefault()
            setIsSpeakerOn(!isSpeakerOn)
            break
          case 'd':
            event.preventDefault()
            setShowInCallDialer(!showInCallDialer)
            break
          case 'escape':
            event.preventDefault()
            handleEndCall()
            break
          default:
            // Handle DTMF tones when in-call dialer is open
            if (showInCallDialer && /^[0-9*#]$/.test(event.key)) {
              event.preventDefault()
              handleInCallDialpadClick(event.key)
            }
            break
        }
        return
      }

      const key = event.key

      // Handle numeric keys (0-9)
      if (/^[0-9]$/.test(key)) {
        event.preventDefault()
        setDialedNumber(prev => prev + key)
      }
      // Handle special characters (* and #)
      else if (key === '*' || key === '#') {
        event.preventDefault()
        setDialedNumber(prev => prev + key)
      }
      // Handle backspace
      else if (key === 'Backspace') {
        event.preventDefault()
        setDialedNumber(prev => prev.slice(0, -1))
      }
      // Handle Enter key to initiate call
      else if (key === 'Enter') {
        event.preventDefault()
        if (dialedNumber) {
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
  }, [isInCall, dialedNumber, isMuted, isOnHold, isSpeakerOn, showInCallDialer]) // Dependencies for keyboard shortcuts

  if (isInCall) {
    return (
      <div className="flex h-full bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        {/* Main Call Interface */}
        <div className="flex-1 flex flex-col">
          {/* Call Header */}
          <div className="flex flex-col items-center justify-center flex-1 p-8">
            <div className="text-center mb-8">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=128&h=128&fit=crop&crop=face" />
                <AvatarFallback className="text-2xl">SW</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold mb-2">Sarah Wilson</h2>
              <p className="text-muted-foreground mb-2">{dialedNumber}</p>
              <div className="flex items-center justify-center gap-3">
                <Badge variant={isOnHold ? "secondary" : "default"}>
                  {isOnHold ? "On Hold" : "Connected"}
                </Badge>
                <span className="text-lg font-mono text-muted-foreground">
                  {formatCallDuration(callDuration)}
                </span>
              </div>
            </div>

            {/* Primary Controls */}
            <div className="flex items-center gap-6 mb-6">
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="lg"
                className="w-16 h-16 rounded-full"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              
              <Button
                variant={isOnHold ? "default" : "secondary"}
                size="lg"
                className="w-16 h-16 rounded-full"
                onClick={() => setIsOnHold(!isOnHold)}
                title={isOnHold ? "Resume" : "Hold"}
              >
                {isOnHold ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                className="w-20 h-20 rounded-full"
                onClick={handleEndCall}
                title="End Call"
              >
                <PhoneOff className="w-8 h-8" />
              </Button>

              <Button
                variant={isSpeakerOn ? "default" : "secondary"}
                size="lg"
                className="w-16 h-16 rounded-full"
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                title={isSpeakerOn ? "Speaker Off" : "Speaker On"}
              >
                {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="w-16 h-16 rounded-full"
                title="Video Call"
              >
                <Video className="w-6 h-6" />
              </Button>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant={showInCallDialer ? "default" : "outline"}
                onClick={() => setShowInCallDialer(!showInCallDialer)}
                className="gap-2"
              >
                <Phone className="w-4 h-4" />
                Dialer
              </Button>

              <Button variant="outline" className="gap-2">
                <PhoneForwarded className="w-4 h-4" />
                Transfer
              </Button>

              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Merge
              </Button>
            </div>
          </div>
        </div>

        {/* In-Call Dialer - Reuse our existing dialer component */}
        {showInCallDialer && (
          <div className="w-96 border-l border-border bg-card/50">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Send DTMF Tones</h3>
              <p className="text-sm text-muted-foreground">Use dialer to send tones during call</p>
            </div>
            
            <div className="p-6">
              {/* Number Display for DTMF */}
              <div className="mb-8">
                <div className="bg-background rounded-lg p-4 min-h-[60px] flex items-center">
                  <span className="text-2xl font-mono flex-1 text-center">
                    {dialedNumber || "Enter digits..."}
                  </span>
                  {dialedNumber && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDialedNumber(prev => prev.slice(0, -1))}
                      className="ml-2"
                    >
                      ←
                    </Button>
                  )}
                </div>
              </div>

              {/* Dialpad - Reuse existing */}
              <div className="grid grid-cols-3 gap-4">
                {dialpadNumbers.map((item) => (
                  <Button
                    key={item.number}
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center hover:bg-accent"
                    onClick={() => handleInCallDialpadClick(item.number)}
                  >
                    <span className="text-xl font-semibold">{item.number}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col sm:flex-row">
      {/* Dialer */}
      <div className={`p-4 sm:p-6 flex flex-col ${showRecentCalls ? 'sm:w-80 md:w-96 sm:border-r border-border' : 'w-full max-w-md mx-auto'}`}>
        {/* Number Display */}
        <div className="mb-8">
          <div className="light:bg-input-background rounded-lg p-4 min-h-[60px] flex items-center">
            <span className="text-2xl font-mono flex-1 text-center">
              {dialedNumber || "Enter number"}
            </span>
            {dialedNumber && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackspace}
                className="ml-2"
              >
                ←
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
          disabled={!dialedNumber}
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

                  <Button variant="ghost" size="sm">
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