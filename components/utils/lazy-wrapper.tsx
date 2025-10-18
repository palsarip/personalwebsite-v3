"use client";

import { Suspense, lazy } from "react";
import LoadingSpinner from "../ui/loading-spinner";

// Lazy load heavy components
export const LazyPortfolioView = lazy(() => import("../views/portfolio-view"));
export const LazyAboutView = lazy(() => import("../views/about-view"));
export const LazyContactView = lazy(() => import("../views/contact-view"));

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function LazyWrapper({ children, fallback }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>{children}</Suspense>
  );
}
