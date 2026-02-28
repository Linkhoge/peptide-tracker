import { signInAnonymously } from 'firebase/auth'
import { auth } from './config'

export const initializeAnonymousAuth = async () => {
  try {
    const userCredential = await signInAnonymously(auth)
    console.log('Anonymous user signed in:', userCredential.user.uid)
    return userCredential.user
  } catch (error) {
    console.error('Error signing in anonymously:', error)
    throw error
  }
}