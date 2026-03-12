import { Layout } from '@/components/Layout';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories, providers, CategoryType } from '@/data/mockData';
import { CriticalityBadge, TypeBadge } from '@/components/Badges';
import { ArrowLeft, ArrowRight, CheckSquare, ShieldCheck, FileText, ClipboardCheck, AlertOctagon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const spring = { type: 'spring' as const, duration: 0.4, bounce: 0 };

function getIcon(name: string) {
  const Icon = (LucideIcons as any)[name];
  return Icon || LucideIcons.FileText;
}

// Cross-cutting categories view
function CrossCuttingView({ typeId }: { typeId: string }) {
  const type = typeId as CategoryType;
  const typeCats = categories.filter(c => c.type === type);
  const title = type === 'audit' ? 'Auditoria e Conformidade' : 'Acesso Emergencial / Breaking Glass';
  const description = type === 'audit'
    ? 'Categorias de auditoria e conformidade disponíveis em todos os provedores cloud.'
    : 'Categorias de acesso emergencial (Breaking Glass) disponíveis em todos os provedores cloud.';
  const icon = type === 'audit' ? <ClipboardCheck className="w-5 h-5 text-info" /> : <AlertOctagon className="w-5 h-5 text-destructive" />;

  const grouped = {
    aws: typeCats.filter(c => c.provider === 'aws'),
    azure: typeCats.filter(c => c.provider === 'azure'),
    oci: typeCats.filter(c => c.provider === 'oci'),
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/catalog" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            {icon}
            <div>
              <h1>{title}</h1>
              <p className="text-muted-foreground mt-0.5">{description}</p>
            </div>
          </div>
        </div>

        {type === 'breaking-glass' && (
          <div className="bg-destructive/5 border-2 border-destructive/20 rounded-xl p-4 flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-destructive">Processo Excepcional e Sensível</p>
              <p className="text-xs text-muted-foreground mt-0.5">Breaking Glass é um processo de acesso emergencial altamente controlado. Requer justificativa, incidente associado, aprovação reforçada, temporalidade definida e revisão obrigatória pós-uso.</p>
            </div>
          </div>
        )}

        {(['aws', 'azure', 'oci'] as const).map(providerId => {
          const providerCats = grouped[providerId];
          if (providerCats.length === 0) return null;
          const provider = providers.find(p => p.id === providerId)!;
          return (
            <div key={providerId}>
              <h2 className="text-foreground mb-3 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full bg-${provider.color}`} />
                {provider.shortName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {providerCats.map((cat, i) => {
                  const Icon = getIcon(cat.icon);
                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: i * 0.03 }}
                      whileHover={{ y: -2 }}
                      className={`bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-all ${type === 'breaking-glass' ? 'ring-1 ring-destructive/10' : ''}`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg ${type === 'breaking-glass' ? 'bg-destructive/10' : 'bg-info/10'} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${type === 'breaking-glass' ? 'text-destructive' : 'text-info'}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold truncate">{cat.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{cat.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <CriticalityBadge criticality={cat.criticality} />
                        <TypeBadge type={cat.type} />
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-muted text-muted-foreground">
                          SLA: {cat.sla}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/catalog/${providerId}/${cat.id}/new`}
                          className={`flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity ${type === 'breaking-glass' ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'}`}
                        >
                          Abrir Solicitação
                        </Link>
                        <Link
                          to={`/catalog/${providerId}/${cat.id}`}
                          className="px-3 py-2 rounded-md bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-1"
                        >
                          Requisitos <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export default function ProviderCategories() {
  const { providerId, typeId } = useParams<{ providerId: string; typeId?: string }>();

  // Cross-cutting view
  if (providerId === 'cross' && typeId) {
    return <CrossCuttingView typeId={typeId} />;
  }

  const provider = providers.find(p => p.id === providerId);
  const providerCategories = categories.filter(c => c.provider === providerId);

  if (!provider) return <Layout><p>Provedor não encontrado.</p></Layout>;

  const standardCats = providerCategories.filter(c => c.type === 'standard');
  const auditCats = providerCategories.filter(c => c.type === 'audit');
  const bgCats = providerCategories.filter(c => c.type === 'breaking-glass');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/catalog" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1>{provider.name}</h1>
            <p className="text-muted-foreground mt-0.5">Categorias de solicitação disponíveis</p>
          </div>
        </div>

        {/* Standard */}
        <div>
          <h2 className="text-foreground mb-3">Solicitações Padrão</h2>
          <CategoryGrid cats={standardCats} providerId={providerId!} providerColor={provider.color} />
        </div>

        {/* Audit */}
        {auditCats.length > 0 && (
          <div>
            <h2 className="text-foreground mb-1 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-info" />
              Auditoria e Conformidade
            </h2>
            <p className="text-xs text-muted-foreground mb-3">Solicitações de auditoria, inventário e revisão de acessos.</p>
            <CategoryGrid cats={auditCats} providerId={providerId!} providerColor="info" isAudit />
          </div>
        )}

        {/* Breaking Glass */}
        {bgCats.length > 0 && (
          <div>
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 mb-3 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-bold text-destructive">Acesso Emergencial / Breaking Glass</p>
                <p className="text-xs text-muted-foreground">Processo excepcional. Requer incidente, aprovação reforçada e revisão pós-uso.</p>
              </div>
            </div>
            <CategoryGrid cats={bgCats} providerId={providerId!} providerColor="destructive" isBreakingGlass />
          </div>
        )}
      </div>
    </Layout>
  );
}

function CategoryGrid({ cats, providerId, providerColor, isAudit, isBreakingGlass }: {
  cats: typeof categories;
  providerId: string;
  providerColor: string;
  isAudit?: boolean;
  isBreakingGlass?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {cats.map((cat, i) => {
        const Icon = getIcon(cat.icon);
        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.03 }}
            whileHover={{ y: -2 }}
            className={`bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-all ${isBreakingGlass ? 'ring-1 ring-destructive/10' : ''}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg bg-${providerColor}/10 flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 text-${providerColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold truncate">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{cat.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <CriticalityBadge criticality={cat.criticality} />
              <TypeBadge type={cat.type} />
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-muted text-muted-foreground">
                <FileText className="w-3 h-3" /> {cat.fieldsCount} campos
              </span>
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-muted text-muted-foreground">
                <CheckSquare className="w-3 h-3" /> {cat.validationsCount} validações
              </span>
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-muted text-muted-foreground">
                <ShieldCheck className="w-3 h-3" /> {cat.approvalsCount} aprovações
              </span>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/catalog/${providerId}/${cat.id}/new`}
                className={`flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity ${isBreakingGlass ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'}`}
              >
                Abrir Solicitação
              </Link>
              <Link
                to={`/catalog/${providerId}/${cat.id}`}
                className="px-3 py-2 rounded-md bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-1"
              >
                Requisitos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
