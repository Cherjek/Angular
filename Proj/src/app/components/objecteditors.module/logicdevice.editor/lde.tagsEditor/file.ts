enum Statuses { complete, warning, error }

class DataSource1 {
    
    dataSource = [{
        id: 1,
        name: "name 1",
        description: "какое-то длинное описание текста размер не меньше 300 символов",
        relateItems: [
            {
                id: 1,
                name: "item child 1"
            },
            {
                id: 2,
                name: "item child 2"
            },
            {
                id: 3,
                name: "item child 3"
            },
            {
                id: 4,
                name: "item child 4"
            }],
        status: Statuses.complete
    }, {
        id: 2,
        name: "name 2",
        description: "какое-то длинное описание текста размер не меньше 300 символов",
        relateItems: [
            {
                id: 2,
                name: "item child 2"
            },
            {
                id: 3,
                name: "item child 3"
            },
            {
                id: 5,
                name: "item child 5"
            }],
            status: Statuses.warning
    }, {
        id: 3,
        name: "name 3",
        description: "какое-то длинное описание текста размер не меньше 300 символов",
        relateItems: [
            {
                id: 5,
                name: "item child 5"
            },
            {
                id: 6,
                name: "item child 6"
            },
            {
                id: 7,
                name: "item child 7"
            }],
            status: Statuses.error
    }, {
            id: 4,
            name: "name 4",
            description: "какое-то длинное описание текста размер не меньше 300 символов",
            relateItems: [
                {
                    id: 2,
                    name: "item child 2"
                },
                {
                    id: 5,
                    name: "item child 5"
                },
                {
                    id: 8,
                    name: "item child 8"
                }],
            status: Statuses.complete
        }]
}


enum StatusWorker { OnWork, OnHolliday, OnHouseWork, OnSick }


class DataSource2 {

    dataSource = [{
        id: 1,
        name: "user 1",
        surname: "surname user 1",
        description: "какое-то длинное описание текста размер не меньше 300 символов",
        card: {
            phone: "89036773320",
            email: "1email@ya.ru"
        },
        status: [StatusWorker.OnWork]
    },
        {
            id: 2,
            name: "user 2",
            surname: "surname user 2",
            description: "какое-то длинное описание текста размер не меньше 300 символов",
            card: {
                phone: "890324483320",
                email: "2email@ya.ru"
            },
            status: [StatusWorker.OnSick, StatusWorker.OnHouseWork]
        }, {
            id: 3,
            name: "user 3",
            surname: "surname user 3",
            description: "какое-то длинное описание текста размер не меньше 300 символов",
            card: {
                phone: "823323273320",
                email: "3email@ya.ru"
            },
            status: [StatusWorker.OnHolliday]
        }, {
            id: 4,
            name: "user 4",
            surname: "surname user 4",
            description: "какое-то длинное описание текста размер не меньше 300 символов",
            card: {
                phone: "89036933320",
                email: "4email@ya.ru"
            },
            status: [StatusWorker.OnWork]
        }, {
            id: 5,
            name: "user 5",
            surname: "surname user 5",
            description: "какое-то длинное описание текста размер не меньше 300 символов",
            card: {
                phone: "89036286320",
                email: "5email@ya.ru"
            },
            status: [StatusWorker.OnSick]
        }, {
            id: 6,
            name: "user 6",
            surname: "surname user 6",
            description: "какое-то длинное описание текста размер не меньше 300 символов",
            card: {
                phone: "89036623320",
                email: "6email@ya.ru"
            },
            status: [StatusWorker.OnHouseWork]
        }, {
            id: 7,
            name: "user 7",
            surname: "surname user 7",
            description: "какое-то длинное описание текста размер не меньше 300 символов",
            card: {
                phone: "89333473320",
                email: "7email@ya.ru"
            },
            status: [StatusWorker.OnWork, StatusWorker.OnHolliday]
        }]
}