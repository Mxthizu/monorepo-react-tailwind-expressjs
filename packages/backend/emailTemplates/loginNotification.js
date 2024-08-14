const loginNotification = (username, ipAddress) => {
  const subject = "Login Notification";
  const text = `Hello ${username}, you have successfully logged in from IP address: ${ipAddress}.`;
  const html = `<p>Hello <strong>${username}</strong>, you have successfully logged in from IP address: <strong>${ipAddress}</strong>.</p>`;

  return { subject, text, html };
};

module.exports = loginNotification;
