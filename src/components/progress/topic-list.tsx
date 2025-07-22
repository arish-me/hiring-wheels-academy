"use client";
import Link from "next/link";
import { useCourseProgress } from "./course-progress-provider";
import { CheckCircle2 } from "lucide-react";

export function TopicList({ topics, courseSlug }: { topics: any[]; courseSlug: string }) {
  const { isCompleted } = useCourseProgress();
  return (
    <ul className="space-y-3">
      {topics.map((topic) => (
        <li key={topic.id} className="flex items-center gap-3">
          {isCompleted(topic.id) ? (
            <CheckCircle2 className="text-green-600 w-5 h-5" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-700" />
          )}
          <Link
            href={`/${courseSlug}/${topic.slug}`}
            className="flex-grow hover:text-primary transition-colors"
          >
            {topic.order}. {topic.title}
          </Link>
        </li>
      ))}
    </ul>
  );
} 