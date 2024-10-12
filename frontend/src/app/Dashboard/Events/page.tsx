import React from 'react';
import { Card, CardHeader,CardContent, CardFooter } from  '@/components/ui/card';

const events = [
  {
    title: 'Event 1',
    description: 'Description for event 1',
    date: '2023-10-01',
  },
  {
    title: 'Event 2',
    description: 'Description for event 2',
    date: '2023-10-15',
  },
  {
    title: 'Event 3',
    description: 'Description for event 3',
    date: '2023-11-01',
  },
];

const Page = () => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event, index) => (
        <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="font-bold text-xl">{event.title}</CardHeader>
          <CardContent>
            <p>{event.description}</p>
            <p className="text-sm text-gray-500">{event.date}</p>
          </CardContent>
          <CardFooter>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
              View Details
            </button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Page;