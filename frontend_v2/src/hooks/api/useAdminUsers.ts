// File: src/hooks/api/useAdminUsers.ts
// @new
// Mock API hook for fetching and managing admin/user data.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Role } from '@/types/user'; // Using the existing User type

// --- Mock Data ---
const createMockUsers = (): User[] => [
  { id: 'usr_001', name: 'Amjed Mohammed', email: 'Amjed.mohammed@gmail.com', role: 'admin', permissions: ['manage:users', 'read:analytics'] },
  { id: 'usr_002', name: 'Ali Hassan', email: 'ali.hassan@example.com', role: 'user', permissions: [] },
  { id: 'usr_003', name: 'Fatima Al-Salem', email: 'fatima.salem@example.com', role: 'user', permissions: [] },
  { id: 'usr_004', name: 'Khalid Ibrahim', email: 'khalid.ibrahim@example.com', role: 'admin', permissions: ['read:analytics'] },
  { id: 'usr_005', name: 'Noura Abdullah', email: 'noura.abdullah@example.com', role: 'user', permissions: [] },
  { id: 'usr_006', name: 'Saad Al-Mutairi', email: 'saad.mutairi@example.com', role: 'user', permissions: [] },
  { id: 'usr_007', name: 'Layla Al-Qahtani', email: 'layla.qahtani@example.com', role: 'user', permissions: [] },
];

let mockUsersDB = createMockUsers();

// --- Mock API Functions ---
const fetchUsers = async (): Promise<User[]> => {
  console.log("Fetching mock users...");
  await new Promise(res => setTimeout(res, 500));
  return [...mockUsersDB];
};

const updateUser = async (updatedUser: Partial<User> & { id: string }): Promise<User> => {
  console.log("Updating mock user:", updatedUser);
  await new Promise(res => setTimeout(res, 800));
  
  const userIndex = mockUsersDB.findIndex(u => u.id === updatedUser.id);
  if (userIndex === -1) {
    throw new Error("User not found");
  }

  // Merge the existing user data with the updates
  const newUser = { ...mockUsersDB[userIndex], ...updatedUser };
  mockUsersDB[userIndex] = newUser;
  return newUser;
};


// --- React Query Hooks ---
export function useAdminUsers() {
  const queryClient = useQueryClient();

  // Query to get all users
  const usersQuery = useQuery<User[], Error>({
    queryKey: ['admin', 'users'],
    queryFn: fetchUsers,
  });

  // Mutation to update a user
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // When an update is successful, invalidate the users query to refetch the fresh list
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  return {
    usersQuery,
    updateUserMutation,
  };
}