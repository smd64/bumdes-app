// src/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { Box, Button, Heading, Text, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const iconColor = useColorModeValue('red.400', 'red.300');
      const bg = useColorModeValue('red.50', 'red.900');
      const textColor = useColorModeValue('gray.700', 'gray.200');

      return (
        <Box
          bg={bg}
          p={8}
          mt={20}
          mx="auto"
          maxW="lg"
          rounded="xl"
          textAlign="center"
          boxShadow="2xl"
        >
          <VStack spacing={5}>
            <Icon as={FaExclamationTriangle} w={12} h={12} color={iconColor} />
            <Heading size="lg" color={iconColor}>
              Terjadi Kesalahan
            </Heading>
            <Text fontSize="md" color={textColor}>
              {this.state.error?.message || 'Sesuatu yang tidak terduga terjadi.'}
            </Text>
            <Button
              colorScheme="red"
              onClick={this.handleReload}
              size="md"
              variant="solid"
              _hover={{ transform: 'scale(1.03)' }}
            >
              Muat Ulang Halaman
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
