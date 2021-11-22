import { Button } from '@chakra-ui/button'
import { Box, Link } from '@chakra-ui/layout'
import { Formik, Form } from 'formik'
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { InputField } from '../../components/InputField'
import { Wrapper } from '../../components/Wrapper'
import { useChangePasswordMutation } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { toErrorMap } from '../../utils/toErrorMap'
import NextLink from 'next/link'
import { Flex } from '@chakra-ui/react'


const ChangePassword: NextPage<{ token: string }> = () => {
    const [tokenError, setTokenError] = useState('');
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();

    console.log(router.query)


    return (
        <Wrapper variant='small'>
            <Formik initialValues={{ newPassword: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({
                        newPassword: values.newPassword,
                        token:
                            typeof
                                router.query.token === 'string' ? router.query.token : ""
                    });
                    if (response.data?.changePassword.errors) {
                        console.log(response.data?.changePassword.errors)
                        const errorMap = toErrorMap(response.data.changePassword.errors)
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token as any)
                        }
                        setErrors(errorMap)
                    } else if (response.data?.changePassword.user) {
                        router.push('/')
                    }

                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='newPassword'
                            placeholder='Enter your new password'
                            label='New Password'
                            type='password'
                        />
                        {tokenError ? (
                            <>
                                <Flex>
                                    <Box mr={4} color='red'>{tokenError}</Box>
                                    <NextLink href='/forgot-password'>
                                        <Link>Create new Token</Link>
                                    </NextLink>
                                </Flex>
                            </>

                        ) : null}

                        <Button type='submit'
                            variant='solid'
                            color='black'
                            backgroundColor='teal'
                            border='solid'
                            isLoading={isSubmitting}
                        >
                            Change Password
                        </Button>
                    </Form>
                )}

            </Formik>
        </Wrapper>
    )
}



export default withUrqlClient(createUrqlClient)(ChangePassword);