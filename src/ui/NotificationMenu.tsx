// components/ui/NotificationMenu.tsx
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Badge,
  Text,
  HStack,
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';

const NotificationMenu = () => (
  <Menu>
    <MenuButton as={IconButton} icon={<FaBell />} aria-label="Notifications" variant="ghost" />
    <MenuList p="2">
      <MenuItem>
        <HStack>
          <Badge colorScheme="green">New</Badge>
          <Text>User registered</Text>
        </HStack>
      </MenuItem>
      <MenuItem>
        <Text>Password changed</Text>
      </MenuItem>
    </MenuList>
  </Menu>
);

export default NotificationMenu;
