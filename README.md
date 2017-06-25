**Schedler** - сервис для показа расписания

**Примеры запросов и ответов**


----------
- `POST` / - Добавление расписания в базу и создание задачи для рассылки

- `Request`
```
{
	"lesson": "...",
	"group": "311",
	"cabinet": "126",
	"teacher": "....",
	"date": "2017-06-24",
	"index": 1
}
```
- `Response`
```
{
    "message": "Расписание успешно добавлено"
}
```

- `GET` /groups- Получение списка всех групп

- `Response`
```
{
    "groups": [
        {
            "group_id": 1,
            "group": "311",
            "course": 2,
            "speciality": "..."
        }
    ]
}
```

- `GET` /teachers- Получение списка всех преподавателей

- `Response`
```
{
    "teachers": [
        {
            "teacher_id": 1,
            "firstname": "...",
            "lastname": "...",
            "patronymic": "..."
        }
    ]
}
```

- `GET` /group/{group_id} - Получение последнего расписания для группы

- `Response`
```
{
    "schedule": [
        {
            "date": "2017-06-24",
            "index": 1,
            "group": {
                "group_id": 1,
                "group": "311",
                "course": 1
            },
            "lesson": {
                "lesson_id": 1,
                "lesson": "..."
            },
            "teacher": {
                "teacher_id": 1,
                "firstname": "...",
                "lastname": "...",
                "patronymic": "...",
                "verified": false
            },
            "cabinet": {
                "cabinet_id": 1,
                "cabinet": "126"
            }
        }
    ]
}
```

- `GET` /group/{group_id}/dates - Получение дат для группы

- `Response`
```
{
    "dates": [
        {
            "date": "2017-06-24"
        }
    ]
}
```

- `GET` /group/{group_id}/{date} - Получение последнего расписания для группы на дату

- `Response`
```
{
    "schedule": [
        {
            "date": "2017-06-24",
            "index": 1,
            "group": {
                "group_id": 1,
                "group": "311",
                "course": 1
            },
            "lesson": {
                "lesson_id": 1,
                "lesson": "..."
            },
            "teacher": {
                "teacher_id": 1,
                "firstname": "...",
                "lastname": "...",
                "patronymic": "...",
                "verified": false
            },
            "cabinet": {
                "cabinet_id": 1,
                "cabinet": "126"
            }
        }
    ]
}
```

- `GET` /teacher/{teacher_id} - Получение последнего расписания для преподавателя

- `Response`
```
{
    "schedule": [
        {
            "date": "2017-06-24",
            "index": 1,
            "group": {
                "group_id": 1,
                "group": "311",
                "course": 1
            },
            "lesson": {
                "lesson_id": 1,
                "lesson": "..."
            },
            "cabinet": {
                "cabinet_id": 1,
                "cabinet": "126"
            }
        }
    ]
}
```

- `GET` /teacher/{teacher_id}/dates - Получение всех дат для преподавателя

- `Response`
```
{
    "dates": [
        {
            "date": "2017-06-24"
        }
    ]
}
```

- `GET` /teacher/{teacher_id}/{date} - Получение расписания для преподавателя на дату

- `Response`
```
{
    "schedule": [
        {
            "date": "2017-06-24",
            "index": 1,
            "group": {
                "group_id": 1,
                "group": "311",
                "course": 1
            },
            "lesson": {
                "lesson_id": 1,
                "lesson": "..."
            },
            "cabinet": {
                "cabinet_id": 1,
                "cabinet": "126"
            }
        }
    ]
}
```