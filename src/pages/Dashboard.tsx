import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tickets, catalog } from '@/data/mockData';
import { StatusBadge, CriticalityBadge, TypeBadge } from '@/components/Badges';
import {
  AlertTriangle, Clock, CheckCircle2, FileText, Plus, ArrowRight,
  ClipboardCheck, AlertOctagon, Eye, List
} from 'lucide-react';

const spring = { type: 'spring' as const, duration: 0.4, bounce: 0 };

const summaryCards = [
  { label: 'Chamados Abertos', value: tickets.filter(t => !['Concluído', 'Rejeitado', 'Cancelado'].includes(t.status)).length, icon: FileText, accent: 'text-foreground' },
  { label: 'Aguardando Aprovação', value: tickets.filter(t => t.status === 'Aguardando Aprovação').length, icon: Clock, accent: 'text-warning', pulse: true },
  { label: 'Auditorias Pendentes', value: tickets.filter(t => t.type === 'audit' && t.status !== 'Concluído').length, icon: ClipboardCheck, accent: 'text-info' },
  { label: 'Breaking Glass Ativos', value: tickets.filter(t => t.type === 'breaking-glass' && t.status !== 'Concluído').length, icon: AlertOctagon, accent: 'text-destructive', highlight: true },
  { label: 'Revisões Pós-Uso Pendentes', value: tickets.filter(t => t.postReviewStatus === 'Pendente').length, icon: Eye, accent: 'text-warning' },
];

export default function Dashboard() {
  const quickActionCategories = catalog.filter(cat => cat.type === 'standard');

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-foreground">Bem-vindo, Ana Souza.</h1>
          <p className="text-muted-foreground mt-1">Visão geral das solicitações AWS.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.05 }}
              className={`bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-shadow ${card.highlight ? 'ring-1 ring-destructive/20' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">{card.label}</span>
                <card.icon className={`w-4 h-4 ${card.accent}`} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold tabular-nums ${card.accent}`}>{card.value}</span>
                {card.pulse && <span className="w-2 h-2 rounded-full bg-warning animate-pulse-dot" />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 card-shadow space-y-4">
            <h2 className="text-foreground">Ações Rápidas</h2>
            <div className="space-y-2">
              {quickActionCategories.map(cat => (
                <Link key={cat.id} to={`/catalog/${cat.id}`} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:card-shadow-hover transition-all group">
                  <Plus className="w-4 h-4 text-aws" />
                  <span className="text-sm font-medium flex-1 truncate">{cat.name}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
              <Link to="/tickets" className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:card-shadow-hover transition-all group">
                <List className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium flex-1">Consultar Chamados</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="lg:col-span-2 bg-card rounded-xl card-shadow overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-foreground">Chamados Recentes</h2>
              <Link to="/tickets" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                Ver todos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Título</th>
                    <th className="px-5 py-3">Tipo</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Criticidade</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.slice(0, 6).map((ticket, i) => (
                    <motion.tr
                      key={ticket.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ ...spring, delay: i * 0.03 }}
                      className={`border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${ticket.type === 'breaking-glass' ? 'bg-destructive/[0.02]' : ''}`}
                      onClick={() => window.location.href = `/tickets/${ticket.id}`}
                    >
                      <td className="px-5 py-3 text-sm font-mono tabular-nums text-muted-foreground">{ticket.id}</td>
                      <td className="px-5 py-3 text-sm font-medium max-w-[200px] truncate">{ticket.title}</td>
                      <td className="px-5 py-3"><TypeBadge type={ticket.type} /></td>
                      <td className="px-5 py-3"><StatusBadge status={ticket.status} /></td>
                      <td className="px-5 py-3"><CriticalityBadge criticality={ticket.criticality} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pendencies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-6 card-shadow">
            <h2 className="text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" /> Pendências
            </h2>
            <div className="space-y-3">
              {tickets.filter(t => t.status === 'Aguardando Aprovação').map(t => (
                <Link key={t.id} to={`/tickets/${t.id}`} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${t.type === 'breaking-glass' ? 'bg-destructive/5 border border-destructive/10 hover:bg-destructive/10' : 'bg-warning/5 border border-warning/10 hover:bg-warning/10'}`}>
                  {t.type === 'breaking-glass' ? <AlertOctagon className="w-4 h-4 text-destructive shrink-0" /> : <Clock className="w-4 h-4 text-warning shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.id} · {t.categoryName}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 card-shadow">
            <h2 className="text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" /> Concluídos Recentes
            </h2>
            <div className="space-y-3">
              {tickets.filter(t => t.status === 'Concluído').map(t => (
                <Link key={t.id} to={`/tickets/${t.id}`} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-success/5 border border-success/10 hover:bg-success/10 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.id}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
