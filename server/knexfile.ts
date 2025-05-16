import {env} from "./src/env";
import {Knex} from "knex";

const config: {[key: string]: Knex.Config} = {
	development: {
		client: "mysql2",
		connection: {
			host: env.DB_HOST,
			port: env.DB_PORT,
			user: env.DB_USER,
			password: env.DB_PASSWORD,
			database: env.DB_NAME,
		},
		migrations: {
			extension: "ts",
			directory: "./db/migrations",
		},
	},
};

export default config;
