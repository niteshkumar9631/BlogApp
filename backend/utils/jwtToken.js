// utils/sendToken.js

export const sendToken = (user, statusCode, message, res) => {
  // Generate JWT token from user method
  const token = user.getJWTToken();

  // Cookie expiration setup (convert days to milliseconds)
  const cookieExpire = process.env.COOKIE_EXPIRE || 7; // fallback to 7 days if not set
  const options = {
    expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,         // Prevent JS access to cookies (security)
    secure: true,           // Cookie sent only over HTTPS (required on Vercel)
    sameSite: "None",       // Allow frontend/backend on different domains
  };

  // Set cookie + send response
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message,
      user,
      token,
    });
};
