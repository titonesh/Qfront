export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhoneNumber = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
};

export const validateIdNumber = (id) => {
  const re = /^\d{7,8}$/;
  return re.test(id);
};

export const validateRequired = (value) => {
  if (!value) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};