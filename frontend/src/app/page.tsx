// pages/login.tsx
'use client'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useUser } from '../app/context/userContext'
import { logo } from './constants/images'
import Image from 'next/image'
import CircularProgress from '@mui/joy/CircularProgress'

const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
})

const initialValues = {
    email: '',
    password: '',
}

interface FormData {
    email: string
    password: string
}

export default function LoginPage() {
    const { setUser } = useUser() // Get setUser from context
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const handleSubmit = async (values: FormData) => {
        setIsSubmitting(true)
        console.log(values)
        const formData: FormData = {
            email: values.email,
            password: values.password,
        }

        try {
            const response = await axios.post(
                'https://zn44q04iq3.execute-api.eu-central-1.amazonaws.com/api-v1/club/login',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            console.log('Success:', response.data)
            // Store the token and user data in context and local storage
            setUser(response.data) // Set user data
            localStorage.setItem('token', response.data.token) // Store the token if needed
            router.push('/Dashboard') // Redirect to the dashboard
            setIsSubmitting(false)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <div className="flex h-screen bg-blue-500">
            <div className="w-full max-w-md m-auto bg-white rounded-lg shadow-lg py-10 px-16">
                <div className="text-center mb-8">
                    <Image
                        src={logo}
                        alt="Logo"
                        className="w-20 h-20 mx-auto mb-4"
                        width={80}
                        height={80}
                    />
                    <h1 className="text-3xl font-bold text-blue-500">
                        RiConnect
                    </h1>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={LoginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <Field
                                    type="text"
                                    name="email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <Field
                                    type="password"
                                    name="password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>
                            {isSubmitting ? (
                                <div className=' flex justify-center items-center'>
                                    <CircularProgress />
                                </div>
                            ) : (
                                <div className=' flex justify-center items-center'>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                                    >
                                        Login
                                    </button>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
                <div className="text-center mt-4">
                    <a
                        href="/Register"
                        className="text-sm text-blue-500 hover:text-blue-700"
                    >
                        Register
                    </a>
                </div>
            </div>
        </div>
    )
}
