

// Tipos TypeScript usados em todo o frontend.
// Define interfaces para User, Provider, Service, ServiceOrder, AuthContext, etc.


export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'provider' | 'admin';
  avatar?: string;
  createdAt: string;
  phone?: string;
  cpf?: string;
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  numero?: string;
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
  setUser?: (user: User | null) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'provider';
  cpf: string;
  phone: string;
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
}

export interface Category {
  id: string;
  name: string;
}

// Tipos para a Landing Page
export interface ProviderLanding {
  provider_id?: string;
  id?: string;
  bio?: string;
  cnpj?: string;
  categories?: { name: string }[];
  avatar_url?: string;
  verified?: boolean;
  location?: string;
  phone?: string;
  email?: string;
}

export interface ServiceLanding {
  id: string;
  title: string;
  description?: string;
  price_min?: number;
  price_max?: number;
}
