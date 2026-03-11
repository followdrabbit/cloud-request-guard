import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { providers } from '@/data/mockData';
import { ArrowRight, Cloud } from 'lucide-react';

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
      </div>
    </Layout>
  );
}
