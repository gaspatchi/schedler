import express from "express";
import { schedule_created, schedule_updated, groups_selected, teachers_selected, last_group_schedule, last_teacher_schedule, group_dates, teacher_dates, group_date, teacher_date } from "../lib/prometheus";
import { Specialties, Teachers, Groups, Schedule, Lessons, Cabinets } from "../models/schedule";
import _ from "lodash";
import sequelize from "sequelize";
import tarantool from "../lib/tarantool";
import { JsonValidate } from "../middlewares/validate";

let schedule_router = express.Router();

schedule_router.post("/", JsonValidate("post_schedule"), async (req, res) => {
	try {
		let date = req.body.date;
		let index = req.body.index;
		let lesson_id = await Lessons.findOrCreate({ where: { shortname: req.body.lesson }, defaults: { lesson: req.body.lesson, verified: false } });
		let group_id = await Groups.findOrCreate({ where: { group: req.body.group }, defaults: { verified: false } });
		let cabinet_id = await Cabinets.findOrCreate({ where: { cabinet: req.body.cabinet }, defaults: { verified: false } });
		let teacher_id = await Teachers.findOrCreate({ where: { shortname: req.body.teacher }, defaults: { firstname: req.body.teacher, lastname: req.body.teacher, patronymic: req.body.teacher, verified: false } });
		let current_schedule = await Schedule.findOne({ where: { group_id: group_id[0].group_id, date, index } });
		if (current_schedule === null) {
			let schedule = await Schedule.create({
				lesson_id: lesson_id[0].lesson_id,
				group_id: group_id[0].group_id, cabinet_id: cabinet_id[0].cabinet_id,
				teacher_id: teacher_id[0].teacher_id, date, index
			});
			if (schedule !== null) {
				let result = await tarantool.postSchedule(group_id[0].group_id, teacher_id[0].teacher_id, date, "create");
				if (result[0][0] === true) {
					schedule_created.inc();
					res.status(200).json({ message: "Расписание успешно добавлено" });
				} else {
					throw Error("Ошибка при добавлении в очередь");
				}
			}
		} else {
			let update = false;
			if (current_schedule.dataValues.lesson_id !== lesson_id[0].lesson_id) {
				update = true;
			}
			if (current_schedule.dataValues.teacher_id !== teacher_id[0].teacher_id) {
				update = true;
			}
			if (current_schedule.dataValues.cabinet_id !== cabinet_id[0].cabinet_id) {
				update = true;
			}
			if (update == true) {
				let schedule = await Schedule.update({
					lesson_id: lesson_id[0].lesson_id,
					cabinet_id: cabinet_id[0].cabinet_id,
					teacher_id: teacher_id[0].teacher_id
				}, { where: { group_id: group_id[0].group_id, date, index } });
				if (schedule !== null) {
					let result = await tarantool.postSchedule(group_id[0].group_id, teacher_id[0].teacher_id, date, "update");
					if (result[0][0] === true) {
						schedule_updated.inc();
						res.status(200).json({ message: "Расписание успешно обновлено" });
					} else {
						throw Error("Ошибка при добавлении в очередь");
					}
				}
			} else {
				res.status(409).json({ message: "Расписание не нуждается в обновлении" });
			}
		}
	} catch (error) {
		console.log({ type: "Error", module: "Schedule", section: "postSchedule", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно добавить расписание" });
	}
});

schedule_router.get("/groups", async (req, res) => {
	try {
		let result = await Groups.findAll({ attributes: ["group_id", "group", "course"], include: [{ model: Specialties, as: "speciality", attributes: ["speciality_id", "speciality", "description"] }] });
		if (result.length === 0) {
			res.status(404).json({ message: "Группы не найдены" });
		} else {
			groups_selected.inc();
			res.status(200).json({ "groups": result });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Schedule", section: "getGroups", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить список групп" });
	}
});

schedule_router.get("/teachers", async (req, res) => {
	try {
		let result = await Teachers.findAll({ attributes: ["teacher_id", "firstname", "lastname", "patronymic"] });
		if (result.length === 0) {
			res.status(404).json({ message: "Преподаватели не найдены" });
		} else {
			teachers_selected.inc();
			res.status(200).json({ "teachers": result });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Schedule", section: "getTeachers", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить список преподавателей" });
	}
});

schedule_router.get("/group/:group", async (req, res) => {
	try {
		let result = await Schedule.findAll({
			attributes: ["date", "index"], order: [["date", "DESC"]], where: { "group_id": req.params.group, "date": [sequelize.literal(`select date from schedules where group_id = ${req.params.group} order by date desc limit 1`)] }, include: [
				{ model: Groups, as: "group", attributes: ["group_id", "group", "course"] },
				{ model: Lessons, as: "lesson", attributes: ["lesson_id", "lesson"] },
				{ model: Teachers, as: "teacher", attributes: ["teacher_id", "firstname", "lastname", "patronymic", "verified"] },
				{ model: Cabinets, as: "cabinet", attributes: ["cabinet_id", "cabinet"] }]
		});
		if (result.length === 0) {
			res.status(404).json({ message: "Расписание для группы не найдено" });
		} else {
			last_group_schedule.inc();
			res.status(200).json({ schedule: _.sortBy(result, "index") });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Schedule", section: "getGroup", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить расписание для группы" });
	}
});

schedule_router.get("/group/:group/dates", async (req, res) => {
	try {
		let result = await Schedule.findAll({ attributes: ["date"], where: { "group_id": req.params.group } });
		if (result.length === 0) {
			res.status(404).json({ message: "Для группы нет доступных дат" });
		} else {
			group_dates.inc();
			res.status(200).json({ dates: _.sortBy(_.uniqBy(result, "date"), "date") });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Schedule", section: "getGroupDates", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить список дат для группы" });
	}
});

schedule_router.get("/group/:group/:date", async (req, res) => {
	try {
		let result = await Schedule.findAll({
			where: { group_id: req.params.group, date: req.params.date },
			attributes: ["date", "index"], include: [
				{ model: Groups, as: "group", attributes: ["group_id", "group", "course"] },
				{ model: Lessons, as: "lesson", attributes: ["lesson_id", "lesson"] },
				{ model: Teachers, as: "teacher", attributes: ["teacher_id", "firstname", "lastname", "patronymic", "verified"] },
				{ model: Cabinets, as: "cabinet", attributes: ["cabinet_id", "cabinet"] }]
		});
		if (result.length === 0) {
			res.status(404).json({ message: "Расписание для группы не найдено" });
		} else {
			group_date.inc();
			res.status(200).json({ schedule: _.sortBy(result, "index") });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Schedule", section: "getGroupDate", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить расписание для группы" });
	}
});

schedule_router.get("/teacher/:teacher", async (req, res) => {
	try {
		let result = await Schedule.findAll({
			attributes: ["date", "index"], where: { "teacher_id": req.params.teacher, "date": [sequelize.literal(`select date from schedules where teacher_id = ${req.params.teacher} order by date desc limit 1`)] }, include: [
				{ model: Groups, as: "group", attributes: ["group_id", "group", "course"] },
				{ model: Lessons, as: "lesson", attributes: ["lesson_id", "lesson"] },
				{ model: Cabinets, as: "cabinet", attributes: ["cabinet_id", "cabinet"] }]
		});
		if (result.length === 0) {
			res.status(404).json({ message: "Расписание для преподавателя не найдено" });
		} else {
			last_teacher_schedule.inc();
			res.status(200).json({ schedule: _.sortBy(result, "index") });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Schedule", section: "getTeacher", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить расписание для преподавателя" });
	}
});

schedule_router.get("/teacher/:teacher/dates", async (req, res) => {
	try {
		let result = await Schedule.findAll({attributes: ["date"], where: { "teacher_id": req.params.teacher } });
		if (result.length === 0) {
			res.status(404).json({ message: "Для преподавателя нет доступных дат" });
		} else {
			teacher_dates.inc();
			res.status(200).json({ dates: _.sortBy(_.uniqBy(result, "date"), "date") });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Schedule", section: "getTeacherDates", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить список дат для преподавателя" });
	}
});

schedule_router.get("/teacher/:teacher/:date", async (req, res) => {
	try {
		let result = await Schedule.findAll({
			attributes: ["date", "index"], where: { "teacher_id": req.params.teacher, "date": req.params.date }, include: [
				{ model: Groups, as: "group", attributes: ["group_id", "group", "course"] },
				{ model: Lessons, as: "lesson", attributes: ["lesson_id", "lesson"] },
				{ model: Cabinets, as: "cabinet", attributes: ["cabinet_id", "cabinet"] }]
		});
		if (result.length === 0) {
			res.status(404).json({ message: "Расписание для преподавателя не найдено" });
		} else {
			teacher_date.inc();
			res.status(200).json({ schedule: _.sortBy(result, "index") });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Schedule", section: "getTeacherDate", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить расписание для преподавателя" });
	}
});

export default schedule_router;