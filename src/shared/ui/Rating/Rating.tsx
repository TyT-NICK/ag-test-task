"use client";

import { useId } from "react";
import styles from "./Rating.module.css";

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

const VIEWBOX = 24;

/** Returns 0 (empty), 0.5 (half), or 1 (full) for a star at position `index`. */
function getStarFill(value: number, index: number): 0 | 0.5 | 1 {
  const remainder = value - index;
  if (remainder >= 0.75) return 1;
  if (remainder >= 0.25) return 0.5;
  return 0;
}
const SIZE = 14;

interface StarProps {
  fill: number; // 0 = empty, 0.5 = half, 1 = full
  color: string;
  clipId: string;
}

function Star({ fill, color, clipId }: StarProps) {
  const isPartial = fill > 0 && fill < 1;
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      fill="none"
      aria-hidden
    >
      {isPartial && (
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={VIEWBOX * fill} height={VIEWBOX} />
          </clipPath>
        </defs>
      )}
      <path d={STAR_PATH} fill="#e5e7eb" />
      {fill > 0 && (
        <path
          d={STAR_PATH}
          fill={color}
          clipPath={isPartial ? `url(#${clipId})` : undefined}
        />
      )}
    </svg>
  );
}

export interface RatingProps {
  value: number;
}

export function Rating({ value }: RatingProps) {
  const uid = useId();
  const color = value >= 4 ? "#22c55e" : value < 3.5 ? "#ef4444" : "#f59e0b";

  return (
    <div className={styles.root} aria-label={`${value} / 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = getStarFill(value, i);
        return (
          <Star key={i} fill={fill} color={color} clipId={`${uid}-${i}`} />
        );
      })}
    </div>
  );
}
