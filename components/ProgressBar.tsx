"use client"

import type React from "react"
import { BRAND_COLORS } from "@/constants"

interface ProgressBarProps {
  current: number
  target: number
  label: string
  color?: keyof typeof BRAND_COLORS
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, target, label, color = "maroon" }) => {
  const percentage = Math.min((current / target) * 100, 100)

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: BRAND_COLORS[color],
          }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(current)}</span>
        <span>{new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(target)}</span>
      </div>
    </div>
  )
}

