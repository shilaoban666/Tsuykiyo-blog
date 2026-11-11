import { PostCard } from "./post-card";
import { Reveal } from "./reveal";
import type { PostListItem } from "@/lib/posts";
import type { Messages } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";

export function PostGrid({ posts, locale, messages }: { posts: PostListItem[]; locale: Locale; messages: Messages }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <Reveal key={post.id} delay={(index % 3) * 0.07} className="h-full">
          <PostCard post={post} locale={locale} messages={messages} />
        </Reveal>
      ))}
    </div>
  );
}
