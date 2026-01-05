const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../lib/generated/prisma/client');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding hackathons...');

    const hackathons = [
        {
            name: 'HackMIT 2025',
            description: 'MIT\'s largest hackathon. Join students from around the world for 24 hours of building, learning, and fun.',
            startDate: new Date('2025-09-15'),
            endDate: new Date('2025-09-16'),
            location: 'Cambridge, MA',
            website: 'https://hackmit.org',
            logo: 'https://hackmit.org/favicon.ico',
        },
        {
            name: 'ETHGlobal London',
            description: 'Building the future of Ethereum. A weekend of hacking on Web3 projects with the ecosystem\'s best builders.',
            startDate: new Date('2025-03-24'),
            endDate: new Date('2025-03-26'),
            location: 'London, UK',
            website: 'https://ethglobal.com',
            logo: 'https://ethglobal.com/favicon.ico',
        },
        {
            name: 'CalHacks 12.0',
            description: 'The world\'s largest collegiate hackathon at UC Berkeley.',
            startDate: new Date('2025-10-10'),
            endDate: new Date('2025-10-12'),
            location: 'Berkeley, CA',
            website: 'https://calhacks.io',
            logo: 'https://calhacks.io/favicon.ico',
        },
        {
            name: 'TreeHacks 2025',
            description: 'Stanford\'s premier hackathon. 36 hours of creation at the heart of Silicon Valley.',
            startDate: new Date('2025-02-14'),
            endDate: new Date('2025-02-16'),
            location: 'Stanford, CA',
            website: 'https://treehacks.com',
            logo: 'https://treehacks.com/favicon.ico',
        },
    ];

    for (const h of hackathons) {
        await prisma.hackathon.upsert({
            where: { id: `seed-${h.name.toLowerCase().replace(/\s+/g, '-')}` },
            update: h,
            create: {
                id: `seed-${h.name.toLowerCase().replace(/\s+/g, '-')}`,
                ...h,
            },
        });
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
