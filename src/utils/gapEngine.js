// =========================================================================
// Day 9: Automated Staffing Gap Calculation Engine
// Formula: Gap = max(0, Required - Allocated)
// =========================================================================

/**
 * Calculates staffing gap for a specific role
 * @param {number} required - Required headcount seats
 * @param {number} allocated - Currently allocated headcount
 * @returns {number} Open gap (non-negative integer)
 */
export function calculateRoleGap(required = 0, allocated = 0) {
  const req = Number(required) || 0;
  const alloc = Number(allocated) || 0;
  return Math.max(0, req - alloc);
}

/**
 * Calculates percentage of fulfillment for a role or project
 * @param {number} required - Required headcount
 * @param {number} allocated - Allocated headcount
 * @returns {number} Integer between 0 and 100
 */
export function calculateFulfillmentPct(required = 0, allocated = 0) {
  const req = Number(required) || 0;
  const alloc = Number(allocated) || 0;
  if (req <= 0) return 100;
  return Math.min(100, Math.round((alloc / req) * 100));
}

/**
 * Generates badge label and styling metadata for staffing gap
 * @param {number} gap - Staffing gap count
 * @returns {{ label: string, badgeClass: string, isFulfilled: boolean }}
 */
export function getGapBadgeInfo(gap = 0) {
  if (gap === 0) {
    return {
      label: 'Fully Staffed',
      shortLabel: '0 Gap',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      textClass: 'text-emerald-700',
      isFulfilled: true
    };
  }
  if (gap === 1) {
    return {
      label: 'Gap: 1',
      shortLabel: '1 Gap',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      textClass: 'text-amber-800',
      isFulfilled: false
    };
  }
  return {
    label: `Gap: ${gap}`,
    shortLabel: `${gap} Gaps`,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    textClass: 'text-rose-700',
    isFulfilled: false
  };
}

/**
 * Computes enterprise project-level staffing gap analytics
 * @param {Array} structures - List of role blueprint structures for project
 * @returns {{ totalRequired: number, totalAllocated: number, totalGap: number, fulfillmentPct: number, isFullyStaffed: boolean }}
 */
export function calculateProjectGapSummary(structures = []) {
  const totalRequired = structures.reduce((sum, s) => sum + (Number(s.requiredCount) || 0), 0);
  const totalAllocated = structures.reduce((sum, s) => sum + (Number(s.allocatedCount) || 0), 0);
  const totalGap = Math.max(0, totalRequired - totalAllocated);
  const fulfillmentPct = calculateFulfillmentPct(totalRequired, totalAllocated);

  return {
    totalRequired,
    totalAllocated,
    totalGap,
    fulfillmentPct,
    isFullyStaffed: totalGap === 0 && totalRequired > 0
  };
}
