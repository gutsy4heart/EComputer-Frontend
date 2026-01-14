export const formatPrice = (
  price: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string => {
  console.log('[formatPrice] Input price:', price, 'type:', typeof price);
 
  if (isNaN(price) || price === undefined || price === null) {
    console.log('[formatPrice] Invalid price, returning $0.00');
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(0);
  }
  
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
  
  console.log('[formatPrice] Formatted price:', formattedPrice);
  return formattedPrice;
};

export const formatDate = (
  date: string | Date,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

export const truncateString = (
  str: string,
  length: number = 100,
  suffix: string = '...'
): string => {
  if (str.length <= length) {
    return str;
  }
  
  return str.substring(0, length).trim() + suffix;
};
