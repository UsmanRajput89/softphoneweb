import { useState } from "react"
import { Search, Bell, Settings, LogOut, User, Menu, Phone, X, Clock, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

interface TopNavigationProps {
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
  onOpenDialer?: () => void
  onLogout?: () => void
}

export const TopNavigation = ({ onToggleSidebar, onOpenDialer, onLogout }: TopNavigationProps) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "call",
      title: "Missed Call",
      message: "Sarah Wilson called you 5 minutes ago",
      time: "5 min ago",
      icon: Phone,
      unread: true
    },
    {
      id: "2", 
      type: "success",
      title: "Call Recording Ready",
      message: "Your call with Mike Johnson has been recorded and saved",
      time: "10 min ago",
      icon: CheckCircle,
      unread: true
    },
    {
      id: "3",
      type: "warning",
      title: "System Update",
      message: "A new software update is available for your softphone",
      time: "1 hour ago",
      icon: AlertTriangle,
      unread: false
    },
    {
      id: "4",
      type: "info",
      title: "New Contact Added",
      message: "Emily Chen has been added to your contacts",
      time: "2 hours ago", 
      icon: Info,
      unread: false
    },
    {
      id: "5",
      type: "call",
      title: "Incoming Call",
      message: "David Rodriguez tried to reach you",
      time: "3 hours ago",
      icon: Phone,
      unread: false
    },
    {
      id: "6",
      type: "info",
      title: "Meeting Reminder",
      message: "Team standup meeting starts in 15 minutes",
      time: "4 hours ago",
      icon: Info,
      unread: false
    },
    {
      id: "7",
      type: "success",
      title: "Backup Complete",
      message: "Your call history has been successfully backed up",
      time: "5 hours ago",
      icon: CheckCircle,
      unread: false
    },
    {
      id: "8",
      type: "warning",
      title: "Storage Warning",
      message: "Your call recordings storage is 85% full",
      time: "6 hours ago",
      icon: AlertTriangle,
      unread: false
    }
  ])

  const unreadCount = notifications.filter(n => n.unread).length

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'call': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
      case 'success': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
      case 'info': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, unread: false } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    )
  }
  return (
    <div className="h-14 sm:h-16 bg-card border-b border-border px-3 sm:px-6 flex items-center justify-between">
      {/* Left side with sidebar toggle */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-sm sm:max-w-md">
        {/* Sidebar Toggle Button */}
        {onToggleSidebar && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleSidebar}
            className="p-2 flex-shrink-0"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        )}
        
        {/* Search - Hidden on mobile */}
        <div className="flex-1 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search conversations, contacts..." 
              className="pl-10 bg-input-background border-0"
            />
          </div>
        </div>
        
        {/* Mobile Search Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 sm:hidden"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Dialer */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onOpenDialer}
          className="relative p-2"
          title="Open Dialer"
        >
          <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* Notifications */}
        <Popover open={showNotifications} onOpenChange={setShowNotifications}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 p-0 flex items-center justify-center text-xs bg-blue-500">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[90vw] sm:w-80 max-w-80 p-0 overflow-hidden" align="end">
            {/* Notification Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7 px-2"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List with contained scrolling */}
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <ScrollArea className="h-80 w-full">
                <div className="p-2">
                  {notifications.map((notification) => {
                    const IconComponent = notification.icon
                    return (
                      <div
                        key={notification.id}
                        className={`p-3 mb-1 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                          notification.unread ? 'bg-muted/50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-full flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                            <IconComponent className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium truncate">
                                {notification.title}
                              </p>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1 break-words">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {notification.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            )}

            {/* Notification Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border">
                <Button variant="ghost" className="w-full text-sm h-8">
                  View All Notifications
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 h-8 sm:h-10 p-1 sm:p-2">
              <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                <AvatarFallback className="text-xs">JD</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <div className="text-sm">John Doe</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
