import { ScreenContainer } from '@shared/components';
import { defaultFormValidationLogic } from '@shared/constants';
import {
  HobbyCategoryGroup,
  MIN_HOBBY_SELECTION,
  hobbyCategories,
  mockHobbies,
} from '@shared/modules/hobby';
import { useForm, useStore } from '@tanstack/react-form';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { hobbyFormData, hobbyFormSchema } from '../../schemas';
import { OnboardingStickyFooter } from '../OnboardingStickyFooter';
import { OnboardingTitle } from '../OnboardingTitle';

type HobbyViewProps = {
  onComplete: (data: hobbyFormData) => void;
  onPromoLinkTap: () => void;
  onSelectionChange?: (ids: string[]) => void;
  defaultValues?: hobbyFormData;
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
    const current = form.state.values.selectedIds;
    const next = current.includes(id) ? current.filter((i) => i !== id) : [...current, id];
    form.setFieldValue('selectedIds', next);
    onSelectionChange?.(next);
  }

  return (
    <ScreenContainer
      header={screenHeader}
      withSafeAreaTop
      scrollable
      stickyBottom={
        <OnboardingStickyFooter
          onPress={form.handleSubmit}
          disabled={!hasMinimum}
          onPromoLinkTap={hasMinimum ? onPromoLinkTap : undefined}
        />
      }
    >
      <View className="gap-6">
        <OnboardingTitle
          title="What are you into?"
          subtitle="Pick at least 3. We'll use these to suggest alternatives — like 'this jacket = 4 climbing-gym sessions'."
        />

        <Text
          className={`text-right font-nunito-semibold text-body ${
            hasMinimum ? 'text-primary-500' : 'text-typography-400'
          }`}
        >
          {selectedIds.length} / minimum {MIN_HOBBY_SELECTION} selected
        </Text>

        <View className="gap-6">
          {hobbyCategories.map((category) => (
            <HobbyCategoryGroup
              key={category}
              category={category}
              hobbies={mockHobbies.filter((h) => h.category === category)}
              selectedIds={selectedIds}
              onToggle={toggleHobby}
            />
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
