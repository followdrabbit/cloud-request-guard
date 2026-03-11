import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { tickets } from '@/data/mockData';
import { ProviderBadge, StatusBadge, CriticalityBadge, EnvironmentBadge } from '@/components/Badges';
import { Search, Filter } from 'lucide-react';

const spring = { type: 'spring' as const, duration: 0.4, bounce: 0 };

export default function TicketList() {
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [critFilter, setCritFilter] = useState('');
  const [envFilter, setEnvFilter] = useState('');

  const filtered = tickets.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (providerFilter && t.provider !== providerFilter) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (critFilter && t.criticality !== critFilter) return false;
    if (envFilter && t.environment !== envFilter) return false;
    return true;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1>Chamados</h1>
          <p className="text-muted-foreground mt-1">Consulte e gerencie todas as solicitações cloud.</p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-4 card-shadow">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por ID ou título..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field w-full pl-9"
              />
            </div>
            <select value={providerFilter} onChange={e => setProviderFilter(e.target.value)} className="input-field">
              <option value="">Todos provedores</option>
              <option value="aws">AWS</option>
              <option value="azure">Azure</option>
              <option value="oci">OCI</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field">
              <option value="">Todos status</option>
              <option value="Em Preenchimento">Em Preenchimento</option>
              <option value="Aguardando Aprovação">Aguardando Aprovação</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Em Execução">Em Execução</option>
              <option value="Concluído">Concluído</option>
              <option value="Rejeitado">Rejeitado</option>
            </select>
            <select value={critFilter} onChange={e => setCritFilter(e.target.value)} className="input-field">
              <option value="">Todas criticidades</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>
            <select value={envFilter} onChange={e => setEnvFilter(e.target.value)} className="input-field">
              <option value="">Todos ambientes</option>
              <option value="Desenvolvimento">Desenvolvimento</option>
              <option value="Homologação">Homologação</option>
              <option value="Produção">Produção</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Título</th>
                  <th className="px-5 py-3">Provedor</th>
                  <th className="px-5 py-3">Categoria</th>
                  <th className="px-5 py-3">Solicitante</th>
                  <th className="px-5 py-3">Ambiente</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Criticidade</th>
                  <th className="px-5 py-3">Atualização</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket, i) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ ...spring, delay: i * 0.02 }}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link to={`/tickets/${ticket.id}`} className="text-sm font-mono tabular-nums text-info hover:underline">
                        {ticket.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium max-w-[250px] truncate">{ticket.title}</td>
                    <td className="px-5 py-3"><ProviderBadge provider={ticket.provider} /></td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{ticket.categoryName}</td>
                    <td className="px-5 py-3 text-sm">{ticket.requester}</td>
                    <td className="px-5 py-3"><EnvironmentBadge env={ticket.environment} /></td>
                    <td className="px-5 py-3"><StatusBadge status={ticket.status} /></td>
                    <td className="px-5 py-3"><CriticalityBadge criticality={ticket.criticality} /></td>
                    <td className="px-5 py-3 text-sm text-muted-foreground tabular-nums">
                      {new Date(ticket.updatedAt).toLocaleDateString('pt-BR')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">Nenhum chamado encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
