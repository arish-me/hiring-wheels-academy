"use client";
import { useCourseProgress } from "./course-progress-provider";

export function CourseProgressBar({ total }: { total: number }) {
  const { progress } = useCourseProgress();
  const completed = progress.filter((p) => p.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs mb-1">
        <span>Progress</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-3 bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
} 