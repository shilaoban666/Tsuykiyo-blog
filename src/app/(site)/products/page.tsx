import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { products } from "@/content/site-links";
import { getI18n } from "@/i18n/server";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n();
  return { title: messages["products.title"], description: messages["products.desc"] };
}

export default async function ProductsPage() {
  const { locale, messages } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow="Things I build"
        title={messages["products.title"]}
        description={messages["products.desc"]}
        meta={
          <div className="flex flex-wrap gap-3">
            <span className="chip">{products.length} projects</span>
            <span className="chip">Open source</span>
            <span className="chip">DSH ecosystem</span>
          </div>
        }
      />

      <div className="mx-auto max-w-[1160px] px-5 py-14 sm:px-6">
        <div className="space-y-8">
          {products.map((product, index) => {
            const tagline = product.tagline[locale] ?? product.tagline.en;
            const description = product.description[locale] ?? product.description.en;
            const features = product.features[locale] ?? product.features.en;
            return (
              <Reveal key={product.id} delay={index * 0.06}>
                <Link href={`/products/${product.id}`} className="group block">
                <article className="grid overflow-hidden rounded-[28px] border border-line bg-surface/25 transition-colors duration-500 hover:border-[var(--line-strong)] md:grid-cols-[1.05fr_1fr]">
                  <div
                    className={`relative min-h-[240px] overflow-hidden border-b border-line md:min-h-[380px] md:border-b-0 lg:min-h-[420px] ${
                      index % 2 === 1 ? "lg:order-2 lg:border-l" : "lg:border-r"
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[10px] tracking-[0.16em] text-white/85 backdrop-blur">
                      {product.license}
                    </span>
                    <span className="absolute bottom-4 left-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] tracking-[0.12em] text-white/80 opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100">
                      {messages["products.viewDetails"]} <ArrowUpRight size={12} />
                    </span>
                  </div>

                  <div className={`flex flex-col justify-center p-6 sm:p-9 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <p className="font-display text-[10px] tracking-[0.24em] text-faint">{product.subtitle.toUpperCase()}</p>
                    <h2 className="mt-3 font-serif-cn text-3xl font-semibold leading-tight text-ink transition-colors group-hover:text-accent sm:text-4xl">{product.title}</h2>
                    <p className="mt-3 font-serif-cn text-lg text-accent">{tagline}</p>
                    <p className="mt-4 text-sm leading-7 text-muted">{description}</p>

                    <ul className="mt-6 space-y-2.5">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-muted">
                          <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0" style={{ color: product.accent }} />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="chip">{tag}</span>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                      <span className="text-[10px] tracking-[0.12em] text-faint">
                        {messages["products.license"]} · {product.license}
                      </span>
                      <span className="inline-flex items-center gap-2 text-xs text-muted transition-colors group-hover:text-accent">
                        {messages["products.viewDetails"]}
                        <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </article>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-surface/20 px-6 py-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-[10px] tracking-[0.24em] text-faint">OPEN SOURCE</p>
              <p className="mt-2 font-serif-cn text-lg text-ink">{messages["products.sourceNote"]}</p>
            </div>
            <Link href="/friends" className="btn btn-primary text-xs">
              {messages["nav.friends"]}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}