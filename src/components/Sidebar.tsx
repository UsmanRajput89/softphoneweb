import { MessageCircle, Phone, Users, Settings, PhoneCall } from "lucide-react"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  collapsed: boolean
  onToggleCollapsed: () => void
}

export const Sidebar = ({ activeSection, onSectionChange, collapsed, onToggleCollapsed }: SidebarProps) => {
  const navItems = [
    { id: 'chats', label: 'Chats', icon: MessageCircle },
    { id: 'dialer', label: 'Dialer', icon: Phone },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className={`bg-card border-r border-border h-full flex flex-col transition-all duration-300 ease-in-out ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo */}
      <div className={`border-b border-border transition-all duration-300 ${
        collapsed ? 'p-3' : 'p-6'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <PhoneCall className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <h1 className="text-xl font-semibold transition-opacity duration-300 opacity-100">
              SoftPhone
            </h1>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            
            const buttonContent = (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full h-11 transition-all duration-300 ${
                  collapsed ? 'justify-center px-2' : 'justify-start gap-3'
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="transition-opacity duration-300 opacity-100">
                    {item.label}
                  </span>
                )}
              </Button>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    {buttonContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return buttonContent
          })}
        </div>
      </nav>
    </div>
  )
}

