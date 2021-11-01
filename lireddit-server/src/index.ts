import "reflect-metadata";
import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import express from 'express'
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis'
import { MyContext } from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

declare module "express-session" {
    interface Session {
        userId: number;
    }
}



const main = async () => {
    // create database
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up()

    const app = express();

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,


            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
                sameSite: "lax",
                secure: __prod__, //only true in production


            },
            saveUninitialized: false,
            secret: 'rnd10256',
            resave: false,


        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({

            })
        ],
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    })

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });


    app.get('/', (_, res) => {
        res.send("helo")
    })

    app.listen(4000, () => {
        console.log('listening on 4000')
    })


};

main().catch(err => {
    console.log(err)
})

