import { SecretSantaGroup, Recipient } from "@prisma/client";

export type Gift = {
    id: number;
    name: string;
    bought: boolean;
    link?: string;
    recipientId: number;
    recipient: Recipient;
    secretSantaGroupId?: number;
    SecretSantaGroup?: SecretSantaGroup;
};