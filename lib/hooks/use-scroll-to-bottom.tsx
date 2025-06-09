// Modified useScrollToBottom hook that doesn't scroll on hover events
import { useEffect, useRef, type RefObject } from "react";

export function useScrollToBottom(
  autoScroll: boolean = true
): [RefObject<HTMLDivElement>, RefObject<HTMLDivElement>, () => void] {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "instant", block: "end" });
    }
  };

  useEffect(() => {
    if (!autoScroll) return;

    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      // Create a more selective observer that won't trigger on hover events
      const observer = new MutationObserver((mutations) => {
        // Check if this is a significant change that should trigger scrolling
        // For example, only scroll on childList changes (new elements added)
        const shouldScroll = mutations.some(
          (mutation) =>
            mutation.type === "childList" && mutation.addedNodes.length > 0
        );

        if (shouldScroll) {
          scrollToBottom();
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: false, // Only observe direct children
        attributes: false, // Don't observe attribute changes
        characterData: false, // Don't observe text changes
      });

      return () => observer.disconnect();
    }
  }, [autoScroll]);

  //@ts-expect-error error
  return [containerRef, endRef, scrollToBottom];
}
