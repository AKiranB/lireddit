"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    if (!options.email.includes('@')) {
        return;
        [
            {
                field: 'username',
                message: 'Invalid Email'
            },
        ];
    }
    if (options.username.includes('@')) {
        return;
        [
            {
                field: 'username',
                message: 'username cannot be an email address'
            },
        ];
    }
    if (options.username.length <= 3) {
        [
            {
                field: 'username',
                message: 'username must be longer than 2 characters'
            },
        ];
    }
    if (options.password.length <= 3) {
        [
            {
                field: 'password',
                message: 'password must be longer than 2 characters'
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map