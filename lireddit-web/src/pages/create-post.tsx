import { Button } from '@chakra-ui/button';
import { Link } from '@chakra-ui/layout';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import router from 'next/router';
import React, { useEffect } from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { NavBar } from '../components/NavBar';
import { Wrapper } from '../components/Wrapper';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';


export const CreatePost: React.FC<{}> = () => {
    const [, createPost] = useCreatePostMutation();
    const [{ data }] = useMeQuery();
    useEffect(() => {
        if (!data?.me) {
            router.replace('/login')
        }
    }, [data, router]);
    return (
        <>
            <Layout variant='small'>
                <Wrapper variant='small'>
                    <Formik initialValues={{ title: '', text: '' }}
                        onSubmit={async (values) => {
                            const { error } = await createPost({ input: values })
                            console.log("err:", error)
                            if (error) {
                                router.push('/login');
                            } else {
                                router.push('/');
                            }
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
            </Layout>
        </>
    )
};

export default withUrqlClient(createUrqlClient)(CreatePost);