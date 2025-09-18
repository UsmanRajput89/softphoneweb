import { useState, useEffect } from "react"
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  PhoneForwarded, 
  Users, 
  Volume2, 
  VolumeX,
  Square,
  Circle,
  Maximize2,
  Minimize2,
  X,
  Delete
} from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { useCall } from "@/contexts/CallContext"

interface CallInterfaceProps {
  variant?: 'full' | 'minimized'
}

export function CallInterface({ variant = 'full' }: CallInterfaceProps) {
  const [dtmfInput, setDtmfInput] = useState("")
  const { 
    callState, 
    endCall, 
    toggleMute, 
    toggleHold, 
    toggleSpeaker, 
    toggleRecording, 
    toggleInCallDialer,
    toggleCallMinimized,
    maximizeCall,
    formatCallDuration 
  } = useCall()

  // Handle keyboard input for DTMF when dialer is open
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle DTMF when in-call dialer is open
      if (!callState.showInCallDialer || (event.target as HTMLElement)?.tagName === 'INPUT') return
      
      const key = event.key

      // Handle numeric keys and special characters
      if (/^[0-9*#]$/.test(key)) {
        event.preventDefault()
        setDtmfInput(prev => prev + key)
        console.log(`DTMF tone sent: ${key}`)
      }
      // Handle backspace
      else if (key === 'Backspace') {
        event.preventDefault()
        setDtmfInput(prev => prev.slice(0, -1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [callState.showInCallDialer])

  if (!callState.isInCall) return null

  if (variant === 'minimized') {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl p-4 min-w-80 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={callState.callerAvatar} />
              <AvatarFallback>
                {callState.callerName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{callState.callerName}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant={callState.isOnHold ? "secondary" : "default"} className="text-xs px-2 py-0">
                  {callState.isOnHold ? "Hold" : "Live"}
                </Badge>
                <span className="font-mono">{formatCallDuration(callState.callDuration)}</span>
                {callState.isRecording && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant={callState.isMuted ? "destructive" : "ghost"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={toggleMute}
                title={callState.isMuted ? "Unmute" : "Mute"}
              >
                {callState.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={maximizeCall}
                title="Expand Call"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={endCall}
                title="End Call"
              >
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Full-screen call interface
  return (
    <div className="flex h-full bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
      {/* Main Call Interface */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Call Header */}
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <div className="text-center mb-8">
            <Avatar className="w-32 h-32 mx-auto mb-4">
              <AvatarImage src={callState.callerAvatar} />
              <AvatarFallback className="text-2xl">
                {callState.callerName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold mb-2">{callState.callerName}</h2>
            <p className="text-muted-foreground mb-2">{callState.dialedNumber}</p>
            <div className="flex items-center justify-center gap-3">
              <Badge variant={callState.isOnHold ? "secondary" : "default"}>
                {callState.isOnHold ? "On Hold" : "Connected"}
              </Badge>
              <span className="text-lg font-mono text-muted-foreground">
                {formatCallDuration(callState.callDuration)}
              </span>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center gap-6 mb-6">
            <Button
              variant={callState.isMuted ? "destructive" : "secondary"}
              size="lg"
              className="w-16 h-16 rounded-full"
              onClick={toggleMute}
              title={callState.isMuted ? "Unmute" : "Mute"}
            >
              {callState.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            
            <Button
              variant={callState.isOnHold ? "default" : "secondary"}
              size="lg"
              className="w-16 h-16 rounded-full"
              onClick={toggleHold}
              title={callState.isOnHold ? "Resume" : "Hold"}
            >
              {callState.isOnHold ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              className="w-20 h-20 rounded-full"
              onClick={endCall}
              title="End Call"
            >
              <PhoneOff className="w-8 h-8" />
            </Button>

            <Button
              variant={callState.isSpeakerOn ? "default" : "secondary"}
              size="lg"
              className="w-16 h-16 rounded-full"
              onClick={toggleSpeaker}
              title={callState.isSpeakerOn ? "Speaker Off" : "Speaker On"}
            >
              {callState.isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </Button>

            <Button
              variant={callState.isRecording ? "destructive" : "secondary"}
              size="lg"
              className="w-16 h-16 rounded-full"
              onClick={toggleRecording}
              title={callState.isRecording ? "Stop Recording" : "Start Recording"}
            >
              {callState.isRecording ? <Square className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant={callState.showInCallDialer ? "default" : "outline"}
              onClick={toggleInCallDialer}
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

            <Button 
              variant="outline" 
              className="gap-2"
              onClick={toggleCallMinimized}
              title="Minimize Call (Q)"
            >
              <Minimize2 className="w-4 h-4" />
              Minimize
            </Button>
          </div>
        </div>
      </div>

      {/* In-Call Dialer - Bottom Sliding Panel */}
      {callState.showInCallDialer && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-300"
            onClick={toggleInCallDialer}
          />
          {/* Dialer Panel */}
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
            <div className="max-w-2xl mx-auto">
              {/* Drag Handle */}
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-12 h-1 bg-muted-foreground/30 rounded-full"></div>
              </div>
              
              <div className="p-4 border-b border-border flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Send DTMF Tones</h3>
                  <p className="text-sm text-muted-foreground">Use dialer to send tones during call</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleInCallDialer}
                  className="hover:bg-accent"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="p-6">
                {/* Number Display for DTMF */}
                <div className="mb-6">
                  <div className="bg-muted rounded-lg p-4 min-h-[50px] flex items-center">
                    <span className="text-xl font-mono flex-1 text-center">
                      {dtmfInput || "Enter digits..."}
                    </span>
                    {dtmfInput && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDtmfInput("")}
                        className="ml-2"
                      >
                        <Delete className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Dialpad - Compact grid for bottom panel */}
                <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <Button
                      key={digit}
                      variant="outline"
                      className="h-12 flex flex-col items-center justify-center hover:bg-accent"
                      onClick={() => {
                        setDtmfInput(prev => prev + digit)
                        // Send DTMF tone
                        console.log(`DTMF tone sent: ${digit}`)
                      }}
                    >
                      <span className="text-lg font-semibold">{digit}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
