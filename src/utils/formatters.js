export const formatCurrency = (value) => {
  if (!value && value !== 0) return 'KES 0';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumberInput = (value) => {
  // Remove all non-digit characters
  const cleanedValue = String(value).replace(/\D/g, '');
  
  // Add commas every 3 digits from the right
  return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const parseNumberInput = (value) => {
  // Remove commas and return the clean number string
  return String(value).replace(/,/g, '');
};

export const formatPercent = (value) => {
  if (!value && value !== 0) return '0%';
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) return '0%';
  // If value is less than 1, assume it's a decimal (e.g., 0.095 = 9.5%)
  const percent = num < 1 ? num * 100 : num;
  return `${percent.toFixed(2)}%`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};