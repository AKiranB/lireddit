import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput"

export const validateRegister = (options: UsernamePasswordInput) => {

    if (!options.email.includes('@')) {
        return
        [
            {
                field: 'username',
                message: 'Invalid Email'
            },
        ]
    }
    if (options.username.includes('@')) {
        return
        [
            {
                field: 'username',
                message: 'username cannot be an email address'
            },
        ]

    }
    if (options.username.length <= 3) {

        [
            {
                field: 'username',
                message: 'username must be longer than 2 characters'
            },
        ]
    }
    if (options.password.length <= 3) {
        [
            {
                field: 'password',
                message: 'password must be longer than 2 characters'
            },
        ]
    }
    return null;
}