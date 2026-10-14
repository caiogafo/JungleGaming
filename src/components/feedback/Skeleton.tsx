import React from 'react'
import { cn } from '../../lib/utils'

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('skeleton-shimmer rounded-md bg-stone-800/60', className)}
      {...props}
    />
  )
}

export function NftCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-md">
      {/* 1:1 Aspect ratio image placeholder */}
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <Skeleton className="h-5 w-4/5" />
        <div className="pt-2 flex items-center justify-between">
          <div>
            <Skeleton className="h-3 w-10 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function NftDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        <div className="flex gap-2 sm:flex-col">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-16 rounded-lg" />
          ))}
        </div>
        <Skeleton className="aspect-square w-full flex-1 rounded-2xl" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-12 w-28 rounded-lg" />
            <Skeleton className="h-12 w-28 rounded-lg" />
          </div>
        </div>
        <div className="rounded-xl border border-border p-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
