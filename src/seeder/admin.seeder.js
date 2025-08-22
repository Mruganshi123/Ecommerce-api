const User = require('../features/user/user.model');
const { encryptPassword } = require('../utils/password');
const Role = require("../features/role/role.model");
const connectDB = require("../config/db.config");
require("dotenv").config();

async function seedAdmin() {

    await connectDB();
    // Find the admin role
    const adminRole = await Role.findOne({ role: 'admin' });
    if (!adminRole) {
        throw new Error('Admin role does not exist. Please create the role first.');
    }

    // Check if an admin user already exists
    const existingAdmin = await User.findOne({ role: adminRole._id });
    if (existingAdmin) {
        throw new Error('Admin already exists');
    }

    const hashedPassword = await encryptPassword(process.env.ADMIN_PASSWORD);

    const admin = await User.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: adminRole._id,
        number: process.env.ADMIN_NUMBER || '0000000000'
    });

    console.log(admin);
}

seedAdmin().then(() => {
    console.log('admin seeded');
    process.exit(0);
}).catch((err) => {
    console.log(err);
});
