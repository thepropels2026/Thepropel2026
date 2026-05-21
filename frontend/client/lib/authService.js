const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://thepropels-production.up.railway.app';

/**
 * Sends an OTP to the given email or mobile number.
 * @param {string} identifier - Email or mobile number.
 */
export async function sendOtp(identifier) {
  const isEmail = identifier.includes('@');
  const payload = isEmail ? { email: identifier } : { mobile: identifier };

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || "Failed to send OTP.");
    }
    return data;
  } catch (error) {
    console.error("Send OTP Error:", error);
    throw error;
  }
}

/**
 * Verifies the OTP for the given identifier.
 * @param {string} identifier - Email or mobile number.
 * @param {string} otp - The 6-digit OTP.
 */
export async function verifyOtp(identifier, otp) {
  const isEmail = identifier.includes('@');
  const payload = isEmail ? { email: identifier, otp } : { mobile: identifier, otp };

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || "Invalid or expired OTP.");
    }
    return data;
  } catch (error) {
    console.error("Verify OTP Error:", error);
    throw error;
  }
}

/**
 * Legacy stubs to prevent immediate crashes if still used somewhere 
 * before we completely replace the usages.
 */
export async function signUpWithEmail(email, password) {
  throw new Error("signUpWithEmail is deprecated. Please use sendOtp.");
}

export async function loginWithEmail(email, password) {
  throw new Error("loginWithEmail is deprecated. Please use sendOtp.");
}

export async function sendPasswordResetLink(email) {
  throw new Error("Password reset is deprecated. Please use OTP login.");
}

export async function resendVerificationEmail(email, password) {
  throw new Error("resendVerificationEmail is deprecated. Please use sendOtp.");
}
