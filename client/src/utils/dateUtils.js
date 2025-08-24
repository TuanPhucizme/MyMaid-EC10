// Utility functions for date formatting

/**
 * Parse date from various formats including Firestore timestamp and string formats
 * @param {*} dateField - Date field from database (can be Firestore timestamp, string, or Date object)
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export const parseDate = (dateField) => {
  try {
    if (!dateField) return null;

    // Handle Firestore Timestamp format with seconds (both formats)
    if (dateField.seconds) {
      return new Date(dateField.seconds * 1000);
    }
    if (dateField._seconds) {
      return new Date(dateField._seconds * 1000);
    }

    // Handle Firestore Timestamp object with toDate method
    if (dateField.toDate && typeof dateField.toDate === 'function') {
      return dateField.toDate();
    }

    // Handle JavaScript Date object
    if (dateField instanceof Date) {
      return isNaN(dateField.getTime()) ? null : dateField;
    }

    // Handle string format like "August 24, 2025 at 10:45:33 AM UTC+7"
    if (typeof dateField === 'string') {
      // Remove "at" and timezone info for better parsing
      const cleanDateString = dateField.replace(' at ', ' ').replace(' UTC+7', '');
      const date = new Date(cleanDateString);
      if (!isNaN(date.getTime())) {
        return date;
      }

      // Try original string
      const originalDate = new Date(dateField);
      if (!isNaN(originalDate.getTime())) {
        return originalDate;
      }
    }

    // Handle regular Date object or other formats
    const date = new Date(dateField);
    return isNaN(date.getTime()) ? null : date;

  } catch (error) {
    console.warn('Error parsing date:', dateField, error);
    return null;
  }
};

/**
 * Format date to dd/mm/yyyy format
 * @param {*} dateField - Date field to format
 * @returns {string} - Formatted date string or 'N/A' if invalid
 */
export const formatDate = (dateField) => {
  const date = parseDate(dateField);
  if (!date) {
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔍 formatDate: Unable to parse date:', dateField);
    }
    return 'N/A';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Format date with time to dd/mm/yyyy HH:mm format
 * @param {*} dateField - Date field to format
 * @returns {string} - Formatted date and time string or 'N/A' if invalid
 */
export const formatDateTime = (dateField) => {
  const date = parseDate(dateField);
  if (!date) return 'N/A';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Format date for Vietnamese locale (compatible with existing code)
 * @param {*} dateField - Date field to format
 * @returns {string} - Formatted date string in Vietnamese locale or 'N/A' if invalid
 */
export const formatDateVN = (dateField) => {
  const date = parseDate(dateField);
  if (!date) return 'N/A';
  
  return date.toLocaleDateString('vi-VN');
};
