import { Arg, post, useMut } from "../api";

async function userFn(
  key: string,
  options: {
    arg:
      | Arg<{ action: "delete" }, { email: string }>
      | Arg<{ action: "create" }, { username: string; password: string }>;
  }
): Promise<string> {
  return post(key, options.arg);
}

export function useUserMut() {
  return useMut("/api/admin/user", userFn);
}

async function signUpFn(
  key: string,
  options: {
    arg: Arg<void, { username: string; password: string }>;
  }
): Promise<string> {
  return post(key, options.arg);
}

export function useSignUpMut() {
  return useMut("/api/signup", signUpFn);
}
