import type { OptionsType } from "@common/api";
import type { AxiosResponse } from "axios";
import type { Fetcher, Key } from "swr";
import type { MutationFetcher } from "swr/mutation";

export interface SWRKey<Args extends OptionsType = OptionsType> {
  url?: string;
  args: Args;
}

export interface SWRKeyType<Params = unknown, Body = unknown> extends SWRKey<OptionsType<Params, Body>> {}

export type KeyOfSWR<T> = T extends SWRKey<infer U> ? U : never;
export type ParamsOfSWRKey<T> = T extends SWRKey<OptionsType<infer U>> ? U : never;
// eslint-disable-next-line
export type BodyOfSWRKey<T> = T extends SWRKey<OptionsType<infer _, infer U>> ? U : never;

export type KeyOfFetcher<T> = T extends Fetcher<unknown, SWRKey<infer U>> ? SWRKey<U> : never;
export type ArgsOfFetcher<T> = T extends Fetcher<unknown, SWRKey<infer U>> ? U : never;
export type ParamsOfFetcher<T> = T extends Fetcher<unknown, SWRKey<OptionsType<infer U>>> ? U : never;
// eslint-disable-next-line
export type BodyOfFetcher<T> = T extends Fetcher<unknown, SWRKey<OptionsType<infer _, infer U>>> ? U : never;
export type DataOfFetcher<T> = T extends Fetcher<infer U, object> ? U : never;

export type ExtraArgOfMutation<T> = T extends MutationFetcher<unknown, Key, infer U> ? U : never;

export type Request<Params = unknown, Body = unknown, Result = unknown> = {
  (args?: OptionsType<Params, Body>): Promise<AxiosResponse<Result>>;
};
// eslint-disable-next-line
export type BodyOfRequest<T> = T extends Request<infer _, infer U> ? U : never;
// eslint-disable-next-line
export type ParamsOfRequest<T> = T extends Request<infer U, infer _> ? U : never;
// eslint-disable-next-line
export type ArgsOfRequest<T> = T extends Request<infer Params, infer Body> ? OptionsType<Params, Body> : never;
