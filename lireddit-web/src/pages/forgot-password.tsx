import { Button, Box } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import React, { useState } from 'react'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useForgotPasswordMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'


const ForgotPassword: React.FC<{}> = ({ }) => {
    const [complete, setComplete] = useState<boolean>()
    const [, forgotPassword] = useForgotPasswordMutation();

    return (<Wrapper variant='small'>
        <Formik initialValues={{ email: "" }}
            onSubmit={async (values) => {
                await forgotPassword(values)
                setComplete(true);

            }}
        >
            {({ isSubmitting }) => complete ? <Box>We've sent an email if this count exists</Box> : (
                <Form>
                    <InputField
                        name='email'
                        placeholder='email'
                        label='Email'
                        type='email'
                    />

                    <Button type='submit'
                        variant='solid'
                        color='black'
                        backgroundColor='teal'
                        border='solid'
                        isLoading={isSubmitting}
                    >
                        Send Email
                    </Button>
                </Form>
            )}

        </Formik>
    </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)