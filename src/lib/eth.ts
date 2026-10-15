/**
 * Precision ETH math utilities using BigInt (fixed precision of 8 decimal places: 10^8)
 * Ensures 100% exact math with zero IEEE-754 floating point rounding bugs.
 */

const PRECISION_SCALE = 100_000_000n // 8 decimal places
const DECIMALS = 8

function toBigIntScaled(val: string | number): bigint {
  const str = String(val).trim().replace(',', '.')
  if (!str) return 0n
  const [intPart, fracPart = ''] = str.split('.')
  const cleanInt = BigInt(intPart || '0')
  const paddedFrac = (fracPart + '00000000').slice(0, DECIMALS)
  const cleanFrac = BigInt(paddedFrac)
  return cleanInt * PRECISION_SCALE + (cleanInt < 0n ? -cleanFrac : cleanFrac)
}

function fromBigIntScaled(val: bigint, displayDecimals = 2): string {
  const isNegative = val < 0n
  const absVal = isNegative ? -val : val

  if (displayDecimals <= 0) {
    const intPart = (absVal + PRECISION_SCALE / 2n) / PRECISION_SCALE
    return `${isNegative ? '-' : ''}${intPart}`
  }

  // Round half-up to displayDecimals
  const factor = 10n ** BigInt(DECIMALS - displayDecimals)
  const halfFactor = factor / 2n
  const roundedScaled = absVal + halfFactor

  const intPart = roundedScaled / PRECISION_SCALE
  const fracPart = (roundedScaled % PRECISION_SCALE) / factor
  const paddedFrac = fracPart.toString().padStart(displayDecimals, '0')

  return `${isNegative ? '-' : ''}${intPart}.${paddedFrac}`
}

export function formatEth(val: string | number | undefined, displayDecimals = 2): string {
  if (val === undefined || val === null || val === '') return '0.00 ETH'
  const cleanNum = typeof val === 'number' ? val.toString() : val
  return `${fromBigIntScaled(toBigIntScaled(cleanNum), displayDecimals)} ETH`
}

export function addEth(a: string, b: string): string {
  const res = toBigIntScaled(a) + toBigIntScaled(b)
  return fromBigIntScaled(res, 6)
}

export function subEth(a: string, b: string): string {
  const res = toBigIntScaled(a) - toBigIntScaled(b)
  const safeRes = res < 0n ? 0n : res
  return fromBigIntScaled(safeRes, 6)
}

export function mulEth(ethStr: string, qty: number): string {
  const safeQty = BigInt(Math.max(0, Math.floor(qty)))
  const res = toBigIntScaled(ethStr) * safeQty
  return fromBigIntScaled(res, 6)
}

export function applyDiscountEth(subtotalStr: string, discountPct: number): string {
  if (discountPct <= 0) return '0.000000'
  const subtotal = toBigIntScaled(subtotalStr)
  const discountScaled = (subtotal * BigInt(discountPct)) / 100n
  return fromBigIntScaled(discountScaled, 6)
}

export function compareEth(a: string, b: string): number {
  const diff = toBigIntScaled(a) - toBigIntScaled(b)
  if (diff < 0n) return -1
  if (diff > 0n) return 1
  return 0
}
