export const calculateTotalWithInterest = (amount, interestRate) => {
  const interest = (amount * interestRate) / 100;
  return amount + interest;
};
