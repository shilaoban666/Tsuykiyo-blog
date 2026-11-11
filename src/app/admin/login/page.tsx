import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "登录控制台" };

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");

  return (
    <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-line-strong">
            <svg viewBox="0 0 32 32" className="size-5 text-accent" aria-hidden>
              <path d="M21.7 5.2a11 11 0 1 0 5.1 17.6A9.2 9.2 0 0 1 21.7 5.2Z" fill="currentColor" />
            </svg>
          </span>
          <div>
            <p className="font-serif-cn text-sm tracking-[0.18em] text-ink">月白</p>
            <p className="font-display text-[8px] tracking-[0.32em] text-faint">STUDIO ACCESS</p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[400px] py-12">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-7 bg-accent" /> Private entrance
          </p>
          <h1 className="mt-5 font-serif-cn text-4xl font-semibold leading-tight text-ink">
            回到月光的另一边
          </h1>
          <p className="mt-3 text-sm leading-7 text-faint">输入你的管理员账号，继续写作、整理与发布。</p>
          <LoginForm />
        </div>

        <p className="text-[10px] tracking-[0.18em] text-faint">TSUKIYO CMS · NEXT.JS + POSTGRESQL</p>
      </div>

      <div className="relative hidden overflow-hidden border-l border-line lg:block">
        <img
          src="/art/generated/hero-night.webp"
          alt="雨夜屋顶上撑伞望月的银发少女"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-sm font-serif-cn text-2xl leading-relaxed text-white/85 [text-shadow:0_4px_30px_rgba(0,0,0,.8)]">
            “写作是把夜晚折成纸船，放进别人的梦里。”
          </p>
          <p className="mt-4 font-display text-[10px] tracking-[0.3em] text-white/45">A NOTE FROM TSUKIYO</p>
        </div>
      </div>
    </div>
  );
}