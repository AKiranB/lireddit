
import { Post } from "../entities/Post"
import { Arg, Ctx, Int, Query, Resolver, Mutation } from "type-graphql"
import { MyContext } from "../types"



@Resolver()
export class PostResolver {

    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => [Post], { nullable: true })
    post(
        @Arg('id', () => Int) id: number,
        @Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, { id });
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: String,
        @Ctx() { em }: MyContext
    ): Promise<Post> {
        const post = em.create(Post, { title });
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post)
    async updatedPost(
        @Arg('title', () => String, { nullable: true }) updatedTitle: string,
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, { id });
        if (!post) {
            return null
        }
        if (typeof updatedTitle !== 'undefined') {
            post.title = updatedTitle;
            await em.persistAndFlush(post)
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
    ): Promise<boolean> {

        await em.nativeDelete(Post, { id });
        return true;
    }

}