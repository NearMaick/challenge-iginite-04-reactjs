import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { useState } from 'react';
import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface ImagesData {
  after: string;
  data: {
    description: string;
    id: string;
    title: string;
    ts: number;
    url: string;
  }[];
}

export default function Home(): JSX.Element {
  const [hasMorePages, setHasMorePages] = useState(false);

  const fetchImages = async ({ pageParam = null }): Promise<ImagesData> => {
    const response = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });
    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.after ?? null,
  });

  const formattedData = useMemo(() => {
    setHasMorePages(hasNextPage);
    return data?.pages
      .map(page => {
        return page.data.map(register => {
          return register;
        });
      })
      .flat();
  }, [data, hasNextPage]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasMorePages && (
          <Button
            mt={10}
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            loadingText="Carregando..."
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
