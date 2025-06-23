import React, {createContext, useContext, useState, useEffect} from "react";
import {User, AuthContextType, RegisterData} from "../types";

// Contexto de autenticação do React.
// Gerencia login, logout, registro e usuário autenticado no frontend.
// Fornece funções e estado para os componentes filhos.

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:3333";

export function AuthProvider({children}: {children: React.ReactNode}) {
	const [user, setUser] = useState(() => {
		const stored = localStorage.getItem("user");
		return stored ? JSON.parse(stored) : null;
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const res = await fetch(`${API_URL}/login`, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({email, password}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Erro ao fazer login");
			setUser(data.user);
			localStorage.setItem("user", JSON.stringify(data.user));
			localStorage.setItem("token", data.token);
			console.log("Usuário logado:", data.user);
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (data: RegisterData) => {
		setIsLoading(true);
		try {
			const res = await fetch(`${API_URL}/register`, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(data),
			});
			const result = await res.json();
			if (!res.ok) throw new Error(result.error || "Erro ao registrar");
			// Após cadastro, já faz login automático
			await login(data.email, data.password);
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider
			value={{user, login, register, logout, isLoading, setUser}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
