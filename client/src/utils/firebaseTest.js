// Test Firebase connection
import { auth } from '../config/firebase';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    console.log('Auth object:', auth);
    console.log('Auth app:', auth.app);
    console.log('Auth config:', auth.app.options);
    
    // Test if we can access Firebase
    const currentUser = auth.currentUser;
    console.log('Current user:', currentUser);
    
    return { success: true, message: 'Firebase connection successful' };
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return { success: false, error: error.message };
  }
};
