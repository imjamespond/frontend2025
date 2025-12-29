import { Graph as X6, type EdgeMetadata, type NodeMetadata } from "@antv/x6";
import { kmDebug } from "@common/misc";
import { useDebounceEffect, useSize } from "ahooks";
import { useLayoutEffect, useMemo, useRef } from "react";

type Params = ConstructorParameters<typeof X6>;

export type Options = Params[0];

export abstract class BaseGraph {
  private x6: X6;
  constructor(options: Options) {
    this.x6 = new X6({
      grid: { size: 10, visible: true, type: "dot" },
      panning: true,
      mousewheel: true,
      ...options,
    });
  }

  abstract layout(model?: { nodes?: NodeMetadata[]; edges?: EdgeMetadata[] } | void): void;

  dispose() {
    this.x6.dispose(true);
  }

  get x6graph() {
    return this.x6;
  }
}

type GraphConstructor<G extends BaseGraph> = new (..._: Params) => G;

export function createUseGraph<G extends BaseGraph>(GraphClass: GraphConstructor<G>, options?: Params[0]) {
  return function useGraph<
    Container extends HTMLElement = HTMLDivElement,
    Wrapper extends HTMLElement = HTMLDivElement
  >() {
    const containerRef = useRef<Container>(null);
    const wrapperRef = useRef<Wrapper>(null);
    const graphRef = useRef<G | null>(null);

    const queue = useMemo(simpleQueue, []);
    const ref = useRef({ queue, mounted: false });

    useLayoutEffect(() => {
      kmDebug("mount graph?");
      ref.current.mounted = true;
      queue(() => {
        kmDebug("create graph");
        const container = containerRef.current;
        if (!container) return;
        const bbox = container.getBoundingClientRect();
        const graph = new GraphClass({
          container,
          width: bbox.width,
          height: bbox.height,
          ...options,
        });
        graphRef.current = graph;
      });

      return () => {
        kmDebug("unmount graph");
        const graph = graphRef.current;
        graphRef.current = null;
        ref.current.mounted = false;
        queue(() => {
          kmDebug("dispose graph");
          if (!graph) return;
          graph.dispose();
        });
      };
    }, []);

    const size = useSize(wrapperRef);
    useDebounceEffect(
      () => {
        if (!size) return;
        ref.current.queue(() => {
          const graph = graphRef.current;
          if (!graph) return;
          if (!ref.current.mounted) return;
          graph.x6graph.resize(size.width, size.height);
        });
      },
      [size],
      { wait: 500 }
    );

    return [containerRef, wrapperRef, graphRef, queue] as const;
  };
}

const simpleQueue = () => {
  let chain = Promise.resolve();

  return (job: () => void) => {
    chain = chain.then(() => {
      return new Promise<void>((resolve) => {
        queueMicrotask(() => {
          try {
            job();
          } finally {
            resolve();
          }
        });
      });
    });
  };
};
