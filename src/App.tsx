import { useState } from "react"
import {Sidebar} from "@/components/Sidebar"
import {TopNavigation} from "@/components/TopNavigation"
import { ChatSection } from "@/components/ChatSection"
import {DialerSection} from "@/components/DialerSection"
import {ContactsSection} from "@/components/ContactsSection"
import {SettingsSection} from "@/components/SettingsSection"

export default function App() {
  const [activeSection, setActiveSection] = useState("chats")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <TopNavigation 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  )
}