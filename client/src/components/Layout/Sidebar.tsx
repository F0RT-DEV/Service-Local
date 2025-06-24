import {Home, User, FileText, Users, ShoppingBag, Search, BarChart2, Menu, X} from "lucide-react";
import {useAuth} from "../../contexts/AuthContext";
import { useState } from "react";

// Menu lateral de navegação.
// Mostra opções diferentes conforme o tipo de usuário (admin, provider, client).
// Permite trocar de tela no sistema.

interface SidebarProps {
	currentView: string;
	onViewChange: (view: string) => void;
}

export function Sidebar({currentView, onViewChange}: SidebarProps) {
	const {user} = useAuth();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const getMenuItems = () => {
		switch (user?.role) {
			case "admin":
				return [
					{id: "dashboard", label: "Dashboard", icon: Home},
          {id: "providers", label: "Prestadores Pendentes", icon: Users},
          {id: "orders", label: "Todas as Ordens", icon: FileText},
          {id: "report", label: "Relatório", icon: BarChart2},
				];
			case "provider":
				return [
					{id: "dashboard", label: "Dashboard", icon: Home},
					{id: "profile", label: "Meu Perfil", icon: User},
					{
						id: "my-provider-services",
						label: "Meus Serviços",
						icon: ShoppingBag,
					}, // <-- aqui!
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

	const handleViewChange = (view: string) => {
		onViewChange(view);
		setIsMobileMenuOpen(false);
	};	return (		<>
			{/* Mobile menu button - só mostra quando o menu está fechado */}
			{!isMobileMenuOpen && (
				<div className="lg:hidden fixed top-4 left-4 z-50">
					<button
						onClick={() => setIsMobileMenuOpen(true)}
						className="p-2 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors border-2 border-blue-500"
					>
						<Menu className="h-6 w-6" />
					</button>
				</div>
			)}

			{/* Mobile overlay */}
			{isMobileMenuOpen && (
				<div 
					className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}			{/* Sidebar */}
			<div className={`
				${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
				fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-sm border-r border-gray-200 h-full transition-transform duration-300 ease-in-out
			`}>
				{/* Header da Sidebar com botão de fechar */}
				<div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-200">
					<h2 className="text-lg font-semibold text-gray-800">Menu</h2>
					<button
						onClick={() => setIsMobileMenuOpen(false)}
						className="p-1 rounded-md hover:bg-gray-100 transition-colors"
					>
						<X className="h-5 w-5 text-gray-600" />
					</button>
				</div>
				
				<nav className="mt-4 lg:mt-8 px-4">
					<ul className="space-y-2">
						{menuItems.map((item) => {
							const Icon = item.icon;
							const isActive = currentView === item.id;

							return (
								<li key={item.id}>
									<button
										onClick={() => handleViewChange(item.id)}
										className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium rounded-lg transition-colors ${
											isActive
												? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
												: "text-gray-700 hover:bg-gray-50"
										}`}
									>
										<Icon
											className={`mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 ${
												isActive ? "text-blue-700" : "text-gray-400"
											}`}
										/>
										<span className="truncate">{item.label}</span>
									</button>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</>
	);
}
