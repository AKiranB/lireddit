import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button, Center, Flex } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {

}




const Login: React.FC<{}> = ({ }) => {
    const router = useRouter();
    const [, login] = useLoginMutation();

    return (
        <Wrapper variant='small'>
            <Formik initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values)
                    console.log(response)
                    if (response.data?.login.errors) {
                        console.log(response.data?.login.errors)
                        setErrors(toErrorMap(response.data?.login.errors))
                    } else if (response.data?.login.user) {
                        router.push('/')
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='username'
                            placeholder='username'
                            label='Username'
                            type='text'
                        />
                        <InputField
                            name='password'
                            placeholder='password'
                            label='Password'
                            type='password'
                        />
                        <Button type='submit'
                            variant='solid'
                            color='black'
                            backgroundColor='teal'
                            border='solid'
                            isLoading={isSubmitting}
                        >
                            Login
                        </Button>
                    </Form>
                )}

            </Formik>
        </Wrapper>

    );
}

export default withUrqlClient(createUrqlClient)(Login);