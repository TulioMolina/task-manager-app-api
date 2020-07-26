const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "tuliojose8@gmail.com",
    subject: "Thanks for joining in to Task Manager App!",
    text: `Welcome to the most powerful Task Manager App available, ${name}. Please let us know how you like it.`,
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "tuliojose8@gmail.com",
    subject: "Goodbye from the Task Manager App team",
    text: `We're sad to hear that you decided to cancel your account, ${name}. Please let us know what we could improve to have you back on board.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
