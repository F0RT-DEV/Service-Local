import db from "../../db.js";

export const ProviderModel = {
	async findById(id) {
		return await db("providers").where({id}).first();
	},

	async updateStatus(id, status) {
		return await db("providers").where({id}).update({status});
	},

	async findPending() {
		return await db("providers").where({status: "pending"});
	},

	async rejectedById(id) {
		return await db("providers").where({id}).update({status: "rejected"});
	},
	async findApproved() {
		return await db("providers").where({status: "approved"});
	},
	async findAllByPending() {
		return await db("providers").where({status: "pending"});
	},
	async getAllUsers() {
		return await db("users");
	},

	// Método para buscar providers pendentes com detalhes adicionais
	async findPendingWithDetails() {
		try {
			// Busca providers pendentes com nome, bio e categorias
			//console.log("Buscando providers pendentes no banco"); // <-- Aqui
        const providers = await db("providers")
            .where({ status: "pending" })
            .select(
                "providers.id",
                "providers.user_id",
                "providers.status",
                "providers.created_at as requestDate",
                "providers.cnpj",
                "providers.bio"
            );
        //console.log("Providers pendentes:", providers); // <-- Aqui

        const userIds = providers.map((p) => p.user_id);
        let users = [];
        if (userIds.length > 0) {
            users = await db("users")
                .whereIn("id", userIds)
                .select("id", "name");
            //console.log("Usuários relacionados:", users); // <-- Aqui
        }

        const providerIds = providers.map((p) => p.id);
        let categories = [];
        if (providerIds.length > 0) {
            categories = await db("providers_categories as pc")
                .join("categories as c", "pc.category_id", "c.id")
                .whereIn("pc.provider_id", providerIds)
                .select("pc.provider_id", "c.name as category");
            //console.log("Categorias relacionadas:", categories); // <-- Aqui
        }

        const result = providers.map((provider) => {
            const user = users.find((u) => u.id === provider.user_id);
            const specialties = categories
                .filter((c) => c.provider_id === provider.id)
                .map((c) => c.category);

            return {
                id: provider.id,
                name: user ? user.name : "",
                bio: provider.bio,
                specialties,
                status: provider.status,
                requestDate: provider.requestDate,
                cnpj: provider.cnpj,
            };
        });
        console.log("Resultado final:", result); // <-- Aqui
        return result;
    } catch (error) {
        console.error("Erro em findPendingWithDetails:", error); // <-- Aqui
        throw error;
    }
}
};

export default ProviderModel;
