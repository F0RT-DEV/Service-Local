import React, { useState } from 'react';
import { SearchFilters } from './SearchFilters';
import { ServiceGrid } from './ServiceGrid';

export function ServiceSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [location, setLocation] = useState('');

  const services = [
    {
      id: '1',
      title: 'Instalação de Ar Condicionado',
      provider: 'João Silva',
      category: 'eletrica',
      rating: 4.8,
      reviewsCount: 24,
      price: 250,
      priceType: 'fixed',
      location: 'São Paulo, SP',
      description: 'Instalação completa de ar condicionado split com garantia de 1 ano.',
      image: 'https://images.pexels.com/photos/1938348/pexels-photo-1938348.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Limpeza Residencial Completa',
      provider: 'Maria Santos',
      category: 'limpeza',
      rating: 4.9,
      reviewsCount: 31,
      price: 120,
      priceType: 'hourly',
      location: 'Rio de Janeiro, RJ',
      description: 'Limpeza completa de residências com produtos ecológicos.',
      image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Jardinagem e Paisagismo',
      provider: 'Carlos Pereira',
      category: 'jardinagem',
      rating: 4.7,
      reviewsCount: 18,
      price: 180,
      priceType: 'negotiable',
      location: 'Belo Horizonte, MG',
      description: 'Criação e manutenção de jardins residenciais e comerciais.',
      image: 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      title: 'Reparo Hidráulico',
      provider: 'Ana Costa',
      category: 'hidraulica',
      rating: 4.6,
      reviewsCount: 42,
      price: 80,
      priceType: 'hourly',
      location: 'Porto Alegre, RS',
      description: 'Reparos em tubulações, torneiras e instalações hidráulicas.',
      image: 'https://images.pexels.com/photos/834949/pexels-photo-834949.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesLocation = !location || service.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleRequestService = (id: string) => {
    console.log('Requesting service:', id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Buscar Serviços</h1>
        <p className="text-gray-600">Encontre o profissional ideal para suas necessidades.</p>
      </div>

      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        location={location}
        setLocation={setLocation}
      />

      <ServiceGrid
        services={filteredServices}
        onRequestService={handleRequestService}
      />
    </div>
  );
}