"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useCourseProgress } from "./course-progress-provider";

export function MarkCompleteButton({ topicId, courseId }: { topicId: string; courseId: string }) {
  const { data: session } = useSession();
  const { refresh } = useCourseProgress();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (!session) return;
    // Fetch progress for this topic
    fetch(`/api/progress?courseId=${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.progress?.find((p: any) => p.topicId === topicId && p.completed);
        setCompleted(!!found);
      });
  }, [session, topicId, courseId]);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, completed: !completed }),
    });
    setLoading(false);
    if (res.ok) {
      setCompleted((c) => !c);
      refresh();
      if (!completed) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 2000);
      }
    }
  };

  if (!session) return null;

  return (
    <div className="my-6 flex flex-col items-center gap-2">
      {completed ? (
        <>
          <button
            onClick={handleClick}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
            disabled={loading}
          >
            ✓ Completed (Click to undo)
          </button>
          {celebrate && (
            <div className="mt-2 animate-bounce">
              <span role="img" aria-label="party">🎉</span> <span className="font-bold">Great job!</span>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={handleClick}
          className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
          disabled={loading}
        >
          Mark as Complete
        </button>
      )}
    </div>
  );
} 