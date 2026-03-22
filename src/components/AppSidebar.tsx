import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, List, ClipboardCheck, AlertOctagon, Settings, ChevronLeft, ChevronRight, Shield, FileText, User, Users, Search
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Catálogo AWS', icon: BookOpen, path: '/catalog' },
  { label: 'Levantamento AWS', icon: Search, path: '/catalog/aws-information' },
  { label: 'Usuários IAM AWS', icon: User, path: '/catalog/aws-iam-users' },
  { label: 'Grupos IAM AWS', icon: Users, path: '/catalog/aws-iam-groups' },
  { label: 'Policy AWS', icon: FileText, path: '/catalog/aws-policies' },
  { label: 'Meus Chamados', icon: List, path: '/tickets' },
  { label: 'Auditoria AWS', icon: ClipboardCheck, path: '/catalog/aws-audit' },
  { label: 'Breaking Glass AWS', icon: AlertOctagon, path: '/catalog/aws-emergency' },
  { label: 'Administração', icon: Settings, path: '/admin' },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-[68px]' : 'w-[260px]'} bg-sidebar flex flex-col transition-all duration-300 relative shrink-0`}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-aws/20 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-aws">M</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-sidebar-primary truncate">My ISTM</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">Portal AWS Governance</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const isEmergency = item.path.includes('emergency');
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                isActive
                  ? 'text-sidebar-accent-foreground'
                  : isEmergency
                  ? 'text-destructive/80 hover:text-destructive hover:bg-destructive/10'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className={`absolute inset-0 ${isEmergency ? 'bg-destructive/20' : 'bg-sidebar-accent'} rounded-lg`}
                  transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
                />
              )}
              <item.icon className="w-5 h-5 relative z-10 shrink-0" />
              {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 text-xs text-sidebar-foreground/50">
            <Shield className="w-4 h-4" />
            <span>My ISTM v3.0</span>
          </div>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card card-shadow flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
