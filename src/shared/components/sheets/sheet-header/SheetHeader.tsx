import { ReactNode } from 'react';
import { Text, View } from 'react-native';

type SheetHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  isCentered?: boolean;
  titleClassName?: string;
};

export function SheetHeader({
  title,
  subtitle,
  icon,
  isCentered = true,
  titleClassName = '',
}: SheetHeaderProps) {
  const alignClass = isCentered ? 'items-center' : '';
  const textAlignClass = isCentered ? 'text-center' : '';

  return (
    <View className={`gap-2 pt-2 ${alignClass}`}>
      {icon}
      <Text
        className={`font-nunito-bold text-display-md text-typography-900 ${textAlignClass} ${titleClassName}`}
      >
        {title}
      </Text>
      {subtitle && (
        <Text className={`font-nunito text-body text-typography-600 ${textAlignClass}`}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
