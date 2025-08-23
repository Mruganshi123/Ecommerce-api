

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
  newVendorRegistered: ({ vendorName }) =>
    `<p> hi , new issue has been submitted by ${vendorName}</p>`,
  vendorRejected: ({ vendorName }) =>
    `<p>Hi ${vendorName}, store is rejected by admin</p>`,
  lowStockWarning: ({ productName, currentStock, threshold, vendorId }) =>
    `<p>Warning: The stock for <strong>${productName}</strong> is low. Current stock is ${currentStock}, which is at or below the threshold of ${threshold}. Please restock soon to avoid running out.</p>`
};