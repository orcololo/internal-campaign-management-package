import type { Voter } from "@/types/voters";

/**
 * Transforms voter data from backend format to frontend format
 */
export function transformVoter(backendVoter: any): Voter {
  return {
    ...backendVoter,
    // Convert coordinates from string to number if needed
    latitude:
      backendVoter.latitude !== null && backendVoter.latitude !== undefined
        ? typeof backendVoter.latitude === "string"
          ? parseFloat(backendVoter.latitude)
          : backendVoter.latitude
        : null,
    longitude:
      backendVoter.longitude !== null && backendVoter.longitude !== undefined
        ? typeof backendVoter.longitude === "string"
          ? parseFloat(backendVoter.longitude)
          : backendVoter.longitude
        : null,
    // Keep 'SIM'/'NAO' as strings - types already updated
    // Backend already parses JSON fields
  };
}

/**
 * Transforms array of voters from backend to frontend
 */
export function transformVoters(backendVoters: any[]): Voter[] {
  return backendVoters.map(transformVoter);
}

/**
 * Helper to check if hasWhatsapp is true (handles both boolean and 'SIM'/'NAO')
 */
export function hasWhatsApp(voter: Voter): boolean {
  if (typeof voter.hasWhatsapp === "boolean") {
    return voter.hasWhatsapp;
  }
  return voter.hasWhatsapp === "SIM";
}

/**
 * Helper to check if has vehicle ownership (handles both boolean and 'SIM'/'NAO')
 */
export function hasVehicleOwnership(voter: Voter): boolean {
  if (typeof voter.vehicleOwnership === "boolean") {
    return voter.vehicleOwnership;
  }
  return voter.vehicleOwnership === "SIM";
}

/**
 * Gets top issues as array (handles both string and array)
 */
export function getTopIssues(voter: Voter): string[] {
  if (!voter.topIssues) return [];
  if (Array.isArray(voter.topIssues)) return voter.topIssues;
  try {
    return JSON.parse(voter.topIssues);
  } catch {
    return [];
  }
}

/**
 * Gets issue positions as object (handles both string and object)
 */
export function getIssuePositions(voter: Voter): Record<string, string> {
  if (!voter.issuePositions) return {};
  if (typeof voter.issuePositions === "object") return voter.issuePositions;
  try {
    return JSON.parse(voter.issuePositions);
  } catch {
    return {};
  }
}

/**
 * Gets tags as array (handles both string and array)
 */
export function getTags(voter: Voter): string[] {
  if (!voter.tags) return [];
  if (Array.isArray(voter.tags)) return voter.tags;
  try {
    return JSON.parse(voter.tags);
  } catch {
    return [];
  }
}

/**
 * Gets event attendance as array (handles both string and array)
 */
export function getEventAttendance(voter: Voter): string[] {
  if (!voter.eventAttendance) return [];
  if (Array.isArray(voter.eventAttendance)) return voter.eventAttendance;
  try {
    return JSON.parse(voter.eventAttendance);
  } catch {
    return [];
  }
}

/**
 * Gets donation history as array (handles both string and array)
 */
export function getDonationHistory(
  voter: Voter
): Array<{ date: string; amount: number }> {
  if (!voter.donationHistory) return [];
  if (Array.isArray(voter.donationHistory)) return voter.donationHistory;
  try {
    return JSON.parse(voter.donationHistory);
  } catch {
    return [];
  }
}

/**
 * Gets seasonal activity as object (handles both string and object)
 */
export function getSeasonalActivity(voter: Voter): Record<string, number> {
  if (!voter.seasonalActivity) return {};
  if (typeof voter.seasonalActivity === "object") return voter.seasonalActivity;
  try {
    return JSON.parse(voter.seasonalActivity);
  } catch {
    return {};
  }
}

/**
 * Gets content preference as array (handles both string and array)
 */
export function getContentPreference(voter: Voter): string[] {
  if (!voter.contentPreference) return [];
  if (Array.isArray(voter.contentPreference)) return voter.contentPreference;
  try {
    return JSON.parse(voter.contentPreference);
  } catch {
    return [];
  }
}

/**
 * Gets best contact day as array (handles both string and array)
 */
export function getBestContactDay(voter: Voter): string[] {
  if (!voter.bestContactDay) return [];
  if (Array.isArray(voter.bestContactDay)) return voter.bestContactDay;
  try {
    return JSON.parse(voter.bestContactDay);
  } catch {
    return [];
  }
}
