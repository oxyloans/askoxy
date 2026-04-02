// Simple encryption/decryption utility for URL parameters
const ENCRYPTION_KEY = 'emp_freelance_2024';

export const encryptParam = (value: string): string => {
  if (!value) return '';
  
  try {
    // Simple base64 encoding with key mixing
    const mixed = value + '|' + ENCRYPTION_KEY;
    return btoa(mixed).replace(/[+/=]/g, (match) => {
      switch (match) {
        case '+': return '-';
        case '/': return '_';
        case '=': return '';
        default: return match;
      }
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return value;
  }
};

export const decryptParam = (encryptedValue: string): string => {
  if (!encryptedValue) return '';
  
  try {
    // Reverse the URL-safe base64
    let base64 = encryptedValue.replace(/[-_]/g, (match) => {
      return match === '-' ? '+' : '/';
    });
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const decoded = atob(base64);
    const [originalValue] = decoded.split('|');
    return originalValue || '';
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};