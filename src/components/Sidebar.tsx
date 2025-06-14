
import * as React from 'react';
import { cn } from '@/lib/utils';
import { 
  Youtube, 
  Share2, 
  MessageCircle, 
  ClipboardList,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

const Sidebar = ({ activeTool, setActiveTool }: SidebarProps) => {
  const [collapsed, setCollapsed] = React.useState(false);
  
  const tools = [
    {
      id: 'youtube-summary',
      name: 'YouTube Summary',
      icon: Youtube,
      description: 'Generate summaries from YouTube videos'
    },
    {
      id: 'social-media',
      name: 'Social Media Posts',
      icon: Share2,
      description: 'Create posts for different platforms'
    },
    {
      id: 'comments',
      name: 'Comment Generator',
      icon: MessageCircle,
      description: 'AI-powered comments for social media'
    },
    {
      id: 'jira-tickets',
      name: 'Jira Ticket Creator',
      icon: ClipboardList,
      description: 'Generate professional Jira tickets'
    }
  ];

  return (
    <div className="relative">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 right-4 lg:hidden z-20"
      >
        {collapsed ? <Menu /> : <X />}
      </Button>
      
      <aside
        className={cn(
          "bg-sidebar text-sidebar-foreground h-screen transition-all duration-300",
          collapsed 
            ? "w-0 -translate-x-full lg:w-20 lg:translate-x-0" 
            : "w-64 translate-x-0"
        )}
      >
        <div className="h-full flex flex-col overflow-hidden">
          <div className="p-6 border-b border-sidebar-border">
            <h1 className={cn(
              "text-xl font-semibold transition-opacity duration-300",
              collapsed ? "lg:opacity-0" : "opacity-100"
            )}>
              AI Toolbox
            </h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id);
                  if (window.innerWidth < 1024) setCollapsed(true);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  tool.id === activeTool 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-primary"
                )}
              >
                <tool.icon size={20} />
                <span className={cn(
                  "transition-opacity duration-300",
                  collapsed ? "lg:hidden" : "block"
                )}>
                  {tool.name}
                </span>
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-sidebar-border">
            <Button 
              variant="ghost" 
              onClick={() => setCollapsed(!collapsed)}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-primary hidden lg:flex"
            >
              {collapsed ? <Menu size={20} /> : <>
                <X size={20} className="mr-2" />
                <span>Collapse</span>
              </>}
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
