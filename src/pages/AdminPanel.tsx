import { Layout } from '@/components/Layout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { categories, providers } from '@/data/mockData';
import { CriticalityBadge, TypeBadge } from '@/components/Badges';
import { Settings, Layers, FileText, CheckSquare, ShieldCheck, Users, BookTemplate, Edit, ToggleRight, Plus, ClipboardCheck, AlertOctagon, Clock } from 'lucide-react';

const spring = { type: 'spring' as const, duration: 0.4, bounce: 0 };

const adminSections = [
  { id: 'providers', label: 'Provedores', icon: Layers, count: 3 },
  { id: 'categories', label: 'Categorias', icon: FileText, count: categories.length },
  { id: 'fields', label: 'Campos', icon: Edit, count: 218 },
  { id: 'validations', label: 'Validações', icon: CheckSquare, count: 132 },
  { id: 'requirements', label: 'Requisitos', icon: ShieldCheck, count: 64 },
  { id: 'approvals', label: 'Aprovações', icon: Users, count: 42 },
  { id: 'templates', label: 'Templates', icon: BookTemplate, count: 28 },
  { id: 'audit-config', label: 'Auditoria', icon: ClipboardCheck, count: 9 },
  { id: 'bg-config', label: 'Breaking Glass', icon: AlertOctagon, count: 8 },
];

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState('categories');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-muted-foreground" />
          <div>
            <h1>Painel Administrativo</h1>
            <p className="text-muted-foreground mt-0.5">Gerenciamento do catálogo de serviços e configurações.</p>
          </div>
        </div>

        {/* Section cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {adminSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`relative p-4 rounded-xl text-left transition-all card-shadow hover:card-shadow-hover ${
                activeSection === section.id ? 'bg-primary text-primary-foreground' : 'bg-card'
              }`}
            >
              <section.icon className="w-5 h-5 mb-2" />
              <p className="text-xs font-semibold">{section.label}</p>
              <p className={`text-lg font-bold tabular-nums ${activeSection === section.id ? '' : 'text-foreground'}`}>{section.count}</p>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="bg-card rounded-xl card-shadow overflow-hidden"
        >
          {activeSection === 'categories' && (
            <>
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2>Gerenciamento de Categorias</h2>
                <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Nova Categoria
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                      <th className="px-5 py-3">Categoria</th>
                      <th className="px-5 py-3">Tipo</th>
                      <th className="px-5 py-3">Provedor</th>
                      <th className="px-5 py-3">Criticidade</th>
                      <th className="px-5 py-3">Campos</th>
                      <th className="px-5 py-3">Validações</th>
                      <th className="px-5 py-3">Aprovações</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => {
                      const p = providers.find(pr => pr.id === cat.provider);
                      return (
                        <tr key={cat.id} className={`border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${cat.type === 'breaking-glass' ? 'bg-destructive/[0.02]' : ''}`}>
                          <td className="px-5 py-3">
                            <p className="text-sm font-medium">{cat.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{cat.description}</p>
                          </td>
                          <td className="px-5 py-3"><TypeBadge type={cat.type} /></td>
                          <td className="px-5 py-3 text-sm">{p?.shortName}</td>
                          <td className="px-5 py-3"><CriticalityBadge criticality={cat.criticality} /></td>
                          <td className="px-5 py-3 text-sm tabular-nums">{cat.fieldsCount}</td>
                          <td className="px-5 py-3 text-sm tabular-nums">{cat.validationsCount}</td>
                          <td className="px-5 py-3 text-sm tabular-nums">{cat.approvalsCount}</td>
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                              <ToggleRight className="w-3.5 h-3.5" /> Ativo
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-1">
                              <button className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground hover:bg-muted/80">Editar</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeSection === 'providers' && (
            <div className="p-6 space-y-4">
              <h2>Provedores Cloud</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {providers.map(p => (
                  <div key={p.id} className="rounded-xl border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3>{p.shortName}</h3>
                      <span className="text-xs text-success font-medium">Ativo</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.categoriesCount} categorias configuradas</p>
                    <button className="mt-3 px-3 py-1.5 text-xs rounded bg-muted text-muted-foreground">Configurar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'audit-config' && (
            <div className="p-6 space-y-4">
              <h2>Configurações de Auditoria</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Templates de Auditoria', desc: 'Modelos pré-configurados para auditoria de recursos, permissões e conformidade.', count: 6 },
                  { title: 'Regras de Validação', desc: 'Validações automáticas para escopo, justificativa e classificação de dados.', count: 18 },
                  { title: 'Checklists de Saída', desc: 'Formatos de saída esperados: relatório executivo, técnico, inventário, matriz.', count: 4 },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-info/20 p-5 bg-info/[0.02]">
                    <ClipboardCheck className="w-5 h-5 text-info mb-2" />
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    <p className="text-lg font-bold tabular-nums mt-2">{item.count}</p>
                    <button className="mt-3 px-3 py-1.5 text-xs rounded bg-muted text-muted-foreground">Configurar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'bg-config' && (
            <div className="p-6 space-y-4">
              <h2>Configurações de Breaking Glass</h2>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 mb-2 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-destructive" />
                <p className="text-xs text-muted-foreground">Configurações de acesso emergencial. Alterações requerem aprovação de CISO.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Duração Máxima', desc: 'Limites de duração por tipo de acesso emergencial.', icon: Clock, count: 5 },
                  { title: 'Regras de Aprovação', desc: 'Cadeia de aprovação emergencial e escalação.', icon: ShieldCheck, count: 8 },
                  { title: 'Checklists Pós-Revisão', desc: 'Itens obrigatórios na revisão após uso de breaking glass.', icon: CheckSquare, count: 7 },
                  { title: 'Alertas e Banners', desc: 'Mensagens de alerta e avisos visuais configuráveis.', icon: AlertOctagon, count: 6 },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-destructive/20 p-5 bg-destructive/[0.02]">
                    <item.icon className="w-5 h-5 text-destructive mb-2" />
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    <p className="text-lg font-bold tabular-nums mt-2">{item.count}</p>
                    <button className="mt-3 px-3 py-1.5 text-xs rounded bg-muted text-muted-foreground">Configurar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!['categories', 'providers', 'audit-config', 'bg-config'].includes(activeSection) && (
            <div className="p-6">
              <h2 className="mb-3">{adminSections.find(s => s.id === activeSection)?.label}</h2>
              <div className="bg-muted/50 rounded-xl p-8 text-center">
                <p className="text-sm text-muted-foreground">Módulo de gerenciamento de {adminSections.find(s => s.id === activeSection)?.label.toLowerCase()}.</p>
                <p className="text-xs text-muted-foreground mt-1">Interface administrativa para configuração de regras, campos e workflows.</p>
                <button className="mt-4 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium">
                  Acessar Configurações
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
