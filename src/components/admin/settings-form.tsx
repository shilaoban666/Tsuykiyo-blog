"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, FloppyDisk, Plus, Trash, UserCircle } from "@phosphor-icons/react";
import { api } from "@/lib/client-api";
import type { SiteSettings, TimelineEntry } from "@/lib/settings";

type Tab = "identity" | "home" | "about" | "social";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("identity");
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateTimeline(index: number, patch: Partial<TimelineEntry>) {
    update("timeline", form.timeline.map((entry, entryIndex) => (entryIndex === index ? { ...entry, ...patch } : entry)));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await api("/api/admin/settings", { method: "PUT", body: JSON.stringify(form) });
      setMessage("站点设置已保存，刷新前台即可看到变化。");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "identity", label: "站点与作者" },
    { key: "home", label: "首页文案" },
    { key: "about", label: "关于页面" },
    { key: "social", label: "社交与页脚" },
  ];

  return (
    <form onSubmit={save}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 rounded-full border border-line p-1">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${tab === item.key ? "bg-accent text-[var(--accent-ink)]" : "text-muted hover:text-ink"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button type="submit" disabled={saving} className="btn btn-primary !py-2.5 text-xs">
          <FloppyDisk size={15} /> {saving ? "保存中…" : "保存设置"}
        </button>
      </div>

      {message ? (
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-xs text-emerald-300">
          <CheckCircle size={15} /> {message}
        </p>
      ) : null}
      {error ? <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs text-red-300">{error}</p> : null}

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-5">
          {tab === "identity" ? (
            <>
              <Section title="站点身份" hint="会出现在导航、页脚、浏览器标题与分享卡片中。">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="中文站名"><input value={form.siteName} onChange={(event) => update("siteName", event.target.value)} className="field" /></Field>
                  <Field label="英文站名"><input value={form.siteEn} onChange={(event) => update("siteEn", event.target.value)} className="field" /></Field>
                  <Field label="作者名"><input value={form.authorName} onChange={(event) => update("authorName", event.target.value)} className="field" /></Field>
                  <Field label="作者英文名"><input value={form.authorEn} onChange={(event) => update("authorEn", event.target.value)} className="field" /></Field>
                  <Field label="所在地"><input value={form.location} onChange={(event) => update("location", event.target.value)} className="field" /></Field>
                  <Field label="建站日期"><input type="date" value={form.startDate} onChange={(event) => update("startDate", event.target.value)} className="field" /></Field>
                </div>
                <Field label="一句话签名"><input value={form.tagline} onChange={(event) => update("tagline", event.target.value)} className="field" /></Field>
                <Field label="站点描述"><textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={2} className="field resize-y" /></Field>
                <Field label="作者简介"><textarea value={form.bio} onChange={(event) => update("bio", event.target.value)} rows={2} className="field resize-y" /></Field>
                <Field label="头像地址"><input value={form.avatarUrl} onChange={(event) => update("avatarUrl", event.target.value)} className="field font-mono text-xs" /></Field>
                <label className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm text-muted">
                  开启文章评论
                  <input type="checkbox" checked={form.commentsEnabled} onChange={(event) => update("commentsEnabled", event.target.checked)} className="size-4 accent-[var(--accent)]" />
                </label>
              </Section>
            </>
          ) : null}

          {tab === "home" ? (
            <Section title="首页文案" hint="如果想把标题分成两行，请使用 / 分隔，例如「把夜色 / 写成一页」。">
              <Field label="眉题（英文小字）"><input value={form.heroEyebrow} onChange={(event) => update("heroEyebrow", event.target.value)} className="field font-mono text-xs" /></Field>
              <Field label="主标题"><input value={form.heroTitle} onChange={(event) => update("heroTitle", event.target.value)} className="field font-serif-cn text-lg" /></Field>
              <Field label="首页副标题"><textarea value={form.heroSubtitle} onChange={(event) => update("heroSubtitle", event.target.value)} rows={3} className="field resize-y" /></Field>
              <Field label="公告条"><input value={form.announcement} onChange={(event) => update("announcement", event.target.value)} className="field" /></Field>
            </Section>
          ) : null}

          {tab === "about" ? (
            <Section title="关于页面" hint="这些内容会出现在 /about。">
              <Field label="关于我（支持换行分段）"><textarea value={form.aboutIntro} onChange={(event) => update("aboutIntro", event.target.value)} rows={8} className="field resize-y" /></Field>
              <Field label="此刻在做的事"><textarea value={form.nowText} onChange={(event) => update("nowText", event.target.value)} rows={3} className="field resize-y" /></Field>
              <Field label="技术栈 / 工具（逗号分隔）">
                <input value={form.stack.join(", ")} onChange={(event) => update("stack", event.target.value.split(/[,，]/).map((item) => item.trim()).filter(Boolean))} className="field" />
              </Field>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] text-faint">时间线</span>
                  <button type="button" onClick={() => update("timeline", [...form.timeline, { year: String(new Date().getFullYear()), title: "", description: "" }])} className="inline-flex items-center gap-1 text-[11px] text-accent">
                    <Plus size={12} /> 添加一行
                  </button>
                </div>
                <div className="space-y-3">
                  {form.timeline.map((entry, index) => (
                    <div key={index} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-[80px_1fr_auto]">
                      <input value={entry.year} onChange={(event) => updateTimeline(index, { year: event.target.value })} placeholder="年份" className="field !py-2 text-xs" />
                      <div className="space-y-2">
                        <input value={entry.title} onChange={(event) => updateTimeline(index, { title: event.target.value })} placeholder="标题" className="field !py-2 text-xs" />
                        <input value={entry.description} onChange={(event) => updateTimeline(index, { description: event.target.value })} placeholder="描述" className="field !py-2 text-xs" />
                      </div>
                      <button type="button" onClick={() => update("timeline", form.timeline.filter((_, itemIndex) => itemIndex !== index))} className="grid size-8 place-items-center self-center rounded-full text-faint hover:text-red-400" aria-label="删除时间线">
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          ) : null}

          {tab === "social" ? (
            <Section title="社交与页脚" hint="留空的社交项不会显示在站点上。">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="GitHub"><input value={form.socials.github ?? ""} onChange={(event) => update("socials", { ...form.socials, github: event.target.value })} className="field" /></Field>
                <Field label="X / Twitter"><input value={form.socials.x ?? ""} onChange={(event) => update("socials", { ...form.socials, x: event.target.value })} className="field" /></Field>
                <Field label="邮箱"><input value={form.socials.email ?? ""} onChange={(event) => update("socials", { ...form.socials, email: event.target.value })} className="field" /></Field>
                <Field label="Bilibili"><input value={form.socials.bilibili ?? ""} onChange={(event) => update("socials", { ...form.socials, bilibili: event.target.value })} className="field" /></Field>
                <Field label="微博"><input value={form.socials.weibo ?? ""} onChange={(event) => update("socials", { ...form.socials, weibo: event.target.value })} className="field" /></Field>
              </div>
              <Field label="页脚短句"><input value={form.footerText} onChange={(event) => update("footerText", event.target.value)} className="field" /></Field>
              <Field label="备案号（可选）"><input value={form.icp} onChange={(event) => update("icp", event.target.value)} className="field" /></Field>
            </Section>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-surface/25 p-5">
            <p className="font-display text-[10px] tracking-[0.2em] text-faint">LIVE PREVIEW</p>
            <div className="mt-4 flex items-center gap-3">
              <img src={form.avatarUrl} alt="" className="size-12 rounded-full border border-line object-cover" />
              <div>
                <p className="font-serif-cn text-lg text-ink">{form.siteName}</p>
                <p className="font-display text-[9px] tracking-[0.24em] text-faint">{form.siteEn}</p>
              </div>
            </div>
            <p className="mt-4 font-serif-cn text-sm leading-6 text-muted">{form.tagline}</p>
            <div className="mt-4 border-t border-line pt-3 text-[10px] leading-5 text-faint">{form.footerText}</div>
          </div>
          <div className="rounded-2xl border border-line bg-surface/25 p-5">
            <p className="font-display text-[10px] tracking-[0.2em] text-faint">TIP</p>
            <p className="mt-3 text-[11px] leading-6 text-faint">
              设置保存在 PostgreSQL 的 site_settings 表里，不会因为重新构建而丢失。修改后刷新前台页面即可生效。
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface/20 p-5 sm:p-6">
      <h2 className="font-serif-cn text-xl text-ink">{title}</h2>
      {hint ? <p className="mt-1 text-[11px] text-faint">{hint}</p> : null}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] text-faint">{label}</span>
      {children}
    </label>
  );
}

export function AccountForm({ user }: { user: { name: string; email: string } }) {
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setMessage("");
    try {
      await api("/api/admin/account", {
        method: "PUT",
        body: JSON.stringify({ name, currentPassword: currentPassword || undefined, newPassword: newPassword || undefined }),
      });
      setState("ok");
      setMessage("账号信息已更新。");
      setCurrentPassword("");
      setNewPassword("");
    } catch (reason) {
      setState("error");
      setMessage(reason instanceof Error ? reason.message : "更新失败");
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-surface/20 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <UserCircle size={24} weight="light" className="text-accent" />
        <div>
          <h2 className="font-serif-cn text-lg text-ink">账号与安全</h2>
          <p className="text-[10px] text-faint">{user.email}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="显示名称" className="field text-xs" aria-label="显示名称" />
        <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="当前密码" className="field text-xs" autoComplete="current-password" aria-label="当前密码" />
        <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="新密码（至少 8 位）" className="field text-xs" autoComplete="new-password" aria-label="新密码" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className={`text-[11px] ${state === "error" ? "text-red-400" : "text-emerald-300"}`}>{message}</p>
        <button type="submit" disabled={state === "saving"} className="btn btn-ghost !py-2.5 text-xs">{state === "saving" ? "更新中…" : "更新账号"}</button>
      </div>
    </form>
  );
}