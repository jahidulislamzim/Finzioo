export const formatAccountNumber = (number) => {
    if (!number) return '';
    const numStr = number.toString().replace(/\s/g, '');
    const part1 = numStr.slice(0, 4);
    const part2 = numStr.slice(4, 8);
    const part3 = numStr.slice(8, 12);
    const part4 = numStr.slice(12, 17);
    return `${part1} ${part2} ${part3} ${part4}`.trim();
  };
