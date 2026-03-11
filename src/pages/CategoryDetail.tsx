import { Layout } from '@/components/Layout';
import { Link, useParams } from 'react-router-dom';
import { categories, providers } from '@/data/mockData';
import { CriticalityBadge } from '@/components/Badges';
import { ArrowLeft, Clock, FileCheck, ShieldCheck, BookOpen, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';

export default function CategoryDetail() {
  const { providerId, categoryId } = useParams();
  const provider = providers.find(p => p.id === providerId);
  const category = categories.find(c => c.id === categoryId);

  if (!provider || !category) return <Layout><p>Categoria não encontrada.</p></Layout>;

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link to={`/catalog/${providerId}`} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1>{category.name}</h1>
              <CriticalityBadge criticality={category.criticality} />
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">{provider.shortName} · {category.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* When to use */}
          <div className="bg-card rounded-xl p-5 card-shadow">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-info" />
              <h3>Quando Usar</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{category.whenToUse}</p>
          </div>

          {/* SLA */}
          <div className="bg-card rounded-xl p-5 card-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-warning" />
              <h3>SLA Estimado</h3>
            </div>
            <p className="text-2xl font-bold tabular-nums">{category.sla}</p>
            <p className="text-xs text-muted-foreground mt-1">Após todas as aprovações concluídas</p>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="bg-card rounded-xl p-5 card-shadow">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="w-5 h-5 text-foreground" />
            <h3>Pré-requisitos</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {category.prerequisites.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-card rounded-xl p-5 card-shadow">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="w-5 h-5 text-foreground" />
            <h3>Documentos Necessários</h3>
          </div>
          <div className="space-y-2">
            {category.documents.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0" />
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Validations */}
        <div className="bg-card rounded-xl p-5 card-shadow">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3>Validações Automáticas</h3>
          </div>
          <div className="space-y-2">
            {category.validations.map((v, i) => (
              <div key={i} className="flex items-center gap-2 text-sm px-3 py-2 bg-warning/5 rounded-lg border border-warning/10">
                <ShieldCheck className="w-4 h-4 text-warning shrink-0" />
                {v}
              </div>
            ))}
          </div>
        </div>

        {/* Approvals */}
        <div className="bg-card rounded-xl p-5 card-shadow">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-info" />
            <h3>Aprovações Esperadas</h3>
          </div>
          <div className="space-y-2">
            {category.approvals.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-info/10 text-info flex items-center justify-center text-xs font-bold tabular-nums">{i + 1}</span>
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Related examples */}
        <div className="bg-card rounded-xl p-5 card-shadow">
          <h3 className="mb-3">Exemplos de Solicitações</h3>
          <div className="space-y-2">
            {category.relatedExamples.map((ex, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                {ex}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/catalog/${providerId}/${categoryId}/new`}
          className="block w-full text-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Iniciar Solicitação
        </Link>
      </div>
    </Layout>
  );
}
