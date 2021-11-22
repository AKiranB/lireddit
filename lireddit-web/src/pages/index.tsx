import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Link } from '@chakra-ui/react'
import NextLink from "next/link"

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <Layout>
        <NextLink href='/create-post'>
          <Link>Create Post</Link>
        </NextLink>
        {data ?
          data.posts.map((post) =>
            <div key={post.id}>
              {post.title}
            </div>
          ) : (
            <div>Fetching posts</div>)}
      </Layout>
    </>
  )

}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
