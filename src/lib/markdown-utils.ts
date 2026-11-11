export function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractHeadings(markdown: string) {
  const headings: { level: number; text: string; id: string }[] = [];
  const seen = new Map<string, number>();
  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/[*_`]/g, "").trim();
    const base = text
      .toLowerCase()
      .replace(/[^\p{Script=Han}\p{Letter}\p{Number}\s-]/gu, "")
      .replace(/\s+/g, "-");
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    headings.push({ level: match[1].length, text, id: count ? `${base}-${count}` : base });
  }
  return headings;
}