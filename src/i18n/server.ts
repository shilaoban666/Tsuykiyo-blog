import { cache } from "react";
import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, detectLocale, isLocale, type Locale } from "./config";
import { getMessages, type Messages } from "./messages";

export const getLocale = cache(async (): Promise<Locale> => {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(value)) return value;
  const headerStore = await headers();
  return detectLocale(headerStore.get("accept-language"));
});

export const getI18n = cache(async (): Promise<{ locale: Locale; messages: Messages }> => {
  const locale = await getLocale();
  return { locale, messages: getMessages(locale) };
});