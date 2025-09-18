import { useState } from "react"
import { Search, Phone, MessageCircle, Video, Plus, MoreHorizontal, X, User, Mail, Building, Briefcase, Info } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

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

interface ContactsSectionProps {
  onShowContactHistory?: (contact: Contact, history: ContactHistory) => void
}

export function ContactsSection({ onShowContactHistory }: ContactsSectionProps = {}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddContact, setShowAddContact] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    title: "",
    status: "offline" as const
  })

  // Sample call history data
  const contactHistories: ContactHistory[] = [
    {
      contactId: "1",
      totalCalls: 12,
      totalDuration: "2h 34m",
      lastCall: "2 hours ago",
      callRecords: [
        { 
          id: "1", 
          type: "outgoing", 
          duration: "15:32", 
          timestamp: "10:30 AM", 
          date: "Today",
          isRecorded: true,
          recordingUrl: "/recordings/dummy-voice.mp3",
          recordingDuration: "15:32"
        },
        { 
          id: "2", 
          type: "incoming", 
          duration: "8:45", 
          timestamp: "2:15 PM", 
          date: "Yesterday",
          isRecorded: false
        },
        { 
          id: "3", 
          type: "missed", 
          duration: "0:00", 
          timestamp: "9:22 AM", 
          date: "Yesterday",
          isRecorded: false
        },
        { 
          id: "4", 
          type: "outgoing", 
          duration: "22:18", 
          timestamp: "4:45 PM", 
          date: "Dec 16",
          isRecorded: true,
          recordingUrl: "/recordings/dummy-voice.mp3",
          recordingDuration: "22:18"
        },
        { 
          id: "5", 
          type: "incoming", 
          duration: "12:03", 
          timestamp: "11:30 AM", 
          date: "Dec 15",
          isRecorded: true,
          recordingUrl: "/recordings/dummy-voice.mp3",
          recordingDuration: "12:03"
        }
      ]
    },
    {
      contactId: "2",
      totalCalls: 8,
      totalDuration: "1h 12m",
      lastCall: "1 day ago",
      callRecords: [
        { 
          id: "6", 
          type: "incoming", 
          duration: "18:45", 
          timestamp: "3:20 PM", 
          date: "Yesterday",
          isRecorded: true,
          recordingUrl: "/recordings/dummy-voice.mp3",
          recordingDuration: "18:45"
        },
        { 
          id: "7", 
          type: "outgoing", 
          duration: "6:32", 
          timestamp: "10:15 AM", 
          date: "Dec 16",
          isRecorded: false
        },
        { 
          id: "8", 
          type: "missed", 
          duration: "0:00", 
          timestamp: "2:45 PM", 
          date: "Dec 15",
          isRecorded: false
        }
      ]
    },
    {
      contactId: "3",
      totalCalls: 5,
      totalDuration: "45m",
      lastCall: "3 days ago",
      callRecords: [
        { 
          id: "9", 
          type: "outgoing", 
          duration: "25:12", 
          timestamp: "1:30 PM", 
          date: "Dec 15",
          isRecorded: false
        },
        { 
          id: "10", 
          type: "incoming", 
          duration: "12:48", 
          timestamp: "9:45 AM", 
          date: "Dec 14",
          isRecorded: true,
          recordingUrl: "/recordings/dummy-voice.mp3",
          recordingDuration: "12:48"
        }
      ]
    }
  ]

  const contacts: Contact[] = [
    {
      id: "1",
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      phone: "+1 (555) 123-4567",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=40&h=40&fit=crop&crop=face",
      status: "online",
      department: "Marketing",
      title: "Marketing Manager"
    },
    {
      id: "2",
      name: "Mike Johnson",
      email: "mike.johnson@company.com", 
      phone: "+1 (555) 987-6543",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      status: "busy",
      department: "Engineering",
      title: "Senior Developer"
    },
    {
      id: "3",
      name: "Emily Chen",
      email: "emily.chen@company.com",
      phone: "+1 (555) 456-7890",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      status: "offline",
      department: "Design",
      title: "UX Designer"
    },
    {
      id: "4",
      name: "David Rodriguez",
      email: "david.rodriguez@company.com",
      phone: "+1 (555) 234-5678",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      status: "online",
      department: "Sales",
      title: "Sales Director"
    },
    {
      id: "5",
      name: "Lisa Thompson",
      email: "lisa.thompson@company.com",
      phone: "+1 (555) 345-6789",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
      status: "online",
      department: "HR",
      title: "HR Manager"
    },
    {
      id: "6",
      name: "Alex Turner",
      email: "alex.turner@company.com",
      phone: "+1 (555) 567-8901",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      status: "busy",
      department: "Engineering",
      title: "DevOps Engineer"
    },
    {
      id: "7",
      name: "Jessica Park",
      email: "jessica.park@company.com",
      phone: "+1 (555) 678-9012",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
      status: "online",
      department: "Design",
      title: "Product Designer"
    },
    {
      id: "8",
      name: "Robert Kim",
      email: "robert.kim@company.com",
      phone: "+1 (555) 789-0123",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face",
      status: "offline",
      department: "Finance",
      title: "Financial Analyst"
    },
    {
      id: "9",
      name: "Maria Garcia",
      email: "maria.garcia@company.com",
      phone: "+1 (555) 890-1234",
      avatar: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=40&h=40&fit=crop&crop=face",
      status: "online",
      department: "Marketing",
      title: "Content Manager"
    }
  ]

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-red-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Available'
      case 'busy': return 'Busy'
      case 'offline': return 'Offline'
      default: return 'Unknown'
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Adding contact:', formData)
    
    // Reset form and close modal
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      title: "",
      status: "offline"
    })
    setShowAddContact(false)
    
    // Show success message (you could use a toast library)
    alert('Contact added successfully!')
  }

  const handleShowContactHistory = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId)
    if (!contact || !onShowContactHistory) return

    const history = contactHistories.find(h => h.contactId === contactId) || {
      contactId,
      totalCalls: 0,
      totalDuration: "0m",
      lastCall: "Never",
      callRecords: []
    }

    onShowContactHistory(contact, history)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Contacts</h2>
          <Button 
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => setShowAddContact(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input-background border-0"
          />
        </div>
      </div>

      {/* Contacts Grid */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="group p-4 rounded-xl border border-border hover:border-border/80 hover:shadow-md transition-all duration-200 bg-card hover:bg-card/80"
              >
                {/* Header with Avatar and Status */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="text-sm font-medium">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${getStatusColor(contact.status)} border-2 border-background rounded-full`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
                    <Badge 
                      variant={contact.status === 'online' ? 'default' : 'secondary'} 
                      className="text-xs mt-1"
                    >
                      {getStatusText(contact.status)}
                    </Badge>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {contact.department}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{contact.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                  <p className="text-xs font-mono text-muted-foreground">{contact.phone}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-xs"
                    title="Call"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2"
                    title="Message"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2"
                    title="Video Call"
                  >
                    <Video className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2"
                    title="Contact History"
                    onClick={() => handleShowContactHistory(contact.id)}
                  >
                    <Info className="w-3 h-3" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        title="More Options"
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                      <DropdownMenuItem>Add to Favorites</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Contact
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredContacts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? `No results for "${searchQuery}"` : "Your contact list is empty"}
              </p>
              {!searchQuery && (
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Contact
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Add Contact Modal */}
      <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Add New Contact
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Department Field */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="department"
                  placeholder="Enter department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="title"
                  placeholder="Enter job title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddContact(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                disabled={!formData.name || !formData.email || !formData.phone}
              >
                Add Contact
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}