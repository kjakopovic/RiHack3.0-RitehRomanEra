import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Image, Text, Heading } from '@shadcn/ui';

interface GiveawayInfo {
  banner: string;
  name: string;
  prize: string;
  endDate: string;
  description: string;
  participants: string[];
}

const GiveawayModal: React.FC = () => {
  const [giveawayInfo, setGiveawayInfo] = useState<GiveawayInfo>({
    banner: 'https://example.com/banner.jpg',
    name: 'Awesome Giveaway',
    prize: 'Cool Prize',
    endDate: '2023-12-31',
    description: 'This is an awesome giveaway!',
    participants: ['Alice', 'Bob', 'Charlie', 'Dave']
  });

  const [winner, setWinner] = useState<string | null>(null);

  const selectWinner = () => {
    const randomIndex = Math.floor(Math.random() * giveawayInfo.participants.length);
    setWinner(giveawayInfo.participants[randomIndex]);
  };

  return (
    <Card className="giveaway-modal">
      <CardHeader>
        <Image src={giveawayInfo.banner} alt="Event Banner" />
        <Heading>{giveawayInfo.name}</Heading>
      </CardHeader>
      <CardBody>
        <Text><strong>Prize:</strong> {giveawayInfo.prize}</Text>
        <Text><strong>End Date:</strong> {giveawayInfo.endDate}</Text>
        <Text>{giveawayInfo.description}</Text>
      </CardBody>
      <CardFooter>
        <Button onClick={selectWinner}>Select Winner</Button>
        {winner && <Text><strong>Winner:</strong> {winner}</Text>}
      </CardFooter>
    </Card>
  );
};

export default GiveawayModal;