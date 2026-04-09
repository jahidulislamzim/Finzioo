export const generateAccountNumber = (date) => {
    return date.toISOString().replace(/\D/g, '');
  };