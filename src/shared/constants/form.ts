import { revalidateLogic } from '@tanstack/form-core';

export const defaultFormValidationLogic = revalidateLogic({
  mode: 'submit',
  modeAfterSubmission: 'change',
});
