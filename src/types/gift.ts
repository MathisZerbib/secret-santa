
// gift .ts types

import { Recipient } from "./recipient";


export type Gift = {
    id: number;
    name: string;
    recipient: Recipient;
    bought: boolean;
    link: string | undefined;
};
