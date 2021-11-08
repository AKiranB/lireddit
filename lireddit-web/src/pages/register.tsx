import React from 'react'
import { Formik, Form } from 'formik'
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Button, Center, Flex } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useMutation } from 'urql';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {

}




const Register: React.FC<registerProps> = ({ }) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();

    return (
        <Wrapper variant='small'>
            <Formik initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register(values)
                    console.log(response)
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data?.register.errors))
                    } else if (response.data?.register.user) {
                        router.push('/')
                    }
                }}
            >
                {({ values, handleChange, isSubmitting }) => (
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
                            Register
                        </Button>
                    </Form>
                )}

            </Formik>
        </Wrapper>

    );
}

export default withUrqlClient(createUrqlClient)(Register);