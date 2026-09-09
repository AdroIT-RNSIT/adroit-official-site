import { createAuthClient } from "better-auth/react";

const API_URL = import.meta.env.VITE_API_URL;

const emptySession = {
  data: null,
  isPending: false,
  error: null,
  refetch: async () => {},
  update: async () => {},
};

function useOfflineSession() {
  return emptySession;
}

export const authClient = API_URL
  ? createAuthClient({
      baseURL: `${API_URL}/api/auth`,
    })
  : {
      signIn: { email: async () => ({ error: { message: "Auth is not configured" } }) },
      signOut: async () => {},
      useSession: useOfflineSession,
    };

export const useSession = API_URL ? authClient.useSession : useOfflineSession;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
