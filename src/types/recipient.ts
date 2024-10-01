import { Gift, Recipient as PrismaRecipient } from "@prisma/client";

export type Recipient = PrismaRecipient & {
    gifts: Gift[];
};