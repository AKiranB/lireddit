
import { Post } from "../entities/Post"
import {
    Arg,
    Query,
    Resolver,
    Mutation,
    InputType,
    Field,
    Ctx,
    UseMiddleware,

} from "type-graphql"
import { MyContext } from "src/types";
import { isAuth } from "./middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
class PostInput {
    @Field()
    title: string

    @Field()
    text: string
}

@Resolver()
export class PostResolver {

    @Query(() => [Post])
    async posts(
        @Arg('limit') limit: number,
        @Arg('cursor', () => Date, { nullable: true }) cursor: string | null,
    ): Promise<Post[]> {
        const realLimit = Math.min(50, limit)
        const qb = getConnection()
            .getRepository(Post)
            .createQueryBuilder('post')
            .orderBy('"createdAt"', "DESC")
            .take(realLimit)

        if (cursor) {
            qb.where('"createdAt" < :cursor', {
                cursor: cursor
            });
        }

        return qb.getMany();

    }

    @Query(() => [Post], { nullable: true })
    post(
        @Arg('id') id: number): Promise<Post | undefined> {
        return Post.findOne(id)
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(@Arg('input') input: PostInput,
        @Ctx() { req }: MyContext): Promise<Post> {
        return await Post.create({
            ...input,
            creatorId: req.session.userId
        }).save();
    }

    @Mutation(() => Post)
    async updatePost(
        @Arg('title', () => String, { nullable: true }) title: string,
        @Arg('id') id: number): Promise<Post | null> {
        const post = await Post.findOne(id);
        if (!post) {
            return null
        }
        if (typeof title !== 'undefined') {
            await Post.update({ id }, { title });
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(@Arg('id') id: number): Promise<boolean> {
        await Post.delete(id)
        return true;
    }

}