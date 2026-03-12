import { Layout } from '@/components/Layout';
import { useParams, Link } from 'react-router-dom';
import { tickets, categories, approvers } from '@/data/mockData';
import { ProviderBadge, StatusBadge, CriticalityBadge, EnvironmentBadge, TypeBadge, PostReviewBadge } from '@/components/Badges';
import { ArrowLeft, CheckCircle2, Clock, Circle, MessageSquare, Paperclip, History, AlertOctagon, Shield, Eye } from 'lucide-react';
import { useState } from 'react';

export default function TicketDetail() {
  const { ticketId } = useParams();
  const ticket = tickets.find(t => t.id === ticketId) || tickets[0];
  const category = categories.find(c => c.id === ticket.categoryId);
  const [activeTab, setActiveTab] = useState('Visão Geral');

  const isBreakingGlass = ticket.type === 'breaking-glass';
  const isAudit = ticket.type === 'audit';

  const baseTabs = ['Visão Geral', 'Dados Técnicos', 'Segurança', 'Aprovações', 'Anexos', 'Histórico'];
  const tabs = isBreakingGlass ? [...baseTabs, 'Pós-Uso / Post Review'] : isAudit ? [...baseTabs, 'Escopo da Auditoria'] : baseTabs;

  const timeline = isBreakingGlass ? [
    { label: 'Solicitação Emergencial Criada', date: new Date(ticket.createdAt).toLocaleString('pt-BR'), done: true, by: ticket.requester },
    { label: 'Validação Automática', date: new Date(ticket.createdAt).toLocaleString('pt-BR'), done: true, by: 'Sistema' },
    { label: 'Aprovação Emergencial', date: ticket.status !== 'Aguardando Aprovação' ? new Date(ticket.updatedAt).toLocaleString('pt-BR') : '', done: ticket.status !== 'Aguardando Aprovação', by: 'Segurança Cloud', pending: ticket.status === 'Aguardando Aprovação' },
    { label: 'Acesso Concedido', date: ticket.status === 'Em Execução' || ticket.status === 'Concluído' ? new Date(ticket.updatedAt).toLocaleString('pt-BR') : '', done: ticket.status === 'Em Execução' || ticket.status === 'Concluído', by: 'IAM Admin', pending: false },
    { label: 'Revogação do Acesso', date: ticket.status === 'Concluído' ? new Date(ticket.updatedAt).toLocaleString('pt-BR') : '', done: ticket.status === 'Concluído', by: 'Sistema' },
    { label: 'Revisão Pós-Uso', date: ticket.postReviewStatus === 'Concluída' ? new Date(ticket.updatedAt).toLocaleString('pt-BR') : '', done: ticket.postReviewStatus === 'Concluída', by: 'Identity Governance', pending: ticket.postReviewStatus === 'Pendente' },
  ] : [
    { label: 'Solicitação Criada', date: new Date(ticket.createdAt).toLocaleString('pt-BR'), done: true, by: ticket.requester },
    { label: 'Validação Automática', date: new Date(ticket.createdAt).toLocaleString('pt-BR'), done: true, by: 'Sistema' },
    { label: 'Aprovação do Gestor', date: '', done: false, by: ticket.manager, pending: ticket.status === 'Aguardando Aprovação' },
    { label: 'Aprovação de Segurança', date: '', done: false, by: 'Roberto Nascimento' },
    { label: 'Execução', date: '', done: false, by: 'Equipe IAM' },
    { label: 'Conclusão', date: '', done: false, by: '' },
  ];

  const comments = isBreakingGlass ? [
    { author: ticket.requester, date: new Date(ticket.createdAt).toLocaleString('pt-BR'), text: `Solicitação emergencial criada. Incidente: ${ticket.incidentId}. ${ticket.justification}` },
    { author: 'Sistema', date: new Date(ticket.createdAt).toLocaleString('pt-BR'), text: 'Validação automática concluída. Acesso Breaking Glass requer aprovação reforçada.' },
    { author: 'Roberto Nascimento', date: new Date(ticket.updatedAt).toLocaleString('pt-BR'), text: 'Incidente validado. Aprovando acesso emergencial com duração máxima conforme solicitado.' },
  ] : isAudit ? [
    { author: ticket.requester, date: new Date(ticket.createdAt).toLocaleString('pt-BR'), text: `Solicitação de auditoria criada. ${ticket.justification}` },
    { author: 'Sistema', date: new Date(ticket.createdAt).toLocaleString('pt-BR'), text: 'Validação automática concluída. Escopo da auditoria validado.' },
  ] : [
    { author: 'Ana Souza', date: '15/01/2024 10:32', text: 'Solicitação criada conforme alinhamento com o time de Dados.' },
    { author: 'Sistema', date: '15/01/2024 10:31', text: 'Validação automática concluída.' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Link to="/tickets" className="p-2 rounded-lg hover:bg-muted transition-colors mt-0.5">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-mono tabular-nums">{ticket.id}</h1>
              <StatusBadge status={ticket.status} />
              <ProviderBadge provider={ticket.provider} size="lg" />
              <CriticalityBadge criticality={ticket.criticality} />
              <EnvironmentBadge env={ticket.environment} />
              <TypeBadge type={ticket.type} />
              {isBreakingGlass && ticket.postReviewStatus && <PostReviewBadge status={ticket.postReviewStatus} />}
            </div>
            <p className="text-muted-foreground mt-1">{ticket.title}</p>
          </div>
        </div>

        {/* Breaking Glass Banner */}
        {isBreakingGlass && (
          <div className="bg-destructive/5 border-2 border-destructive/20 rounded-xl p-4 flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-destructive">Acesso Emergencial — Breaking Glass</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Incidente: <span className="font-mono font-medium text-foreground">{ticket.incidentId}</span> · 
                Duração: <span className="font-medium text-foreground">{ticket.breakingGlassDuration}</span> · 
                Revisão pós-uso: <span className="font-medium text-foreground">{ticket.postReviewStatus}</span>
              </p>
            </div>
          </div>
        )}

        {/* Audit Banner */}
        {isAudit && (
          <div className="bg-info/5 border border-info/20 rounded-xl p-4 flex items-start gap-3">
            <Eye className="w-5 h-5 text-info shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-info">Solicitação de Auditoria</p>
              <p className="text-xs text-muted-foreground mt-0.5">Auditoria de conformidade e governança cloud. Resultado esperado conforme escopo definido.</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-card rounded-xl p-5 card-shadow">
          <h3 className="mb-4">Timeline</h3>
          <div className="relative">
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    step.done ? 'bg-success' : step.pending ? 'bg-warning' : 'bg-muted'
                  }`}>
                    {step.done ? <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" /> :
                     step.pending ? <Clock className="w-3.5 h-3.5 text-primary-foreground" /> :
                     <Circle className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                  {i < timeline.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${step.done ? 'bg-success' : 'bg-muted'}`} />}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-medium">{step.label}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {step.date && <span className="tabular-nums">{step.date}</span>}
                    {step.by && <span>· {step.by}</span>}
                    {step.pending && <span className="text-warning font-medium">Pendente</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="border-b border-border flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'Visão Geral' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['Solicitante', ticket.requester],
                    ['E-mail', ticket.requesterEmail],
                    ['Time', ticket.team],
                    ['Gestor', ticket.manager],
                    ['Projeto', ticket.project],
                    ['Sistema', ticket.system],
                    ['Centro de Custo', ticket.costCenter],
                    ['SLA', ticket.sla],
                    ...(ticket.incidentId ? [['Incidente', ticket.incidentId]] : []),
                    ...(ticket.breakingGlassDuration ? [['Duração do Acesso', ticket.breakingGlassDuration]] : []),
                    ['Criado em', new Date(ticket.createdAt).toLocaleString('pt-BR')],
                    ['Atualizado em', new Date(ticket.updatedAt).toLocaleString('pt-BR')],
                  ].map(([label, value], i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Descrição</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ticket.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Justificativa</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ticket.justification}</p>
                </div>
              </div>
            )}

            {activeTab === 'Dados Técnicos' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Dados técnicos conforme a categoria {ticket.categoryName}.</p>
                {isBreakingGlass && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      ['Tipo de Acesso', 'Administrador'],
                      ['Recurso Alvo', ticket.system],
                      ['Identidade', ticket.requesterEmail],
                      ['Duração', ticket.breakingGlassDuration || 'N/A'],
                      ['Revogação', 'Automática'],
                      ['Registro de Sessão', 'Habilitado'],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex justify-between text-sm py-2 border-b border-border">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Segurança' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['Classificação de Risco', isBreakingGlass ? 'Crítico' : 'Alto'],
                    ['Segregação de Função', 'Sem conflito identificado'],
                    ['Menor Privilégio', isBreakingGlass ? 'Exceção emergencial' : 'Justificado'],
                    ['Acesso Privilegiado', isBreakingGlass ? 'Sim - temporário' : 'Não'],
                    ...(isBreakingGlass ? [['Trilha de Auditoria', 'Obrigatória'], ['Revisão Pós-Uso', 'Obrigatória']] : []),
                  ].map(([label, value], i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-border">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                {isBreakingGlass && (
                  <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-destructive mb-1">Acesso Emergencial de Alto Risco</p>
                    <p className="text-sm text-muted-foreground">Acesso breaking glass com trilha de auditoria ativa. Todas as ações são monitoradas e revisadas obrigatoriamente após o uso.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Aprovações' && (
              <div className="space-y-3">
                {approvers.slice(0, category?.approvalsCount || 2).map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                      {a.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.role} · {a.team}</p>
                    </div>
                    <span className={`text-xs font-medium ${i === 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                      {i === 0 ? 'Pendente' : 'Aguardando'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Anexos' && (
              <div className="text-center py-8">
                <Paperclip className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum anexo disponível</p>
              </div>
            )}

            {activeTab === 'Histórico' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <h3>Comentários</h3>
                </div>
                {comments.map((c, i) => (
                  <div key={i} className="border-l-2 border-border pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{c.author}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{c.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Escopo da Auditoria' && isAudit && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['Tipo de Auditoria', 'Permissões de usuários, Acessos privilegiados'],
                    ['Escopo', ticket.provider === 'aws' ? 'Contas produtivas' : ticket.provider === 'azure' ? 'Subscriptions produtivas' : 'Compartments produtivos'],
                    ['Período', 'Últimos 90 dias'],
                    ['Saída Esperada', 'Relatório executivo + Matriz de permissões'],
                    ['Consolidado Executivo', 'Sim'],
                    ['Evidência Técnica', 'Sim'],
                  ].map(([label, value], i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-border">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-info/5 border border-info/10 rounded-lg p-4">
                  <p className="text-sm font-medium text-info mb-2">Itens que serão Auditados</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {['Permissões de usuários', 'Acessos privilegiados', 'Roles e policies', 'Identidades inativas', 'Contas de serviço', 'Acessos cross-account'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-info shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Pós-Uso / Post Review' && isBreakingGlass && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['O acesso foi utilizado?', ticket.postReviewStatus === 'Concluída' ? 'Sim' : 'Em análise'],
                    ['Ações realizadas', ticket.postReviewStatus === 'Concluída' ? 'Ajuste de policy conforme plano' : 'Pendente de validação'],
                    ['Houve desvio de finalidade?', ticket.postReviewStatus === 'Concluída' ? 'Não' : 'Em análise'],
                    ['Acesso removido?', ticket.postReviewStatus === 'Concluída' ? 'Sim - revogação automática' : 'Pendente'],
                    ['Evidências coletadas?', ticket.postReviewStatus === 'Concluída' ? 'Sim' : 'Pendente'],
                    ['Parecer final', ticket.postReviewStatus === 'Concluída' ? 'Aprovado sem ressalvas' : 'Pendente'],
                  ].map(([label, value], i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-border">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                {ticket.postReviewStatus === 'Concluída' && (
                  <div className="bg-success/5 border border-success/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-success mb-1">Revisão Pós-Uso Concluída</p>
                    <p className="text-sm text-muted-foreground">Acesso utilizado conforme justificativa. Sem desvios identificados. Processo breaking glass encerrado com sucesso.</p>
                  </div>
                )}
                {ticket.postReviewStatus === 'Pendente' && (
                  <div className="bg-warning/5 border border-warning/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-warning mb-1">Revisão Pós-Uso Pendente</p>
                    <p className="text-sm text-muted-foreground">A revisão pós-uso deve ser realizada pelo responsável de segurança após o encerramento do acesso emergencial.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
