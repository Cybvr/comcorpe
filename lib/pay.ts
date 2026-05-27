import type { Milestone } from './jobs'

export const COMPLEXITY_MULTIPLIERS = [1, 1.25, 1.5, 1.75, 2] as const
export type ComplexityMultiplier = typeof COMPLEXITY_MULTIPLIERS[number]

export interface PayBreakdown {
  base: number
  withMultiplier: number
  bounty: number
  total: number
}

export function calculateJobPay(
  milestones: Milestone[],
  multiplier: ComplexityMultiplier = 1,
  bounty: number = 0,
  bountyAchieved: boolean = false
): PayBreakdown {
  const base = milestones.reduce((sum, m) => sum + (m.baseFee ?? 0), 0)
  const withMultiplier = Math.round(base * multiplier)
  const earnedBounty = bountyAchieved ? bounty : 0
  return {
    base,
    withMultiplier,
    bounty: earnedBounty,
    total: withMultiplier + earnedBounty,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export function multiplierLabel(m: ComplexityMultiplier): string {
  return m === 1 ? '1× Standard' : `${m}× Complexity`
}
