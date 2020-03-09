export default [
    {
        _id: 'user_1',
        name: 'Huyen Dang',
        avatar: null,
        isOwner: true,
        permission: {
            announcement: true,
            privacy: true,
            messenger: true,
            invite: true
        }
    },
    {
        _id: 'user_2',
        name: 'Nguyen Trong Luan',
        avatar: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/83558548_2290286491264377_331290296627232768_n.jpg?_nc_cat=107&_nc_sid=85a577&_nc_oc=AQkytZyAGiO0-45-PaPeYnPHS2BoEP9TvmyFLeGxdCOu1YiRHyW6PLfi-Fut-G4lU9I&_nc_ht=scontent-hkg3-1.xx&oh=7e73374ad02d84939d981a7b7cf624a8&oe=5E8FE112',
        isOwner: false,
        permission: {
            announcement: true,
            privacy: true,
            messenger: false,
            invite: true
        }
    },
    {
        _id: 'user_3',
        name: 'Minh Tan',
        avatar: null,
        isOwner: false,
        permission: {
            announcement: true,
            privacy: false,
            messenger: true,
            invite: false
        }
    }
]