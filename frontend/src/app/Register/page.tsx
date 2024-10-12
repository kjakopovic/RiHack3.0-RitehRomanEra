'use client'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
//import { logo } from '@/app/constants/images'
const StepOneSchema = Yup.object().shape({
    email: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string().required('Required'),
})

const StepTwoSchema = Yup.object().shape({
    clubName: Yup.string().required('Required'),
})

const StepThreeSchema = Yup.object().shape({
    clubTags: Yup.string().required('Required'),
})
const StepFourSchema = Yup.object().shape({
    workingTime: Yup.string().required('Required'),
})

const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    clubName: '',
    clubTags: '',
    workingHours: '',
}
const StepOne = () => (
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

        <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
        >
            Confirm password
        </label>
        <Field
            type="password"
            name="confirmPassword"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="confirmPassword"
            component="div"
            className="text-red-500 text-sm"
        />
    </div>
)
const StepTwo = () => (
    <div>
        <label
            htmlFor="clubName"
            className="block text-sm font-medium text-gray-700"
        >
            Club Name
        </label>
        <Field
            type="text"
            name="clubName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="clubName"
            component="div"
            className="text-red-500 text-sm"
        />
        <label
            htmlFor="clubName"
            className="block text-sm font-medium text-gray-700"
        >
            Location
        </label>
        <Field
            type="text"
            name="location"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="location"
            component="div"
            className="text-red-500 text-sm"
        />
    </div>
)

const StepThree = () => (
    <div>
        <label
            htmlFor="clubTags"
            className="block text-sm font-medium text-gray-700"
        >
            Club Tags
        </label>
        <Field
            type="text"
            name="clubTags"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="clubTags"
            component="div"
            className="text-red-500 text-sm"
        />
        <label
            htmlFor="clubTags"
            className="block text-sm font-medium text-gray-700"
        >
            Working hours
        </label>
        <Field
            type="text"
            name="workingHours"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="workingHours"
            component="div"
            className="text-red-500 text-sm"
        />
    </div>
)

const StepFour = () => (
    <div>
        <label
            htmlFor="workingTime"
            className="block text-sm font-medium text-gray-700"
        >
            Working Time
        </label>
        <Field
            type="text"
            name="workingTime"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="workingTime"
            component="div"
            className="text-red-500 text-sm"
        />
    </div>
)

export default function RegisterPage() {
    const [step, setStep] = useState(1)

    const handleNext = () => {
        setStep((prevStep) => prevStep + 1)
    }

    const handleBack = () => {
        setStep((prevStep) => prevStep - 1)
    }

    const validationSchema = () => {
        switch (step) {
            case 1:
                return StepOneSchema
            case 2:
                return StepTwoSchema
            case 3:
                return StepThreeSchema
            case 4:
                return StepFourSchema
            default:
                return StepOneSchema
        }
    }

    return (
        <div className="flex min-h-screen bg-blue-500">
            <div className="w-full max-w-lg m-auto bg-white rounded-lg shadow-lg py-12 px-20 fixed-height">
                <div className="text-center mb-10">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        className="mx-auto mb-4"
                        width={80}
                        height={80}
                    />
                    <h1 className="text-3xl font-bold text-blue-500">
                        Register
                    </h1>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log(values)
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-6">
                            {step === 1 && <StepOne />}
                            {step === 2 && <StepTwo />}
                            {step === 3 && <StepThree />}
                            {step === 4 && <StepFour />}
                            <div className="flex justify-between">
                                {step > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={handleBack}
                                    >
                                        Back
                                    </Button>
                                )}
                                {step < 3 ? (
                                    <Button
                                        variant="outline"
                                        onClick={handleNext}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        disabled={isSubmitting}
                                    >
                                        Register
                                    </Button>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
