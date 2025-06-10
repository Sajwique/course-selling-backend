const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} = require("./emailTemplate.js");

const { mailTrapClient, sender } = require("./email.config.js");

const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`error message :`, error.message);
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

const welcomeEmail = async (email, name) => {
  try {
    const recipient = [{ email }];

    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "84c8a290-45d4-11f0-0000-f13361d527fe",
      template_variables: {
        company_info_name: "learnspree",
        name: name,
      },
    });
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

const passwordReSetEmail = async (email, resetURL) => {
  try {
    const recipient = [{ email }];

    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

const resetSuccessEmail = async (email) => {
  try {
    const recipient = [{ email }];

    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

module.exports = {
  sendVerificationEmail: sendVerificationEmail,
  welcomeEmail: welcomeEmail,
  passwordReSetEmail: passwordReSetEmail,
  resetSuccessEmail: resetSuccessEmail,
};
