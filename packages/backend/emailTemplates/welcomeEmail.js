const welcomeEmail = (username) => {
  const subject = "Welcome to Our App";
  const text = `Hello ${username}, welcome to our app!`;
  const html = `<p>Hello <strong>${username}</strong>, welcome to our app!</p>`;

  return { subject, text, html };
};

module.exports = welcomeEmail;
