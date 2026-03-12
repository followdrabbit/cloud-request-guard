import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { providers, crossCuttingCategories, categories } from '@/data/mockData';
import { ArrowRight, Cloud, ClipboardCheck, AlertOctagon } from 'lucide-react';

const spring = { type: 'spring' as const, duration: 0.4, bounce: 0 };

const providerColors: Record<string, string> = {
  aws: 'border-aws/30 hover:border-aws/60',
  azure: 'border-azure/30 hover:border-azure/60',
  oci: 'border-oci/30 hover:border-oci/60',
};

const providerAccent: Record<string, string> = {
  aws: 'bg-aws/10 text-aws',
  azure: 'bg-azure/10 text-azure',
  oci: 'bg-oci/10 text-oci',
};

const crossCuttingIcons: Record<string, React.ReactNode> = {
  'audit': <ClipboardCheck className="w-6 h-6" />,
  'breaking-glass': <AlertOctagon className="w-6 h-6" />,
};

const crossCuttingColors: Record<string, { border: string; accent: string }> = {
  'audit': { border: 'border-info/30 hover:border-info/60', accent: 'bg-info/10 text-info' },
  'breaking-glass': { border: 'border-destructive/30 hover:border-destructive/60', accent: 'bg-destructive/10 text-destructive' },
};

export default function Catalog() {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1>Catálogo de Serviços Cloud</h1>
          <p className="text-muted-foreground mt-1">Selecione um provedor para explorar as categorias de solicitação disponíveis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {providers.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <Link
                to={`/catalog/${p.id}`}
                className={`block bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all border-2 ${providerColors[p.id]}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${providerAccent[p.id]}`}>
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg">{p.shortName}</h2>
                    <p className="text-xs text-muted-foreground">{p.name}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{p.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground">{p.categoriesCount} categorias</span>
                </div>
                <div className="space-y-1.5 mb-5">
                  {p.examples.map((ex, j) => (
                    <div key={j} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                      {ex}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground group">
                  Ver Categorias <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Cross-cutting categories */}
        <div>
          <h2 className="text-foreground mb-1">Categorias Transversais</h2>
          <p className="text-sm text-muted-foreground mb-4">Categorias que abrangem todos os provedores cloud.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crossCuttingCategories.map((cc, i) => {
            const colors = crossCuttingColors[cc.id];
            const typeCats = categories.filter(c => c.type === cc.id);
            const providerCounts = {
              aws: typeCats.filter(c => c.provider === 'aws').length,
              azure: typeCats.filter(c => c.provider === 'azure').length,
              oci: typeCats.filter(c => c.provider === 'oci').length,
            };
            return (
              <motion.div
                key={cc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.3 + i * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
              >
                <Link
                  to={`/catalog/cross/${cc.id}`}
                  className={`block bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all border-2 ${colors.border}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.accent}`}>
                      {crossCuttingIcons[cc.id]}
                    </div>
                    <div>
                      <h2 className="text-lg">{cc.name}</h2>
                      <p className="text-xs text-muted-foreground">{cc.count} categorias em todos os provedores</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{cc.description}</p>
                  <div className="flex gap-3 mb-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-aws/10 text-aws font-medium">AWS: {providerCounts.aws}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-azure/10 text-azure font-medium">Azure: {providerCounts.azure}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-oci/10 text-oci font-medium">OCI: {providerCounts.oci}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground group">
                    Ver Categorias <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
