const deleteAccountNotification = (username) => {
  const subject = "Account Deleted";
  const text = `Hello ${username}, your account has been successfully deleted.`;
  const html = `<p>Hello <strong>${username}</strong>, your account has been successfully deleted.</p>`;

  return { subject, text, html };
};

module.exports = deleteAccountNotification;
