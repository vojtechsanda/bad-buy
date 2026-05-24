import { ScreenContainer } from '@shared/components';
import { defaultFormValidationLogic } from '@shared/constants';
import { MIN_HOBBY_SELECTION, PredefinedHobbyGrid } from '@shared/modules/hobby';
import { useForm, useStore } from '@tanstack/react-form';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { HobbyFormData, hobbyFormSchema } from '../../schemas';
import { OnboardingStickyFooter } from '../OnboardingStickyFooter';
import { OnboardingTitle } from '../OnboardingTitle';

type HobbyViewProps = {
  onComplete: (data: HobbyFormData) => void;
  onPromoLinkTap: () => void;
  onSelectionChange?: (ids: string[]) => void;
  defaultValues?: HobbyFormData | null;
  screenHeader?: ReactNode;
};

export function HobbyView({
  onComplete,
  onPromoLinkTap,
  defaultValues,
  onSelectionChange,
  screenHeader,
}: HobbyViewProps) {
  const form = useForm({
    defaultValues: { selectedIds: defaultValues?.selectedIds ?? ([] as string[]) },
    validationLogic: defaultFormValidationLogic,
    validators: { onDynamic: hobbyFormSchema },
    onSubmit: async ({ value }) => onComplete(value),
  });

  const selectedIds = useStore(form.store, (s) => s.values.selectedIds);
  const hasMinimum = selectedIds.length >= MIN_HOBBY_SELECTION;

  function toggleHobby(id: string) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    form.setFieldValue('selectedIds', next);
    onSelectionChange?.(next);
  }

  return (
    <ScreenContainer
      header={screenHeader}
      withSafeAreaTop
      stickyBottom={
        <OnboardingStickyFooter
          onPress={form.handleSubmit}
          disabled={!hasMinimum}
          onPromoLinkTap={onPromoLinkTap}
          promoLinkDisabled={!hasMinimum}
        />
      }
    >
      <View className="gap-6">
        <OnboardingTitle
          title="What are you into?"
          subtitle="Pick at least 3. We'll use these to suggest alternatives."
          infoMessage="For example: 'this jacket = 4 climbing-gym sessions'."
        />

        <Text
          className={`text-right font-nunito-semibold text-body ${
            hasMinimum ? 'text-primary-500' : 'text-typography-400'
          }`}
        >
          {selectedIds.length} / minimum {MIN_HOBBY_SELECTION} selected
        </Text>

        <PredefinedHobbyGrid selectedIds={selectedIds} onToggle={toggleHobby} />
      </View>
    </ScreenContainer>
  );
}
