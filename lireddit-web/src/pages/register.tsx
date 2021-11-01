import React from 'react'
import { Formik, Form } from 'formik'
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Button, Center, Flex } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';

interface registerProps {

}



const Register: React.FC<registerProps> = ({ }) => {
    
    return (
        <Wrapper variant='small'>
            <Formik initialValues={{ username: "", password: "" }}
                onSubmit={(values) => {
                    console.log(values);
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
                        >
                            Register
                        </Button>
                    </Form>
                )}

            </Formik>
        </Wrapper>

    );
}

export default Register