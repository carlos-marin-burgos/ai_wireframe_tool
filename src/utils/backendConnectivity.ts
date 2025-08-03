import { API_ENDPOINT } from '../config';

/**
 * Check if the backend service is available
 * @returns Promise<boolean> indicating if the backend is reachable
 */
export const checkBackendConnectivity = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend connectivity check failed:', error);
    return false;
  }
};

/**
 * Schedule a retry to check backend connectivity
 * @param callback Function to execute when backend becomes available
 * @param maxRetries Maximum number of retry attempts (default: 3)
 * @param delayMs Delay between retries in milliseconds (default: 5000)
 * @returns Promise<void>
 */
export const scheduleBackendRetry = async (
  callback: () => void,
  maxRetries: number = 3,
  delayMs: number = 5000
): Promise<void> => {
  let retryCount = 0;

  const attemptConnection = async () => {
    if (retryCount >= maxRetries) {
      console.error('Maximum retry attempts reached. Backend is not available.');
      return;
    }

    const isConnected = await checkBackendConnectivity();
    if (isConnected) {
      callback();
    } else {
      retryCount++;
      console.log(`Retrying backend connection... Attempt ${retryCount}/${maxRetries}`);
      setTimeout(attemptConnection, delayMs);
    }
  };

  await attemptConnection();
};
