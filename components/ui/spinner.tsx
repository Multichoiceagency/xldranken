export function Spinner({
    className = "",
    size = "medium",
  }: { className?: string; size?: "small" | "medium" | "large" }) {
    const sizeClasses = {
      small: "w-4 h-4",
      medium: "w-8 h-8",
      large: "w-12 h-12",
    }
  
    return (
      <div
        className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${sizeClasses[size]} ${className}`}
        role="status"
      >
        <span className="sr-only">Laden...</span>
      </div>
    )
  }
  
  