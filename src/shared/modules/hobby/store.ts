export type PredefinedHobby = {
  id: string;
  name: string;
  lucide_icon: string;
  category: string;
  sort_order: number;
};

export const hobbyCategories = ['Sports', 'Music', 'Food', 'Creative', 'Tech', 'Outdoors'] as const;

export const mockHobbies: PredefinedHobby[] = [
  // Sports
  { id: '1', name: 'Cycling', lucide_icon: 'Bike', category: 'Sports', sort_order: 1 },
  { id: '2', name: 'Running', lucide_icon: 'Activity', category: 'Sports', sort_order: 2 },
  { id: '3', name: 'Yoga', lucide_icon: 'Activity', category: 'Sports', sort_order: 3 },
  { id: '4', name: 'Hiking', lucide_icon: 'Mountain', category: 'Sports', sort_order: 4 },
  { id: '5', name: 'Climbing', lucide_icon: 'TreePine', category: 'Sports', sort_order: 5 },
  // Music
  { id: '6', name: 'Guitar', lucide_icon: 'Music', category: 'Music', sort_order: 1 },
  { id: '7', name: 'Piano', lucide_icon: 'Music2', category: 'Music', sort_order: 2 },
  { id: '8', name: 'Singing', lucide_icon: 'Mic', category: 'Music', sort_order: 3 },
  // Food
  { id: '9', name: 'Cooking', lucide_icon: 'ChefHat', category: 'Food', sort_order: 1 },
  { id: '10', name: 'Coffee', lucide_icon: 'Coffee', category: 'Food', sort_order: 2 },
  { id: '11', name: 'Wine', lucide_icon: 'Wine', category: 'Food', sort_order: 3 },
  // Creative
  { id: '12', name: 'Photography', lucide_icon: 'Camera', category: 'Creative', sort_order: 1 },
  { id: '13', name: 'Painting', lucide_icon: 'Brush', category: 'Creative', sort_order: 2 },
  { id: '14', name: 'Reading', lucide_icon: 'BookOpen', category: 'Creative', sort_order: 3 },
  // Tech
  { id: '15', name: 'Gaming', lucide_icon: 'Gamepad2', category: 'Tech', sort_order: 1 },
  { id: '16', name: 'Coding', lucide_icon: 'Code2', category: 'Tech', sort_order: 2 },
  // Outdoors
  { id: '17', name: 'Travel', lucide_icon: 'Plane', category: 'Outdoors', sort_order: 1 },
  { id: '18', name: 'Camping', lucide_icon: 'Tent', category: 'Outdoors', sort_order: 2 },
  { id: '19', name: 'Gardening', lucide_icon: 'Leaf', category: 'Outdoors', sort_order: 3 },
];
