export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'provider' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Provider extends User {
  role: 'provider';
  phone?: string;
  address?: string;
  description?: string;
  specialties?: string[];
  rating?: number;
  reviewsCount?: number;
  status: 'pending' | 'approved' | 'rejected';
  documents?: {
    cpf?: string;
    rg?: string;
    certificates?: string[];
  };
}

export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'negotiable';
  images?: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  provider?: Provider;
}

export interface ServiceOrder {
  id: string;
  clientId: string;
  serviceId: string;
  providerId: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  proposedPrice?: number;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
  client?: User;
  service?: Service;
  provider?: Provider;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'provider';
}