import { useState, useRef } from "react"
import { ArrowLeft, Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, User, Play, Pause, Square, Volume2 } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ScrollArea } from "./ui/scroll-area"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  status: 'online' | 'busy' | 'offline'
  department: string
  title: string
}

interface CallRecord {
  id: string
  type: 'incoming' | 'outgoing' | 'missed'
  duration: string
  timestamp: string
  date: string
  isRecorded?: boolean
  recordingUrl?: string
  recordingDuration?: string
}

interface ContactHistory {
  contactId: string
  totalCalls: number
  totalDuration: string
  lastCall: string
  callRecords: CallRecord[]
}

interface ContactHistoryProps {
  contact: Contact
  history: ContactHistory
  onBack: () => void
}

export function ContactHistory({ contact, history, onBack }: ContactHistoryProps) {
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePlayRecording = async (recordingId: string, recordingUrl?: string) => {
    if (!recordingUrl || !audioRef.current) return

    if (playingRecordingId === recordingId) {
      // Stop current recording
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlayingRecordingId(null)
      setCurrentTime(0)
    } else {
      try {
        setIsLoading(true)
        
        // Stop any current recording
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
        
        // Load and play new recording
        audioRef.current.src = recordingUrl
        audioRef.current.load()
        
        setPlayingRecordingId(recordingId)
        await audioRef.current.play()
        setIsLoading(false)
      } catch (error) {
        console.error('Error playing audio:', error)
        setIsLoading(false)
        setPlayingRecordingId(null)
        // You could show a toast notification here
        alert('Unable to play recording. Please check if the audio file exists.')
      }
    }
  }

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(Math.floor(audioRef.current.currentTime))
    }
  }

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(Math.floor(audioRef.current.duration))
    }
  }

  const handleAudioEnded = () => {
    setPlayingRecordingId(null)
    setCurrentTime(0)
  }

  const handleAudioError = () => {
    console.error('Audio playback error')
    setPlayingRecordingId(null)
    setCurrentTime(0)
    setIsLoading(false)
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'incoming': return 'text-green-600'
      case 'outgoing': return 'text-blue-600'
      case 'missed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case 'incoming': return PhoneIncoming
      case 'outgoing': return PhoneOutgoing
      case 'missed': return PhoneMissed
      default: return Phone
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-red-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold">Contact History</h2>
        </div>

        {/* Contact Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src={contact.avatar} />
              <AvatarFallback className="text-lg font-medium">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(contact.status)} border-2 border-background rounded-full`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{contact.name}</h3>
            <p className="text-sm text-muted-foreground">{contact.title}</p>
            <p className="text-sm text-muted-foreground">{contact.department}</p>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-muted-foreground">{contact.email}</p>
              <p className="text-sm font-mono text-muted-foreground">{contact.phone}</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-blue-600">{history.totalCalls}</div>
            <div className="text-sm text-muted-foreground">Total Calls</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-green-600">{history.totalDuration}</div>
            <div className="text-sm text-muted-foreground">Total Duration</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-sm font-medium">{history.lastCall}</div>
            <div className="text-sm text-muted-foreground">Last Call</div>
          </div>
        </div>
      </div>

      {/* Call Records */}
      <div className="flex-1 p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Calls
        </h3>
        
        {history.callRecords.length > 0 ? (
          <ScrollArea className="h-full">
            <div className="space-y-3">
              {history.callRecords.map((record) => {
                const CallIcon = getCallTypeIcon(record.type)
                return (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-full bg-muted ${getCallTypeColor(record.type)}`}>
                        <CallIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`font-medium text-sm ${getCallTypeColor(record.type)}`}>
                            {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                            {record.type === 'missed' ? ' Call' : ` • ${record.duration}`}
                          </div>
                          {record.isRecorded && (
                            <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs">
                              <Volume2 className="w-3 h-3" />
                              <span>Recorded</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {record.date} at {record.timestamp}
                          {record.isRecorded && record.recordingDuration && (
                            <span className="ml-2">• Recording: {record.recordingDuration}</span>
                          )}
                        </div>
                        {record.isRecorded && playingRecordingId === record.id && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex-1 bg-muted rounded-full h-1 overflow-hidden">
                              <div 
                                className="bg-blue-500 h-full transition-all duration-300"
                                style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                              />
                            </div>
                            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {record.isRecorded && record.recordingUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handlePlayRecording(record.id, record.recordingUrl)}
                          title={playingRecordingId === record.id ? "Stop Recording" : "Play Recording"}
                          disabled={isLoading}
                        >
                          {isLoading && playingRecordingId === record.id ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                          ) : playingRecordingId === record.id ? (
                            <Square className="w-4 h-4 text-red-500" />
                          ) : (
                            <Play className="w-4 h-4 text-blue-500" />
                          )}
                        </Button>
                      )}
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-12">
              <Phone className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <h4 className="text-lg font-medium mb-2">No call history</h4>
              <p className="text-muted-foreground">No calls have been made with this contact yet.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Audio element for real audio playback */}
      <audio 
        ref={audioRef} 
        className="hidden"
        onTimeUpdate={handleAudioTimeUpdate}
        onLoadedMetadata={handleAudioLoadedMetadata}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        preload="metadata"
      />
    </div>
  )
}
