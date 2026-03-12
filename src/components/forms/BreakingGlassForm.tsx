import { AlertTriangle, Info, Check, AlertOctagon, Shield, Clock } from 'lucide-react';
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

interface BreakingGlassFormProps {
  step: number;
  providerId: string;
  category: Category;
}

export function BreakingGlassForm({ step, providerId, category }: BreakingGlassFormProps) {
  if (step === 1) return <BGStep1 providerId={providerId} category={category} />;
  if (step === 2) return <BGStep2 providerId={providerId} />;
  if (step === 3) return <BGStep3 />;
  if (step === 4) return <BGStep4 category={category} />;
  return <BGStep5 providerId={providerId} category={category} />;
}

function BGStep1({ providerId, category }: { providerId: string; category: Category }) {
  const providerLabel = providerId === 'aws' ? 'Amazon Web Services' : providerId === 'azure' ? 'Microsoft Azure' : 'Oracle Cloud Infrastructure';
  return (
    <div className="space-y-5">
      {/* Critical banner */}
      <div className="bg-destructive/5 border-2 border-destructive/20 rounded-xl p-4 flex items-start gap-3">
        <AlertOctagon className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-destructive">Uso Excepcional — Breaking Glass</p>
          <p className="text-xs text-muted-foreground mt-0.5">Este formulário é para acesso emergencial temporário. Requer justificativa, incidente associado, aprovação reforçada e revisão obrigatória pós-uso. Todo acesso será auditado.</p>
        </div>
      </div>

      <h2>Dados Gerais — Acesso Emergencial</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormField label="Título da Solicitação" required>
            <InputField placeholder="Ex: Acesso emergencial admin em conta de produção para incidente P1" />
          </FormField>
        </div>
        <FormField label="Provedor" required>
          <InputField value={providerLabel} />
        </FormField>
        <FormField label="Categoria" required>
          <InputField value={category.name} />
        </FormField>
        <FormField label="Subcategoria" required>
          <SelectField options={['Acesso emergencial administrativo', 'Acesso emergencial de leitura', 'Ativação de conta de emergência', 'Concessão temporária de privilégio elevado', 'Elevação temporária de privilégio']} />
        </FormField>
        <FormField label="Solicitante" required>
          <InputField value="Ana Souza" />
        </FormField>
        <FormField label="E-mail" required>
          <InputField value="ana.souza@corp.com" type="email" />
        </FormField>
        <FormField label="Área / Time" required>
          <SelectField options={['Engenharia de Dados', 'SRE / Observabilidade', 'DevOps', 'Segurança', 'Infraestrutura Cloud', 'CSIRT']} />
        </FormField>
        <FormField label="Gestor Responsável" required>
          <SelectField options={['Carlos Silva', 'Juliana Costa', 'Roberto Nascimento', 'Fernanda Lima']} />
        </FormField>
        <FormField label="Sistema / Projeto Impactado" required>
          <InputField placeholder="Ex: Payment Gateway v3" />
        </FormField>
        <FormField label="Ambiente" required>
          <SelectField options={['Desenvolvimento', 'Homologação', 'Produção']} />
        </FormField>
        <FormField label="Criticidade do Sistema" required>
          <SelectField options={['Alta', 'Crítica']} />
        </FormField>
        <FormField label="Incidente Relacionado" required help="Número do incidente no sistema de gestão">
          <InputField placeholder="INC-2024-XXXX" />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Justificativa Emergencial" required help="Descreva a emergência e por que o acesso padrão não atende">
            <TextArea placeholder="Descreva o incidente, o impacto e por que um acesso emergencial é necessário..." rows={4} />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Impacto em Caso de Não Concessão" required>
            <TextArea placeholder="Descreva o impacto caso o acesso não seja concedido..." />
          </FormField>
        </div>
        <FormField label="Data/Hora Desejada" required>
          <InputField type="datetime-local" />
        </FormField>
        <FormField label="Observações">
          <InputField placeholder="Informações adicionais..." />
        </FormField>
      </div>
    </div>
  );
}

function BGStep2({ providerId }: { providerId: string }) {
  return (
    <div className="space-y-5">
      <h2>Escopo do Acesso Emergencial</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Tipo de Acesso Solicitado" required>
          <SelectField options={['Leitura', 'Operador', 'Administrador restrito', 'Administrador', 'Customizado']} />
        </FormField>
        <FormField label="Provedor" required>
          <InputField value={providerId === 'aws' ? 'AWS' : providerId === 'azure' ? 'Azure' : 'OCI'} />
        </FormField>

        {providerId === 'aws' && (
          <>
            <FormField label="Conta AWS Alvo" required>
              <SelectField options={['123456789012 (prd-payment-gateway)', '234567890123 (prd-data-lake)', '567890123456 (prd-shared-services)', '678901234567 (prd-security-logging)']} />
            </FormField>
            <FormField label="Role / PSET Emergencial">
              <InputField placeholder="Ex: EmergencyAdmin-Role" />
            </FormField>
          </>
        )}
        {providerId === 'azure' && (
          <>
            <FormField label="Subscription Alvo" required>
              <SelectField options={['Corp-Production (sub-001)', 'Analytics-Production (sub-004)', 'Security-Hub (sub-005)']} />
            </FormField>
            <FormField label="Role Assignment Temporário">
              <SelectField options={['Owner', 'Contributor', 'User Access Administrator', 'Custom (especificar)']} />
            </FormField>
          </>
        )}
        {providerId === 'oci' && (
          <>
            <FormField label="Compartment Alvo" required>
              <SelectField options={['cmp-financeiro', 'cmp-seguranca', 'cmp-aplicacoes', 'cmp-shared-services']} />
            </FormField>
            <FormField label="Policy Temporária">
              <InputField placeholder="Ex: Allow group to manage all-resources in compartment" />
            </FormField>
          </>
        )}

        <FormField label="Recurso ou Domínio Alvo" required>
          <InputField placeholder="Ex: KMS Key, AKS Cluster, Autonomous DB..." />
        </FormField>
        <FormField label="Usuário / Identidade que Receberá o Acesso" required>
          <InputField placeholder="Ex: ana.souza@corp.com" />
        </FormField>
        <FormField label="Grupo / Perfil Relacionado">
          <InputField placeholder="Ex: GRP-AWS-Emergency-Admin" />
        </FormField>
        <FormField label="Acesso Individual ou Compartilhado?" required>
          <SelectField options={['Individual', 'Compartilhado']} />
        </FormField>
        <FormField label="Precisa Acessar Produção?" required>
          <SelectField options={['Sim', 'Não']} />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Escopo do Acesso" required help="Descreva exatamente o que será acessado">
            <TextArea placeholder="Descreva o escopo detalhado do acesso emergencial..." />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Ações Pretendidas" required help="Liste as ações que serão realizadas com o acesso">
            <TextArea placeholder="Ex: 1. Verificar política KMS, 2. Ajustar deny rule, 3. Validar acesso..." />
          </FormField>
        </div>
      </div>

      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-destructive">Acesso Altamente Sensível</p>
          <p className="text-xs text-muted-foreground mt-0.5">O acesso emergencial será registrado na trilha de auditoria. Todas as ações realizadas serão monitoradas e revisadas após o encerramento.</p>
        </div>
      </div>
    </div>
  );
}

function BGStep3() {
  return (
    <div className="space-y-5">
      <h2>Temporalidade e Controle</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Início Desejado" required>
          <InputField type="datetime-local" />
        </FormField>
        <FormField label="Fim Desejado" required>
          <InputField type="datetime-local" />
        </FormField>
        <FormField label="Duração Máxima" required>
          <SelectField options={['30 minutos', '1 hora', '2 horas', '4 horas', '8 horas', '12 horas', '24 horas']} />
        </FormField>
        <FormField label="Acesso Temporário ou Uso Único?" required>
          <SelectField options={['Temporário (janela de tempo)', 'Uso único (revogação após ação)']} />
        </FormField>
        <FormField label="Necessidade de Revogação Automática" required>
          <SelectField options={['Sim - automática no prazo', 'Não - revogação manual']} />
        </FormField>
        <FormField label="Necessidade de Dupla Aprovação" required>
          <SelectField options={['Sim', 'Não']} />
        </FormField>
        <FormField label="Responsável pelo Acompanhamento" required>
          <InputField placeholder="Ex: roberto.nascimento@corp.com" />
        </FormField>
        <FormField label="Necessidade de Registro de Sessão">
          <SelectField options={['Sim', 'Não']} />
        </FormField>
        <FormField label="Necessidade de Notificação ao Time de Segurança" required>
          <SelectField options={['Sim - imediata', 'Sim - pós-ativação', 'Já notificado']} />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Evidência do Incidente">
            <div className="border-2 border-dashed border-destructive/20 rounded-xl p-6 text-center bg-destructive/5">
              <p className="text-sm text-muted-foreground">Anexe evidência do incidente (screenshot, log, alerta)</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG, TXT até 10MB</p>
            </div>
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Plano de Rollback / Contenção">
            <TextArea placeholder="Descreva o plano de rollback caso a ação emergencial cause impacto adicional..." />
          </FormField>
        </div>
      </div>

      <div className="bg-warning/5 border border-warning/10 rounded-lg p-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-warning">Requer Revogação Controlada</p>
          <p className="text-xs text-muted-foreground mt-0.5">O acesso emergencial será automaticamente revogado ao final do prazo definido. Extensões exigem nova aprovação.</p>
        </div>
      </div>
    </div>
  );
}

function BGStep4({ category }: { category: Category }) {
  return (
    <div className="space-y-5">
      <h2>Segurança e Risco</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormField label="Motivo da Excepcionalidade" required>
            <TextArea placeholder="Explique por que o acesso emergencial é necessário e por que o processo padrão não atende..." rows={3} />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Por que o Acesso Padrão Não Atende?" required>
            <TextArea placeholder="Descreva por que os canais normais de acesso não são suficientes..." />
          </FormField>
        </div>
        <FormField label="Existe Alternativa Menos Privilegiada?" required>
          <SelectField options={['Não - nenhuma alternativa viável', 'Sim - mas não atende no prazo', 'Sim - mas exige mais aprovações']} />
        </FormField>
        <FormField label="Classificação de Risco" required>
          <SelectField options={['Alto', 'Crítico']} />
        </FormField>
        <FormField label="Sensibilidade do Ambiente" required>
          <SelectField options={['Alta', 'Crítica']} />
        </FormField>
        <FormField label="Impacto Potencial" required>
          <SelectField options={['Moderado', 'Alto', 'Muito Alto', 'Catastrófico']} />
        </FormField>
        <FormField label="Aprovação de Segurança" required>
          <SelectField options={['Sim - obtida', 'Sim - pendente', 'Em processo']} />
        </FormField>
        <FormField label="Aprovação Executiva" required>
          <SelectField options={['Sim - obtida', 'Sim - pendente', 'Não necessária']} />
        </FormField>
        <FormField label="Revisão Obrigatória Pós-Uso" required>
          <SelectField options={['Sim']} />
        </FormField>
        <FormField label="Responsável pela Revisão Posterior" required>
          <InputField placeholder="Ex: roberto.nascimento@corp.com" />
        </FormField>
      </div>

      <div className="bg-info/5 border border-info/10 rounded-xl p-4">
        <h3 className="mb-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-info" /> Cadeia de Aprovação Emergencial
        </h3>
        <div className="space-y-2">
          {category.approvals.map((a, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-bold tabular-nums">{i + 1}</span>
              <span>{a}</span>
              <span className="ml-auto text-xs text-muted-foreground">Pendente</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-destructive/5 border-2 border-destructive/20 rounded-lg p-4 flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-destructive">Requer Trilha de Auditoria</p>
          <p className="text-xs text-muted-foreground mt-0.5">Todo acesso Breaking Glass é registrado, monitorado e revisado obrigatoriamente. Desvios de finalidade serão escalonados automaticamente.</p>
        </div>
      </div>
    </div>
  );
}

function BGStep5({ providerId, category }: { providerId: string; category: Category }) {
  const providerLabel = providerId === 'aws' ? 'AWS' : providerId === 'azure' ? 'Azure' : 'OCI';
  return (
    <div className="space-y-5">
      <h2>Revisão Final — Breaking Glass</h2>

      <div className="bg-destructive/5 border-2 border-destructive/20 rounded-xl p-4 flex items-start gap-3">
        <AlertOctagon className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-destructive">Acesso Emergencial — Revisão Obrigatória</p>
          <p className="text-xs text-muted-foreground mt-0.5">Confirme todos os dados antes de enviar. Este acesso será auditado e revisado após o uso.</p>
        </div>
      </div>

      {[
        { title: 'Dados do Acesso Emergencial', items: [
          ['Provedor', providerLabel], ['Categoria', category.name], ['Solicitante', 'Ana Souza'],
          ['Tipo', 'Breaking Glass'], ['Ambiente', 'Produção'], ['Criticidade', 'Crítica'],
          ['Incidente', 'INC-2024-XXXX'],
        ]},
        { title: 'Escopo e Temporalidade', items: [
          ['Tipo de Acesso', 'Administrador'],
          ['Recurso Alvo', providerId === 'aws' ? 'Conta prd-payment-gateway' : providerId === 'azure' ? 'Subscription Corp-Production' : 'Compartment cmp-financeiro'],
          ['Identidade', 'ana.souza@corp.com'],
          ['Duração', '2 horas'],
          ['Revogação', 'Automática'],
          ['Registro de Sessão', 'Sim'],
        ]},
        { title: 'Segurança e Risco', items: [
          ['Risco', 'Crítico'],
          ['Impacto Potencial', 'Muito Alto'],
          ['Alternativa Menos Privilegiada', 'Não disponível'],
          ['Revisão Pós-Uso', 'Obrigatória'],
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
        <h3 className="mb-3">Aprovações Emergenciais</h3>
        {category.approvals.map((a, i) => (
          <div key={i} className="flex items-center gap-3 text-sm py-1.5">
            <span className="w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-bold">{i + 1}</span>
            <span>{a}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border-2 border-destructive/20 p-4">
        <h3 className="mb-3 text-destructive">Checklist de Conformidade — Breaking Glass</h3>
        <div className="space-y-2">
          {[
            { ok: true, text: 'Justificativa emergencial preenchida' },
            { ok: true, text: 'Incidente associado registrado' },
            { ok: true, text: 'Duração máxima definida' },
            { ok: true, text: 'Revogação automática configurada' },
            { ok: true, text: 'Responsável pela revisão definido' },
            { ok: true, text: 'Trilha de auditoria habilitada' },
            { ok: false, text: 'Acesso em ambiente de produção — aprovação reforçada ativada' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${item.ok ? 'bg-success/5 border border-success/10' : 'bg-destructive/5 border border-destructive/10'}`}>
              {item.ok ? <Check className="w-4 h-4 text-success" /> : <AlertOctagon className="w-4 h-4 text-destructive" />}
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
