import {
  Activity,
  Bike,
  BookOpen,
  Brush,
  Camera,
  ChefHat,
  Code2,
  Coffee,
  Gamepad2,
  Leaf,
  type LucideIcon,
  Mic,
  Mountain,
  Music,
  Music2,
  Plane,
  Tent,
  TreePine,
  Wine,
} from 'lucide-react-native';

const HOBBY_ICON_MAP: Record<string, LucideIcon> = {
  Bike,
  Activity,
  Mountain,
  TreePine,
  Music,
  Music2,
  Mic,
  ChefHat,
  Coffee,
  Wine,
  Camera,
  Brush,
  BookOpen,
  Gamepad2,
  Code2,
  Plane,
  Tent,
  Leaf,
};

export function getHobbyIcon(name: string): LucideIcon | undefined {
  return HOBBY_ICON_MAP[name];
}
