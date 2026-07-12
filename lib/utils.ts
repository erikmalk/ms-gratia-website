export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export const formatPhoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
