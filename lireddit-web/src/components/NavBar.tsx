import { Box, Link, Flex } from "@chakra-ui/layout";
import NextLink from 'next/link'


interface NavBarProps { }

export const NavBar: React.FC<NavBarProps> = ({ }) => {

    return (
        <Flex bg='tomato' p={4} ml={'auto'}>
            <Box>
                <NextLink href='/login'>
                    <Link mr={2} type='telegram'>Login</Link>
                </NextLink>
                <NextLink href='/register'>
                    <Link type='telegram'>Register</Link>
                </NextLink>
            </Box>
        </Flex>
    )
}