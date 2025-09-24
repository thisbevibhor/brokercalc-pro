import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	const user = await prisma.user.create({
		data: {
			email: "test@example.com",
			passwordHash: "hashedpassword123",
		},
	});
	console.log("Created user:", user);
}

main()
	.catch((e) => console.error(e))
	.finally(async () => {
		await prisma.$disconnect();
	});
