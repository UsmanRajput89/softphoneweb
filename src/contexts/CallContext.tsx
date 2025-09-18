import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CallState {
  isInCall: boolean
  dialedNumber: string
  isMuted: boolean
  isOnHold: boolean
  showInCallDialer: boolean
  callDuration: number
  isSpeakerOn: boolean
  isRecording: boolean
  isCallMinimized: boolean
  callerName: string
  callerAvatar: string
}

interface CallContextType {
  // Call state
  callState: CallState
  
  // Call actions
  initiateCall: (number: string, name?: string, avatar?: string) => void
  endCall: () => void
  toggleMute: () => void
  toggleHold: () => void
  toggleSpeaker: () => void
  toggleRecording: () => void
  toggleInCallDialer: () => void
  toggleCallMinimized: () => void
  maximizeCall: () => void
  updateDialedNumber: (number: string) => void
  
  // Navigation callback
  setNavigationCallback: (callback: (section: string) => void) => void
  
  // Auto-minimize functionality
  handleSectionChange: (newSection: string) => void
  
  // Utility functions
  formatCallDuration: (seconds: number) => string
}

const defaultCallState: CallState = {
  isInCall: false,
  dialedNumber: '',
  isMuted: false,
  isOnHold: false,
  showInCallDialer: false,
  callDuration: 0,
  isSpeakerOn: false,
  isRecording: false,
  isCallMinimized: false,
  callerName: '',
  callerAvatar: ''
}

const CallContext = createContext<CallContextType | undefined>(undefined)

export const useCall = () => {
  const context = useContext(CallContext)
  if (!context) {
    throw new Error('useCall must be used within a CallProvider')
  }
  return context
}

interface CallProviderProps {
  children: ReactNode
}

export const CallProvider = ({ children }: CallProviderProps) => {
  const [callState, setCallState] = useState<CallState>(defaultCallState)
  const [navigationCallback, setNavigationCallback] = useState<((section: string) => void) | null>(null)

  const formatCallDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const initiateCall = (number: string, name?: string, avatar?: string) => {
    setCallState(prev => ({
      ...prev,
      isInCall: true,
      dialedNumber: number,
      callerName: name || 'Unknown',
      callerAvatar: avatar || '',
      callDuration: 0,
      isCallMinimized: false
    }))
  }

  const endCall = () => {
    setCallState(defaultCallState)
  }

  const toggleMute = () => {
    setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }))
  }

  const toggleHold = () => {
    setCallState(prev => ({ ...prev, isOnHold: !prev.isOnHold }))
  }

  const toggleSpeaker = () => {
    setCallState(prev => ({ ...prev, isSpeakerOn: !prev.isSpeakerOn }))
  }

  const toggleRecording = () => {
    setCallState(prev => ({ ...prev, isRecording: !prev.isRecording }))
  }

  const toggleInCallDialer = () => {
    setCallState(prev => ({ ...prev, showInCallDialer: !prev.showInCallDialer }))
  }

  const toggleCallMinimized = () => {
    const newMinimizedState = !callState.isCallMinimized
    setCallState(prev => ({ ...prev, isCallMinimized: newMinimizedState }))
    
    // Close global dialer when minimizing call
    if (newMinimizedState && navigationCallback) {
      navigationCallback('close-global-dialer')
    }
  }

  const maximizeCall = () => {
    setCallState(prev => ({ ...prev, isCallMinimized: false }))
    // Navigate to dialer section when maximizing call
    if (navigationCallback) {
      navigationCallback('dialer')
    }
  }

  const updateDialedNumber = (number: string) => {
    setCallState(prev => ({ ...prev, dialedNumber: number }))
  }

  const setNavigationCallbackFn = (callback: (section: string) => void) => {
    setNavigationCallback(() => callback)
  }

  const handleSectionChange = (newSection: string) => {
    // Auto-minimize call when navigating away from dialer section
    if (callState.isInCall && !callState.isCallMinimized && newSection !== 'dialer') {
      setCallState(prev => ({ ...prev, isCallMinimized: true }))
    }
    // Auto-maximize call when navigating back to dialer section
    else if (callState.isInCall && callState.isCallMinimized && newSection === 'dialer') {
      setCallState(prev => ({ ...prev, isCallMinimized: false }))
    }
  }

  // Call timer effect
  useEffect(() => {
    let interval: number | undefined
    if (callState.isInCall && !callState.isOnHold) {
      interval = setInterval(() => {
        setCallState(prev => ({ ...prev, callDuration: prev.callDuration + 1 }))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [callState.isInCall, callState.isOnHold])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!callState.isInCall) return
      
      // Only handle if not typing in an input field
      if ((event.target as HTMLElement)?.tagName === 'INPUT') return
      
      switch (event.key.toLowerCase()) {
        case 'm':
          event.preventDefault()
          toggleMute()
          break
        case 'h':
          event.preventDefault()
          toggleHold()
          break
        case 's':
          event.preventDefault()
          toggleSpeaker()
          break
        case 'd':
          event.preventDefault()
          toggleInCallDialer()
          break
        case 'r':
          event.preventDefault()
          toggleRecording()
          break
        case 'q':
          event.preventDefault()
          toggleCallMinimized()
          break
        case 'escape':
          event.preventDefault()
          if (callState.showInCallDialer) {
            toggleInCallDialer()
          } else {
            endCall()
          }
          break
        default:
          // Handle DTMF tones when in-call dialer is open
          if (callState.showInCallDialer && /^[0-9*#]$/.test(event.key)) {
            event.preventDefault()
            updateDialedNumber(callState.dialedNumber + event.key)
            console.log(`DTMF tone sent: ${event.key}`)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [callState])

  const contextValue: CallContextType = {
    callState,
    initiateCall,
    endCall,
    toggleMute,
    toggleHold,
    toggleSpeaker,
    toggleRecording,
    toggleInCallDialer,
    toggleCallMinimized,
    maximizeCall,
    updateDialedNumber,
    setNavigationCallback: setNavigationCallbackFn,
    handleSectionChange,
    formatCallDuration
  }

  return (
    <CallContext.Provider value={contextValue}>
      {children}
    </CallContext.Provider>
  )
}
