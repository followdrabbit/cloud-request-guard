import { Layout } from '@/components/Layout';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, providers, awsAccounts, azureSubscriptions, ociCompartments, adGroups, psets } from '@/data/mockData';
import { ArrowLeft, ArrowRight, Check, AlertTriangle, Info } from 'lucide-react';

const spring = { type: 'spring' as const, duration: 0.4, bounce: 0 };

const steps = [
  { label: 'Dados Gerais', number: 1 },
  { label: 'Dados Técnicos', number: 2 },
  { label: 'Segurança', number: 3 },
  { label: 'Requisitos', number: 4 },
  { label: 'Revisão', number: 5 },
];

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

function InputField({ placeholder, value, onChange, type = 'text' }: { placeholder?: string; value?: string; onChange?: (v: string) => void; type?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value || ''}
      onChange={e => onChange?.(e.target.value)}
      className="input-field w-full"
    />
  );
}

function SelectField({ options, placeholder, value, onChange }: { options: string[]; placeholder?: string; value?: string; onChange?: (v: string) => void }) {
  return (
    <select value={value || ''} onChange={e => onChange?.(e.target.value)} className="input-field w-full">
      <option value="">{placeholder || 'Selecione...'}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function TextArea({ placeholder, rows = 3 }: { placeholder?: string; rows?: number }) {
  return <textarea placeholder={placeholder} rows={rows} className="input-field w-full resize-none" />;
}

export default function NewTicket() {
  const { providerId, categoryId } = useParams();
  const navigate = useNavigate();
  const provider = providers.find(p => p.id === providerId);
  const category = categories.find(c => c.id === categoryId);
  const [currentStep, setCurrentStep] = useState(1);
  const [showErrors, setShowErrors] = useState(false);

  if (!provider || !category) return <Layout><p>Categoria não encontrada.</p></Layout>;

  const isAWSRole = categoryId === 'aws-role';
  const isAWSPset = categoryId === 'aws-pset';
  const isAWSProfile = categoryId === 'aws-profile';
  const isAWSAccount = categoryId === 'aws-account';

  const handleSubmit = () => {
    navigate(`/tickets/CLD-REQ-84721`);
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to={`/catalog/${providerId}`} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1>Nova Solicitação: {category.name}</h1>
            <p className="text-sm text-muted-foreground">{provider.shortName} · {category.description}</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-card rounded-xl p-4 card-shadow">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold tabular-nums transition-colors ${
                    step.number < currentStep ? 'bg-success text-primary-foreground' :
                    step.number === currentStep ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {step.number < currentStep ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step.number === currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 rounded-full transition-colors ${step.number < currentStep ? 'bg-success' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={spring}
            className="bg-card rounded-xl p-6 card-shadow"
          >
            {/* Step 1: General Data */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h2>Dados Gerais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormField label="Título da Solicitação" required error={showErrors ? 'Campo obrigatório' : undefined}>
                      <InputField placeholder="Ex: Criação de Role para Lambda de integração" />
                    </FormField>
                  </div>
                  <FormField label="Provedor Cloud" required>
                    <InputField value={provider.name} />
                  </FormField>
                  <FormField label="Categoria" required>
                    <InputField value={category.name} />
                  </FormField>
                  <FormField label="Solicitante" required>
                    <InputField value="Ana Souza" />
                  </FormField>
                  <FormField label="E-mail do Solicitante" required>
                    <InputField value="ana.souza@corp.com" type="email" />
                  </FormField>
                  <FormField label="Área / Time" required>
                    <SelectField options={['Engenharia de Dados', 'SRE / Observabilidade', 'DevOps', 'Segurança', 'Arquitetura Cloud', 'Business Intelligence', 'Infraestrutura Cloud', 'Desenvolvimento']} />
                  </FormField>
                  <FormField label="Gestor Responsável" required>
                    <SelectField options={['Carlos Silva', 'Juliana Costa', 'Fernanda Lima', 'Roberto Nascimento', 'Ricardo Almeida']} />
                  </FormField>
                  <FormField label="Sistema / Aplicação" required>
                    <InputField placeholder="Ex: Sistema de Reconciliação" />
                  </FormField>
                  <FormField label="Nome do Projeto">
                    <InputField placeholder="Ex: Data Pipeline v2" />
                  </FormField>
                  <FormField label="Centro de Custo" required>
                    <InputField placeholder="Ex: CC-4521" />
                  </FormField>
                  <FormField label="Ambiente" required>
                    <SelectField options={['Desenvolvimento', 'Homologação', 'Produção']} />
                  </FormField>
                  <FormField label="Criticidade do Sistema" required>
                    <SelectField options={['Baixa', 'Média', 'Alta', 'Crítica']} />
                  </FormField>
                  <FormField label="Data Desejada">
                    <InputField type="date" />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="Justificativa de Negócio" required help="Descreva por que essa solicitação é necessária">
                      <TextArea placeholder="Descreva detalhadamente a justificativa de negócio para esta solicitação..." rows={4} />
                    </FormField>
                  </div>
                  <div className="md:col-span-2">
                    <FormField label="Impacto Esperado">
                      <TextArea placeholder="Descreva o impacto esperado desta solicitação..." />
                    </FormField>
                  </div>
                  <div className="md:col-span-2">
                    <FormField label="Observações Adicionais">
                      <TextArea placeholder="Informações adicionais relevantes..." />
                    </FormField>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Technical Data */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h2>Dados Técnicos</h2>
                
                {isAWSRole && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Nome da Role" required help="Formato: service-purpose-role">
                      <InputField placeholder="eks-cluster-autoscaler-role" />
                    </FormField>
                    <FormField label="Descrição">
                      <InputField placeholder="Role para autoscaling do cluster EKS" />
                    </FormField>
                    <FormField label="Conta AWS de Destino" required>
                      <SelectField options={awsAccounts.map(a => `${a.id} (${a.name})`)} placeholder="Selecione a conta..." />
                    </FormField>
                    <FormField label="Account ID" required>
                      <InputField placeholder="123456789012" />
                    </FormField>
                    <FormField label="Trusted Entity Type" required>
                      <SelectField options={['AWS Account', 'AWS Service', 'Federated', 'Web Identity']} />
                    </FormField>
                    <FormField label="Principal Confiável" required help="ARN ou identificador do principal">
                      <InputField placeholder="arn:aws:iam::123456789012:root" />
                    </FormField>
                    <FormField label="Cross-Account?" required>
                      <SelectField options={['Não', 'Sim']} />
                    </FormField>
                    <FormField label="Max Session Duration">
                      <SelectField options={['1 hora', '2 horas', '4 horas', '8 horas', '12 horas']} />
                    </FormField>
                    <div className="md:col-span-2">
                      <FormField label="Policies Gerenciadas a Anexar" help="Selecione ou digite o nome das policies">
                        <InputField placeholder="AmazonEKSClusterPolicy, AmazonEC2ReadOnlyAccess" />
                      </FormField>
                    </div>
                    <div className="md:col-span-2">
                      <FormField label="Policy Customizada (JSON)" help="Cole o JSON da policy inline">
                        <textarea className="input-field w-full font-mono text-xs resize-none" rows={8} placeholder={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}`} />
                      </FormField>
                    </div>
                    <FormField label="Permission Boundary" help="Obrigatório em produção">
                      <SelectField options={['arn:aws:iam::123456789012:policy/BoundaryPolicy', 'arn:aws:iam::123456789012:policy/RestrictedBoundary', 'Nenhum']} />
                    </FormField>
                    <FormField label="Tags Obrigatórias">
                      <InputField placeholder="Environment=prod, Team=data-eng, CostCenter=CC-4521" />
                    </FormField>
                    <FormField label="Necessidade" required>
                      <SelectField options={['Permanente', 'Temporária']} />
                    </FormField>
                    <FormField label="Data de Expiração">
                      <InputField type="date" />
                    </FormField>
                    <div className="md:col-span-2">
                      <FormField label="Justificativa de Menor Privilégio" required>
                        <TextArea placeholder="Descreva como esta role segue o princípio do menor privilégio..." />
                      </FormField>
                    </div>
                    <FormField label="Dono da Role" required>
                      <InputField placeholder="ana.souza@corp.com" />
                    </FormField>
                    <FormField label="Time Responsável" required>
                      <SelectField options={['Engenharia de Dados', 'SRE', 'DevOps', 'Segurança']} />
                    </FormField>
                    {/* Production warning */}
                    <div className="md:col-span-2 bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-warning">Atenção: Ambiente de Produção</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Permission Boundary é obrigatório para roles em produção. Aprovação adicional de Segurança Cloud será exigida.</p>
                      </div>
                    </div>
                  </div>
                )}

                {isAWSPset && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Nome do PSET" required>
                      <InputField placeholder="PSET-ReadOnly-Observability" />
                    </FormField>
                    <FormField label="Descrição">
                      <InputField placeholder="Permission Set de leitura para observabilidade" />
                    </FormField>
                    <FormField label="Finalidade do Perfil" required>
                      <TextArea placeholder="Descreva a finalidade deste Permission Set..." />
                    </FormField>
                    <FormField label="Conta(s) AWS de Destino" required>
                      <SelectField options={awsAccounts.map(a => `${a.id} (${a.name})`)} />
                    </FormField>
                    <FormField label="Policy Gerenciada" required>
                      <InputField placeholder="ReadOnlyAccess, CloudWatchReadOnlyAccess" />
                    </FormField>
                    <FormField label="Permission Boundary" help="Recomendada em produção">
                      <SelectField options={['BoundaryPolicy-Standard', 'BoundaryPolicy-Restricted', 'Nenhum']} />
                    </FormField>
                    <FormField label="Sessão Máxima">
                      <SelectField options={['1 hora', '4 horas', '8 horas', '12 horas']} />
                    </FormField>
                    <FormField label="Tags">
                      <InputField placeholder="Team=sre, Purpose=monitoring" />
                    </FormField>
                    <FormField label="Acesso" required>
                      <SelectField options={['Permanente', 'Temporário']} />
                    </FormField>
                    <FormField label="Grupo AD Relacionado" required help="Grupo do Active Directory que será vinculado">
                      <SelectField options={adGroups} />
                    </FormField>
                    <FormField label="Área Usuária" required>
                      <SelectField options={['SRE', 'DevOps', 'Engenharia', 'Segurança']} />
                    </FormField>
                    <FormField label="Responsável pelo Acesso" required>
                      <InputField placeholder="juliana.costa@corp.com" />
                    </FormField>
                    <FormField label="Risco do Acesso">
                      <SelectField options={['Baixo', 'Médio', 'Alto', 'Crítico']} />
                    </FormField>
                    <div className="md:col-span-2">
                      <FormField label="Justificativa" required>
                        <TextArea placeholder="Justificativa detalhada para criação do PSET..." rows={3} />
                      </FormField>
                    </div>
                    <div className="md:col-span-2">
                      <FormField label="Policy Customizada">
                        <textarea className="input-field w-full font-mono text-xs resize-none" rows={6} placeholder={`{
  "Version": "2012-10-17",
  "Statement": [...]
}`} />
                      </FormField>
                    </div>
                  </div>
                )}

                {isAWSProfile && (
                  <div className="space-y-6">
                    {/* Visual flow */}
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Fluxo de Criação do Perfil</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {['1. Grupo AD', '2. Associação AWS', '3. Vinculação PSET', '4. Contas Alvo', '5. Liberação', '6. Aprovações'].map((s, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="px-3 py-1.5 rounded-lg bg-card card-shadow text-xs font-medium">{s}</span>
                            {i < 5 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Nome do Perfil" required>
                        <InputField placeholder="PRF-SRE-ReadOnly-Prod" />
                      </FormField>
                      <FormField label="Descrição do Perfil" required>
                        <InputField placeholder="Perfil de acesso de leitura para equipe SRE" />
                      </FormField>
                      <FormField label="Área Solicitante" required>
                        <SelectField options={['SRE / Observabilidade', 'DevOps', 'Engenharia', 'Segurança']} />
                      </FormField>
                      <FormField label="Finalidade do Perfil" required>
                        <TextArea placeholder="Descreva a finalidade deste perfil de acesso..." />
                      </FormField>
                      <FormField label="Tipo de Grupo AD" required>
                        <SelectField options={['Novo Grupo', 'Grupo Existente']} />
                      </FormField>
                      <FormField label="Nome do Grupo AD" required help="Ex: GRP-AWS-SRE-ReadOnly">
                        <SelectField options={adGroups} placeholder="Selecione ou digite..." />
                      </FormField>
                      <FormField label="Owner do Grupo AD" required>
                        <InputField placeholder="juliana.costa@corp.com" />
                      </FormField>
                      <FormField label="PSET Associado" required>
                        <SelectField options={psets} />
                      </FormField>
                      <FormField label="Conta(s) AWS de Acesso" required>
                        <SelectField options={awsAccounts.map(a => `${a.id} (${a.name})`)} />
                      </FormField>
                      <FormField label="Tipo de Acesso" required>
                        <SelectField options={['Leitura', 'Operador', 'Administrador Restrito', 'Administrador', 'Customizado']} />
                      </FormField>
                      <FormField label="Usuários Iniciais Previstos">
                        <InputField placeholder="5" type="number" />
                      </FormField>
                      <FormField label="Acesso Privilegiado?">
                        <SelectField options={['Não', 'Sim']} />
                      </FormField>
                      <FormField label="Prazo de Validade">
                        <InputField type="date" />
                      </FormField>
                      <FormField label="Gestor Aprovador" required>
                        <SelectField options={['Juliana Costa', 'Carlos Silva', 'Ricardo Almeida']} />
                      </FormField>
                      <FormField label="Aprovador de Segurança" required>
                        <SelectField options={['Roberto Nascimento', 'Patrícia Gomes']} />
                      </FormField>
                      <FormField label="Dependências">
                        <InputField placeholder="CLD-REQ-84722 (PSET ReadOnly)" />
                      </FormField>
                      <div className="md:col-span-2">
                        <FormField label="Justificativa de Negócio" required>
                          <TextArea placeholder="Justificativa detalhada..." rows={3} />
                        </FormField>
                      </div>
                      <div className="md:col-span-2">
                        <FormField label="Observações">
                          <TextArea placeholder="Informações adicionais..." />
                        </FormField>
                      </div>
                    </div>
                  </div>
                )}

                {isAWSAccount && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Nome da Conta" required>
                        <InputField placeholder="prd-payment-gateway" />
                      </FormField>
                      <FormField label="E-mail da Conta" required help="Deve ser único na organização">
                        <InputField placeholder="aws-prd-payment@corp.com" type="email" />
                      </FormField>
                      <FormField label="Business Unit" required>
                        <SelectField options={['Pagamentos', 'Data & Analytics', 'Infraestrutura', 'Segurança']} />
                      </FormField>
                      <FormField label="Sistema / Projeto" required>
                        <InputField placeholder="Payment Gateway v3" />
                      </FormField>
                      <FormField label="Finalidade da Conta" required>
                        <TextArea placeholder="Descreva a finalidade desta conta AWS..." />
                      </FormField>
                      <FormField label="Necessidade Regulatória">
                        <SelectField options={['PCI-DSS', 'LGPD', 'SOX', 'HIPAA', 'Nenhuma']} />
                      </FormField>
                      <FormField label="Classificação de Dados" required>
                        <SelectField options={['Público', 'Interno', 'Confidencial', 'Restrito']} />
                      </FormField>
                      <FormField label="Região Principal" required>
                        <SelectField options={['us-east-1', 'sa-east-1', 'eu-west-1', 'ap-southeast-1']} />
                      </FormField>
                      <FormField label="Owner Técnico" required>
                        <InputField placeholder="ricardo.almeida@corp.com" />
                      </FormField>
                      <FormField label="Owner Executivo" required>
                        <InputField placeholder="fernanda.lima@corp.com" />
                      </FormField>
                      <FormField label="Equipe Responsável" required>
                        <SelectField options={['Arquitetura Cloud', 'DevOps', 'Engenharia', 'Segurança']} />
                      </FormField>
                    </div>

                    {/* Provisioning section */}
                    <div className="bg-muted/50 rounded-xl p-5">
                      <h3 className="mb-4">Provisionamento Inicial</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          'Conta criada', 'Baseline aplicada', 'Logging habilitado',
                          'Monitoramento habilitado', 'Guardrails aplicados', 'PSET padrão criado',
                          'Perfis padrão criados', 'Acessos administrativos iniciais definidos'
                        ].map((item, i) => (
                          <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                            {item}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Necessidade de PSETs Iniciais">
                        <SelectField options={['Sim', 'Não']} />
                      </FormField>
                      <FormField label="Necessidade de Perfis Iniciais">
                        <SelectField options={['Sim', 'Não']} />
                      </FormField>
                      <div className="md:col-span-2">
                        <FormField label="Observações">
                          <TextArea placeholder="Informações adicionais sobre o provisionamento..." />
                        </FormField>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generic for Azure/OCI */}
                {!isAWSRole && !isAWSPset && !isAWSProfile && !isAWSAccount && providerId === 'azure' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Subscription" required>
                      <SelectField options={azureSubscriptions.map(s => `${s.name} (${s.id})`)} />
                    </FormField>
                    <FormField label="Resource Group">
                      <InputField placeholder="rg-analytics-prod" />
                    </FormField>
                    <FormField label="Scope" required>
                      <SelectField options={['Subscription', 'Resource Group', 'Resource']} />
                    </FormField>
                    <FormField label="Role Definition" required>
                      <SelectField options={['Reader', 'Contributor', 'Owner', 'User Access Administrator', 'Custom Role']} />
                    </FormField>
                    <FormField label="Principal Type" required>
                      <SelectField options={['User', 'Group', 'Service Principal', 'Managed Identity']} />
                    </FormField>
                    <FormField label="Service Principal Name">
                      <InputField placeholder="sp-github-actions-deploy" />
                    </FormField>
                    <FormField label="Tenant">
                      <InputField placeholder="corp.onmicrosoft.com" />
                    </FormField>
                    <FormField label="Owner">
                      <InputField placeholder="felipe.torres@corp.com" />
                    </FormField>
                    <div className="md:col-span-2">
                      <FormField label="Justificativa" required>
                        <TextArea placeholder="Justificativa técnica..." rows={3} />
                      </FormField>
                    </div>
                  </div>
                )}

                {!isAWSRole && !isAWSPset && !isAWSProfile && !isAWSAccount && providerId === 'oci' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Tenancy" required>
                      <InputField placeholder="corp-tenancy" />
                    </FormField>
                    <FormField label="Compartment" required>
                      <SelectField options={ociCompartments.map(c => `${c.name} (${c.id.slice(-10)})`)} />
                    </FormField>
                    <FormField label="Group Name">
                      <InputField placeholder="grp-finops-users" />
                    </FormField>
                    <FormField label="Dynamic Group Rule">
                      <InputField placeholder="ALL {resource.type = 'fnfunc'}" />
                    </FormField>
                    <div className="md:col-span-2">
                      <FormField label="Policy Statement" help="Formato: Allow group X to manage Y in compartment Z">
                        <TextArea placeholder="Allow group grp-finops-users to manage all-resources in compartment cmp-financeiro" rows={3} />
                      </FormField>
                    </div>
                    <FormField label="Target Compartment" required>
                      <SelectField options={ociCompartments.map(c => c.name)} />
                    </FormField>
                    <FormField label="Owner" required>
                      <InputField placeholder="carla.duarte@corp.com" />
                    </FormField>
                    <FormField label="Classificação de Risco">
                      <SelectField options={['Baixo', 'Médio', 'Alto', 'Crítico']} />
                    </FormField>
                    <div className="md:col-span-2">
                      <FormField label="Justificativa" required>
                        <TextArea placeholder="Justificativa detalhada..." rows={3} />
                      </FormField>
                    </div>
                  </div>
                )}

                {/* Fallback for AWS categories without specific forms */}
                {!isAWSRole && !isAWSPset && !isAWSProfile && !isAWSAccount && providerId === 'aws' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Conta AWS" required>
                      <SelectField options={awsAccounts.map(a => `${a.id} (${a.name})`)} />
                    </FormField>
                    <FormField label="Recurso / ARN">
                      <InputField placeholder="arn:aws:..." />
                    </FormField>
                    <FormField label="Tipo de Acesso" required>
                      <SelectField options={['Leitura', 'Escrita', 'Administração', 'Customizado']} />
                    </FormField>
                    <FormField label="Escopo">
                      <InputField placeholder="Bucket, VPC, Security Group..." />
                    </FormField>
                    <div className="md:col-span-2">
                      <FormField label="Detalhes Técnicos" required>
                        <TextArea placeholder="Descreva os detalhes técnicos da solicitação..." rows={4} />
                      </FormField>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Security */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h2>Segurança e Governança</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Classificação de Risco" required>
                    <SelectField options={['Baixo', 'Médio', 'Alto', 'Crítico']} />
                  </FormField>
                  <FormField label="Segregação de Função" required help="Garantir que não há conflito de interesses">
                    <SelectField options={['Sem conflito identificado', 'Conflito mitigado', 'Necessita análise']} />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="Justificativa de Menor Privilégio" required>
                      <TextArea placeholder="Explique como esta solicitação adere ao princípio do menor privilégio..." rows={3} />
                    </FormField>
                  </div>
                  <FormField label="Acesso Privilegiado?" required>
                    <SelectField options={['Não', 'Sim - temporário', 'Sim - permanente']} />
                  </FormField>
                  <FormField label="Necessidade de MFA Adicional">
                    <SelectField options={['Não', 'Sim']} />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="Riscos Identificados">
                      <TextArea placeholder="Liste riscos conhecidos associados a esta solicitação..." />
                    </FormField>
                  </div>

                  {/* Approvals section */}
                  <div className="md:col-span-2 bg-info/5 border border-info/10 rounded-xl p-4">
                    <h3 className="mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4 text-info" /> Cadeia de Aprovação
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
                </div>
              </div>
            )}

            {/* Step 4: Requirements */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <h2>Requisitos e Anexos</h2>

                {/* Requirements checklist */}
                <div className="bg-muted/50 rounded-xl p-5">
                  <h3 className="mb-3">Checklist de Requisitos</h3>
                  <div className="space-y-2">
                    {category.prerequisites.map((p, i) => (
                      <label key={i} className="flex items-center gap-3 text-sm cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" defaultChecked={i < 1} />
                        {p}
                      </label>
                    ))}
                    {category.documents.map((d, i) => (
                      <label key={`doc-${i}`} className="flex items-center gap-3 text-sm cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                        {d}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Validations */}
                <div className="space-y-2">
                  <h3>Validações de Segurança</h3>
                  {category.validations.map((v, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm px-3 py-2 bg-warning/5 rounded-lg border border-warning/10">
                      <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                      {v}
                    </div>
                  ))}
                </div>

                {/* Attachments */}
                <div>
                  <h3 className="mb-3">Anexos</h3>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                    <p className="text-sm text-muted-foreground">Arraste arquivos aqui ou clique para selecionar</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JSON, XLSX até 10MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <h2>Revisão Final</h2>

                {/* Summary sections */}
                {[
                  { title: 'Dados Gerais', items: [
                    ['Provedor', provider.name], ['Categoria', category.name], ['Solicitante', 'Ana Souza'],
                    ['Ambiente', 'Produção'], ['Criticidade', 'Alta'], ['Centro de Custo', 'CC-4521'],
                  ]},
                  { title: 'Dados Técnicos', items: isAWSRole ? [
                    ['Nome da Role', 'lambda-s3-integration-role'], ['Conta AWS', '123456789012 (prd-payment-gateway)'],
                    ['Trusted Entity', 'AWS Service'], ['Principal', 'lambda.amazonaws.com'],
                    ['Policies', 'AmazonS3ReadOnlyAccess'], ['Permission Boundary', 'BoundaryPolicy-Standard'],
                  ] : [['Detalhes', 'Preenchidos conforme categoria']] },
                  { title: 'Segurança e Governança', items: [
                    ['Risco', 'Alto'], ['Segregação', 'Sem conflito'], ['Menor Privilégio', 'Justificado'],
                    ['Acesso Privilegiado', 'Não'],
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

                {/* Approval chain */}
                <div className="rounded-xl border border-border p-4">
                  <h3 className="mb-3">Aprovações Exigidas</h3>
                  {category.approvals.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm py-1.5">
                      <span className="w-6 h-6 rounded-full bg-info/10 text-info flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>

                {/* Compliance checklist */}
                <div className="rounded-xl border border-border p-4">
                  <h3 className="mb-3">Checklist de Conformidade</h3>
                  <div className="space-y-2">
                    {[
                      { ok: true, text: 'Justificativa de negócio preenchida' },
                      { ok: true, text: 'Menor privilégio justificado' },
                      { ok: false, text: 'Permission Boundary ausente para ambiente de produção' },
                      { ok: true, text: 'Tags obrigatórias presentes' },
                      { ok: true, text: 'Segregação de função verificada' },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${item.ok ? 'bg-success/5 border border-success/10' : 'bg-destructive/5 border border-destructive/10'}`}>
                        {item.ok ? <Check className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-destructive" />}
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium disabled:opacity-50 hover:bg-muted/80 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Anterior
          </button>
          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(s => Math.min(5, s + 1))}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Próximo <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Enviar Solicitação
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
