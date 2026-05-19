import hashlib
import os

# Use an environment variable salt or a default if missing
SECRET_SALT = os.getenv("OTP_SECRET_SALT", "super_secret_otp_salt_12345")

def hash_otp(otp: str) -> str:
    """Hashes the OTP using SHA256 with a salt."""
    salted_otp = f"{otp}{SECRET_SALT}"
    return hashlib.sha256(salted_otp.encode()).hexdigest()

def verify_otp_hash(plain_otp: str, hashed_otp: str) -> bool:
    """Verifies a plain OTP against its hash."""
    return hash_otp(plain_otp) == hashed_otp
