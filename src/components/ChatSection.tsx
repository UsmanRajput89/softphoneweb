import { useState } from "react"
import { Search, Phone, Video, MoreHorizontal, Send, Paperclip, Smile } from "lucide-react"
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
}

export function ChatSection() {
  const [selectedChat, setSelectedChat] = useState<string>("1")
  const [newMessage, setNewMessage] = useState("")

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
    { id: "1", sender: "other", content: "Hey! How's the project coming along?", timestamp: "10:30 AM" },
    { id: "2", sender: "me", content: "Going well! Just finished the wireframes.", timestamp: "10:32 AM" },
    { id: "3", sender: "other", content: "That's awesome! Can you share them?", timestamp: "10:33 AM" },
    { id: "4", sender: "me", content: "Sure thing! I'll send them over in a few minutes.", timestamp: "10:35 AM" },
    { id: "5", sender: "other", content: "Thanks for the quick response!", timestamp: "10:36 AM" }
  ]

  const selectedChatData = chats.find(chat => chat.id === selectedChat)

  return (
    <div className="flex h-full">
      {/* Chat List */}
      <div className="border-r border-border flex flex-col">
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
                onClick={() => setSelectedChat(chat.id)}
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
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedChatData.avatar} />
                  <AvatarFallback>{selectedChatData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedChatData.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedChatData.online ? 'Online' : 'Last seen 2h ago'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'me'
                          ? 'bg-blue-500 text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'me' ? 'text-blue-100' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="pr-10 bg-input-background border-0"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600">
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