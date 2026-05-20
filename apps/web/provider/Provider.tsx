"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";

import { ReactNode } from "react";
import { store } from "@/redux/store/store";

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};

const Provider = ({ children }: Props) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
};

export default Provider;
