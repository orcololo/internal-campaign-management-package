export interface Campaign {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: "active" | "inactive" | "completed";
  logo?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignStats {
  totalVoters: number;
  totalEvents: number;
  engagementRate: number;
  geographicCoverage: number;
}
