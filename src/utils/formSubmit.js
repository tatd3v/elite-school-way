import { PAYMENT_QR_IMAGE_URL } from '../config/constants';

/**
 * Submit form data to Google Sheets via Google Apps Script
 * @param {Object} formData - The form data to submit
 * @returns {Promise} - Resolves when submission is successful
 */
export async function submitForm(formData) {
  const scriptURL = import.meta.env.VITE_GOOGLE_SCRIPT_URL

  if (!scriptURL) {
    console.error('Google Script URL not configured')
    throw new Error('Configuración incompleta. Por favor, contacta al administrador.')
  }

  const amount = formData.entryType ? formData.entryType.replace(/\D/g, '') : '';

  const payload = {
    timestamp: new Date().toISOString(),
    artistName: formData.artistName,
    email: formData.email,
    phone: formData.phone,
    house: formData.house || 'N/A',
    entryType: amount ? Number(amount) : 'N/A',
    age: formData.age || 'N/A',
    qrImageUrl: PAYMENT_QR_IMAGE_URL,
    paymentScreenshot: formData.paymentScreenshot || '',
  }

  try {
    await fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload)
    })

    // Note: With 'no-cors' mode, we can't read the response
    // We assume success if no error is thrown
    return { success: true }
  } catch (error) {
    console.error('Error submitting form:', error)
    throw error
  }
}
