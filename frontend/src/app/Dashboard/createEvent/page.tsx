import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import * as Yup from 'yup';
const MultiStepEventForm = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (values: { title: string; category: string; description: string; date: string; location: string; guests: string; }) => {
    console.log(values);
    // Handle form submission here
  };

  const initialValues = {
    title: '',
    category: '',
    description: '',
    date: '',
    location: '',
    guests: ''
  };

  const step1ValidationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    category: Yup.string().required('Category is required'),
  });
  
  const step2ValidationSchema = Yup.object({
    date: Yup.string().required('Date is required'),
    location: Yup.string().required('Location is required'),
  });
  const getValidationSchema = () => {
    switch (step) {
      case 1:
        return step1ValidationSchema;
      case 2:
        return step2ValidationSchema;
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={getValidationSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ isSubmitting }) => (
        <Form>
          {step === 1 && (
            <div>
              <h2>Whats your event about?</h2>
              <div>
                <label>Title</label>
                <Field as={Input} name="title" placeholder="Newsletter Bi-Weekly Review" />
                <ErrorMessage name="title" component="div" />
              </div>
              <div>
                <label>Category</label>
                <Field as={Select} name="category">
                  <option value="">Select a category</option>
                  <option value="meeting">Meeting</option>
                  <option value="webinar">Webinar</option>
                  <option value="workshop">Workshop</option>
                </Field>
                <ErrorMessage name="category" component="div" />
              </div>
              <div>
                <label>Description</label>
                <Field as={Textarea} name="description" placeholder="Add a description to encourage guests to attend your event." />
              </div>
              <Button type="button" onClick={nextStep}>Next</Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2>Date and Location</h2>
              <div>
                <label>Date</label>
                <Field as={Input} type="date" name="date" />
                <ErrorMessage name="date" component="div" />
              </div>
              <div>
                <label>Location</label>
                <Field as={Input} name="location" placeholder="Enter the event location" />
                <ErrorMessage name="location" component="div" />
              </div>
              <Button type="button" onClick={prevStep}>Back</Button>
              <Button type="button" onClick={nextStep}>Next</Button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2>Guests</h2>
              <div>
                <label>Guest Emails (comma-separated)</label>
                <Field as={Textarea} name="guests" placeholder="Enter email addresses" />
              </div>
              <Button type="button" onClick={prevStep}>Back</Button>
              <Button type="submit" disabled={isSubmitting}>Create Event</Button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default MultiStepEventForm;
