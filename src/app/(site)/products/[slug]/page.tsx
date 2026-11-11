import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  DownloadSimple,
  GithubLogo,
  Terminal,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";
import { CopyButton } from "@/components/copy-button";
import { products } from "@/content/site-links";
import { getI18n } from "@/i18n/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, { locale }] = await Promise.all([params, getI18n()]);
  const product = products.find((item) => item.id === slug);
  if (!product) return { title: "Product" };
  const tagline = product.tagline[locale] ?? product.tagline.en;
  return {
    title: product.title,
    description: tagline,
    openGraph: {
      type: "website",
      title: product.title,
      description: tagline,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const [{ slug }, { locale, messages }] = await Promise.all([params, getI18n()]);
  const product = products.find((item) => item.id === slug);
  if (!product) notFound();

  const lang = locale === "zh" ? "zh" : "en";
  const [titleMain, titleEn] = product.title.split(" · ");
  const tagline = product.tagline[locale] ?? product.tagline.en;
  const description = product.description[locale] ?? product.description.en;
  const features = product.features[locale] ?? product.features.en;
  const featureDetails = product.featureDetails[lang];
  const longDescription = product.longDescription[lang];
  const note = product.note[lang];
  const download = product.downloads?.[0];
  const nextProduct = products[(products.indexOf(product) + 1) % products.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.title,
    description: tagline,
    codeRepository: product.repo,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    license: product.license,
    image: product.image,
  };

  return (
    <article className="overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ——— HERO ——— */}
      <section className="relative border-b border-line pb-16 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:56px_56px] opacity-30 [mask-image:radial-gradient(ellipse_at_50%_0%,black_10%,transparent_70%)]" />
          <div className="absolute -right-40 top-0 size-[560px] rounded-full opacity-20 blur-[120px]" style={{ background: product.accent }} />
        </div>

        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6">
          <Link href="/products" className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] text-faint transition-colors hover:text-accent">
            <ArrowLeft size={13} /> {messages["products.back"]}
          </Link>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/40 px-3 py-1 text-[10px] tracking-[0.1em] text-muted">
                  <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" />
                  {messages["products.earlyAccess"]}
                </span>
                <span className="chip">{product.license}</span>
              </div>

              <p className="mt-6 font-display text-[10px] tracking-[0.28em] text-faint">{product.subtitle.toUpperCase()}</p>
              <h1 className="mt-3 font-serif-cn text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                {titleMain}
                {titleEn ? <span className="mt-4 block font-display text-base font-normal tracking-[0.28em] text-faint sm:text-lg">{titleEn.toUpperCase()}</span> : null}
              </h1>
              <p className="mt-5 font-serif-cn text-xl leading-9 text-accent sm:text-2xl">{tagline}</p>
              <p className="mt-5 max-w-xl text-sm leading-8 text-muted">{description}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {download ? (
                  <a href={download.url} className="btn btn-primary text-xs">
                    <DownloadSimple size={16} weight="light" />
                    {messages["products.downloadNow"]}
                    <span className="text-[9px] opacity-60">{download.size}</span>
                  </a>
                ) : (
                  <a href="#install" className="btn btn-primary text-xs">
                    <Terminal size={15} weight="light" />
                    {messages["products.installGuide"]}
                  </a>
                )}
                <a href={product.repo} target="_blank" rel="noreferrer" className="btn btn-ghost text-xs">
                  <GithubLogo size={16} weight="light" />
                  {messages["products.viewGithub"]}
                  <ArrowUpRight size={14} />
                </a>
                {product.releaseNotesUrl ? (
                  <a href={product.releaseNotesUrl} target="_blank" rel="noreferrer" className="text-[11px] text-faint underline underline-offset-4 transition-colors hover:text-accent">
                    {messages["products.releaseNotes"]}
                  </a>
                ) : null}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="chip">{tag}</span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 rounded-[36px] border border-line/60" />
              <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,.8)]">
                <img src={product.image} alt={product.title} className="aspect-[3/2] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[10px] tracking-[0.16em] text-faint">
                <span>OPEN SOURCE · {product.license}</span>
                <span>{product.subtitle.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— STATS ——— */}
      <section className="border-b border-line bg-surface/20">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 px-5 sm:grid-cols-4 sm:px-6">
          {product.stats.map((stat) => (
            <div key={stat.value} className="border-b border-line bg-surface/30 px-5 py-7 odd:border-r sm:border-b-0 sm:border-r sm:px-6 sm:last:border-r-0">
              <p className="font-display text-3xl text-ink sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-[11px] tracking-[0.12em] text-faint">{stat[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ——— DOWNLOAD ——— */}
      {download ? (
        <section id="download" className="relative overflow-hidden border-b border-line">
          <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: `radial-gradient(ellipse at 18% 50%, color-mix(in srgb, ${product.accent} 16%, transparent), transparent 55%)` }} />
          <div className="relative mx-auto grid max-w-[1240px] items-center gap-6 px-5 py-9 sm:px-6 lg:grid-cols-[auto_1fr_auto]">
            <div className="grid size-14 place-items-center rounded-2xl border border-line bg-surface/50" style={{ color: product.accent }}>
              <DownloadSimple size={26} weight="light" />
            </div>
            <div>
              <p className="font-display text-[10px] tracking-[0.24em] text-faint">DOWNLOAD / {download.version}</p>
              <h2 className="mt-2 font-serif-cn text-2xl font-semibold text-ink">{download.label[lang]}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">{messages["products.downloadNote"]}</p>
              <p className="mt-2 font-mono text-[10px] tracking-wide text-faint">
                {download.filename} · {messages["products.version"]} {download.version} · {messages["products.size"]} {download.size}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a href={download.url} download={download.filename} className="btn btn-primary text-xs">
                <DownloadSimple size={16} weight="bold" />
                {messages["products.downloadNow"]}
              </a>
              {product.releaseNotesUrl ? (
                <a href={product.releaseNotesUrl} target="_blank" rel="noreferrer" className="btn btn-ghost !py-2.5 text-xs">
                  {messages["products.releaseNotes"]}
                  <ArrowUpRight size={13} />
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* ——— OVERVIEW ——— */}
      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.62fr_1fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="font-display text-[10px] tracking-[0.24em] text-faint">01 / {messages["products.overview"]}</p>
              <h2 className="mt-4 font-serif-cn text-3xl font-semibold leading-snug text-ink sm:text-4xl">
                {messages["products.highlights"]}
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-faint">{note}</p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="font-serif-cn text-lg leading-9 text-muted">{longDescription}</p>
            </Reveal>
            <div className="mt-10 space-y-4">
              {features.map((feature, index) => (
                <Reveal key={feature} delay={index * 0.06}>
                  <div className="group flex gap-4 rounded-2xl border border-line bg-surface/20 p-5 transition-colors hover:border-[var(--line-strong)]">
                    <span className="font-display text-sm" style={{ color: product.accent }}>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-serif-cn text-lg text-ink">{feature}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted">{featureDetails[index]}</p>
                    </div>
                    <CheckCircle size={17} weight="fill" className="ml-auto mt-1 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: product.accent }} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— GALLERY ——— */}
      <section className="border-y border-line bg-surface/15 py-20 sm:py-28">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-[10px] tracking-[0.24em] text-faint">02 / {messages["products.gallery"]}</p>
              <h2 className="mt-4 font-serif-cn text-3xl font-semibold text-ink sm:text-4xl">{messages["products.gallery"]}</h2>
            </div>
            <span className="text-[10px] tracking-[0.14em] text-faint">REAL PRODUCT UI · {product.screenshots.length} SHOTS</span>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {product.screenshots.map((shot, index) => (
              <Reveal key={shot.src} delay={index * 0.05} className={index === 0 ? "lg:col-span-2" : ""}>
                <figure className="group overflow-hidden rounded-2xl border border-line bg-[var(--surface-solid)]">
                  <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                    <span className="size-2 rounded-full bg-[#ff5f57]" />
                    <span className="size-2 rounded-full bg-[#febc2e]" />
                    <span className="size-2 rounded-full bg-[#28c840]" />
                    <span className="ml-2 truncate font-mono text-[10px] text-faint">github.com/shilaoban666</span>
                  </div>
                  <div className="overflow-hidden">
                    <img
                      src={shot.src}
                      alt={shot[lang]}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.015]"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-[11px] text-faint">
                    <span>{shot[lang]}</span>
                    <span className="font-display text-[9px] tracking-[0.18em]">{String(index + 1).padStart(2, "0")}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— INSTALL / TECH ——— */}
      <section id="install" className="mx-auto max-w-[1240px] scroll-mt-28 px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div className="overflow-hidden rounded-[24px] border border-line bg-[#090b14]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <div className="flex items-center gap-2 text-[10px] tracking-[0.16em] text-white/45">
                  <Terminal size={14} /> {messages["products.quickstart"]}
                </div>
                <span className="font-mono text-[10px] text-white/30">bash</span>
              </div>
              <div className="px-5 py-6">
                {product.install.map((line, index) => (
                  <div key={`${line}-${index}`} className="flex items-start gap-3 font-mono text-[12px] leading-7 sm:text-[13px]">
                    <span className="select-none text-white/25">{line.trim().startsWith("#") ? "#" : "$"}</span>
                    <code className={line.trim().startsWith("#") ? "text-white/35" : "text-[#d7dcec]"}>{line.replace(/^#\s?/, "")}</code>
                  </div>
                ))}
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <p className="max-w-sm text-[10px] leading-5 text-white/35">{note}</p>
                  <CopyButton
                    value={product.install.filter((line) => !line.trim().startsWith("#")).join("\n")}
                    label={messages["products.copy"]}
                    copiedLabel={messages["products.copied"]}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[10px] text-white/60 transition-colors hover:border-accent hover:text-accent"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="flex h-full flex-col rounded-[24px] border border-line bg-surface/25 p-6">
              <p className="font-display text-[10px] tracking-[0.24em] text-faint">03 / {messages["products.tech"]}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="chip">{tag}</span>
                ))}
              </div>
              <div className="mt-6 space-y-3 border-t border-line pt-5 text-xs text-muted">
                <p className="flex items-center justify-between gap-3">
                  <span>{messages["products.license"]}</span>
                  <span className="font-display text-ink">{product.license}</span>
                </p>
                <p className="flex items-center justify-between gap-3">
                  <span>{messages["products.status"]}</span>
                  <span className="text-emerald-300">{messages["products.earlyAccess"]}</span>
                </p>
              </div>
              <a href={product.repo} target="_blank" rel="noreferrer" className="btn btn-ghost mt-auto !py-2.5 text-xs">
                <GithubLogo size={15} weight="light" />
                {messages["products.viewGithub"]}
                <ArrowUpRight size={14} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— NEXT ——— */}
      <section className="mx-auto max-w-[1240px] border-t border-line px-5 py-14 sm:px-6">
        <p className="font-display text-[10px] tracking-[0.24em] text-faint">{messages["products.next"]}</p>
        <Link href={`/products/${nextProduct.id}`} className="group mt-5 flex flex-col justify-between gap-5 rounded-2xl border border-line bg-surface/25 p-5 transition-colors hover:border-[var(--line-strong)] sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <img src={nextProduct.image} alt="" className="size-20 rounded-xl border border-line object-cover" />
            <div>
              <h3 className="font-serif-cn text-xl text-ink transition-colors group-hover:text-accent">{nextProduct.title}</h3>
              <p className="mt-1 text-xs text-faint">{nextProduct.tagline[locale] ?? nextProduct.tagline.en}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-xs text-muted transition-colors group-hover:text-accent">
            {messages["products.viewDetails"]}
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </Link>
      </section>
    </article>
  );
}