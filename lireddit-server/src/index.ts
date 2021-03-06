import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from './constants';
import express from 'express'
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from "./resolvers/user";
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import cors from 'cors';
import { createConnection } from 'typeorm'
import { Post } from "./entities/Post";
import { User } from "./entities/User";


declare module "express-session" {
    interface Session {
        userId: number;
    }
};

const main = async () => {
    // create database
    const connection = await createConnection({
        type: 'postgres',
        database: 'lireddit2',
        username: 'postgres',
        password: 'postgres',
        logging: true,
        synchronize: true,
        entities: [Post, User]
    });

    const app = express();

    const RedisStore = connectRedis(session)
    const redis = new Redis();

    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
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
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({
            })
        ],
        context: ({ req, res, }) => ({ req, res, redis })
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: { origin: false }
    });

    app.get('/', (_, res) => {
        res.send("helo")
    });

    app.listen(4000, () => {
        console.log('listening on 4000')
    });


};

main().catch(err => {
    console.log(err)
});

