import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card'; // Adjust the import paths as needed
import { Button } from './ui/button' // Adjust the import paths as needed
import Image from 'next/image';
import { calendar } from '@/app/constants/images';
interface GiveawayModalProps {

  giveaway: {

    name: string;

    description: string;

    prize: string;

    participants?: number;

    users: string[];

    entries: string[];

  };

  onClose: () => void;

}
  
const GiveawayModal: React.FC<GiveawayModalProps> = ({ giveaway, onClose }) => {
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [winner, setWinner] = useState('');
  const handleSelectWinner = async () => {
    try {
      const response = await fetch(`https://your-api-endpoint.com/api/v1/giveaway/winner?id=${giveaway.id}`, { // adjust id here leter 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWinner(data.winner);
      setIsWinnerModalOpen(true);
    } catch (error) {
      console.error('Error fetching winner:', error);
    }
  };

  const handleCloseWinnerModal = () => {
    setIsWinnerModalOpen(false);
    onClose();
  };

  return (
    <>
      {!isWinnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <Card className="relative w-full max-w-3xl p-4 bg-white shadow-lg">
            <Button className="absolute top-4 right-4" onClick={onClose}>
              Close
            </Button>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <span className="font-bold text-xl">{giveaway.name}</span>
                <p className="text-lg">{giveaway.description}</p>
              </div>
             
            </CardHeader>
            <hr className="mb-5" />
            <CardContent>
              <p className="flex justify-center text-2xl mb-4"><strong>Prize:</strong> {giveaway.prize}</p>
              <hr />
              <p className="mt-2">Participants: 54</p>
            </CardContent>
            <CardFooter className="flex justify-center items-center">
              <Button
                onClick={handleSelectWinner}
                className="px-20 py-5 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Select Winner
              </Button>
              {winner && <p><strong>Winner:</strong> {winner}</p>}
            </CardFooter>
          </Card>
        </div>
      )}

      {isWinnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <Card className="relative w-full max-w-md p-4 bg-white shadow-lg">
            <Button className="absolute top-4 right-4" onClick={handleCloseWinnerModal}>
              Close
            </Button>
            <CardHeader className="text-center">
              <span className="font-bold text-xl">Winner Selected</span>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg">Congratulations to the winner:</p>
              <p className="text-2xl font-bold">{winner}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={handleCloseWinnerModal} className="px-10 py-2">
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default GiveawayModal;