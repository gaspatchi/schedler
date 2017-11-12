import client from "prom-client";

export let registry = new client.Registry();

export let schedule_created = new client.Counter({ name: "schedler_schedule_created", help: "Количество созданных расписаний" });
export let schedule_updated = new client.Counter({ name: "schedler_schedule_updated", help: "Количество обновленных расписаний" });

export let groups_selected = new client.Counter({ name: "schedler_groups_selected", help: "Количество получений списка всех групп" });
export let teachers_selected = new client.Counter({ name: "schedler_teachers_selected", help: "Количество получений списка всех преподавателей" });

export let last_group_schedule = new client.Counter({ name: "schedler_last_group_schedule", help: "Количество получений последнего расписания для группы" });
export let last_teacher_schedule = new client.Counter({ name: "schedler_last_teacher_schedule", help: "Количество получений последнего расписания для преподавателя" });

export let group_dates = new client.Counter({ name: "schedler_group_dates", help: "Количество получений списка дат для группы" });
export let teacher_dates = new client.Counter({ name: "schedler_teacher_dates", help: "Количество получений списка дат для преподавателя" });

export let group_date = new client.Counter({ name: "schedler_group_date", help: "Количество получений расписания для группы на дату" });
export let teacher_date = new client.Counter({ name: "schedler_teacher_date", help: "Количество получений расписания для преподавателя на дату" });

registry.registerMetric(schedule_created);
registry.registerMetric(schedule_updated);
registry.registerMetric(groups_selected);
registry.registerMetric(teachers_selected);
registry.registerMetric(last_group_schedule);
registry.registerMetric(last_teacher_schedule);
registry.registerMetric(group_dates);
registry.registerMetric(teacher_dates);
registry.registerMetric(group_date);
registry.registerMetric(teacher_date);