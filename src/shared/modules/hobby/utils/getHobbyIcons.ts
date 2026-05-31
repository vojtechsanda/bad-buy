import {
  Bike,
  BookOpen,
  Bot,
  Box,
  Camera,
  ChefHat,
  Circle,
  CircleDot,
  Code2,
  Coffee,
  Cookie,
  Cpu,
  Disc3,
  Fish,
  Flower,
  Flower2,
  Gamepad2,
  GlassWater,
  HelpCircle,
  type LucideIcon,
  Mic,
  Mountain,
  Music,
  Paintbrush,
  PenLine,
  Pencil,
  PersonStanding,
  Plane,
  Scissors,
  Tent,
  Waves,
  Wine,
  Zap,
} from 'lucide-react-native';

const HOBBY_ICON_MAP: Record<string, LucideIcon> = {
  Bike,
  BookOpen,
  Bot,
  Box,
  Camera,
  ChefHat,
  Circle,
  CircleDot,
  Code2,
  Coffee,
  Cookie,
  Cpu,
  Disc3,
  Fish,
  Flower,
  Flower2,
  Gamepad2,
  GlassWater,
  Mic,
  Mountain,
  Music,
  Paintbrush,
  PenLine,
  Pencil,
  PersonStanding,
  Plane,
  Scissors,
  Tent,
  Waves,
  Wine,
  Zap,
};

export function getHobbyIcon(name: string): LucideIcon {
  const icon = HOBBY_ICON_MAP[name];
  if (!icon) {
    console.warn(`No icon found for hobby "${name}", using fallback.`);

    return HelpCircle;
  }

  return icon;
}
