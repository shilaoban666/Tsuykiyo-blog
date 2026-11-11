"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeSlash, LockKey, WarningCircle } from "@phosphor-icons/react";
import { api } from "@/lib/client-api";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.replace("/admin");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-4">
      <label className="block">
        <span className="mb-2 block text-[11px] tracking-[0.12em] text-faint">邮箱</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="username"
          placeholder="you@example.com"
          className="field !py-3"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-[11px] tracking-[0.12em] text-faint">密码</span>
        <span className="relative block">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="field !py-3 !pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-faint transition-colors hover:text-ink"
            aria-label={showPassword ? "隐藏密码" : "显示密码"}
          >
            {showPassword ? <EyeSlash size={17} /> : <Eye size={17} />}
          </button>
        </span>
      </label>

      {error ? (
        <p className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2.5 text-xs text-red-300">
          <WarningCircle size={15} /> {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="btn btn-primary mt-2 w-full !py-3.5 disabled:opacity-60">
        {loading ? "正在验证…" : "进入控制台"}
        {!loading ? <ArrowRight size={16} /> : null}
      </button>

      <p className="flex items-start gap-2 pt-2 text-[11px] leading-5 text-faint">
        <LockKey size={14} className="mt-0.5 shrink-0" />
        初始账号与密码在项目 README 中。首次登录后请到「账号与安全」修改密码。
      </p>
    </form>
  );
}