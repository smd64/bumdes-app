import { SimpleGrid, Box, Text } from '@chakra-ui/react';

const SummaryCards = () => {
  const stats = [
    { label: 'Users', value: '1,240' },
    { label: 'Orders', value: '320' },
    { label: 'Visitors', value: '7,400' },
  ];

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={6} mt={4}>
      {stats.map((item) => (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Text fontSize="lg" fontWeight="bold">
            {item.value}
          </Text>
          <Text color="gray.500">{item.label}</Text>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default SummaryCards;
