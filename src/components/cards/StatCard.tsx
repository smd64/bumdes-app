import React from 'react';
import { Card, Text, Title, useMantineTheme } from '@mantine/core';

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  const theme = useMantineTheme();

  return (
    <Card
      padding="lg"
      shadow="sm"
      radius="md"
      style={{
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
      }}
    >
      <Text
        size="sm"
        color={theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[6]}
        style={{ marginBottom: 8 }}
      >
        {title}
      </Text>
      <Title order={3}>{value}</Title>
    </Card>
  );
};

export default StatCard;
