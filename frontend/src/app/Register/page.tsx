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
    workingHours: Yup.string().required('Required'),
    workingDays: Yup.string().required('Required'),
})




const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    clubName: '',
    workingHours: '',
    workingDays: '',
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
            htmlFor="location"
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
                htmlFor="workingDays"
                className="block text-sm font-medium text-gray-700"
            >
                Working Days
            </label>
            <Field
                as="select"
                name="workingDays"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
                <option value="" disabled>Select working days</option>
                <option value="whole_week">Whole Week</option>
                <option value="weekend">Weekend</option>
                <option value="week_days">Week Days</option>
            </Field>
            <ErrorMessage
                name="workingDays"
                component="div"
                className="text-red-500 text-sm"
            />
        <label
            htmlFor="workingHours"
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
                                        type='button'
                                        onClick={handleBack}
                                    >
                                        Back
                                    </Button>
                                )}
                                {step < 3 ? (
                                    <Button
                                        type='button'
                                        variant="outline"
                                        onClick={handleNext}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        disabled={isSubmitting}
                                        type='submit'
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
