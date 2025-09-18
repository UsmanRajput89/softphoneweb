import { useState, useEffect } from "react"
import {Sidebar} from "@/components/Sidebar"
import {TopNavigation} from "@/components/TopNavigation"
import { ChatSection } from "@/components/ChatSection"
import {UnifiedDialer} from "@/components/UnifiedDialer"
import {ContactsSection} from "@/components/ContactsSection"
import { ContactHistory } from "@/components/ContactHistory"
import {SettingsSection} from "@/components/SettingsSection"
import { Login } from "@/components/Login"
import { Register } from "@/components/Register"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CallProvider, useCall } from "@/contexts/CallContext"
import { CallInterface } from "@/components/CallInterface"

// Define types for contact history
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

interface ContactHistoryData {
  contactId: string
  totalCalls: number
  totalDuration: string
  lastCall: string
  callRecords: CallRecord[]
}

function AppContent() {
  const [activeSection, setActiveSection] = useState("chats")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [globalDialerOpen, setGlobalDialerOpen] = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authView, setAuthView] = useState<'login' | 'register'>('login')
  const [showContactHistory, setShowContactHistory] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedContactHistory, setSelectedContactHistory] = useState<ContactHistoryData | null>(null)
  const { callState, setNavigationCallback, handleSectionChange } = useCall()

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleRegister = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAuthView('login')
  }

  const handleShowContactHistory = (contact: Contact, history: ContactHistoryData) => {
    setSelectedContact(contact)
    setSelectedContactHistory(history)
    setShowContactHistory(true)
  }

  const handleBackToContacts = () => {
    setShowContactHistory(false)
    setSelectedContact(null)
    setSelectedContactHistory(null)
  }

  // Set up navigation callback for call context
  useEffect(() => {
    setNavigationCallback((action: string) => {
      if (action === 'close-global-dialer') {
        setGlobalDialerOpen(false)
      } else {
        setActiveSection(action)
        setGlobalDialerOpen(false) // Close global dialer if open
      }
    })
  }, [setNavigationCallback])

  // Handle section changes for auto-minimize functionality
  const handleSectionChangeWithAutoMinimize = (section: string) => {
    handleSectionChange(section) // Auto-minimize/maximize logic
    setActiveSection(section)
    setSidebarHidden(true) // Auto-hide sidebar on mobile after selection
  }

  // Monitor activeSection changes for auto-minimize (handles all navigation methods)
  useEffect(() => {
    handleSectionChange(activeSection)
  }, [activeSection, handleSectionChange])

  const renderActiveSection = () => {
    // Show contact history if active
    if (showContactHistory && selectedContact && selectedContactHistory) {
      return (
        <ContactHistory 
          contact={selectedContact}
          history={selectedContactHistory}
          onBack={handleBackToContacts}
        />
      )
    }

    switch (activeSection) {
      case "chats":
        return <ChatSection />
      case "dialer":
        return <UnifiedDialer />
      case "contacts":
        return <ContactsSection onShowContactHistory={handleShowContactHistory} />
      case "settings":
        return <SettingsSection />
      default:
        return <ChatSection />
    }
  }

  // Show authentication screens if not authenticated
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthView('register')}
        />
      )
    } else {
      return (
        <Register 
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthView('login')}
        />
      )
    }
  }

  return (
    <div className="h-screen bg-background flex relative">
      {/* Mobile Sidebar Overlay */}
      {!sidebarHidden && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarHidden(true)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${
        sidebarHidden ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      } fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChangeWithAutoMinimize}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <TopNavigation 
          onToggleSidebar={() => {
            // On mobile, toggle sidebar visibility; on desktop, toggle collapse
            if (window.innerWidth < 1024) {
              setSidebarHidden(!sidebarHidden)
            } else {
              setSidebarCollapsed(!sidebarCollapsed)
            }
          }}
          onOpenDialer={() => setGlobalDialerOpen(true)}
          onLogout={handleLogout}
        />
        
        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {renderActiveSection()}
        </div>
      </div>

      {/* Global Dialer Modal */}
      <Dialog open={globalDialerOpen} onOpenChange={setGlobalDialerOpen}>
        <DialogContent className="max-w-md max-h-[90vh] w-[90vw] sm:w-full p-0">
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <DialogTitle>Dialer</DialogTitle>
          </DialogHeader>
          <div className="h-[500px] sm:h-[600px] overflow-hidden">
            <UnifiedDialer showRecentCalls={false} isGlobalDialer={true} />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Global Call Widget - Show minimized call when not on dialer section */}
      {callState.isInCall && callState.isCallMinimized && activeSection !== 'dialer' && (
        <CallInterface variant="minimized" />
      )}
      </div>
  )
}

export default function App() {
  return (
    <CallProvider>
      <AppContent />
    </CallProvider>
  )
}