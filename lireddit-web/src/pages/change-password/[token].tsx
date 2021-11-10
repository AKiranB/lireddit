import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
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
import login from '../login'


const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const [tokenError, setTokenError] = useState();
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();

    return (
        <Wrapper variant='small'>
            <Formik initialValues={{ newPassword: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({
                        newPassword: values.newPassword,
                        token,
                    });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors)
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token as any)
                        } else {
                            setErrors(errorMap);
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
                        {tokenError ? <Box color='blue'>{tokenError}</Box> : null}

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

ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}

export default withUrqlClient(createUrqlClient)(ChangePassword);