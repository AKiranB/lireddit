import { Button } from '@chakra-ui/button'
import { Link } from '@chakra-ui/layout'
import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import router from 'next/router'
import React from 'react'
import { InputField } from '../components/InputField'
import { NavBar } from '../components/NavBar'
import { Wrapper } from '../components/Wrapper'
import { useCreatePostMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'


export const CreatePost: React.FC<{}> = () => {
    const [, createPost] = useCreatePostMutation()
    return (
        <>
            <NavBar></NavBar>
            <Wrapper variant='small'>
                <Formik initialValues={{ title: '', text: '' }}
                    onSubmit={async (values, { setErrors }) => {
                        const result = await createPost({ input: values })
                        console.log(result)
                        router.push('/')
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <InputField
                                name='title'
                                placeholder='Enter title'
                                label='Title'

                            />
                            <InputField
                                name='text'
                                placeholder='text'
                                label='Text'
                                textarea
                            />

                            <Button type='submit'
                                variant='solid'
                                color='black'
                                backgroundColor='teal'
                                border='solid'
                                isLoading={isSubmitting}
                            >
                                Create Post
                            </Button>
                        </Form>
                    )}

                </Formik>
            </Wrapper>
        </>
    )
}

export default withUrqlClient(createUrqlClient)(CreatePost)