'use client'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import * as Yup from 'yup'
import { calendar, images, pin, vinyl } from '@/app/constants/images'
import { ToastContainer, toast } from 'react-toastify';
import CircularProgress from '@mui/joy/CircularProgress'
const initialValues = {
    title: '',
    description: '',
    date: '', // theme type geners
    location: '',
    theme: '',
    type: '',
    startTime: '',
    endTime: '',
    genre: '',
    djName: '',
    
        giveawayName: '',
        giveawayEndDate: '',
        giveawayPrize: '',
        giveawayDescription: '',
        image:''
   
}

const StepOneSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    theme: Yup.string().required('Theme is required'),
    type: Yup.string().required('Type is required'),
    genre: Yup.string().required('Geners is required'),
    description: Yup.string().required('Description is required'),
})

const StepTwoSchema = Yup.object().shape({
    date: Yup.string().required('Date is required'),
    location: Yup.string().required('Location is required'),
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string().required('End time is required'),
})

const StepThreeSchema = Yup.object().shape({
    djName: Yup.string().required('DJ name is required'),
    giveawayName: Yup.string().required('Giveaway name is required'),
    giveawayEndDate: Yup.string().required('Giveaway end date is required'),
    giveawayPrize: Yup.string().required('Giveaway prize is required'),
    giveawayDescription: Yup.string().required('Giveaway description is required'),
})
const StepFourSchema = Yup.object().shape({
    image: Yup.string().required('Image is required'),
})

const StepOne = () => (
    <>
        <div className="flex justify-center items-center">
            <Image src={pin} alt="Logo" width={50} height={50} />
            <h1 className="font-bold text-xl">What is your Event about?</h1>
        </div>
        <div>
            <label htmlFor="title">Title</label>
            <Field name="title" as={Input} />
            <ErrorMessage name="title" component="div" />
        </div>
        <div className=" flex flex-row justify-between gap-3">
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
                    <option value="Neon/Glow Party">Neon/Glow Party</option>
                    <option value="Retro Night (80s/90s)">
                        Retro Night (80s/90s)
                    </option>
                    <option value="Masquerade Ball">Masquerade Ball</option>
                </Field>
                <ErrorMessage name="theme" component="div" />
            </div>
            <div className="mt-10 w-1/3">
                <label htmlFor="type">Type</label>
                <Field
                    name="type"
                    as="select"
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="" disabled>
                        Select type
                    </option>
                    <option value="Live DJ Performances">
                        Live DJ Performances
                    </option>
                    <option value="Theme Parties">Theme Parties</option>
                    <option value="Guest Appearances">
                        Guest Appearances
                    </option>
                </Field>
                <ErrorMessage name="type" component="div" />
            </div>
            <div className="mt-10 w-1/3">
                <label htmlFor="genre">Genre</label>
                <Field
                    name="genre"
                    as="select"
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="" disabled>
                        Select Genre
                    </option>
                    <option value="EDM">EDM</option>
                    <option value="House">House</option>
                    <option value="Hip Hop">Hip Hop</option>
                    <option value="Techno">Techno</option>
                    <option value="Pop">Pop</option>
                </Field>
                <ErrorMessage name="genre" component="div" />
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
            <Image src={calendar} alt="Logo" width={30} height={30} />
            <h1 className="font-bold text-xl ml-3">
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
        <div className="mt-4 flex justify-center items-center">
        <Image src={vinyl} alt="Logo" width={30} height={30} />
            <label htmlFor="dj" className="font-bold text-lg ml-3">
                Will there be a Dj or a Singer
            </label>
           
        </div>
        
            <div className="mt-4">
                <label htmlFor="djName" className=' font-bold'>DJ Name</label>
                <Field
                    name="djName"
                    as={Input}
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="djName" component="div" />
            </div>
      
        <div className="mt-4 flex items-center">
            <label htmlFor="giveaway" className="font-bold text-lg mr-2">
                Do you want to make a giveaway?
            </label>
            
          
        </div>
        
            <div className="mt-4 overflow-y-auto max-h-64">
                <div className="mt-4">
                    <label htmlFor="giveawayName">
                        Giveaway Name
                    </label>
                    <Field
                        name="giveawayName"
                        as={Input}
                        className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                        name="giveawayName"
                        component="div"
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="giveawayEndDate">
                        Date of Ending
                    </label>
                    <Field
                        name="giveawayEndDate"
                        type="date"
                        as={Input}
                        className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                        name="giveawayEndDate"
                        component="div"
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="giveawayPrize">Prize</label>
                    <Field
                        name="giveawayPrize"
                        as={Input}
                        className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                        name="giveawayPrize"
                        component="div"
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="giveawayDescription">
                        Description
                    </label>
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
    
    </div>
)
interface FormData {
    title: string
    theme: string
    type: string
    genre: string
    description: string
    date: string
    djName: string
    startTime: string
    endTime: string
    
        giveawayName: string | null
        giveawayEndDate: string | null
        giveawayPrize: string | null
        giveawayDescription: string | null
    image:string
}
const MultiStepEventForm = () => {
    const [step, setStep] = useState(1)
    const [isFormVisible, setIsFormVisible] = useState(true)
    const [loading, setLoading] = useState(false)
    const handleNext = () => {
        setStep((prevStep) => prevStep + 1)
        console.log(step)
    }

    const handleBack = () => {
        setStep((prevStep) => prevStep - 1)
        console.log(step)
    }
    const closeForm = () => setIsFormVisible(false)

    

   
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
    

    const handleSubmit = async (values: FormData) => {
       
        const formData = {
            title: values.title,
            theme: values.theme,
            type: values.type,
            genre: values.genre,
            startingAt: values.date + " "+values.startTime,
            endingAt: values.date +" "+ values.endTime,
            description: values.description,
            performers: values.djName,
            giveaway: {
               name: values.giveawayName || null,

                prize: values.giveawayPrize || null,
                description:
                    values.giveawayDescription || null,
            },
            event_image: values.image
        }
      
        const token = localStorage.getItem('token');
        console.log(token);
        console.log(formData)
        setLoading(true);
        try {
            const response = await fetch(
                'https://qk7sr3c7r4.execute-api.eu-central-1.amazonaws.com/api-v1/event/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,

                    },
                    body: JSON.stringify(formData),
                   
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log('Success:', data)
            if(response.ok){
                closeForm()
            }
        } catch (error) {
            console.error('Error:', error)
        } finally{
            setLoading(false);
        }
    }
    if (!isFormVisible) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const StepFour = ({ setFieldValue }: { setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void }) => {
        const [file, setFile] = useState<File | null>(null);
        const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
      
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const files = event.target.files;
          if (files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
              setFile(file);
              console.log(reader.result);
              setPreview(reader.result);
              setFieldValue('image', reader.result);
            };
            reader.readAsDataURL(file);
            
          }
        };
      
        return (
          <div className="space-y-4">
            <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              id="fileInput"
              name="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && (
              <div className="mt-2">
                <img src={preview} alt="Preview" className="h-32 w-32 object-cover" />
              </div>
            )}
          </div>
        );
      };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg h-2/3 p-11 bg-white rounded-lg shadow-md">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={closeForm}
                >
                    &times;
                </button>
                
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                   {({ isSubmitting,setFieldValue}) => (
    <Form className="space-y-6">
        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
        {step === 4 && <StepFour setFieldValue={setFieldValue} />}

        <div className="flex justify-between ">
                    
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    type = "button"
                  >
                    Back
                  </Button>
                )}
                {step < 4 ? (
                  <Button
                    variant="outline"
                    onClick={handleNext}
                    type="button"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    disabled={isSubmitting || loading}
                    type="submit"
                  >
                    {loading ? (
                     <CircularProgress size='sm' />
                    ) : (
                      'Create event'
                    )}
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
