

import {Knex} from "knex";

declare module "knex/types/tables" {
	export interface Tables {
		users: {
			id: string | null;
			nome: string | null;
			image: string | null;
			email: string | null;
			senha: string | null;
			whatsapp: string | null;
			telefone: string | null;
			cpf: string | null;
			logo: string | null;
			descricao: string | null;
			cep: string | null;
			logradouro: string | null;
			complemento: string | null;
			bairro: string | null;
			localidade: string | null;
			uf: string | null;
			numero: string | null;
		};
		categories: {
			id: string;
			nome: string;
		};
		products: {
			id: string | null;
			nome: string | null;
			image: string | null;
			preco: string | null;
			descricao: string | null;
			data_anuncio: Date | null;
			usuario_id: string | null;
			categories_id: string | null;
		};
		product_images: {
			id: string | null;
			produto_id: string | null;
			url: string | null;
		};
	}
}
