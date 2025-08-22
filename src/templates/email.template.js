

module.exports = {
  registration: ({ vendorName }) => `
      <h2>Welcome, ${vendorName}!</h2>
        <h1>Thank you for registering with us</h1>
        <p>We will provide you with a unique access link to access your account shortly.</p>
        `,
  statusChnage: ({ username, status }) =>
    `< p > Hello ${username}, your issue status has been updated to: <strong>${status}</strong>.</ > `,
  companyReject: ({ companyName }) =>
    `<p>Hi ${companyName}, your company has been rejected by the admin</p>
    <p>Thank you for your time</p>`,
  vendorApproved: ({ vendorName }) =>
    `<p>Hi ${vendorName}, your company has been approved by the admin</p>
 
  `,
  HrCreated: ({ companyName, setUpUrl }) =>
    `<p>Hi you are added by ${companyName}, please login to your account</p>
  <p>setup furthre with this link: ${setUpUrl}</p>`,
  managerCreated: ({ companyName, setUpUrl }) =>
    `<p>Hi you are added by ${companyName}, please login to your account</p>
  <p>setup furthre with this link: ${setUpUrl}</p>`,
  newCompanyRegistration: ({ companyName }) =>
    `<p>Hi, new company has been registered with the name ${companyName} </p>`,
  newVendorRegistered: ({ vendorName }) =>
    `<p> hi , new issue has been submitted by ${vendorName}</p>`,
  vendorRejected: ({ vendorName }) =>
    `<p>Hi ${vendorName}, store is rejected by admin</p>`,
  issueAssigned: ({ name }) =>
    `<p>hi ${name},  issue has been assigned to you</p>`,
};