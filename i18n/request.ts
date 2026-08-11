import {getRequestConfig} from 'next-intl/server';
import { defaultLocale } from '@/i18n.config';
 
export default getRequestConfig(async ({locale: requestLocale}) => {
  const locale = requestLocale || defaultLocale;
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
