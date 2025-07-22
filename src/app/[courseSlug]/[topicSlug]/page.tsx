import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function TopicPage({ params }: { params: { courseSlug: string; topicSlug: string } }) {
  // Find the course and topic
  const course = await prisma.course.findUnique({
    where: { slug: params.courseSlug },
    include: {
      chapters: {
        orderBy: { order: "asc" },
        include: {
          topics: { orderBy: { order: "asc" } },
        },
      },
    },
  });
  if (!course) notFound();

  // Find the topic and its chapter
  let foundTopic = null;
  let chapterIdx = -1;
  let topicIdx = -1;
  let chapter = null;
  for (let cIdx = 0; cIdx < course.chapters.length; cIdx++) {
    const ch = course.chapters[cIdx];
    for (let tIdx = 0; tIdx < ch.topics.length; tIdx++) {
      const t = ch.topics[tIdx];
      if (t.slug === params.topicSlug) {
        foundTopic = t;
        chapterIdx = cIdx;
        topicIdx = tIdx;
        chapter = ch;
        break;
      }
    }
    if (foundTopic) break;
  }
  if (!foundTopic) notFound();

  // Find previous and next topics (across chapters)
  const flatTopics = course.chapters.flatMap((ch) => ch.topics.map((t) => ({ ...t, chapter: ch })));
  const currentIdx = flatTopics.findIndex((t) => t.id === foundTopic.id);
  const prev = currentIdx > 0 ? flatTopics[currentIdx - 1] : null;
  const next = currentIdx < flatTopics.length - 1 ? flatTopics[currentIdx + 1] : null;

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-8">
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/">Home</Link> &gt; {" "}
        <Link href={`/${course.slug}`}>{course.title}</Link> &gt; {" "}
        <span>{foundTopic.title}</span>
      </nav>
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{foundTopic.title}</h1>
        <p className="text-muted-foreground mb-2">Chapter: {chapter?.title}</p>
      </header>
      <article className="prose prose-neutral dark:prose-invert mb-8">
        {foundTopic.content}
      </article>
      {foundTopic.hasCodeEditor && (
        <div className="mb-8 p-4 border rounded-lg bg-muted">
          <p className="mb-2 font-semibold">Interactive Code Editor (coming soon)</p>
          {/* Code editor will go here */}
        </div>
      )}
      <div className="flex justify-between gap-4 mt-8">
        {prev ? (
          <Link
            href={`/${course.slug}/${prev.slug}`}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80 border text-sm"
          >
            ← {prev.title}
          </Link>
        ) : <div />}
        {next ? (
          <Link
            href={`/${course.slug}/${next.slug}`}
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
          >
            {next.title} →
          </Link>
        ) : <div />}
      </div>
    </div>
  );
} 