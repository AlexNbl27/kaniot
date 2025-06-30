export interface MoneyPot {
  id: string;
  title: string;
  target_amount: number;
  expiration_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  creator_name: string;
  share_code: string;
}

export interface Participant {
  id: string;
  pot_id: string;
  name: string;
  max_pledge: number;
  calculated_contribution: number;
  joined_at: string;
  user_id: string | null;
}

export interface PotSummary {
  pot: MoneyPot;
  participants: Participant[];
  total_pledged: number;
  participant_count: number;
  is_expired: boolean;
}

export interface CreatePotData {
  title: string;
  target_amount: number;
  expiration_date?: string;
}

export interface JoinPotData {
  name: string;
  max_pledge: number;
}