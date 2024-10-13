import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';  // Adjust the import paths as needed
import Image from 'next/image';
import { calendar, images } from '@/app/constants/images';

interface Event {

    title: string;
  
    description: string;
  
    startingAt: string;
  
    theme?: string;
  
    type?: string;
  
    genre?: string;
  
    image?: string;
  
    picture: string;

    participants?: number;

    performers?: string;
  
    
  
  }
  

interface EventModalProps {
  event: Event;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    useEffect(() => {
        if (event.image) {
          const blob = base64ToBlob(event.image);
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
            console.log(url);
          // Clean up the URL object when the component unmounts
          return () => URL.revokeObjectURL(url);
        }
      }, [event.image]);
    
      const base64ToBlob = (base64: string) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: 'image/jpeg' }); // Adjust the MIME type as needed
      };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <Card className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <Button className="absolute top-2 right-2 text-white hover:text-gray-700" onClick={onClose}>
          x
        </Button>
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">{event.title}</h2>
          <div className=' flex flex-row justify-center items-center gap-2'>
              <Image src ={calendar} alt = "logo" width = { 24} height= {24} />
              <p> {event.startingAt}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
        {imageUrl ? <Image src={imageUrl} alt="Event" width = { 24} height= {24}/> : <p>Loading image...</p>}
  <p> {event.performers}</p>
  <p className='flex justify-center items-center'>{event.description}</p>
  <div className="flex flex-wrap gap-2">
    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
      Theme: {event.theme}
    </span>
    <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
      Type: {event.type}
    </span>
    <span className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
      Genre: {event.genre}
    </span>
  </div>
  <div>
    <p className="text-sm text-gray-500">Participants: {event.participants}</p>
  </div>
  
 
</CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onClose} className="px-10 py-2">
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EventModal;