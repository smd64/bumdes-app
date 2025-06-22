// src/components/layout/QuickActionButton.tsx
import { IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const QuickActionButton = () => {
  const navigate = useNavigate();

  return (
    <IconButton
      icon={<FaPlus />}
      aria-label="Quick Action"
      colorScheme="teal"
      size="lg"
      isRound
      position="fixed"
      bottom={6}
      right={6}
      zIndex="tooltip"
      boxShadow="lg"
      onClick={() => navigate('/create')}
    />
  );
};

export default QuickActionButton;
