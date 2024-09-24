import { Gift } from "./gift";

export type Recipient = {
    id: number;
    name: string;
    email: string;
    gifts: Gift[];
};