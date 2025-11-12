import * as React from "react"

export function Avatar({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 overflow-hidden ${className}`}
    >
      {children}
    </div>
  )
}

export function AvatarImage({
  src,
  alt,
}: {
  src?: string
  alt?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
    />
  )
}

export function AvatarFallback({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <span className="text-sm font-medium text-gray-600">{children}</span>
  )
}
