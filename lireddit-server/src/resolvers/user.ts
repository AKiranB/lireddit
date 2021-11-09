import { User } from "../entities/User"
import { MyContext } from "../types"
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql"
import argon2 from 'argon2'
import { COOKIE_NAME, FORGET_PASSWORD_TOKEN_PREFIX } from "../constants"
import { UsernamePasswordInput } from "./UsernamePasswordInput"
import { validateRegister } from "../utils/validateRegister"
import { sendEmail } from "src/utils/sendEmail"
import { v4 } from 'uuid'




@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { em, redis }: MyContext
    ) {
        const user = await em.findOne(User, { email })
        if (!user) {
            return true;
        }

        const token = v4();

        redis.set(FORGET_PASSWORD_TOKEN_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3)

        await sendEmail(
            email,
            `<a href="http://localhost:3000/change-password/${token}> Reset Password </a>`

        );

        return true;

    }

    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { req, em }: MyContext
    ) {
        if (req.session.userId === null) {
            return null;
        }

        const user = await em.findOne(User, { id: req.session.userId })
        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {

        const errors = validateRegister(options);
        if (errors) {
            return { errors }
        }

        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword,
            email: options.email
        })
        try {
            await em.persistAndFlush(user);
        } catch (err) {
            console.log(err)
            if (err.code === '23505') {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "This username is unavailable"
                        }
                    ]
                }
            }

        }
        //this sets a cokie on the 
        //user and keeps them
        //logged in
        req.session.userId = user.id;
        return { user }
    };

    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, usernameOrEmail.includes('@') ? {
            email: usernameOrEmail
        } : {
            username: usernameOrEmail
        })
        if (user === null) {
            return {
                errors: [
                    {
                        field: 'usernameOrEmail',
                        message: "that username doesn't exist"
                    },
                ],
            };
        }

        const valid = await argon2.verify(user.password, password)

        if (password.length <= 3) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: "password must be longer than two characters"
                    }
                ]
            }
        }

        if (!valid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: "incorrect password"
                    },
                ],
            }
        }

        req.session.userId = user.id

        return {
            user,
        };

    }

    @Mutation(() => Boolean)
    async logout(
        @Ctx() { req, res }: MyContext
    ) {
        return new Promise((resolve) =>
            req.session.destroy(err => {
                res.clearCookie(COOKIE_NAME)
                if (err) {
                    resolve(false);
                    return
                }
                resolve(true)
            }))

    }

};