import { SecretSantaGroup } from "@prisma/client";

export type AppManager = {
    id: number;
    email: string;
    token: string;
    hasPaid: boolean;
    SecretSantaGroup: SecretSantaGroup[];
};