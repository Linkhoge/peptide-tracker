import { doc } from 'firebase/firestore'
import { db } from '../firebase/config'

export const peptideRef = (userId, peptideId) =>
  doc(db, 'users', userId, 'peptides', peptideId)

export const parseDosage = (dosageStr) => {
  const match = dosageStr?.match(/^([\d.]+)([a-zA-Z]+)$/)
  return match ? { amount: match[1], unit: match[2] } : { amount: dosageStr, unit: 'mcg' }
}
