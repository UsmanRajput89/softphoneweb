import { ComponentType } from 'react';

declare module '@/components/Sidebar' {
  interface SidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
    collapsed: boolean;
    onToggleCollapsed: () => void;
  }
  const Sidebar: ComponentType<SidebarProps>;
  export default Sidebar;
}

declare module '@/components/TopNavigation' {
  interface TopNavigationProps {
    sidebarCollapsed?: boolean;
    onToggleSidebar?: () => void;
  }
  const TopNavigation: ComponentType<TopNavigationProps>;
  export default TopNavigation;
}

declare module '@/components/ChatSection' {
  const ChatSection: ComponentType<{}>;
  export default ChatSection;
}

declare module '@/components/DialerSection' {
  const DialerSection: ComponentType<{}>;
  export default DialerSection;
}

declare module '@/components/ContactsSection' {
  const ContactsSection: ComponentType<{}>;
  export default ContactsSection;
}

declare module '@/components/SettingsSection' {
  const SettingsSection: ComponentType<{}>;
  export default SettingsSection;
}
