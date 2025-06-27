export interface Shop {
  id: string;
  name: string;
  contactNumber: string;
  locationUrl: string;
  description: string;
  category: 'Shop' | 'Traders' | 'Mill';
  imageUrl?: string;
}

export interface Carnival {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  imageUrl?: string;
}