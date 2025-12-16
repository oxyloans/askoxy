export interface TripFormData {
  name: string;
  city: string;
  departure_city: string;
  num_days: number;
  no_of_persons: number;
  mobile_number: string;
  budget_range: 'budget' | 'medium' | 'luxury';
  currency: string;
  multi_cities: string[];
  model: string;
  travel_date: string;
}

export interface TripResponse {
  plan: string;
  pricing_data?: {
    estimated_costs: {
      total: number;
      flights: number;
      accommodation: number;
      activities: number;
      transport: number;
      food: number;
    };
    group_discount: number;
  };
  safety_info?: {
    safety_rating: number;
  };
  multi_city_route?: {
    route: string[];
  };
}

export interface StatusState {
  text: string;
  color: string;
}