import { Box, Link, Flex } from "@chakra-ui/layout";


interface NavBarProps { }

export const NavBar: React.FC<NavBarProps> = ({ }) => {

    return (
        <Flex bg='tomato' p={4} ml={'auto'}>
            <Box>
                <Link mr={2} type='telegram'>Login</Link>
                <Link type='telegram'>Register</Link>
            </Box>
        </Flex>
    )

}