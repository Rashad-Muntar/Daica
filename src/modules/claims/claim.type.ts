export interface IClaim {
  user_id: string;
  description: string;
  location: string;
  images: string[];
  status: string;
  createdAt: Date;
  isComplete?: () => boolean
}
