// lib/gifts.ts

import { Gift } from '../types/gift';

export const getGiftsByGroupId = async (groupId: string): Promise<Gift[]> => {
    // Implement your logic to fetch gifts by group ID from your database
    // This is just a placeholder implementation
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gifts?groupId=${groupId}`);
    const gifts = await response.json();
    return gifts;
};