"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { ReactNode } from "react";
import { store } from "@/redux/store/store";
import { useFCM } from "@/hooks/useFCM";
import { useAppSelector } from "@/redux/store/hooks";

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};
function FCMProvider({ children }: { children: ReactNode }) {
  const userId = useAppSelector((u) => u.auth.user?._id);
  useFCM({ userId });

  return <>{children}</>;
}

const Provider = ({ children }: Props) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <FCMProvider>{children}</FCMProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default Provider;