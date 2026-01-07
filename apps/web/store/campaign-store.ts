import { create } from "zustand";
import { Campaign } from "@/types/campaign";

interface CampaignState {
  currentCampaign: Campaign | null;
  campaigns: Campaign[];
  setCurrentCampaign: (campaign: Campaign) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  switchCampaign: (campaignId: string) => void;
}

// Mock campaigns for development
const mockCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    name: "Campanha 2024",
    description: "Campanha principal para as eleições de 2024",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "active",
    color: "#3b82f6",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "campaign-2",
    name: "Campanha Teste",
    description: "Campanha de teste e desenvolvimento",
    startDate: "2024-06-01",
    status: "inactive",
    color: "#8b5cf6",
    createdAt: new Date("2024-06-01").toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useCampaignStore = create<CampaignState>((set, get) => ({
  currentCampaign: mockCampaigns[0],
  campaigns: mockCampaigns,

  setCurrentCampaign: (campaign) => set({ currentCampaign: campaign }),

  setCampaigns: (campaigns) => set({ campaigns }),

  switchCampaign: (campaignId) => {
    const campaign = get().campaigns.find((c) => c.id === campaignId);
    if (campaign) {
      set({ currentCampaign: campaign });
    }
  },
}));
