import { Graph as X6 } from "@antv/x6";
import { kmDebug } from "@common/misc";
import { useDebounceEffect, useSize } from "ahooks";
import { useId, useLayoutEffect, useMemo, useRef } from "react";

type Params = ConstructorParameters<typeof X6>;

export type Options = Params[0];

export abstract class BaseGraph {
  private x6: X6;
  mounted = true;
  constructor(options: Options) {
    this.x6 = new X6({
      grid: { size: 10, visible: true, type: "dot" },
      panning: true,
      mousewheel: true,
      ...options,
    });
  }

  // abstract layout(model?: { nodes?: Node.Metadata[]; edges?: Edge.Metadata[] } | void): void;

  init() {}

  dispose() {
    this.x6.dispose(true);
  }

  get graph() {
    return this.x6;
  }
}

type GraphConstructor<G extends BaseGraph> = new (..._: Params) => G;

export function createUseGraph<G extends BaseGraph>(GraphClass: GraphConstructor<G>, options?: Params[0]) {
  return function useGraph<
    Container extends HTMLElement = HTMLDivElement,
    Wrapper extends HTMLElement = HTMLDivElement,
  >() {
    const containerRef = useRef<Container>(null);
    const wrapperRef = useRef<Wrapper>(null);
    const graphRef = useRef<G | null>(null);
    const id = useId();

    const queue = useMemo(simpleQueue, []);
    const ref = useRef({ queue, id });

    useLayoutEffect(() => {
      const { queue, id } = ref.current;
      kmDebug("mount graph", id);
      queue(() => {
        kmDebug("create graph", id);
        const container = containerRef.current;
        if (!container) return;
        const bbox = container.getBoundingClientRect();
        const graph = new GraphClass({
          container,
          width: bbox.width,
          height: bbox.height,
          ...options,
        });
        graph.init();
        graphRef.current = graph;
      });

      return () => {
        kmDebug("unmount graph", id);

        queue(() => {
          kmDebug("dispose graph", id);
          const graph = graphRef.current;
          if (!graph) return;
          graphRef.current = null;
          graph.mounted = false;
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
          if (!graph?.mounted) return;
          graph.graph.resize(size.width, size.height);
        });
      },
      [size],
      { wait: 500 },
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
