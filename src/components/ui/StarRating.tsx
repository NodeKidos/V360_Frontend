import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxStars?: number;
  size?: string;
  readOnly?: boolean;
}

export default function StarRating({
  rating,
  onRatingChange,
  maxStars = 5,
  size = "text-[24px]",
  readOnly = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (selectedRating: number) => {
    if (!readOnly) {
      onRatingChange(selectedRating);
    }
  };

  const handleMouseEnter = (selectedRating: number) => {
    if (!readOnly) {
      setHoverRating(selectedRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);

        return (
          <FaStar
            key={index}
            className={`${size} ${
              isFilled ? "text-yellow-400" : "text-gray-300"
            } ${!readOnly ? "cursor-pointer hover:scale-110" : ""} transition-all duration-200`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
      <span className="ml-2 text-gray-600 text-[14px] font-poppins">
        {rating > 0 ? `${rating} / ${maxStars}` : "Not rated"}
      </span>
    </div>
  );
}
