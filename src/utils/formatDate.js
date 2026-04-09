export const formatDate = (dateString) => {
  if (!dateString) {
    return { date: 'N/A', time: 'N/A' };
  }
  try {
    const date = new Date(dateString);

    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);

    const timeOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    return { date: formattedDate, time: formattedTime };
  } catch (error) {
    console.error("Error formatting date:", error);
    return { date: dateString, time: '' };
  }
};
