"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setPreview } from "@/redux/features/previewSlice";
import { useAppDispatch } from "@/redux/store/hooks";

export function RouteListener() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPreview({preview: false, id: ""}));
  }, [pathname, dispatch]);

  return null;
}