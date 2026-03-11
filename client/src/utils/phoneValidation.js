// Phone input handler - only allows digits and +, limits length
export const formatPhoneNumber = (value) => {
  // Allow only + at start and digits
  let cleaned = value.replace(/[^\d+]/g, '')
  // Only allow + as first character
  if (cleaned.includes('+')) {
    cleaned = '+' + cleaned.replace(/\+/g, '')
  }
  // Limit max length: +998XXXXXXXXX = 13 chars
  if (cleaned.startsWith('+')) {
    return cleaned.slice(0, 13)
  }
  // Local: 9 digits max
  return cleaned.slice(0, 9)
}

export const isValidUzbekPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, '')

  // International: +998XXXXXXXXX → 12 digits (998 + 9)
  if (digits.startsWith('998') && digits.length === 12) return true

  // Local: 9 digits starting with valid operator code (90-99)
  if (digits.length === 9) {
    const op = parseInt(digits.slice(0, 2))
    return op >= 90 && op <= 99
  }

  return false
}
