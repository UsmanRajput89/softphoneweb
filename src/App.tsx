import { useState } from "react"
import {Sidebar} from "@/components/Sidebar"
import {TopNavigation} from "@/components/TopNavigation"
import { ChatSection } from "@/components/ChatSection"
import {DialerSection} from "@/components/DialerSection"
import {ContactsSection} from "@/components/ContactsSection"
import {SettingsSection} from "@/components/SettingsSection"
import { Login } from "@/components/Login"
import { Register } from "@/components/Register"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function App() {
  const [activeSection, setActiveSection] = useState("chats")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [globalDialerOpen, setGlobalDialerOpen] = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authView, setAuthView] = useState<'login' | 'register'>('login')

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

  const renderActiveSection = () => {
    switch (activeSection) {
      case "chats":
        return <ChatSection />
      case "dialer":
        return <DialerSection />
      case "contacts":
        return <ContactsSection />
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
          onSectionChange={(section) => {
            setActiveSection(section)
            setSidebarHidden(true) // Auto-hide sidebar on mobile after selection
          }}
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
            <DialerSection showRecentCalls={false} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}