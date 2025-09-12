import { useState } from "react"
import { Search, Phone, Video, MoreHorizontal, Send, Paperclip, Smile, MessageSquare, Mail, Smartphone, Globe, Headphones, Check, CheckCheck, ArrowLeft, Menu } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

interface Message {
  id: string
  sender: 'me' | 'other'
  content: string
  timestamp: string
  source: 'sms' | 'email' | 'web' | 'app' | 'call' | 'whatsapp'
  status?: 'sending' | 'sent' | 'delivered' | 'read'
  sourceInfo?: string
}

export function ChatSection() {
  const [selectedChat, setSelectedChat] = useState<string>("1")
  const [newMessage, setNewMessage] = useState("")
  const [showChatList, setShowChatList] = useState(false)

  const chats: Chat[] = [
    {
      id: "1",
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Thanks for the quick response!",
      timestamp: "2m ago",
      unread: 2,
      online: true
    },
    {
      id: "2", 
      name: "Marketing Team",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Let's schedule a meeting for tomorrow",
      timestamp: "15m ago",
      unread: 0,
      online: false
    },
    {
      id: "3",
      name: "Mike Johnson", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      lastMessage: "The project looks great!",
      timestamp: "1h ago",
      unread: 1,
      online: true
    }
  ]

  const messages: Message[] = [
    { 
      id: "1", 
      sender: "other", 
      content: "Hey! How's the project coming along?", 
      timestamp: "10:30 AM", 
      source: "sms",
      status: "read",
      sourceInfo: "SMS from +1 (555) 123-4567"
    },
    { 
      id: "2", 
      sender: "me", 
      content: "Going well! Just finished the wireframes.", 
      timestamp: "10:32 AM", 
      source: "app",
      status: "delivered",
      sourceInfo: "Mobile App"
    },
    { 
      id: "3", 
      sender: "other", 
      content: "That's awesome! Can you share them?", 
      timestamp: "10:33 AM", 
      source: "whatsapp",
      status: "read",
      sourceInfo: "WhatsApp Business"
    },
    { 
      id: "4", 
      sender: "me", 
      content: "Sure thing! I'll send them over in a few minutes.", 
      timestamp: "10:35 AM", 
      source: "web",
      status: "read",
      sourceInfo: "Web Portal"
    },
    { 
      id: "5", 
      sender: "other", 
      content: "Thanks for the quick response!", 
      timestamp: "10:36 AM", 
      source: "email",
      status: "read",
      sourceInfo: "Email from sarah@company.com"
    },
    { 
      id: "6", 
      sender: "me", 
      content: "No problem! Always happy to help.", 
      timestamp: "10:38 AM", 
      source: "call",
      status: "sent",
      sourceInfo: "Voice message transcription"
    }
  ]

  const selectedChatData = chats.find(chat => chat.id === selectedChat)

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'sms': return Smartphone
      case 'email': return Mail
      case 'web': return Globe
      case 'app': return MessageSquare
      case 'call': return Headphones
      case 'whatsapp': return MessageSquare
      default: return MessageSquare
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'sms': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'email': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
      case 'web': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20'
      case 'app': return 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20'
      case 'call': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20'
      case 'whatsapp': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'sent': return Check
      case 'delivered': return CheckCheck
      case 'read': return CheckCheck
      default: return null
    }
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'sent': return 'text-gray-400'
      case 'delivered': return 'text-gray-400'
      case 'read': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="flex h-full relative">
      {/* Mobile Chat List Overlay */}
      {showChatList && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setShowChatList(false)}
        />
      )}
      
      {/* Chat List */}
      <div className={`${
        showChatList ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
      } fixed sm:static inset-y-0 left-0 w-80 md:w-96 lg:w-80 xl:w-96 border-r border-border flex flex-col flex-shrink-0 z-50 sm:z-auto transition-transform duration-300 ease-in-out bg-background`}>
        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search chats..." 
              className="pl-10 bg-input-background border-0"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                  selectedChat === chat.id ? 'bg-accent' : ''
                }`}
                onClick={() => {
                  setSelectedChat(chat.id)
                  setShowChatList(false) // Close mobile chat list
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs">{chat.unread}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile Chat List Toggle */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="sm:hidden p-2"
                  onClick={() => setShowChatList(true)}
                >
                  <Menu className="w-4 h-4" />
                </Button>
                
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                  <AvatarImage src={selectedChatData.avatar} />
                  <AvatarFallback>{selectedChatData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-medium text-sm sm:text-base truncate">{selectedChatData.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {selectedChatData.online ? 'Online' : 'Last seen 2h ago'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-10 sm:w-10">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-10 sm:w-10">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-10 sm:w-10">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 sm:p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const SourceIcon = getSourceIcon(message.source)
                  const StatusIcon = getStatusIcon(message.status)
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                        {/* Source indicator */}
                        <div className={`flex items-center gap-2 mb-1 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getSourceColor(message.source)}`}>
                            <SourceIcon className="w-3 h-3" />
                            <span className="capitalize">{message.source}</span>
                          </div>
                          {message.sourceInfo && (
                            <span className="text-xs text-muted-foreground" title={message.sourceInfo}>
                              {message.source === 'email' ? '' : 
                               message.source === 'sms' ? '' : 
                               message.source === 'whatsapp' ? '' : 
                               message.source === 'call' ? '' : 
                               message.source === 'web' ? '' : ''}
                            </span>
                          )}
                        </div>
                        
                        {/* Message bubble */}
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            message.sender === 'me'
                              ? 'bg-blue-500 text-white'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          
                          {/* Timestamp and status */}
                          <div className={`flex items-center gap-2 mt-1 ${
                            message.sender === 'me' ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className={`text-xs ${
                              message.sender === 'me' ? 'text-blue-100' : 'text-muted-foreground'
                            }`}>
                              {message.timestamp}
                            </span>
                            
                            {/* Status indicator for sent messages */}
                            {message.sender === 'me' && StatusIcon && (
                              <StatusIcon className={`w-3 h-3 ${getStatusColor(message.status)}`} />
                            )}
                          </div>
                        </div>
                        
                        {/* Source info tooltip */}
                        {message.sourceInfo && (
                          <div className={`text-xs text-muted-foreground mt-1 ${
                            message.sender === 'me' ? 'text-right' : 'text-left'
                          }`}>
                            {message.sourceInfo}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-3 sm:p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="pr-10 bg-input-background border-0 text-sm sm:text-base"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8"
                  >
                    <Smile className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  )
}