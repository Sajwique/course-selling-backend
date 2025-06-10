const { MailtrapClient } = require("mailtrap");

console.log("process.env.MAILTRAP_ENDPOINT,", process.env.MAILTRAP_ENDPOINT);
console.log("process.env.MAILTRAP_TOKEN", process.env.MAILTRAP_TOKEN);

const mailTrapClient = new MailtrapClient({
  endPoint: process.env.MAILTRAP_ENDPOINT,
  // token: process.env.MAILTRAP_TOKEN,
  token: process.env.MAILTRAP_TOKEN_PANKAJ,
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "Pankaj",
};

module.exports = {
  mailTrapClient: mailTrapClient,
  sender: sender,
};
