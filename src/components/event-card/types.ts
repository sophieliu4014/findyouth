
export interface EventCardProps {
  id: string;
  title: string;
  organization: string;
  date: string;
  endDate?: string;
  location: string;
  causeArea: string;
  rating: number;
  imageUrl?: string;
  profileImage?: string;
  organizationId?: string;
  creatorId?: string;
  registrationLink?: string;
}
