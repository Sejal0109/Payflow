import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient, RampStatus, AuthType } from "@prisma/client";
import { z } from "zod";

// Singleton pattern for PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Assign singleton to `prisma`
const prisma: ReturnType<typeof prismaClientSingleton> =
  globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// Export Prisma client as default
export default prisma;

// Export Prisma types
export { RampStatus, AuthType };

// Example Zod schemas for validation
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email().optional(),
  number: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;

