import { Provider } from '@/data/mockData';

const providerConfig: Record<Provider, { bg: string; text: string; label: string }> = {
  aws: { bg: 'bg-aws/10', text: 'text-aws', label: 'AWS' },
  azure: { bg: 'bg-azure/10', text: 'text-azure', label: 'Azure' },
  oci: { bg: 'bg-oci/10', text: 'text-oci', label: 'OCI' },
};

export function ProviderBadge({ provider, size = 'sm' }: { provider: Provider; size?: 'sm' | 'lg' }) {
  const config = providerConfig[provider];
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${config.bg} ${config.text} ${
      size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
    }`}>
      {config.label}
    </span>
  );
}

const statusConfig: Record<string, { bg: string; text: string; dot?: string }> = {
  'Em Preenchimento': { bg: 'bg-muted', text: 'text-muted-foreground' },
  'Aguardando Aprovação': { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  'Aprovado': { bg: 'bg-info/10', text: 'text-info' },
  'Em Execução': { bg: 'bg-info/10', text: 'text-info', dot: 'bg-info' },
  'Concluído': { bg: 'bg-success/10', text: 'text-success' },
  'Rejeitado': { bg: 'bg-destructive/10', text: 'text-destructive' },
  'Cancelado': { bg: 'bg-muted', text: 'text-muted-foreground' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig['Em Preenchimento'];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse-dot`} />}
      {status}
    </span>
  );
}

const criticalityConfig: Record<string, { bg: string; text: string }> = {
  'Baixa': { bg: 'bg-success/10', text: 'text-success' },
  'Média': { bg: 'bg-warning/10', text: 'text-warning' },
  'Alta': { bg: 'bg-aws/10', text: 'text-aws' },
  'Crítica': { bg: 'bg-destructive/10', text: 'text-destructive' },
};

export function CriticalityBadge({ criticality }: { criticality: string }) {
  const config = criticalityConfig[criticality] || criticalityConfig['Média'];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}>
      {criticality}
    </span>
  );
}

export function EnvironmentBadge({ env }: { env: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    'Produção': { bg: 'bg-destructive/10', text: 'text-destructive' },
    'Homologação': { bg: 'bg-warning/10', text: 'text-warning' },
    'Desenvolvimento': { bg: 'bg-success/10', text: 'text-success' },
  };
  const c = config[env] || config['Desenvolvimento'];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.bg} ${c.text}`}>
      {env}
    </span>
  );
}
