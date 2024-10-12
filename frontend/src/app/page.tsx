'use client'
import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
})

const initialValues = {
    email: '',
    password: '',
}

export default function LoginPage() {
    return (
        <div className="flex h-screen bg-blue-500">
            <div className="w-full max-w-md m-auto bg-white rounded-lg shadow-lg py-10 px-16">
                <div className="text-center mb-8">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-20 h-20 mx-auto mb-4"
                    />
                    <h1 className="text-3xl font-bold text-blue-500">
                        Application Name
                    </h1>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={LoginSchema}
                    onSubmit={(values) => {
                        console.log(values)
                    }}
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
                                    type="email"
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
                            <button
                                type="submit"
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            >
                                Login
                            </button>
                        </Form>
                    )}
                </Formik>
                <div className="text-center mt-4">
                    <a
                        href="/register"
                        className="text-sm text-blue-500 hover:text-blue-700"
                    >
                        Register
                    </a>
                </div>
            </div>
        </div>
    )
}
