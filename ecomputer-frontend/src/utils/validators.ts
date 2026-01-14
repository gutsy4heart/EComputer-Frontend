 
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

 
export const isValidPassword = (password: string, minLength: number = 8): boolean => {
  return password.length >= minLength;
};

 
export const isValidName = (
  name: string,
  minLength: number = 3,
  maxLength: number = 20
): boolean => {
  return name.length >= minLength && name.length <= maxLength;
};

 
export const isValidPrice = (price: number): boolean => {
  return price >= 0;
};
 
export const isValidQuantity = (quantity: number): boolean => {
  return quantity >= 0 && Number.isInteger(quantity);
};
