import { Layout } from '@/components/Layout';
import { useParams, Link } from 'react-router-dom';
import { tickets, categories, approvers } from '@/data/mockData';
import { ProviderBadge, StatusBadge, CriticalityBadge, EnvironmentBadge } from '@/components/Badges';
import { ArrowLeft, CheckCircle2, Clock, Circle, MessageSquare, Paperclip, History } from 'lucide-react';
import { useState } from 'react';

const tabs = ['Visão Geral', 'Dados Técnicos', 'Segurança', 'Aprovações', 'Anexos', 'Histórico'];

const timeline = [
  { label: 'Solicitação Criada', date: '15/01/2024 10:30', done: true, by: 'Ana Souza' },
  { label: 'Validação Automática', date: '15/01/2024 10:31', done: true, by: 'Sistema' },
  { label: 'Aprovação do Gestor', date: '15/01/2024 14:22', done: false, by: 'Carlos Silva', pending: true },
  { label: 'Aprovação de Segurança', date: '', done: false, by: 'Roberto Nascimento' },
  { label: 'Execução', date: '', done: false, by: 'Equipe IAM' },
  { label: 'Conclusão', date: '', done: false, by: '' },
];

const comments = [
  { author: 'Ana Souza', date: '15/01/2024 10:32', text: 'Solicitação criada conforme alinhamento com o time de Dados. Urgência: alta, pois pipeline entra em produção dia 20/01.' },
  { author: 'Sistema', date: '15/01/2024 10:31', text: 'Validação automática concluída. 1 alerta: Permission Boundary não definido para ambiente de produção.' },
  { author: 'Carlos Silva', date: '15/01/2024 14:22', text: 'Analisando. Preciso confirmar se o permission boundary padrão se aplica a esse caso.' },
];

export default function TicketDetail() {
  const { ticketId } = useParams();
  const ticket = tickets.find(t => t.id === ticketId) || tickets[0];
  const category = categories.find(c => c.id === ticket.categoryId);
  const [activeTab, setActiveTab] = useState('Visão Geral');

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
            </div>
            <p className="text-muted-foreground mt-1">{ticket.title}</p>
          </div>
        </div>

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
                {ticket.categoryId === 'aws-role' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      ['Nome da Role', 'lambda-s3-integration-role'],
                      ['Conta AWS', '123456789012 (prd-payment-gateway)'],
                      ['Trusted Entity', 'AWS Service'],
                      ['Principal', 'lambda.amazonaws.com'],
                      ['Policies Gerenciadas', 'AmazonS3ReadOnlyAccess'],
                      ['Permission Boundary', 'BoundaryPolicy-Standard'],
                      ['Max Session', '4 horas'],
                      ['Necessidade', 'Permanente'],
                      ['Tags', 'Environment=prod, Team=data-eng'],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex justify-between text-sm py-2 border-b border-border">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Dados técnicos conforme a categoria {ticket.categoryName}.</p>
                )}
              </div>
            )}

            {activeTab === 'Segurança' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['Classificação de Risco', 'Alto'],
                    ['Segregação de Função', 'Sem conflito identificado'],
                    ['Menor Privilégio', 'Justificado'],
                    ['Acesso Privilegiado', 'Não'],
                    ['MFA Adicional', 'Não necessário'],
                  ].map(([label, value], i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-border">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-warning/5 border border-warning/10 rounded-lg p-4">
                  <p className="text-sm font-medium text-warning mb-1">Riscos Identificados</p>
                  <p className="text-sm text-muted-foreground">Acesso a ambiente de produção. Permission Boundary configurado para mitigação.</p>
                </div>
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
                    <div className="flex gap-2">
                      {i === 0 ? (
                        <span className="text-xs text-warning font-medium">Pendente</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Aguardando</span>
                      )}
                    </div>
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
                <div className="mt-4 flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-muted-foreground" />
                  <h3>Alterações</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-4 text-muted-foreground">
                    <span className="tabular-nums shrink-0">15/01 14:22</span>
                    <span>Status alterado de <span className="font-medium text-foreground">Validação</span> para <span className="font-medium text-foreground">Aguardando Aprovação</span></span>
                  </div>
                  <div className="flex gap-4 text-muted-foreground">
                    <span className="tabular-nums shrink-0">15/01 10:31</span>
                    <span>Validação automática concluída com <span className="font-medium text-warning">1 alerta</span></span>
                  </div>
                  <div className="flex gap-4 text-muted-foreground">
                    <span className="tabular-nums shrink-0">15/01 10:30</span>
                    <span>Solicitação criada por <span className="font-medium text-foreground">Ana Souza</span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
