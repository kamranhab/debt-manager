import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine multiple class names into a single string and handle Tailwind CSS class conflicts.
 * @param {...string} inputs - Class names to be combined.
 * @returns {string} - Combined class names with resolved Tailwind conflicts.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Standardized error handling utility for API responses
 * 
 * @param {Error} error - The error object from the API or unexpected error
 * @param {string} [fallbackMessage='An unexpected error occurred'] - Fallback message if error is not well-formed
 * @returns {string} - A user-friendly error message
 */
export function handleApiError(error, fallbackMessage = 'An unexpected error occurred') {
  // If it's a Supabase error with a message
  if (error?.message) {
    if (error.message.includes('JWT expired')) {
      return 'Your session has expired. Please sign in again.';
    }
    
    if (error.message.includes('email')) {
      return 'There was a problem with your email. Please check and try again.';
    }
    
    if (error.message.includes('password')) {
      return 'There was a problem with your password. Please check and try again.';
    }
    
    if (error.message.includes('network')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    // If we have an error message but it doesn't match any of our specific cases
    return error.message;
  }
  
  // For non-standard errors, return the fallback message
  return fallbackMessage;
}

/**
 * Log error to console with additional context
 * 
 * @param {Error} error - Error object
 * @param {string} context - Context where the error occurred  
 * @param {Object} [additionalData={}] - Any additional data to log
 */
export function logError(error, context, additionalData = {}) {
  console.error(
    `Error in ${context}:`, 
    error, 
    Object.keys(additionalData).length > 0 ? additionalData : ''
  );
}

/**
 * Validate form inputs against common issues
 * 
 * @param {Object} inputs - Object containing form input values
 * @returns {Object|null} - Object with error messages or null if no errors
 */
export function validateInputs(inputs) {
  const errors = {};
  
  Object.entries(inputs).forEach(([key, value]) => {
    if (typeof value === 'string') {
      if (!value.trim()) {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    }
    
    if (key === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors[key] = 'Please enter a valid email address';
      }
    }
    
    if (key === 'password' && value) {
      if (value.length < 6) {
        errors[key] = 'Password must be at least 6 characters';
      }
    }
    
    if (key === 'amount' && value) {
      if (isNaN(value) || value <= 0) {
        errors[key] = 'Amount must be a positive number';
      }
    }
  });
  
  return Object.keys(errors).length > 0 ? errors : null;
} 