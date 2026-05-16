import { ReactNode } from 'react';
import { Text, View } from 'react-native';

type SheetHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  titleClassName?: string;
};

export function SheetHeader({ title, subtitle, icon, titleClassName = '' }: SheetHeaderProps) {
  return (
    <View className="items-center gap-2 pt-4">
      {icon}
      <Text
        className={`text-center font-nunito-bold text-display-md text-typography-900 ${titleClassName}`}
      >
        {title}
      </Text>
      {subtitle && (
        <Text className="text-center font-nunito text-body text-typography-600">{subtitle}</Text>
      )}
    </View>
  );
}
