export const isAfterDate = (transTime: string, targetDate: string): boolean => {
  // Convert YYYYMMDDHHMMSS to Date object
  const year = Number.parseInt(transTime.substring(0, 4))
  const month = Number.parseInt(transTime.substring(4, 6)) - 1 // JS months are 0-based
  const day = Number.parseInt(transTime.substring(6, 8))
  const hour = Number.parseInt(transTime.substring(8, 10))
  const minute = Number.parseInt(transTime.substring(10, 12))
  const second = Number.parseInt(transTime.substring(12, 14))

  const transDate = new Date(year, month, day, hour, minute, second)
  const target = new Date(targetDate)

  return transDate >= target
}

export const formatTransactionDate = (dateString: string): string => {
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)
  const hour = dateString.substring(8, 10)
  const minute = dateString.substring(10, 12)

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`).toLocaleString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

