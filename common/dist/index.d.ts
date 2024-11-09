import { PrismaClient, RampStatus, AuthType } from "@prisma/client";
import { z } from "zod";
declare const prismaClientSingleton: () => PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import(".prisma/client").Prisma.RejectOnNotFound | import(".prisma/client").Prisma.RejectPerOperation | undefined, import("@prisma/client/runtime").DefaultArgs>;
declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}
declare const prisma: ReturnType<typeof prismaClientSingleton>;
export default prisma;
export { RampStatus, AuthType };
export declare const UserSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    number: z.ZodString;
}, "strip", z.ZodTypeAny, {
    number: string;
    id: number;
    name: string;
    email?: string | undefined;
}, {
    number: string;
    id: number;
    name: string;
    email?: string | undefined;
}>;
export type UserType = z.infer<typeof UserSchema>;
