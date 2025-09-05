export interface SidebarMenuItem {
  icon: React.ForwardRefExoticComponent<any>;
  text: string;
  href: string;
  badge?: string | number;
}