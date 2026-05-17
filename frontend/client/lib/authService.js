import { auth } from './firebaseConfig.js';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithEmailAndPassword, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
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

/**
 * Initializes Firebase RecaptchaVerifier for Phone Authentication.
 * @param {string} buttonId - The ID of the button to trigger recaptcha or container ID.
 * @returns {import("firebase/auth").RecaptchaVerifier}
 */
export function setupPhoneAuth(buttonId) {
  if (typeof window === 'undefined') return null;
  try {
    const recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
      size: 'invisible',
      callback: (response) => {
        // reCAPTCHA solved
      }
    });
    return recaptchaVerifier;
  } catch (error) {
    console.error("Recaptcha initialization failed:", error);
    throw new Error("Failed to initialize security verification. Please reload the page.");
  }
}

/**
 * Sends an OTP to the user's phone number.
 * @param {string} phoneNumber 
 * @param {import("firebase/auth").ApplicationVerifier} appVerifier 
 * @returns {Promise<import("firebase/auth").ConfirmationResult>}
 */
export async function sendOTPToPhone(phoneNumber, appVerifier) {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error("Failed to send OTP:", error);
    if (error.code === 'auth/invalid-phone-number') {
      throw new Error("The phone number provided is invalid. Please use international format (e.g., +919876543210).");
    } else if (error.code === 'auth/quota-exceeded') {
      throw new Error("SMS quota exceeded. Please try again later or contact support.");
    } else {
      throw new Error(error.message || "Failed to send verification code. Please check your network and try again.");
    }
  }
}

/**
 * Confirms the OTP code sent to the phone.
 * @param {import("firebase/auth").ConfirmationResult} confirmationResult 
 * @param {string} otpCode 
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export async function verifyOTPCode(confirmationResult, otpCode) {
  try {
    if (!confirmationResult) {
      throw new Error("No pending phone verification found. Please request a new verification code.");
    }
    const userCredential = await confirmationResult.confirm(otpCode);
    return userCredential;
  } catch (error) {
    console.error("OTP Verification failed:", error);
    if (error.code === 'auth/invalid-verification-code') {
      throw new Error("Invalid code entered. The code you entered does not match our records. Please try again.");
    } else if (error.code === 'auth/code-expired') {
      throw new Error("The verification code has expired. Please request a new code.");
    } else {
      throw new Error(error.message || "Verification failed. Please try again.");
    }
  }
}
