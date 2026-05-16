import { Clock, RefreshCw, Sparkles } from 'lucide-react-native';
import { ComponentType } from 'react';

type PremiumFeatureDescription = {
  Icon: ComponentType<{ size: number; strokeWidth: number; color: string }>;
  title: string;
  description: string;
};

export const premiumFeatures: PremiumFeatureDescription[] = [
  {
    Icon: RefreshCw,
    title: 'Refresh suggestions',
    description: 'Refresh your suggestion list at any time.',
  },
  {
    Icon: Clock,
    title: 'Custom freeze duration',
    description: 'Set any freeze countdown, from hours to months.',
  },
  {
    Icon: Sparkles,
    title: 'Add your own hobbies',
    description: 'Personalize your activity suggestions.',
  },
];
