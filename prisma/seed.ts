import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	const hashedPassword = await bcrypt.hash("hashedpassword123", 10);

	const testUser = await prisma.user.upsert({
		where: { email: "test@example.com" },
		update: {},
		create: {
			email: "test@example.com",
			passwordHash: hashedPassword,
		},
	});

	console.log("User ensured:", testUser);

	const broker = await prisma.brokerAccount.upsert({
		where: { id: "dummy-broker-id" },
		update: {},
		create: {
			id: "dummy-broker-id",
			brokerName: "Zerodha",
			apiKey: "dummy-api-key",
			apiSecret: "dummy-api-secret",
			userId: testUser.id,
		},
	});

	console.log("Broker ensured:", broker);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
