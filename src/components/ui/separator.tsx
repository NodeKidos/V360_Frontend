export function Separator({
  className = "",
  orientation = "horizontal",
}: {
  className?: string
  orientation?: "horizontal" | "vertical"
}) {
  return (
    <div
      role="separator"
      className={
        orientation === "horizontal"
          ? `h-px w-full bg-gray-200 ${className}`
          : `w-px h-full bg-gray-200 ${className}`
      }
    />
  )
}
