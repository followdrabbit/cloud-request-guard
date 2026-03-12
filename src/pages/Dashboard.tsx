import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { tickets, providers } from '@/data/mockData';
import { ProviderBadge, StatusBadge, CriticalityBadge, TypeBadge } from '@/components/Badges';
import {
  AlertTriangle, Clock, CheckCircle2, FileText, Plus, List, Settings,
  ArrowRight, TrendingUp, ClipboardCheck, AlertOctagon
} from 'lucide-react';

const spring = { type: 'spring' as const, duration: 0.4, bounce: 0 };

const chartData = [
  { name: 'AWS', value: tickets.filter(t => t.provider === 'aws').length, color: 'hsl(24, 95%, 53%)' },
  { name: 'Azure', value: tickets.filter(t => t.provider === 'azure').length, color: 'hsl(207, 90%, 54%)' },
  { name: 'OCI', value: tickets.filter(t => t.provider === 'oci').length, color: 'hsl(350, 79%, 60%)' },
];

const summaryCards = [
  { label: 'Total de Chamados', value: tickets.length, icon: FileText, accent: 'text-foreground' },
  { label: 'Aguardando Aprovação', value: tickets.filter(t => t.status === 'Aguardando Aprovação').length, icon: Clock, accent: 'text-warning', pulse: true },
  { label: 'Auditorias Ativas', value: tickets.filter(t => t.type === 'audit' && t.status !== 'Concluído').length, icon: ClipboardCheck, accent: 'text-info' },
  { label: 'Breaking Glass', value: tickets.filter(t => t.type === 'breaking-glass').length, icon: AlertOctagon, accent: 'text-destructive', highlight: true },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-foreground">Bem-vindo, Ana Souza.</h1>
          <p className="text-muted-foreground mt-1">Visão geral do portal de governança cloud.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.05 }}
              className={`bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-shadow ${card.highlight ? 'ring-1 ring-destructive/20' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                <card.icon className={`w-5 h-5 ${card.accent}`} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-3xl font-bold tabular-nums ${card.accent}`}>{card.value}</span>
                {card.pulse && <span className="w-2 h-2 rounded-full bg-warning animate-pulse-dot" />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 card-shadow space-y-4">
            <h2 className="text-foreground">Atalhos Rápidos</h2>
            <div className="space-y-2">
              {providers.map(p => (
                <Link key={p.id} to={`/catalog/${p.id}`} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:card-shadow-hover transition-all group">
                  <Plus className={`w-4 h-4 text-${p.color}`} />
                  <span className="text-sm font-medium flex-1">Novo Chamado {p.shortName}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
              <Link to="/tickets" className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:card-shadow-hover transition-all group">
                <List className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium flex-1">Consultar Chamados</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:card-shadow-hover transition-all group">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium flex-1">Administração</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 bg-card rounded-xl p-6 card-shadow">
            <h2 className="text-foreground mb-4">Chamados por Provedor</h2>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 5%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 13, fill: 'hsl(240, 4%, 46%)' }} />
                  <YAxis tick={{ fontSize: 13, fill: 'hsl(240, 4%, 46%)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-foreground">Chamados Recentes</h2>
            <Link to="/tickets" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Título</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Provedor</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Criticidade</th>
                  <th className="px-6 py-3">Atualização</th>
                </tr>
              </thead>
              <tbody>
                {tickets.slice(0, 8).map((ticket, i) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: i * 0.03 }}
                    className={`border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${ticket.type === 'breaking-glass' ? 'bg-destructive/[0.02]' : ''}`}
                    onClick={() => window.location.href = `/tickets/${ticket.id}`}
                  >
                    <td className="px-6 py-4 text-sm font-mono tabular-nums text-muted-foreground">{ticket.id}</td>
                    <td className="px-6 py-4 text-sm font-medium max-w-xs truncate">{ticket.title}</td>
                    <td className="px-6 py-4"><TypeBadge type={ticket.type} /></td>
                    <td className="px-6 py-4"><ProviderBadge provider={ticket.provider} /></td>
                    <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                    <td className="px-6 py-4"><CriticalityBadge criticality={ticket.criticality} /></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground tabular-nums">
                      {new Date(ticket.updatedAt).toLocaleDateString('pt-BR')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
                <div key={t.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${t.type === 'breaking-glass' ? 'bg-destructive/5 border border-destructive/10' : 'bg-warning/5 border border-warning/10'}`}>
                  {t.type === 'breaking-glass' ? <AlertOctagon className="w-4 h-4 text-destructive shrink-0" /> : <Clock className="w-4 h-4 text-warning shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.id} · {t.type === 'breaking-glass' ? 'Breaking Glass' : t.type === 'audit' ? 'Auditoria' : 'Padrão'}</p>
                  </div>
                  <ProviderBadge provider={t.provider} />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 card-shadow">
            <h2 className="text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" /> Concluídos Recentes
            </h2>
            <div className="space-y-3">
              {tickets.filter(t => t.status === 'Concluído').map(t => (
                <div key={t.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-success/5 border border-success/10">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.id}</p>
                  </div>
                  <ProviderBadge provider={t.provider} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
