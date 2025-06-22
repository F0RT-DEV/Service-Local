import {Home, User, FileText, Users, ShoppingBag, Search} from "lucide-react";
import {useAuth} from "../../contexts/AuthContext";

// Menu lateral de navegação.
// Mostra opções diferentes conforme o tipo de usuário (admin, provider, client).
// Permite trocar de tela no sistema.

interface SidebarProps {
	currentView: string;
	onViewChange: (view: string) => void;
}

export function Sidebar({currentView, onViewChange}: SidebarProps) {
	const {user} = useAuth();

	const getMenuItems = () => {
		switch (user?.role) {
			case "admin":
				return [
					{id: "dashboard", label: "Dashboard", icon: Home},
					{id: "providers", label: "Providers Pendentes", icon: Users},
					{id: "services", label: "Todos os Serviços", icon: ShoppingBag},
					{id: "orders", label: "Todas as Ordens", icon: FileText},
				];
			case "provider":
				return [
					{id: "dashboard", label: "Dashboard", icon: Home},
					{id: "profile", label: "Meu Perfil", icon: User},
					{id: "services", label: "Meus Serviços", icon: ShoppingBag},
					{id: "orders", label: "Ordens Recebidas", icon: FileText},
				];
			case "client":
				return [
					{id: "dashboard", label: "Dashboard", icon: Home},
					{id: "search", label: "Buscar Serviços", icon: Search},
					{id: "orders", label: "Minhas Ordens", icon: FileText},
					{id: "profile", label: "Meu Perfil", icon: User},
				];
			default:
				return [];
		}
	};

	const menuItems = getMenuItems();

	return (
		<div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
			<nav className="mt-8 px-4">
				<ul className="space-y-2">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = currentView === item.id;

						return (
							<li key={item.id}>
								<button
									onClick={() => onViewChange(item.id)}
									className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
										isActive
											? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									<Icon
										className={`mr-3 h-5 w-5 ${
											isActive ? "text-blue-700" : "text-gray-400"
										}`}
									/>
									{item.label}
								</button>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
}
