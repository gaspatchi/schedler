let config = {
	server: {
		name: "schedler",
		address: "127.0.0.1",
		port: 8087
	},
	consul: {
		address: "127.0.0.1",
		port: 8500
	},
	tarantool: {
		address: "",
		port: "",
		user: process.env.tarantool_user,
		password: process.env.tarantool_password,
		timeout: 3000,
		log: false
	},
	postgres: {
		address: "127.0.0.1",
		database: process.env.postgres_db,
		user: process.env.postgres_user,
		password: process.env.postgres_password,	
	}
};

export default config;
