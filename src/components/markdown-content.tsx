import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";

const components: Components = {
  a({ href, children, ...props }) {
    const external = href?.startsWith("http");
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined} {...props}>
        {children}
      </a>
    );
  },
  img({ src, alt, ...props }) {
    return <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} loading="lazy" {...props} />;
  },
  table({ children }) {
    return (
      <div className="my-8 overflow-x-auto rounded-xl border border-line">
        <table>{children}</table>
      </div>
    );
  },
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-moon">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeHighlight, { ignoreMissing: true }]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}