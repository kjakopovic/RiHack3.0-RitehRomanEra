'use client'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { logo } from '../constants/images'

const StepOneSchema = Yup.object().shape({
    email: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string().required('Required'),
})

const StepTwoSchema = Yup.object().shape({
    club_name: Yup.string().required('Required'),
})

const StepThreeSchema = Yup.object().shape({
    default_working_hours: Yup.string().required('Required'),
    working_days: Yup.string().required('Required'),
})
 




const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    club_name: '',
    default_working_hours: '',
    working_days: '',
    longitude: 0,
    latitude: 0,
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
            htmlFor="club_name"
            className="block text-sm font-medium text-gray-700"
        >
            Club Name
        </label>
        <Field
            type="text"
            name="club_name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="club_name"
            component="div"
            className="text-red-500 text-sm"
        />
        <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
        >
            Adress
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
                htmlFor="working_days"
                className="block text-sm font-medium text-gray-700"
            >
                Working Days
            </label>
            <Field
                as="select"
                name="working_days"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
                <option value="" disabled>Select working days</option>
                <option value="Mon-Sun">Mon - Sun</option>
                <option value="Fri-Sun">Fri - Sun</option>
                <option value="Mon-Fri">Mon - Fri</option>
            </Field>
            <ErrorMessage
                name="working_days"
                component="div"
                className="text-red-500 text-sm"
            />
        <label
            htmlFor="default_working_hours"
            className="block text-sm font-medium text-gray-700"
        >
            Working hours
        </label>
        <Field
            type="text"
            name="default_working_hours"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="default_working_hours"
            component="div"
            className="text-red-500 text-sm"
        />
    </div>
)

const StepFour = () => (
    <div>
        <label
            htmlFor="working_days"
            className="block text-sm font-medium text-gray-700"
        >
            Working Time
        </label>
        <Field
            type="text"
            name="working_days"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage
            name="working_days"
            component="div"
            className="text-red-500 text-sm"
        />
    </div>
)
interface FormData {
    email: string;
    password: string;
    club_name: string;
    longitude: number;
    location: string;
    latitude: number;
    default_working_hours: string;
    working_days: string;   
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export default function RegisterPage() {
    const [step, setStep] = useState(1)
   const router = useRouter()
    const handleSubmit = async (values: FormData) => {
   
        // Construct the Geoapify URL with the address from form data
        const geoapifyApiKey = 'd80ae4047f0749d0abcb38b1a2eba807';
        const address = encodeURIComponent(values.location);
        const geoapifyUrl = `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${geoapifyApiKey}`;
        
        try {
            const response = await fetch(geoapifyUrl, {
                method: 'GET',
            });
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
           
            // Extract longitude and latitude from the Geoapify response
            const lon  = data.features[0].geometry.coordinates[0];
            const lat = data.features[0].geometry.coordinates[1];
            console.log('Longitude:', lon + ' Latitude:', lat);
            const formData: FormData = {
                email: values.email,
                password: values.password,
                club_name: values.club_name,
                location: values.location,
                longitude: lon,
                latitude: lat,
                default_working_hours: values.default_working_hours,
                working_days: values.working_days,
            };
            console.log(formData);
            // Send formData to your backend
            const backendResponse = await fetch("https://zn44q04iq3.execute-api.eu-central-1.amazonaws.com/api-v1/club/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (backendResponse.ok) {
                console.log('Success:', backendResponse);
                
            }
            router.push('/');
        } catch (error) {
            console.error('Error:', error);
        }
    };
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
            
            default:
                return StepOneSchema
        }
    }

    return (
        <div className="flex min-h-screen bg-blue-500">
            <div className="w-full max-w-lg m-auto bg-white rounded-lg shadow-lg py-12 px-20 fixed-height">
                <div className="text-center mb-10">
                    <Image
                        src={logo}
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
                    onSubmit={handleSubmit}
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
