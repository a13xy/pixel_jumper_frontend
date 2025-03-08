import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Custom hook for auth form handling
 * @param {Object} schema - Zod validation schema
 * @param {Object} defaultValues - Default form values
 * @param {Function} onSubmitHandler - Form submission handler
 * @returns {Object} Form methods and state
 */
export function useAuthForm(schema, defaultValues, onSubmitHandler) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formMethods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  });

  const { handleSubmit, reset, setError: setFormError, formState } = formMethods;

  /**
   * Handle form submission
   * @param {Object} data - Form data
   */
  const onSubmit = async (data) => {
    if (Object.keys(formState.errors).length > 0) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await onSubmitHandler(data);
    } catch (err) {
      if (err.message === 'ACCOUNT_ALREADY_EXISTS' || err.message === 'Account already exists') {
        setFormError('login', { 
          type: 'manual', 
          message: 'This username is already taken' 
        });
      } else if (err.message === 'WRONG_PASSWORD' || err.message === 'Incorrect password') {
        setFormError('password', { 
          type: 'manual', 
          message: 'Incorrect password' 
        });
      } else if (err.message === 'ACCOUNT_DO_NOT_EXIST' || err.message === 'Account does not exist') {
        setFormError('login', { 
          type: 'manual', 
          message: 'Account does not exist' 
        });
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset form state
   */
  const resetForm = () => {
    reset(defaultValues);
    setError('');
  };

  /**
   * Set success message
   * @param {string} message - Success message
   */
  const setSuccessMessage = (message) => {
    setSuccess(message);
  };

  /**
   * Clear all form state
   */
  const clearFormState = () => {
    reset(defaultValues);
    setError('');
    setSuccess('');
  };

  return {
    formMethods,
    isLoading,
    error,
    success,
    onSubmit: handleSubmit(onSubmit),
    resetForm,
    clearFormState,
    setError,
    setSuccessMessage
  };
} 