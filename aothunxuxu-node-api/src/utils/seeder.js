const sequelize = require('../config/database');
const Product = require('../models/Product');
const User = require('../models/User');

const seedData = async () => {
    try {
        await sequelize.sync({ force: true }); // Careful: this drops tables
        console.log('Database synced (all tables dropped and recreated)');

        // Create Admin
        await User.create({
            username: 'admin',
            passwordHash: 'admin123', // Will be hashed by hook
            role: 'Admin'
        });
        console.log('Admin user created (admin / admin123)');

        // Create Sample Products
        const sampleProducts = [
            {
                name: 'Áo thun cổ tròn cao cấp',
                description: 'Chất liệu 100% Cotton, thấm hút mồ hôi tốt, bền màu.',
                price: 150000,
                imageUrl: '/ao-thun-co-tron-min.jpg',
                category: 'AoThun'
            },
            {
                name: 'Túi hột xoài LDPE',
                description: 'Túi dẻo dai, in ấn sắc nét, phù hợp cho shop thời trang.',
                price: 2500,
                imageUrl: '/bao-bi-min.jpg',
                category: 'BaoBi'
            },
            {
                name: 'In băng rôn Hiflex',
                description: 'In kỹ thuật số khổ lớn, màu sắc trung thực, chịu được nắng mưa.',
                price: 35000,
                imageUrl: '/quang-cao-min.jpg',
                category: 'QuangCao'
            }
        ];

        await Product.bulkCreate(sampleProducts);
        console.log('Sample products seeded');

        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
