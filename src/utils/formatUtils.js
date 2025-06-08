// src/utils/formatUtils.js
export const formatCurrency = (amount) => {
  if (!amount || isNaN(amount)) return "No disponible";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatRuntime = (minutes) => {
  if (!minutes) return "No disponible";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
};