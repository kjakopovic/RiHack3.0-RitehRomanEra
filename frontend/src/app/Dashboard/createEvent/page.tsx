'use client'
import React, {  useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import * as Yup from 'yup'
import { axiosPublic } from '@/app/config/axios'

const MultiStepEventForm = () => {
    const [step, setStep] = useState(1)
    const [isFormVisible, setIsFormVisible] = useState(true)
    const [showDjNameInput, setShowDjNameInput] = useState(false)
    const [showGiveawayForm, setShowGiveawayForm] = useState(false)

    const handleNext = () => {
      setStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
      setStep((prevStep) => prevStep - 1)
  }
    const closeForm = () => setIsFormVisible(false)
   

    const initialValues = {
        title: '',
        category: '',
        description: '',
        date: '',// theme type geners 
        location: '',
        theme: '',
        type: '',
        geners: '',
        djName: '',
        giveaway:{
            giveawayName: '',
            giveawayEndDate: '',
            giveawayPrize: '',
            giveawayDescription: '',
        }
        
    }

    const StepOneSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        theme: Yup.string().required('Theme is required'),
        type: Yup.string().required('Type is required'),
        geners: Yup.string().required('Geners is required'),
        description: Yup.string().required('Description is required'),
    })

    const StepTwoSchema = Yup.object().shape({
        date: Yup.string().required('Date is required'),
        location: Yup.string().required('Location is required'),
        startTime: Yup.string().required('Start time is required'),
    })

    const StepThreeSchema = Yup.object().shape({
    
        djName: Yup.string().when('guests', (guests, schema) =>
            guests && guests.includes('DJ')
                ? schema.required('DJ name is required')
                : schema
        ),
        giveawayName: Yup.string().when('giveaway', (giveaway, schema) =>
            giveaway ? schema.required('Giveaway name is required') : schema
        ),
        giveawayEndDate: Yup.string().when('giveaway', (giveaway, schema) =>
            giveaway ? schema.required('Giveaway end date is required') : schema
        ),
        giveawayPrize: Yup.string().when('giveaway', (giveaway, schema) =>
            giveaway ? schema.required('Giveaway prize is required') : schema
        ),
        giveawayDescription: Yup.string().when(
            'giveaway',
            (giveaway, schema) =>
                giveaway
                    ? schema.required('Giveaway description is required')
                    : schema
        ),
    })
    
    const StepOne = () => (
        <>
            <div className="flex justify-center items-center">
                <Image src="/logo.png" alt="Logo" width={50} height={50} />
                <h1 className="font-bold text-xl">What is your Event about?</h1>
            </div>
            <div >
                <label htmlFor="title">Title</label>
                <Field name="title" as={Input} />
                <ErrorMessage name="title" component="div" />
            </div>
            <div className=' flex flex-row justify-between gap-3'> 
              <div className="mt-10 w-1/3">
                  <label htmlFor="category">Theme</label>
                  <Field
                      name="theme"
                      as="select"
                      className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                      <option value="" disabled>
                          Select Theme
                      </option>
                      <option value="conference">Neon/Glow Party</option>
                      <option value="meetup">Retro Night (80s/90s)</option>
                      <option value="workshop">Masquerade Ball</option>
                  </Field>
                  <ErrorMessage name="category" component="div" />
              </div>
              <div className="mt-10 w-1/3">
                <label htmlFor="category">Type</label> 
                <Field
                    name="type"
                    as="select"
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="" disabled>
                        Select type
                    </option>
                    <option value="conference">Live DJ Performances</option>
                    <option value="meetup">Theme Parties</option>
                    <option value="workshop">Guest Appearances</option>
                </Field>
                <ErrorMessage name="category" component="div" />
            </div>
            <div className="mt-10 w-1/3">
                <label htmlFor="category">Genre</label> 
                <Field
                    name="genre"
                    as="select"
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="" disabled>
                        Select Genre
                    </option>
                    <option value="conference">EDM</option>
                    <option value="meetup">House</option>
                    <option value="workshop">Hip Hop</option>
                    <option value="meetup">Techno</option>
                    <option value="workshop">Pop</option>
                </Field>
                <ErrorMessage name="category" component="div" />
            </div>
            </div>
            <div className="mt-10">
                <label htmlFor="description">Description</label>
                <Field
                    name="description"
                    as={Textarea}
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                />
                <ErrorMessage name="description" component="div" />
            </div>
        </>
    )

    const StepTwo = () => (
        <>
            <div className="flex justify-center items-center">
                <Image src="/logo.png" alt="Logo" width={50} height={50} />
                <h1 className="font-bold text-xl">
                    When and where will it take place?
                </h1>
            </div>
            <div>
                <label htmlFor="date">The event will be held on</label>
                <Field
                    name="date"
                    type="date"
                    as={Input}
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="date" component="div" />
            </div>
            <div className="mt-4">
                <label htmlFor="startTime">From</label>
                <Field
                    name="startTime"
                    type="time"
                    as={Input}
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="startTime" component="div" />
            </div>
            <div className="mt-4">
                <label htmlFor="endTime">To</label>
                <Field
                    name="endTime"
                    type="time"
                    as={Input}
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="endTime" component="div" />
            </div>
            <div className="mt-4">
                <label htmlFor="location">Location</label>
                <Field
                    name="location"
                    as={Input}
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="location" component="div" />
            </div>
        </>
    )

    const StepThree = () => (
        <div>
            <div className="mt-4 flex justify-between items-center">
                <label htmlFor="dj" className="font-bold text-lg mr-2">
                    Will there be a Dj or a Singer
                </label>
                <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    onChange={(e) => setShowDjNameInput(e.target.checked)}
                />
            </div>
            {showDjNameInput && (
                <div className="mt-4">
                    <label htmlFor="djName">DJ Name</label>
                    <Field
                        name="djName"
                        as={Input}
                        className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="djName" component="div" />
                </div>
            )}
            <div className="mt-4 flex items-center">
                <label htmlFor="giveaway" className="font-bold text-lg mr-2">
                    Do you want to make a giveaway?
                </label>
                <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    onChange={(e: {
                        target: {
                            checked: boolean | ((prevState: boolean) => boolean)
                        }
                    }) => setShowGiveawayForm(e.target.checked)}
                />
                <ErrorMessage name="giveaway" component="div" />
            </div>
            {showGiveawayForm && (
                <div className="mt-4 overflow-y-auto max-h-64">
                    <div className="mt-4">
                        <label htmlFor="giveawayName">Giveaway Name</label>
                        <Field
                            name="giveawayName"
                            as={Input}
                            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="giveawayName" component="div" />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="giveawayEndDate">Date of Ending</label>
                        <Field
                            name="giveawayEndDate"
                            type="date"
                            as={Input}
                            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="giveawayEndDate" component="div" />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="giveawayPrize">Prize</label>
                        <Field
                            name="giveawayPrize"
                            as={Input}
                            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="giveawayPrize" component="div" />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="giveawayDescription">Description</label>
                        <Field
                            name="giveawayDescription"
                            as={Textarea}
                            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                        />
                        <ErrorMessage
                            name="giveawayDescription"
                            component="div"
                        />
                    </div>
                </div>
            )}
        </div>
    )
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface FormData {
        title: string;
        category: string;
        description: string;
        date: string;
        location: string;
        djName: string | null;
        giveaway: {
            giveawayName: string | null;
            giveawayEndDate: string | null;
            giveawayPrize: string | null;
            giveawayDescription: string | null;
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (values: any) => {
      console.log(values)
     /*  const formData: FormData = {
          title: values.title,
          category: values.category,
          description: values.description,
          date: values.date + ' ' + values.startTime + ' - ' + values.endTime, 
          location: values.location,
          
          djName: values.djName || null,
          giveaway:{
              giveawayName: values.giveawayName || null,
              giveawayEndDate: values.giveawayEndDate || null,
              giveawayPrize: values.giveawayPrize || null,
              giveawayDescription: values.giveawayDescription || null,
          
         
      },
    }

      try {
          const response = await axiosPublic.post("/events",formData, {
              headers: {
                  'Content-Type': 'application/json',
              },
          });

          console.log('Success:', response.data);
      } catch (error) {
          console.error('Error:', error);
      } */
  };
    if (!isFormVisible) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg h-2/3 p-11 bg-white rounded-lg shadow-md">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={closeForm}
                >
                    &times;
                </button>
                <div className="flex justify-between mb-4">
                    <div
                        className={`w-1/3 h-2 ${step >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
                    />
                    <div
                        className={`w-1/3 h-2 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}
                    />
                    <div
                        className={`w-1/3 h-2 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}
                    />
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
                                        type='submit'
                                    >
                                        Create event
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

export default MultiStepEventForm
