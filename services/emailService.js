const transporter = require('../config/emailTransporter');

const sendEmailActivation = async (email, activationToken, host) => {
  await new Promise((resolve, reject) => {
    transporter.sendMail({
      from: 'url-monitor app <ahmedsayed1712@gmail.com>',
      to: email,
      subject: 'Verify your email',
      html: `
        <h2>Thanks for sign up <h2>
        <h4>please verify your email to continue...<h4>
        <a href = "http://${host}/verify-email?token=${activationToken}">verify your email<a> 
        <p>Token Is ${activationToken}<p>`
    }, (error, info) => {

      if (error) {
        reject(error);
      } else {
        resolve(info)
      }
    });
  });
}

const sendUrlStatusEmail = async (email, Status, url, name) => {
  await new Promise((resolve, reject) => {
    transporter.sendMail({
      from: 'url-monitor app <ahmedsayed1712@gmail.com>',
      to: email,
      subject: 'New Url Status',
      html: `
        <h2>Thanks for using url-monitor <h2>
        <h4>check Name: ${name} <h4>
        <h4>check Url: ${url} <h4>
        <h4>check Status: ${Status} <h4>`
    }, (error, info) => {

      if (error) {
        reject(error);
      } else {
        resolve(info)
      }
    });
  });
}

module.exports = {
  sendEmailActivation,
  sendUrlStatusEmail
};