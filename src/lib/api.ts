import { useCallback, useRef } from "react";
import useSWRMutation, {
  MutationFetcher,
  TriggerWithArgs,
  TriggerWithOptionsArgs,
  TriggerWithoutArgs,
} from "swr/mutation";

export type Arg<P extends Record<string, string> | void, B = object> = {
  params?: P;
  body?: B;
};

export const post = async (input: string, arg: Arg<Record<string, string> | void, object>) => {
  const response = await fetch(arg.params ? `${input}?${new URLSearchParams(arg.params)}` : input, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: arg.body ? JSON.stringify(arg.body) : undefined,
  });
  const result = await response.json();
  if (!response.ok) {
    // Create and throw an error with the status text
    throw { cause: result, status: response.status, statusText: response.statusText };
  }
  return result;
};
export function useMut<ExtraArg, Data = unknown>(key: string, fetcher: MutationFetcher<Data, string, ExtraArg>) {
  // [ExtraArg] extends [never] ? TriggerWithoutArgs<Data, unknown, string, ExtraArg> 没参数
  // : IsUndefinedIncluded<ExtraArg> extends true ? TriggerWithOptionsArgs<Data, unknown, string, ExtraArg> 参数可空
  // : TriggerWithArgs<Data, unknown, string, ExtraArg> 有参数
  const { trigger, isMutating, data, error } = useSWRMutation<Data, unknown, string, ExtraArg>(key, fetcher);
  const ref = useRef({ trigger });
  type TriggerT = typeof trigger;
  const triggerFn = useCallback((...args: Parameters<TriggerT>) => {
    try {
      const _trigger = ref.current.trigger;
      if (args.length === 0) {
        return (_trigger as unknown as TriggerWithoutArgs<Data, unknown, string, ExtraArg>)();
      }
      const arg = args[0];
      if (arg) {
        return (_trigger as unknown as TriggerWithArgs<Data, unknown, string, ExtraArg>)(arg);
      }
      return (_trigger as unknown as TriggerWithOptionsArgs<Data, unknown, string, ExtraArg>)(void 0);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return [triggerFn, isMutating, data, error] as const;
}

// const [trigger] = useMut<never>("foobar", async () => {});
// trigger() // ok
// trigger(123) // error
// const [trigger] = useMut<string|undefined>("foobar", async () => {});
// trigger() // ok
// trigger('123') // ok
// trigger(void 0) // ok
// const [trigger] = useMut<string>("foobar", async () => {});
// trigger() // error
// trigger("123"); // ok
// trigger(void 0) // error
