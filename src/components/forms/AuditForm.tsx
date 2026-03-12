import { AlertTriangle, Info, Check } from 'lucide-react';
import { Category } from '@/data/mockData';

function FormField({ label, required, help, children, error }: { label: string; required?: boolean; help?: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
        {help && (
          <span className="group relative">
            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-foreground text-primary-foreground text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {help}
            </span>
          </span>
        )}
      </label>
      {children}
      {error && <p className="text-xs text-destructive flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

function InputField({ placeholder, value, type = 'text' }: { placeholder?: string; value?: string; type?: string }) {
  return <input type={type} placeholder={placeholder} defaultValue={value || ''} className="input-field w-full" />;
}

function SelectField({ options, placeholder }: { options: string[]; placeholder?: string }) {
  return (
    <select className="input-field w-full">
      <option value="">{placeholder || 'Selecione...'}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function TextArea({ placeholder, rows = 3 }: { placeholder?: string; rows?: number }) {
  return <textarea placeholder={placeholder} rows={rows} className="input-field w-full resize-none" />;
}

interface AuditFormProps {
  step: number;
  providerId: string;
  category: Category;
}

export function AuditForm({ step, providerId, category }: AuditFormProps) {
  if (step === 1) return <AuditStep1 providerId={providerId} category={category} />;
  if (step === 2) return <AuditStep2 providerId={providerId} />;
  if (step === 3) return <AuditStep3 />;
  if (step === 4) return <AuditStep4 category={category} />;
  return <AuditStep5 providerId={providerId} category={category} />;
}

function AuditStep1({ providerId, category }: { providerId: string; category: Category }) {
  const providerLabel = providerId === 'aws' ? 'Amazon Web Services' : providerId === 'azure' ? 'Microsoft Azure' : 'Oracle Cloud Infrastructure';
  return (
    <div className="space-y-5">
      <h2>Dados Gerais da Auditoria</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormField label="Título da Solicitação" required>
            <InputField placeholder="Ex: Auditoria de permissões IAM em contas produtivas" />
          </FormField>
        </div>
        <FormField label="Provedor Cloud" required>
          <InputField value={providerLabel} />
        </FormField>
        <FormField label="Categoria" required>
          <InputField value={category.name} />
        </FormField>
        <FormField label="Subcategoria de Auditoria" required>
          <SelectField options={['Recursos em uso', 'Permissões de usuários', 'Grupos e perfis', 'Roles e policies', 'Contas / Subscriptions / Compartments', 'Acessos privilegiados', 'Chaves e identidades de serviço', 'Recursos expostos publicamente', 'Logging e trilhas', 'Baseline compliance']} />
        </FormField>
        <FormField label="Solicitante" required>
          <InputField value="Ana Souza" />
        </FormField>
        <FormField label="E-mail" required>
          <InputField value="ana.souza@corp.com" type="email" />
        </FormField>
        <FormField label="Área / Time" required>
          <SelectField options={['SecOps', 'GRC', 'IAM', 'Auditoria Interna', 'Engenharia de Dados', 'SRE / Observabilidade', 'Arquitetura Cloud']} />
        </FormField>
        <FormField label="Gestor Responsável" required>
          <SelectField options={['Fernanda Lima', 'Roberto Nascimento', 'Carlos Silva', 'Juliana Costa']} />
        </FormField>
        <FormField label="Sistema / Projeto Relacionado">
          <InputField placeholder="Ex: Audit Q1-2024" />
        </FormField>
        <FormField label="Ambiente" required>
          <SelectField options={['Desenvolvimento', 'Homologação', 'Produção', 'Todos']} />
        </FormField>
        <FormField label="Criticidade" required>
          <SelectField options={['Baixa', 'Média', 'Alta', 'Crítica']} />
        </FormField>
        <FormField label="Prazo Desejado">
          <InputField type="date" />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Justificativa da Auditoria" required help="Descreva a razão e o contexto desta auditoria">
            <TextArea placeholder="Ex: Auditoria trimestral exigida por compliance PCI-DSS..." rows={4} />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Objetivo Esperado" required>
            <TextArea placeholder="Ex: Inventário completo de recursos, relatório executivo de conformidade..." />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Observações">
            <TextArea placeholder="Informações adicionais relevantes..." />
          </FormField>
        </div>
      </div>
    </div>
  );
}

function AuditStep2({ providerId }: { providerId: string }) {
  return (
    <div className="space-y-5">
      <h2>Escopo da Auditoria</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormField label="Tipo de Auditoria" required help="Selecione os domínios a serem auditados">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {['Recursos em uso', 'Permissões de usuários', 'Grupos e perfis', 'Roles e policies', 'Contas / subscriptions / compartments', 'Acessos privilegiados', 'Logging e trilhas', 'Exposição pública', 'Baseline compliance'].map(item => (
                <label key={item} className="flex items-center gap-2 text-sm cursor-pointer px-3 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                  {item}
                </label>
              ))}
            </div>
          </FormField>
        </div>

        {providerId === 'aws' && (
          <FormField label="AWS Account(s)" required>
            <SelectField options={['123456789012 (prd-payment-gateway)', '234567890123 (prd-data-lake)', '567890123456 (prd-shared-services)', '678901234567 (prd-security-logging)', 'Todas as contas produtivas']} />
          </FormField>
        )}
        {providerId === 'azure' && (
          <FormField label="Azure Subscription(s)" required>
            <SelectField options={['Corp-Production (sub-001)', 'Analytics-Production (sub-004)', 'Security-Hub (sub-005)', 'Todas as subscriptions produtivas']} />
          </FormField>
        )}
        {providerId === 'oci' && (
          <FormField label="OCI Compartment(s)" required>
            <SelectField options={['cmp-financeiro', 'cmp-seguranca', 'cmp-aplicacoes', 'cmp-shared-services', 'Todos os compartments produtivos']} />
          </FormField>
        )}

        <FormField label="Escopo do Ambiente" required>
          <SelectField options={['Desenvolvimento', 'Homologação', 'Produção', 'Todos os ambientes']} />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Recursos Específicos a Analisar" help="Liste recursos, serviços ou domínios específicos">
            <TextArea placeholder="Ex: EC2, S3, RDS, Lambda, IAM Roles, KMS, Security Groups..." />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Usuários, Grupos ou Identidades Alvo" help="Especifique se a auditoria foca em identidades específicas">
            <TextArea placeholder="Ex: GRP-AWS-DataEng-Admin, todos os usuários com AdministratorAccess..." />
          </FormField>
        </div>
        <FormField label="Período de Referência">
          <SelectField options={['Últimos 30 dias', 'Últimos 90 dias', 'Últimos 6 meses', 'Último ano', 'Customizado']} />
        </FormField>
        <FormField label="Necessidade de Visão Histórica">
          <SelectField options={['Não', 'Sim - últimos 90 dias', 'Sim - último ano']} />
        </FormField>
        <FormField label="Necessidade de Consolidado Executivo">
          <SelectField options={['Sim', 'Não']} />
        </FormField>
        <FormField label="Necessidade de Evidência Técnica Detalhada">
          <SelectField options={['Sim', 'Não']} />
        </FormField>
      </div>

      {/* Scope warning */}
      <div className="bg-info/5 border border-info/10 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold">Escopo Amplo</p>
          <p className="text-xs text-muted-foreground mt-0.5">Auditorias com escopo "Todas as contas/subscriptions" podem demandar esforço elevado. A equipe de auditoria irá avaliar a viabilidade do prazo solicitado.</p>
        </div>
      </div>
    </div>
  );
}

function AuditStep3() {
  return (
    <div className="space-y-5">
      <h2>Requisitos e Filtros</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          'Incluir recursos órfãos',
          'Incluir recursos sem tag',
          'Incluir identidades inativas',
          'Incluir permissões administrativas',
          'Incluir acessos cross-account / cross-subscription / cross-compartment',
          'Incluir políticas customizadas',
          'Incluir acessos temporários',
          'Incluir contas de serviço',
          'Incluir service principals',
          'Incluir dynamic groups',
          'Incluir trilhas de auditoria',
        ].map(item => (
          <label key={item} className="flex items-center gap-3 text-sm cursor-pointer px-3 py-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
            {item}
          </label>
        ))}
      </div>

      <div className="mt-4">
        <FormField label="Saída Esperada" required>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {['Relatório executivo', 'Relatório técnico detalhado', 'Inventário de recursos', 'Matriz de permissões', 'Dashboard / visualização', 'Planilha consolidada'].map(item => (
              <label key={item} className="flex items-center gap-2 text-sm cursor-pointer px-3 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                {item}
              </label>
            ))}
          </div>
        </FormField>
      </div>

      <div>
        <h3 className="mb-3">Anexos ou Evidências de Suporte</h3>
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground">Arraste arquivos aqui ou clique para selecionar</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, JSON, XLSX, CSV até 10MB</p>
        </div>
      </div>
    </div>
  );
}

function AuditStep4({ category }: { category: Category }) {
  return (
    <div className="space-y-5">
      <h2>Segurança e Governança</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormField label="Justificativa de Negócio" required>
            <TextArea placeholder="Justificativa detalhada para a realização desta auditoria..." rows={3} />
          </FormField>
        </div>
        <FormField label="Base Regulatória / Compliance" help="Qual regulamentação motiva esta auditoria?">
          <SelectField options={['PCI-DSS', 'SOX', 'LGPD', 'ISO 27001', 'CIS Benchmark', 'NIST', 'Política interna', 'Auditoria externa', 'Nenhuma específica']} />
        </FormField>
        <FormField label="Nível de Sensibilidade dos Dados">
          <SelectField options={['Público', 'Interno', 'Confidencial', 'Restrito']} />
        </FormField>
        <FormField label="Existe Incidente Associado?">
          <SelectField options={['Não', 'Sim']} />
        </FormField>
        <FormField label="Existe Auditoria Interna/Externa Relacionada?">
          <SelectField options={['Não', 'Sim - auditoria interna', 'Sim - auditoria externa']} />
        </FormField>
        <FormField label="Existe Prazo Regulatório?">
          <SelectField options={['Não', 'Sim']} />
        </FormField>
        <FormField label="Classificação de Risco">
          <SelectField options={['Baixo', 'Médio', 'Alto', 'Crítico']} />
        </FormField>
        <FormField label="Necessidade de Segregação da Análise" help="Se a auditoria deve ser conduzida por equipe independente">
          <SelectField options={['Não', 'Sim']} />
        </FormField>
      </div>

      <div className="bg-info/5 border border-info/10 rounded-xl p-4">
        <h3 className="mb-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-info" /> Aprovações Necessárias
        </h3>
        <div className="space-y-2">
          {category.approvals.map((a, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-info/10 text-info flex items-center justify-center text-xs font-bold tabular-nums">{i + 1}</span>
              <span>{a}</span>
              <span className="ml-auto text-xs text-muted-foreground">Pendente</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-warning/5 border border-warning/10 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-warning">Dados Sensíveis</p>
          <p className="text-xs text-muted-foreground mt-0.5">Auditorias envolvendo dados classificados como Confidencial ou Restrito exigem classificação adequada e podem requerer aprovação adicional de Compliance.</p>
        </div>
      </div>
    </div>
  );
}

function AuditStep5({ providerId, category }: { providerId: string; category: Category }) {
  const providerLabel = providerId === 'aws' ? 'AWS' : providerId === 'azure' ? 'Azure' : 'OCI';
  return (
    <div className="space-y-5">
      <h2>Revisão Final</h2>

      {[
        { title: 'Dados Gerais', items: [
          ['Provedor', providerLabel], ['Categoria', category.name], ['Solicitante', 'Ana Souza'],
          ['Tipo', 'Auditoria'], ['Ambiente', 'Produção'], ['Criticidade', 'Alta'],
        ]},
        { title: 'Escopo da Auditoria', items: [
          ['Tipo', 'Permissões de usuários, Acessos privilegiados'],
          ['Escopo', providerId === 'aws' ? 'Contas produtivas' : providerId === 'azure' ? 'Subscriptions produtivas' : 'Compartments produtivos'],
          ['Período', 'Últimos 90 dias'],
          ['Visão Histórica', 'Sim'],
          ['Consolidado Executivo', 'Sim'],
        ]},
        { title: 'Saída Esperada', items: [
          ['Relatório executivo', '✓'],
          ['Matriz de permissões', '✓'],
          ['Planilha consolidada', '✓'],
        ]},
      ].map((section, si) => (
        <div key={si} className="rounded-xl border border-border p-4">
          <h3 className="mb-3">{section.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {section.items.map(([label, value], i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-border p-4">
        <h3 className="mb-3">Aprovações Exigidas</h3>
        {category.approvals.map((a, i) => (
          <div key={i} className="flex items-center gap-3 text-sm py-1.5">
            <span className="w-6 h-6 rounded-full bg-info/10 text-info flex items-center justify-center text-xs font-bold">{i + 1}</span>
            <span>{a}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border p-4">
        <h3 className="mb-3">Checklist de Conformidade</h3>
        <div className="space-y-2">
          {[
            { ok: true, text: 'Justificativa de auditoria preenchida' },
            { ok: true, text: 'Escopo definido com ao menos um domínio' },
            { ok: true, text: 'Ambiente de destino selecionado' },
            { ok: true, text: 'Saída esperada definida' },
            { ok: false, text: 'Escopo amplo: aprovação adicional pode ser necessária' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${item.ok ? 'bg-success/5 border border-success/10' : 'bg-warning/5 border border-warning/10'}`}>
              {item.ok ? <Check className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-warning" />}
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
