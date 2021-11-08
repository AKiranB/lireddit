import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { ResultOf } from '@graphql-typed-document-node/core'
import { cacheExchange } from '@urql/exchange-graphcache'
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql'
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql'
import theme from '../theme'
import { betterUpdateQuery } from '../utils/betterUpdateQuery'



function MyApp({ Component, pageProps }: any) {
  return (

    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  )
}

export default MyApp;
