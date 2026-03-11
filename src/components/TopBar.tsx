import { Search, Bell, User } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 max-w-md flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar chamados, categorias, provedores..."
            className="input-field w-full pl-9 pr-4 py-2"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive animate-pulse-dot" />
        </button>
        <div className="h-8 w-px bg-border" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Ana Souza</p>
            <p className="text-xs text-muted-foreground">Engenharia de Dados</p>
          </div>
        </div>
      </div>
    </header>
  );
}
