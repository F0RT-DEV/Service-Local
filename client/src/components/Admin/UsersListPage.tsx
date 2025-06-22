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

export function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);

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

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Usuários Cadastrados</h2>
      {loading ? (
        <div>Carregando usuários...</div>
      ) : (
        <Card>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => fetchUserDetails(user.id)}
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal de detalhes do usuário */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setSelectedUser(null)}
              aria-label="Fechar"
            >
              &times;
            </button>
            <div className="flex flex-col items-center mb-4">
              {selectedUser.avatar ? (
                <img
                  src={`http://localhost:3333${selectedUser.avatar}`}
                  alt={selectedUser.name}
                  className="w-24 h-24 rounded-full object-cover border mb-2"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                  <span className="text-3xl text-gray-400">{selectedUser.name[0]}</span>
                </div>
              )}
              <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
              <span className="text-xs text-gray-500 capitalize">{selectedUser.role}</span>
            </div>
            <div className="space-y-1 text-sm">
              <p><strong>Email:</strong> {selectedUser.email}</p>
              {selectedUser.phone && <p><strong>Telefone:</strong> {selectedUser.phone}</p>}
              {selectedUser.cpf && <p><strong>CPF:</strong> {selectedUser.cpf}</p>}
              {selectedUser.cep && <p><strong>CEP:</strong> {selectedUser.cep}</p>}
              {selectedUser.logradouro && <p><strong>Logradouro:</strong> {selectedUser.logradouro}</p>}
              {selectedUser.complemento && <p><strong>Complemento:</strong> {selectedUser.complemento}</p>}
              {selectedUser.bairro && <p><strong>Bairro:</strong> {selectedUser.bairro}</p>}
              {selectedUser.localidade && <p><strong>Cidade:</strong> {selectedUser.localidade}</p>}
              {selectedUser.uf && <p><strong>UF:</strong> {selectedUser.uf}</p>}
              {selectedUser.numero && <p><strong>Número:</strong> {selectedUser.numero}</p>}
              {selectedUser.created_at && (
                <p>
                  <strong>Criado em:</strong>{" "}
                  {new Date(selectedUser.created_at).toLocaleString("pt-BR")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}