"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { ReactNode, useEffect, createContext, useState } from "react";
import { store } from "@/redux/store/store";
import { useFCM } from "@/hooks/useFCM";
import { useAppSelector } from "@/redux/store/hooks";
import { api } from "@/utils/api";

const queryClient = new QueryClient();

export const AuthContext = createContext<any>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const res = await api.post("/refresh-token", {}, {
          withCredentials: true,
        });

        setUser(res.data.user || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    refreshSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function FCMProvider({ children }: { children: ReactNode }) {
  const userId = useAppSelector((u) => u.auth.user?._id);
  useFCM({ userId });

  return <>{children}</>;
}

type Props = {
  children: ReactNode;
};

const Provider = ({ children }: Props) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FCMProvider>{children}</FCMProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default Provider;