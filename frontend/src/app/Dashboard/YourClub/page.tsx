'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, } from '@/components/ui/card'; // Adjust the import path as necessary
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/app/context/userContext';

interface ClubData {
  name: string;
  workingHours: string;
  workingDays: string;
  email: string;
}

const ClubPage: React.FC = () => {
  const [clubData, setClubData] = useState<ClubData>({
    name: '',
    workingHours: '',
    workingDays: '',
    email: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, logout } = useUser(); 
  useEffect(() => {
    // Mock club data
    const mockData = {
      name: 'Mock Club',
      email:' name@name.cok',
      workingHours: '9 AM - 5 PM',
      workingDays: 'Monday - Friday',
    };

    setTimeout(() => {
      setClubData(mockData);
      setIsLoading(false);
    }, 1000); // Simulate a network request
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClubData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://your-api-endpoint.com/api/v1/club', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clubData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white shadow-md p-4">
        <CardHeader className="text-2xl font-bold mb-4">Club Information</CardHeader>
        <CardContent>
          <p className="text-lg font-semibold mb-4">Club Email: {user.club.club_id}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700">Name</Label>
              <Input
                type="text"
                name="name"
                value={user.club.club_name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Working Hours</Label>
              <Input
                type="text"
                name="workingHours"
                value={user.club.default_working_hours}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Working Days</Label>
              <Input
                type="text"
                name="workingDays"
                value={user.club.working_days}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <Button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubPage;