import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CourseProgressProvider } from "@/components/progress/course-progress-provider";
import { CourseProgressBar } from "@/components/progress/course-progress-bar";
import { TopicList } from "@/components/progress/topic-list";
import { CheckCircle2 } from "lucide-react";

export default async function CoursePage({ params }: { params: { courseSlug: string } }) {
  const course = await prisma.course.findUnique({
    where: { slug: params.courseSlug },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          topics: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const totalChapters = course.chapters.length;
  const totalTopics = course.chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);

  return (
    <CourseProgressProvider courseId={course.id}>
      <div className="container mx-auto p-4 sm:p-8">
        <header className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          {course.imageUrl && (
            <Image
              src={course.imageUrl}
              alt={course.title}
              width={120}
              height={120}
              className="rounded-lg object-contain"
            />
          )}
          <div className="flex-grow">
            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">
            <CourseProgressBar total={totalTopics} />
            <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
            <Accordion type="multiple" className="w-full">
              {course.chapters.map((chapter) => (
                <AccordionItem key={chapter.id} value={chapter.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between items-center w-full">
                      <span>{chapter.order}. {chapter.title}</span>
                      <span className="text-sm text-muted-foreground">{chapter.topics.length} topics</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <TopicList topics={chapter.topics} courseSlug={course.slug} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </main>

          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Stats</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex justify-between"><span>Chapters:</span> <strong>{totalChapters}</strong></li>
                <li className="flex justify-between"><span>Topics:</span> <strong>{totalTopics}</strong></li>
                <li className="flex justify-between"><span>Total Hours:</span> <strong>~5h</strong></li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
               {/* Progress bar and buttons will go here */}
               <p className="text-center text-muted-foreground">Progress tracking coming soon!</p>
            </div>
          </aside>
        </div>
      </div>
    </CourseProgressProvider>
  );
} 