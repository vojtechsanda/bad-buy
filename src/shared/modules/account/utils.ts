import { Account } from '@shared/types';

export function getAccountPictureUrl(account: Account) {
  return `https://api.dicebear.com/9.x/thumbs/png?seed=${account.id}&size=192`;
}
