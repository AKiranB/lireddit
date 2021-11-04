import { User } from "../entities/User"
import { MyContext } from "../types"
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql"
import argon2 from 'argon2'


@InputType()
class UsernamePasswordInput {

    @Field()
    username: string
    @Field()
    password: string
}

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
        if (options.username.length <= 3) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'username must be longer than 2 characters'
                    },
                ]
            }
        }
        if (options.password.length <= 3) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'password must be longer than 2 characters'
                    },
                ]
            }
        }
        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword
        })
        try {
            await em.persistAndFlush(user);
        } catch (err) {
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
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username })
        if (user === null) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: "that username doesn't exist"
                    },
                ],
            };
        }

        const valid = await argon2.verify(user.password, options.password)

        if (options.password.length <= 3) {
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
        }
    }

};