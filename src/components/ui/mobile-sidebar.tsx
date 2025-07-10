import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";

interface MobileSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the sidebar is collapsed on desktop
   */
  isCollapsed?: boolean;
  /**
   * Function to toggle the collapsed state on desktop
   */
  onCollapseToggle?: () => void;
  /**
   * Whether the sidebar is open on mobile
   */
  isOpen?: boolean;
  /**
   * Function to toggle the open state on mobile
   */
  onOpenToggle?: () => void;
  /**
   * If the sidebar is a mobile version with slide-over behavior
   */
  isMobileSidebar?: boolean;
  /**
   * Side of the screen the sidebar should be on
   */
  side?: "left" | "right";
}

const MobileSidebar = React.forwardRef<HTMLDivElement, MobileSidebarProps>(
  ({ 
    className,
    children,
    isCollapsed = false,
    onCollapseToggle,
    isOpen = false,
    onOpenToggle,
    isMobileSidebar = false,
    side = "left",
    ...props
  }, ref) => {
    const isMobile = useIsMobile();
    const { t } = useTranslation();
    
    // If we're on mobile but not using mobile sidebar variant, don't render
    if (isMobile && !isMobileSidebar) {
      return null;
    }
    
    // If we're using mobile sidebar but it's not open, don't render content (just show backdrop if specified)
    if (isMobileSidebar && !isOpen) {
      return null;
    }
    
    // Main sidebar component
    return (
      <>
        {/* Backdrop for mobile sidebar */}
        {isMobileSidebar && isOpen && onOpenToggle && (
          <div 
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40" 
            onClick={onOpenToggle}
            aria-hidden="true"
          />
        )}
        
        <aside 
          ref={ref}
          className={cn(
            "group flex flex-col gap-4 h-full bg-background",
            // Desktop styles
            !isMobileSidebar && "border-r border-border transition-all duration-300",
            !isMobileSidebar && isCollapsed ? "w-[70px]" : "w-[240px]",
            // Mobile styles
            isMobileSidebar && "fixed inset-y-0 w-[280px] shadow-strong z-50 animate-in slide-in-from-left duration-300",
            side === "right" && "right-0 border-l",
            side === "left" && "left-0 border-r",
            className
          )}
          {...props}
        >
          {/* Sidebar header */}
          <header className="flex h-14 items-center border-b px-4 py-2">
            {!isCollapsed && (
              <div className="flex-1">
                {/* Logo or header content */}
                <div className="font-semibold text-lg">
                  {t("Aisle 404")}
                </div>
              </div>
            )}
            
            {/* Collapse toggle for desktop */}
            {!isMobileSidebar && onCollapseToggle && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onCollapseToggle}
                aria-label={isCollapsed ? t("Expand sidebar") : t("Collapse sidebar")}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {/* Close button for mobile */}
            {isMobileSidebar && onOpenToggle && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onOpenToggle}
                aria-label={t("Close sidebar")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </header>
          
          {/* Scrollable sidebar content */}
          <ScrollArea className="flex-1 px-3">
            {children}
          </ScrollArea>
          
          {/* Language selector */}
          <div className="px-3 py-2 border-t">
            <LanguageSelector />
          </div>
          
          {/* Optional footer area */}
          <footer className="mt-auto border-t px-3 py-4">
            {!isCollapsed && (
              <div className="text-xs text-muted-foreground text-center">
                {t("© 2025 Aisle 404")}
              </div>
            )}
          </footer>
        </aside>
      </>
    );
  }
);
MobileSidebar.displayName = "MobileSidebar";

// Sidebar section component
interface MobileSidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
  isCollapsed?: boolean;
}

const MobileSidebarSection = React.forwardRef<HTMLDivElement, MobileSidebarSectionProps>(
  ({ className, title, icon, isCollapsed = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("py-2", className)}
        {...props}
      >
        {title && !isCollapsed && (
          <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
            {title}
          </h3>
        )}
        {title && isCollapsed && icon && (
          <div className="mb-2 flex h-8 items-center justify-center">
            {icon}
          </div>
        )}
        <div className="space-y-1">{children}</div>
      </div>
    );
  }
);
MobileSidebarSection.displayName = "MobileSidebarSection";

// Sidebar item component
interface MobileSidebarItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  label: string;
  isCollapsed?: boolean;
  isActive?: boolean;
  badge?: React.ReactNode;
}

const MobileSidebarItem = React.forwardRef<HTMLAnchorElement, MobileSidebarItemProps>(
  ({ className, icon, label, isCollapsed = false, isActive = false, badge, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          isActive && "bg-primary/10 text-primary",
          className
        )}
        {...props}
      >
        {icon && (
          <span className={cn("h-5 w-5", isActive && "text-primary")}>
            {icon}
          </span>
        )}
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate">{label}</span>
            {badge && <span>{badge}</span>}
          </>
        )}
        {isCollapsed && badge && (
          <span className="absolute right-2 top-1 flex h-5 w-5 items-center justify-center">
            {badge}
          </span>
        )}
      </a>
    );
  }
);
MobileSidebarItem.displayName = "MobileSidebarItem";

// Mobile bottom navigation
interface BottomNavProps extends React.HTMLAttributes<HTMLDivElement> {}

const BottomNav = React.forwardRef<HTMLDivElement, BottomNavProps>(
  ({ className, children, ...props }, ref) => {
    const isMobile = useIsMobile();
    
    if (!isMobile) return null;
    
    return (
      <div 
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around items-center h-16 px-4 pb-safe-bottom z-50",
          "shadow-[0_-2px_10px_rgba(0,0,0,0.05)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BottomNav.displayName = "BottomNav";

// Bottom navigation item
interface BottomNavItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const BottomNavItem = React.forwardRef<HTMLAnchorElement, BottomNavItemProps>(
  ({ className, icon, label, isActive = false, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-1 px-2 rounded-lg",
          isActive ? "text-primary" : "text-muted-foreground",
          className
        )}
        {...props}
      >
        <div className={cn(
          "h-6 w-6 mb-1",
          isActive && "text-primary",
        )}>
          {icon}
        </div>
        <span className="text-xs font-medium">{label}</span>
      </a>
    );
  }
);
BottomNavItem.displayName = "BottomNavItem";

// Mobile sidebar toggle button
interface MobileSidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

const MobileSidebarToggle = React.forwardRef<HTMLButtonElement, MobileSidebarToggleProps>(
  ({ className, onClick, ...props }, ref) => {
    const { t } = useTranslation();
    
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("touch-target", className)}
        onClick={onClick}
        aria-label={t("Open menu")}
        {...props}
      >
        <Menu className="h-6 w-6" />
      </Button>
    );
  }
);
MobileSidebarToggle.displayName = "MobileSidebarToggle";

export { 
  MobileSidebar, 
  MobileSidebarSection, 
  MobileSidebarItem, 
  MobileSidebarToggle,
  BottomNav, 
  BottomNavItem 
};
