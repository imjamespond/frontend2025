import { KmFlex, KmSpin } from "@components";
import type React from "react";
import { lazy, Suspense } from "react";

type Lazy<T> = typeof lazy<React.FunctionComponent<T>>;
type LazyParams<T> = Parameters<Lazy<T>>;

export function getLazyComponent<T>(load: LazyParams<T>[0], fallback?: React.ReactNode) {
  const Component = lazy(load);
  const fc = (props: React.JSX.IntrinsicAttributes & React.PropsWithRef<T>) => (
    <Suspense
      fallback={
        fallback ?? (
          <KmFlex justify="center">
            <KmSpin />
          </KmFlex>
        )
      }
    >
      <Component {...props} />
    </Suspense>
  );
  return fc;
}
