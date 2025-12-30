import { useEffect, useRef } from "react";

/**
 * 交叉触发请求,
 * @param callback
 * @param init
 * @returns
 */
export function useIntersection({
  callback,
  options,
}: {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const ref = useRef({ callback, options });

  useEffect(() => {
    const { callback, options } = ref.current;
    const root = rootRef.current;
    const target = targetRef.current;
    if (!root || !target) return;
    const observer = new IntersectionObserver(callback, {
      threshold: 0,
      root,
      rootMargin: "0px 0px -50px", // 缩小root底部范围
      ...options,
    });
    observer.observe(target);
    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, []);

  return { rootRef, targetRef };
}
