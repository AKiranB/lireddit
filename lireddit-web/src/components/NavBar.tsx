import { Button } from "@chakra-ui/button";
import { Box, Link, Flex } from "@chakra-ui/layout";
import NextLink from 'next/link'
import { useEffect } from "react";
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from "../utils/isServer";


interface NavBarProps { }

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery({
        pause: isServer()
    })

    console.log(data)
    let body

    if (fetching) {
        //data is loading
        body = <h1>Fetching</h1>

    } else if (data?.me === null) {
        body = (<>
            <NextLink href='/login'>
                <Link mr={2} type='telegram'>Login</Link>
            </NextLink>
            <NextLink href='/register'>
                <Link type='telegram'>Register</Link>
            </NextLink>
        </>)

    } else {
        body = (
            <Flex>
                <Box pr={4}>{data?.me?.username}
                </Box>
                <Button onClick={() => {
                    logout();
                }}
                    isLoading={logoutFetching}
                >

                    Logout
                </Button>
            </Flex>
        )
    }

    return (
        <Flex bg='tomato' p={4}>
            <Box ml={'auto'}>{body}</Box>
        </Flex>
    )
}