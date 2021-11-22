import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';
import { COOKIE_NAME, FORGET_PASSWORD_TOKEN_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from 'uuid';
import { getConnection } from "typeorm";


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
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() { redis, req }: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 3) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: 'length must be greater than 3'
                    },
                ]
            }
        }

        const key = FORGET_PASSWORD_TOKEN_PREFIX + token
        const userId = await redis.get(key);

        if (userId === null) {
            return {
                errors: [
                    {
                        field: 'token',
                        message: 'token expired'
                    }

                ]
            }
        }
        const userIdNumber = parseInt(userId)
        const user = await User.findOne(userIdNumber)

        if (user === null) {
            return {
                errors: [
                    {
                        field: 'token',
                        message: 'user no longer exists'
                    }

                ]
            }
        }


        await User.update(
            { id: userIdNumber },
            { password: await argon2.hash(newPassword) });
        //delete token from redis store

        await redis.del(key);

        //log user into session
        req.session.userId = userIdNumber;

        return { user };
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { redis }: MyContext
    ) {
        const user = await User.findOne({ where: { email } });
        console.log(user)
        if (user === undefined) {
            return
        }

        const token = v4();

        await redis.set(
            FORGET_PASSWORD_TOKEN_PREFIX + token,
            user.id,
            'ex',
            1000 * 60 * 60 * 24 * 3)

        await sendEmail(
            email,
            `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
        );

        return true;

    }


    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { req }: MyContext
    ) {
        if (req.session.userId === null) {
            return null;
        }

        const user = await User.findOne(req.session.userId)
        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {

        const errors = validateRegister(options);
        if (errors) {
            return { errors }
        }

        const hashedPassword = await argon2.hash(options.password)
        let user;
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    username: options.username,
                    email: options.email,
                    password: hashedPassword,
                }
                ).returning("*")
                .execute()

            user = result.raw[0];

        } catch (err) {
            console.log('err:', err)
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
        req.session.userId = user.id;
        return { user }
    };

    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne(
            usernameOrEmail.includes('@')
                ? { where: { email: usernameOrEmail } }
                : { where: { username: usernameOrEmail } })

        if (!user) {
            return {
                errors: [
                    {
                        field: 'usernameOrEmail',
                        message: "that username doesn't exist"
                    },
                ],
            };
        }
        const userPassword = user?.password as string
        const valid = await argon2.verify(userPassword, password)

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
        const userId = user?.id as number
        console.log("userid is:", userId)
        req.session.userId = userId
        console.log(req.session)

        //end wednesday

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