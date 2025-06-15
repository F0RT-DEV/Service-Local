export async function verifyAdminRole(request, reply, next) {
	if (request.user?.role !== "admin") {
		return reply
			.status(403)
			.send({message: "Acesso negado: apenas administradores."});
	}
	next();
}
export async function verifyProviderRole(request, reply, next) {
	if (request.user?.role !== "provider") {
		return reply
			.status(403)
			.send({message: "Acesso negado: apenas prestadores."});
	}
	next();
}
export async function verifyUserRole(request, reply, next) {
	if (request.user?.role !== "client") {
		return reply.status(403).send({message: "Acesso negado: apenas usuários."});
	}
	next();
}
