// src/components/ui/StarRatingInput.tsx

import React, { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingInputProps {
  count?: number
  value: number
  onChange: (value: number) => void
  size?: number
  className?: string
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  count = 5,
  value,
  onChange,
  size = 36,
  className,
}) => {
  const [hover, setHover] = useState(0)

  const stars = Array.from({ length: count }, (_, i) => i + 1)

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {stars.map((ratingValue) => {
        return (
          <button
            type="button" // Important to prevent form submission
            key={ratingValue}
            onClick={() => onChange(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer bg-transparent border-none p-0"
          >
            <Star
              size={size}
              className={cn(
                "transition-colors",
                ratingValue <= (hover || value)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}