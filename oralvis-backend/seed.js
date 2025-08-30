// oralvis-backend/seed.js

const bcrypt = require('bcryptjs');
const db = require('./database');

const users = [
    {
        email: "technician@oralvis.com",
        password: "password123",
        role: "Technician"
    },
    {
        email: "dentist@oralvis.com",
        password: "password123",
        role: "Dentist"
    }
];

const seedUsers = async () => {
    console.log('Seeding users into the database...');
    
    for (const user of users) {
        // Check if user already exists
        const sqlCheck = `SELECT * FROM users WHERE email = ?`;
        db.get(sqlCheck, [user.email], async (err, row) => {
            if (err) {
                console.error('Error checking user:', err.message);
                return;
            }
            if (row) {
                console.log(`User ${user.email} already exists. Skipping.`);
            } else {
                // Hash the password as required for secure storage
                const hashedPassword = await bcrypt.hash(user.password, 10);
                const sqlInsert = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`;
                
                db.run(sqlInsert, [user.email, hashedPassword, user.role], function(err) {
                    if (err) {
                        console.error(`Error inserting user ${user.email}:`, err.message);
                    } else {
                        console.log(`User ${user.email} created successfully.`);
                    }
                });
            }
        });
    }
};

// Run the seeder function
seedUsers();