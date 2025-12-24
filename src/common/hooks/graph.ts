import { Graph as X6, type EdgeMetadata, type NodeMetadata } from "@antv/x6";
import { useDebounceEffect, useSize } from "ahooks";
import { useEffect, useRef } from "react";

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
    this.x6.dispose();
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
    const graphRef = useRef<G>();

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const bbox = container.getBoundingClientRect();
      const graph = (graphRef.current = new GraphClass({
        container,
        width: bbox.width,
        height: bbox.height,
        ...options,
      }));

      return () => graph.dispose();
    }, []);

    const size = useSize(wrapperRef);
    useDebounceEffect(
      () => {
        const graph = graphRef.current;
        if (!graph) return;
        if (!size) return;
        graph.x6graph.resize(size.width, size.height);
      },
      [size],
      { wait: 500 }
    );

    return [containerRef, wrapperRef, graphRef] as const;
  };
}
