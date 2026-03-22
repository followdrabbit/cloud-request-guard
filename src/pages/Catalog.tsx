import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { catalog } from '@/data/mockData';
import { CriticalityBadge } from '@/components/Badges';
import { ArrowRight, AlertOctagon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const spring = { type: 'spring' as const, duration: 0.4, bounce: 0 };

function getIcon(name: string) {
  const Icon = (LucideIcons as any)[name];
  return Icon || LucideIcons.FileText;
}

const categoryColors: Record<string, { border: string; accent: string }> = {
  'aws-accounts': { border: 'border-aws/30 hover:border-aws/60', accent: 'bg-aws/10 text-aws' },
  'aws-information': { border: 'border-info/30 hover:border-info/60', accent: 'bg-info/10 text-info' },
  'aws-profiles': { border: 'border-info/30 hover:border-info/60', accent: 'bg-info/10 text-info' },
  'aws-iam-users': { border: 'border-info/30 hover:border-info/60', accent: 'bg-info/10 text-info' },
  'aws-iam-groups': { border: 'border-aws/30 hover:border-aws/60', accent: 'bg-aws/10 text-aws' },
  'aws-psets': { border: 'border-aws/30 hover:border-aws/60', accent: 'bg-aws/10 text-aws' },
  'aws-roles': { border: 'border-info/30 hover:border-info/60', accent: 'bg-info/10 text-info' },
  'aws-policies': { border: 'border-warning/30 hover:border-warning/60', accent: 'bg-warning/10 text-warning' },
  'aws-audit': { border: 'border-info/30 hover:border-info/60', accent: 'bg-info/10 text-info' },
  'aws-emergency': { border: 'border-destructive/30 hover:border-destructive/60', accent: 'bg-destructive/10 text-destructive' },
};

export default function Catalog() {
  const standardCats = catalog.filter(c => c.type === 'standard');
  const auditCat = catalog.find(c => c.type === 'audit');
  const emergencyCat = catalog.find(c => c.type === 'breaking-glass');

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1>Catálogo de Serviços AWS</h1>
          <p className="text-muted-foreground mt-1">Selecione uma categoria para abrir uma nova solicitação de atividade executada por Segurança da Informação.</p>
        </div>

        {/* Standard Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {standardCats.map((cat, i) => {
            const Icon = getIcon(cat.icon);
            const colors = categoryColors[cat.id] || categoryColors['aws-accounts'];
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: i * 0.06 }}
                whileHover={{ y: -3 }}
              >
                <Link to={`/catalog/${cat.id}`} className={`block bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all border-2 ${colors.border}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg">{cat.name}</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <CriticalityBadge criticality={cat.criticality} />
                        <span className="text-xs text-muted-foreground">SLA: {cat.sla}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{cat.description}</p>
                  <div className="space-y-1 mb-4">
                    {cat.requestTypes.slice(0, 3).map((rt) => (
                      <div key={rt.id} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                        {rt.name}
                      </div>
                    ))}
                    {cat.requestTypes.length > 3 && (
                      <div className="text-xs text-muted-foreground/60">+{cat.requestTypes.length - 3} tipos de solicitação</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground group">
                    Ver solicitações <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Audit & Emergency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {auditCat && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.3 }}
              whileHover={{ y: -3 }}
            >
              <Link to={`/catalog/${auditCat.id}`} className="block bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all border-2 border-info/30 hover:border-info/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-info/10 text-info">
                    {(() => { const I = getIcon(auditCat.icon); return <I className="w-5 h-5" />; })()}
                  </div>
                  <div>
                    <h2 className="text-lg">{auditCat.name}</h2>
                    <span className="text-xs text-muted-foreground">{auditCat.requestTypes.length} tipos de auditoria · SLA: {auditCat.sla}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{auditCat.description}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground group">
                  Ver auditorias <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          )}

          {emergencyCat && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.36 }}
              whileHover={{ y: -3 }}
            >
              <Link to={`/catalog/${emergencyCat.id}`} className="block bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all border-2 border-destructive/30 hover:border-destructive/60 ring-1 ring-destructive/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-destructive/10 text-destructive">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg">{emergencyCat.name}</h2>
                    <span className="text-xs text-destructive font-medium">Processo excepcional · SLA: {emergencyCat.sla}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{emergencyCat.description}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-destructive group">
                  Acesso emergencial <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
