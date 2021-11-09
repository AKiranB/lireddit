import { Button } from '@chakra-ui/button'
import { Formik, Form } from 'formik'
import { NextPage } from 'next'
import router from 'next/router'
import React from 'react'
import { InputField } from '../../components/InputField'
import { Wrapper } from '../../components/Wrapper'
import { toErrorMap } from '../../utils/toErrorMap'
import login from '../login'


const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    return (
        <Wrapper variant='small'>
            <Formik initialValues={{ newPassword: '' }}
                onSubmit={async (values, { setErrors }) => {
                    // const response = await login(values)
                    // console.log(response)
                    // if (response.data?.login.errors) {
                    //     console.log(response.data?.login.errors)
                    //     setErrors(toErrorMap(response.data?.login.errors))
                    // } else if (response.data?.login.user) {
                    //     router.push('/')
                    // }
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

export default ChangePassword