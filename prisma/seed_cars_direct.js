const { createClient } = require('@libsql/client');
const crypto = require('crypto');

const client = createClient({
    url: 'file:/Users/apple/Desktop/Automobility/dev.db',
});

const carData = {
    "BMW": ["3 Series", "5 Series", "X5", "X3", "7 Series", "1 Series", "X1", "X6", "M3", "M5"],
    "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLE", "GLC", "A-Class", "CLA", "GLA", "G-Class", "AMG GT"],
    "Audi": ["A4", "A6", "Q5", "Q7", "A3", "Q3", "A8", "RS6", "e-tron", "TT"],
    "Volkswagen": ["Golf", "Passat", "Tiguan", "Touareg", "Polo", "Jetta", "Arteon", "ID.4", "T-Roc", "Transporter"],
    "Toyota": ["Camry", "Corolla", "RAV4", "Land Cruiser", "Hilux", "Prius", "C-HR", "Yaris", "Highlander", "Supra"],
    "Honda": ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Jazz", "Insight", "Odyssey"],
    "Ford": ["Focus", "Fiesta", "Mondeo", "Kuga", "Mustang", "Explorer", "Ranger", "Transit", "Edge"],
    "Hyundai": ["Tucson", "Santa Fe", "Elantra", "Sonata", "i30", "Kona", "Ioniq 5", "Palisade", "Accent"],
    "Kia": ["Sportage", "Sorento", "Ceed", "Rio", "Optima", "Stinger", "EV6", "Carnival", "Telluride"],
    "Skoda": ["Octavia", "Superb", "Kodiaq", "Karoq", "Fabia", "Kamiq", "Scala", "Enyaq"],
    "Renault": ["Megane", "Clio", "Duster", "Scenic", "Kadjar", "Captur", "Logan", "Koleos"],
    "Peugeot": ["308", "508", "3008", "5008", "208", "2008", "Partner"],
    "Volvo": ["XC60", "XC90", "V60", "S60", "S90", "V90", "XC40"],
    "Lexus": ["RX", "NX", "ES", "LS", "LX", "GX", "IS", "UX"],
    "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan", "718 Boxster", "718 Cayman"],
    "Land Rover": ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Defender", "Discovery", "Evoque"],
    "Jeep": ["Grand Cherokee", "Wrangler", "Compass", "Renegade", "Cherokee"],
    "Mazda": ["CX-5", "CX-30", "Mazda6", "Mazda3", "CX-9", "MX-5"],
    "Nissan": ["Qashqai", "X-Trail", "Juke", "Leaf", "Navara", "Patrol", "GT-R", "370Z"],
    "Mitsubishi": ["Outlander", "L200", "Pajero", "ASX", "Eclipse Cross", "Lancer"],
    "Subaru": ["Forester", "Outback", "Impreza", "XV", "WRX STI"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
};

async function seed() {
    console.log("Starting legacy seed...");
    try {
        // Test connection
        await client.execute("SELECT 1");

        for (const [brand, models] of Object.entries(carData)) {
            console.log(`Seeding ${brand}...`);
            for (const model of models) {
                const id = crypto.randomUUID();
                const now = new Date().toISOString();
                await client.execute({
                    sql: "INSERT INTO CarCatalog (id, brand, model, yearFrom, yearTo, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    args: [id, brand, model, 2000, 2024, "Passenger", now]
                });
            }
        }
        console.log("Seeding finished successfully!");
    } catch (error) {
        console.error("Seed failed:", error);
    }
}

seed();
