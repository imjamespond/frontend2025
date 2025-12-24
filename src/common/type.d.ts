declare namespace Api {
  export interface Error {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
  }
  export interface ApiError {
    ApiError: {
      status: string;
      timestamp: number;
      message: string;
      cnMessage: string;
    };
  }
}

declare namespace Misc {
  export type Nullable<T> = T | null | undefined;
  export type Noneable<T> = T | undefined;

  export type Prettier<T> = {
    [K in keyof T]: T[K];
  };

  export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
  export type PartialOmit<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
  export type PartialRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

  export type ExtractFCProps<T> = T extends React.FunctionComponent<infer P> ? P : never;

  export type Func = typeof console.log;
  export type AnyParams = Parameters<Func>;
  export type Any = ReturnType<typeof JSON.parse>;

  export type AnyType = boolean | number | string | symbol | null | undefined | object;
  export type AnyList = AnyType[];
}

/**
 * test
 */
// type Foobar = { foo: string; bar: 123 };
// type Foo = Misc.Prettier<Misc.Optional<Foobar, 'bar'>>;
