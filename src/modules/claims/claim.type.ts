export interface IClaim {
  user_id: string;
  accidentDate: Date;
  policyNumber: string;
  location: string;
  images?: string[];
  status?: string;
  isComplete?: () => boolean;
}
