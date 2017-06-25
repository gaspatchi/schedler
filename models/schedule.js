import Sequelize from "../lib/postgres";
import sequelize from "sequelize";

export const Teachers = Sequelize.define("teachers", {
	teacher_id: {
		type: sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	image_id: {
		type: sequelize.INTEGER,
		allowNull: false,
		defaultValue: 2
	},
	firstname: {
		type: sequelize.STRING,
		allowNull: false
	},
	lastname: {
		type: sequelize.STRING,
		allowNull: false
	},
	patronymic: {
		type: sequelize.STRING,
		allowNull: false
	},
	shortname: {
		type: sequelize.STRING,
		allowNull: false
	},
	email: {
		type: sequelize.STRING,
		allowNull: true,
		validate: {
			isEmail: true
		}
	},
	post: {
		type: sequelize.STRING,
		allowNull: true
	},
	verified: {
		type: sequelize.BOOLEAN,
		allowNull: false
	}
});

export const Specialties = Sequelize.define("specialties", {
	speciality_id: {
		type: sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	speciality: {
		type: sequelize.STRING,
		allowNull: false
	},
	description: {
		type: sequelize.TEXT,
		allowNull: true
	}
});

export const Groups = Sequelize.define("groups", {
	group_id: {
		type: sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	group: {
		type: sequelize.STRING,
		allowNull: false
	},
	course: {
		type: sequelize.INTEGER,
		allowNull: true
	},
	verified: {
		type: sequelize.BOOLEAN,
		allowNull: false
	}
});

export const Lessons = Sequelize.define("lessons", {
	lesson_id: {
		type: sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	lesson: {
		type: sequelize.STRING,
		allowNull: false
	},
	shortname: {
		type: sequelize.STRING,
		allowNull: false
	},
	description: {
		type: sequelize.TEXT,
		allowNull: true
	},
	verified: {
		type: sequelize.BOOLEAN,
		allowNull: false
	}
});

export const Cabinets = Sequelize.define("cabinets", {
	cabinet_id: {
		type: sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	image_id: {
		type: sequelize.INTEGER,
		allowNull: false,
		defaultValue: 3
	},
	cabinet: {
		type: sequelize.STRING,
		allowNull: false
	},
	housing: {
		type: sequelize.INTEGER,
		allowNull: true
	},
	floor: {
		type: sequelize.INTEGER,
		allowNull: true
	},
	description: {
		type: sequelize.TEXT,
		allowNull: true
	},
	verified: {
		type: sequelize.BOOLEAN,
		allowNull: false
	}
});

export const Schedule = Sequelize.define("schedule", {
	schedule_id: {
		type: sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	index: {
		type: sequelize.INTEGER,
		allowNull: false
	},
	date: {
		type: sequelize.DATEONLY,
		allowNull: false
	}
});

Groups.belongsTo(Teachers, { as: "teacher", foreignKey: { name: "teacher_id", allowNull: true } });
Groups.belongsTo(Specialties, { as: "speciality", foreignKey: { name: "speciality_id", allowNull: true } });

Schedule.belongsTo(Groups, { as: "group", foreignKey: { name: "group_id", allowNull: true } });
Schedule.belongsTo(Lessons, { as: "lesson", foreignKey: { name: "lesson_id", allowNull: true } });
Schedule.belongsTo(Teachers, { as: "teacher", foreignKey: { name: "teacher_id", allowNull: true } });
Schedule.belongsTo(Cabinets, { as: "cabinet", foreignKey: { name: "cabinet_id", allowNull: true } });

Teachers.sync({ force: false });
Specialties.sync({ force: false });
Groups.sync({ force: false });
Lessons.sync({ force: false });
Cabinets.sync({ force: false });
Schedule.sync({ force: false });