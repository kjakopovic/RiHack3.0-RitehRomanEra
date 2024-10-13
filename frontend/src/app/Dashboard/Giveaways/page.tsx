'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'; // Adjust the import path as necessary;
import GiveawayModal from '../../../components/GiveawayModal'; // Adjust the import path as necessary
import { Button } from '@/components/ui/button'; // Adjust the import path as necessary
import CircularProgress from '@mui/joy/CircularProgress';

const Giveaways = [
  {
    title: 'Giveaway 1',
    description: 'Exciting giveaway with cool prizes!',
    date: '2023-11-01',
    prize: 'Amazon Gift Card',
    participants: ['Ivan Horvat', 'Ana Kovač', 'Marko Jurić'],
  },
  {
    title: 'Giveaway 2',
    description: 'Chance to win an exclusive VIP ticket!',
    date: '2023-11-05',
    prize: 'VIP Concert Ticket',
    participants: ['Marija Novak', 'Luka Petrović', 'Ivana Marinković'],
  },
  {
    title: 'Giveaway 3',
    description: 'Enter to win a year\'s subscription to our service!',
    date: '2023-11-10',
    prize: '1 Year Subscription',
    participants: ['Karlo Mihaljević', 'Tomislav Pavlović', 'Josip Babić'],
  },
  {
    title: 'Giveaway 4',
    description: 'Exclusive gadgets and tech accessories up for grabs!',
    date: '2023-11-15',
    prize: 'Smartwatch',
    participants: ['Ivana Zorić', 'Katarina Vuković', 'Petar Matić'],
  },
  {
    title: 'Giveaway 5',
    description: 'Win a deluxe spa weekend getaway!',
    date: '2023-11-20',
    prize: 'Spa Weekend Package',
    participants: ['Nikolina Kralj', 'Matej Radić', 'Marin Lovrić'],
  }
];


const Page = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGiveaway, setSelectedGiveaway] = useState<{
    name: string;
    description: string;
    prize: string;
    users: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entries: any[];
  } | null>(null);
  
  
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const token = localStorage.getItem('token');
  /* useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`https://qk7sr3c7r4.execute-api.eu-central-1.amazonaws.com/api-v1/events/giveaway`, {
          method: 'GET',
          headers:{
            'Authorization': 'Bearer ' + token
          }
        });
        const data = await response.json();
        setGiveaways(data.events);
        console.log(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }finally{
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []); */
  const openModal = (giveaway: { title: string; description: string; date: string; prize: string; participants: string[] }) => {
      setSelectedGiveaway({
          name: giveaway.title,
          description: giveaway.description,
          prize: giveaway.prize,
          users: giveaway.participants,
          entries: [], // Assuming entries can be an empty array or you can fetch it accordingly
      });
      setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedGiveaway(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
        {  Giveaways.map((giveaways, index) => (
            <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="font-bold text-xl">{giveaways.title}</CardHeader>
              <CardContent>
                <p>{giveaways.description}</p>
                <p className="text-sm text-gray-500">{giveaways.date}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => openModal(giveaways)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        
      
      
     
      {isModalOpen && selectedGiveaway && (
        
          <GiveawayModal giveaway={selectedGiveaway} onClose={closeModal} />
        
      )}
    </div>
  );
};

export default Page;