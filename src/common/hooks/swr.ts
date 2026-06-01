import type { OptionsType } from "@common/api";
import { useCallback, useRef } from "react";
import useSWRMutation, { type MutationFetcher } from "swr/mutation";
import { useMsg } from ".";

export function useMut<Data, Params = unknown, Body = unknown>(
  key: string,
  fetcher: MutationFetcher<Data, string, OptionsType<Params, Body>>,
  successTip?: boolean | string,
) {
  const msg = useMsg();
  const mut = useSWRMutation(key, fetcher);

  const stateRef = useRef({ msg, successTip, mut });
  stateRef.current.mut = mut;

  const caller = useCallback(async (arg: OptionsType<Params, Body>) => {
    const { mut, msg, successTip } = stateRef.current;
    try {
      const result = await mut.trigger(arg);
      if (successTip) msg.success(typeof successTip === "string" ? successTip : "操作成功！");
      return [true, result] as const;
    } catch (error) {
      const err = handleError(error);
      if (err) {
        msg.error(err);
      } else {
        msg.error("未知错误");
      }
      return [false, undefined] as const;
    }
  }, []);

  return [caller, mut.isMutating, mut] as const;
}

export function handleError(error: unknown) {
  if (error) {
    if (typeof error === "string") {
      return error;
    } else if (typeof error === "object") {
      let err = error;
      if ("ApiError" in error) {
        err = error.ApiError as object;
      }
      const errs: string[] = [];
      if ("cnMessage" in err && typeof err.cnMessage === "string") {
        errs.push(err.cnMessage);
      }
      if ("message" in err && typeof err.message === "string") {
        errs.push(err.message);
      }
      if ("detail" in err && typeof err.detail === "string") {
        errs.push(err.detail);
      }
      if (errs.length > 0) {
        return errs.join(", ");
      }
    }
  }
}
