import { Layout } from '@/components/Layout';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories, providers } from '@/data/mockData';
import { CriticalityBadge } from '@/components/Badges';
import { ArrowLeft, ArrowRight, CheckSquare, ShieldCheck, FileText } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const spring = { type: 'spring' as const, duration: 0.4, bounce: 0 };

function getIcon(name: string) {
  const Icon = (LucideIcons as any)[name];
  return Icon || LucideIcons.FileText;
}

export default function ProviderCategories() {
  const { providerId } = useParams<{ providerId: string }>();
  const provider = providers.find(p => p.id === providerId);
  const providerCategories = categories.filter(c => c.provider === providerId);

  if (!provider) return <Layout><p>Provedor não encontrado.</p></Layout>;

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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {providerCategories.map((cat, i) => {
            const Icon = getIcon(cat.icon);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: i * 0.03 }}
                whileHover={{ y: -2 }}
                className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-${provider.color}/10 flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 text-${provider.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold truncate">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{cat.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <CriticalityBadge criticality={cat.criticality} />
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
                    className="flex-1 text-center px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
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
    </Layout>
  );
}
