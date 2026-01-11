import { Suspense } from "react";
import { MessagesClientWrapper } from "./messages-client-wrapper";

// Remove force-dynamic - let Next.js handle it
// This page now loads instantly with a skeleton

export default function MessagesPage() {
  return (
    <div className="-m-4 lg:-m-8 h-[calc(100vh-4rem)] lg:h-screen">
      <Suspense fallback={<MessagesLoadingSkeleton />}>
        <MessagesClientWrapper />
      </Suspense>
    </div>
  );
}

// Loading skeleton - shows instantly
function MessagesLoadingSkeleton() {
  return (
    <div className="flex h-full w-full bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200/50">
      {/* Sidebar skeleton */}
      <div className="w-80 flex-shrink-0 border-r bg-slate-50 flex flex-col">
        <div className="p-4 border-b bg-burgundy-700">
          <div className="h-10 bg-white/20 rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-white">
              <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 border-b flex items-center px-6 gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
            <div className="h-3 bg-slate-100 rounded w-24 animate-pulse" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 animate-pulse" />
            <p>Loading messages...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
