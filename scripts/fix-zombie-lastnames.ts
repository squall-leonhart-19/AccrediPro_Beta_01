import prisma from "../src/lib/prisma";

// Common last names - diverse and realistic
const LAST_NAMES = [
  // Top 50 US surnames
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
  "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
  "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
  "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
  // More variety
  "Carter", "Roberts", "Phillips", "Evans", "Turner", "Parker", "Collins", "Edwards",
  "Stewart", "Morris", "Murphy", "Cook", "Rogers", "Morgan", "Peterson", "Cooper",
  "Reed", "Bailey", "Bell", "Gomez", "Kelly", "Howard", "Ward", "Cox",
  "Diaz", "Richardson", "Wood", "Watson", "Brooks", "Bennett", "Gray", "James",
  "Reyes", "Cruz", "Hughes", "Price", "Myers", "Long", "Foster", "Sanders",
  "Ross", "Morales", "Powell", "Sullivan", "Russell", "Ortiz", "Jenkins", "Gutierrez",
  // Additional for variety
  "Perry", "Butler", "Barnes", "Fisher", "Henderson", "Coleman", "Simmons", "Patterson",
  "Jordan", "Reynolds", "Hamilton", "Graham", "Kim", "Gonzales", "Alexander", "Ramos",
  "Wallace", "Griffin", "West", "Cole", "Hayes", "Chavez", "Gibson", "Bryant",
  "Ellis", "Stevens", "Murray", "Ford", "Marshall", "Owens", "McDonald", "Harrison",
  "Ruiz", "Kennedy", "Wells", "Alvarez", "Woods", "Mendoza", "Castillo", "Olson",
  "Webb", "Washington", "Tucker", "Freeman", "Burns", "Henry", "Vasquez", "Snyder",
  "Simpson", "Crawford", "Jimenez", "Porter", "Mason", "Shaw", "Gordon", "Wagner",
  "Hunter", "Romero", "Hicks", "Dixon", "Hunt", "Palmer", "Robertson", "Black",
  "Holmes", "Stone", "Meyer", "Boyd", "Mills", "Warren", "Fox", "Rose",
  "Rice", "Moreno", "Schmidt", "Patel", "Ferguson", "Nichols", "Herrera", "Medina",
  "Ryan", "Fernandez", "Weaver", "Daniels", "Stephens", "Gardner", "Payne", "Kelley",
  "Dunn", "Pierce", "Arnold", "Tran", "Spencer", "Peters", "Hawkins", "Grant",
  "Hansen", "Castro", "Hoffman", "Hart", "Elliott", "Cunningham", "Knight", "Bradley"
];

async function main() {
  console.log("Fixing zombie last names...");

  // Get all zombies with lastName "Smith"
  const smithZombies = await prisma.user.findMany({
    where: {
      isFakeProfile: true,
      lastName: "Smith"
    },
    select: { id: true }
  });

  console.log(`Found ${smithZombies.length} zombies with lastName "Smith"`);

  // Update each with a random last name
  let updated = 0;
  for (const zombie of smithZombies) {
    const randomLastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

    await prisma.user.update({
      where: { id: zombie.id },
      data: { lastName: randomLastName }
    });

    updated++;
    if (updated % 100 === 0) {
      console.log(`Updated ${updated}/${smithZombies.length}...`);
    }
  }

  console.log(`Done! Updated ${updated} zombies with diverse last names.`);

  // Show new distribution
  const lastNames = await prisma.user.groupBy({
    by: ['lastName'],
    where: { isFakeProfile: true },
    _count: true,
    orderBy: { _count: { lastName: 'desc' } }
  });

  console.log("\nNew last name distribution (top 20):");
  lastNames.slice(0, 20).forEach(ln => {
    console.log(`  ${ln.lastName}: ${ln._count}`);
  });
  console.log(`Total unique last names: ${lastNames.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
