import { useEffect, useState } from 'react';
import { Card } from '../UI/Card';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserDetails extends User {
  phone?: string;
  cep?: string;
  cpf?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  numero?: string;
  created_at?: string;
  avatar?: string;
}

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  provider: 'bg-blue-100 text-blue-800',
  client: 'bg-green-100 text-green-800'
};

const roleIcons: Record<string, string> = {
  admin: '👑',
  provider: '🔧',
  client: '👤'
};

export function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3333/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

   const fetchUserDetails = async (id: string) => {
    try {
      // Busca todos os dados do usuário (ajuste o endpoint se necessário)
      const res = await fetch(`http://localhost:3333/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      const user = data.find((u: UserDetails) => u.id === id);
      setSelectedUser(user || null);
    } catch {
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const formatAddress = (user: UserDetails) => {
    const parts = [
      user.logradouro,
      user.numero,
      user.complemento,
      user.bairro,
      user.localidade,
      user.uf
    ].filter(Boolean);
    
    return parts.join(', ');
  };
  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Usuários Cadastrados</h2>
        <p className="text-sm sm:text-base text-gray-600">Gerencie todos os usuários da plataforma</p>
      </div>

      <Card className="rounded-lg shadow-sm">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="search" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input
                type="text"
                id="search"
                placeholder="Nome ou email..."
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                id="role"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="admin">Admin</option>
                <option value="provider">Prestador</option>
                <option value="client">Cliente</option>
              </select>
            </div>
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <span className="text-xs sm:text-sm text-gray-500">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'usuário' : 'usuários'} encontrados
              </span>
            </div>
          </div>
        </div>        {loading ? (
          <div className="px-3 sm:px-6 py-8 sm:py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="block sm:hidden">
              {filteredUsers.length > 0 ? (
                <div className="space-y-3 p-3">
                  {filteredUsers.map(user => (
                    <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-600 text-sm font-medium">{user.name[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                            <div className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                              {roleIcons[user.role]} {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => fetchUserDetails(user.id)}
                          className="ml-2 flex-shrink-0 text-blue-600 hover:text-blue-900 text-xs font-medium"
                        >
                          Ver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-8 text-center text-sm text-gray-500">
                  Nenhum usuário encontrado
                </div>
              )}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <span className="text-gray-600">{user.name[0]}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                            {roleIcons[user.role]} {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => fetchUserDetails(user.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Ver detalhes
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>      {/* Modal de detalhes do usuário */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] overflow-y-auto mt-4 sm:mt-0">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Detalhes do Usuário</h3>
              <button
                className="text-gray-500 hover:text-gray-700 p-1"
                onClick={() => setSelectedUser(null)}
                aria-label="Fechar"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-col items-center mb-4">
                {selectedUser.avatar ? (
                  <img
                    src={`http://localhost:3333${selectedUser.avatar}`}
                    alt={selectedUser.name}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200 mb-3"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                    <span className="text-xl sm:text-3xl text-gray-600">{selectedUser.name[0]}</span>
                  </div>
                )}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">{selectedUser.name}</h3>
                <div className={`mt-1 inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${roleColors[selectedUser.role]}`}>
                  {roleIcons[selectedUser.role]} {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">INFORMAÇÕES BÁSICAS</h4>
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm">
                      <span className="font-medium text-gray-700">Email:</span> {selectedUser.email}
                    </p>
                    {selectedUser.phone && (
                      <p className="text-xs sm:text-sm">
                        <span className="font-medium text-gray-700">Telefone:</span> {selectedUser.phone}
                      </p>
                    )}
                    {selectedUser.cpf && (
                      <p className="text-xs sm:text-sm">
                        <span className="font-medium text-gray-700">CPF:</span> {selectedUser.cpf}
                      </p>
                    )}
                    {selectedUser.created_at && (
                      <p className="text-xs sm:text-sm">
                        <span className="font-medium text-gray-700">Cadastrado em:</span> {new Date(selectedUser.created_at).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>

                {(selectedUser.logradouro || selectedUser.cep) && (
                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">ENDEREÇO</h4>
                    <div className="space-y-2">
                      {selectedUser.cep && (
                        <p className="text-xs sm:text-sm">
                          <span className="font-medium text-gray-700">CEP:</span> {selectedUser.cep}
                        </p>
                      )}
                      {formatAddress(selectedUser) && (
                        <p className="text-xs sm:text-sm">
                          <span className="font-medium text-gray-700">Endereço:</span> {formatAddress(selectedUser)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-4 sm:px-6 py-3 bg-gray-50 text-right rounded-b-lg sticky bottom-0">
              <button
                type="button"
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
                onClick={() => setSelectedUser(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}