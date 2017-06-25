import Sequelize from "sequelize";
import config from "../config";

export default new Sequelize(config.postgres.database, config.postgres.user, config.postgres.password, {
	host: config.postgres.address,
	dialect: "postgres",
	pool: {
		min: 10,
		max: 30
	},
	retry: {
		max: 3
	},
	benchmark: false,
	logging: false
});