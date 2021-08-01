import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [imageSelected, setImageSelected] = useState('');

  function viewImage(url: string): void {
    onOpen();
    setImageSelected(url);
  }

  return (
    <>
      <SimpleGrid columns={3} spacing={8}>
        {cards.map(card => (
          <Card data={card} viewImage={url => viewImage(url)} key={card.id} />
        ))}
      </SimpleGrid>

      {isOpen && (
        <ModalViewImage
          isOpen={isOpen}
          onClose={onClose}
          imgUrl={imageSelected}
        />
      )}
    </>
  );
}
