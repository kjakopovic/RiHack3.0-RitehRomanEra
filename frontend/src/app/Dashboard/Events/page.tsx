'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../../../components/ui/card'; // Adjust the import paths as needed
import EventModal from '../../../components/EventModal'; // Adjust the import path as needed
import { useUser } from '@/app/context/userContext';
import CircularProgress from '@mui/joy/CircularProgress';

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<null | {
    title: string;
    description: string;
    startingAt: string;
    endingAt: string;
    theme?: string;
    type?: string;
    genre?: string;
    longitude?: string;
    latitude?: string;
    performers?: string;
    participants?: number;
    event_id: string;
    club_id: string;
  }>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useUser();
  const clubId = user.club.club_id; // Replace with your actual club ID

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`https://qk7sr3c7r4.execute-api.eu-central-1.amazonaws.com/api-v1/events/club?club_id=${clubId}`, {
          method: 'GET',
          mode: 'cors',
        });
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }finally{
        setLoading(false);
      }
    };

    fetchEvents();
  }, [clubId]);

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      {loading ? (
        <div>
          <CircularProgress />
        </div>
      )
      : ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event, index) => (
          <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="font-bold text-xl">{event.title}</CardHeader>
            <CardContent>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500">{new Date(event.startingAt).toLocaleString()}</p>
              <p className="text-sm text-gray-500">{new Date(event.endingAt).toLocaleString()}</p>
            </CardContent>
            <CardFooter>
              <button
                onClick={() => handleOpenModal(event)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
              >
                View Details
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>)}
      
     
      {isModalOpen && selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Page;