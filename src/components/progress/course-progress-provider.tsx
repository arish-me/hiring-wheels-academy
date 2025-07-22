"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

interface Progress {
  topicId: string;
  completed: boolean;
}

const CourseProgressContext = createContext<{
  progress: Progress[];
  isCompleted: (topicId: string) => boolean;
  loading: boolean;
  refresh: () => void;
}>({ progress: [], isCompleted: () => false, loading: true, refresh: () => {} });

export function CourseProgressProvider({ courseId, children }: { courseId: string; children: React.ReactNode }) {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(() => {
    if (!session) {
      setProgress([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/progress?courseId=${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setProgress(data.progress || []);
        setLoading(false);
      });
  }, [session, courseId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const isCompleted = (topicId: string) => progress.some((p) => p.topicId === topicId && p.completed);

  return (
    <CourseProgressContext.Provider value={{ progress, isCompleted, loading, refresh: fetchProgress }}>
      {children}
    </CourseProgressContext.Provider>
  );
}

export function useCourseProgress() {
  return useContext(CourseProgressContext);
} 