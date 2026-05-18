import { auth } from './firebaseConfig.js';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithEmailAndPassword 
} from "firebase/auth";

/**
 * Creates a user with email and password, then sends an email verification link.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export async function signUpWithEmail(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Send verification email
    await sendEmailVerification(userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Sign up error:", error);
    // Descriptive error messages matching website needs
    if (error.code === 'auth/email-already-in-use') {
      throw new Error("This email address is already in use by another account.");
    } else if (error.code === 'auth/invalid-email') {
      throw new Error("The email address is invalid.");
    } else if (error.code === 'auth/weak-password') {
      throw new Error("The password is too weak. Please use at least 6 characters.");
    } else {
      throw new Error(error.message || "Failed to create an account. Please try again.");
    }
  }
}

/**
 * Logs in the user, but throws an error if user.emailVerified is false.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      throw new Error("Email not verified. Please verify your email before logging in. A verification link was sent to your inbox.");
    }
    return userCredential;
  } catch (error) {
    console.error("Login error:", error);
    if (error.code === 'auth/wrong-password') {
      throw new Error("Invalid password. Please check your credentials and try again.");
    } else if (error.code === 'auth/user-not-found') {
      throw new Error("No account found with this email. Please sign up first.");
    } else if (error.code === 'auth/invalid-credential') {
      throw new Error("Invalid email or password. Please verify and try again.");
    } else {
      throw new Error(error.message || "Failed to log in. Please try again.");
    }
  }
}
