export const subscription = [
    {
        planType: "Basic",
        price: "10€",
        priceId: "price_1Q58wYGWRVquvw5g51rM8qm5",
    },
    {
        planType: "Standard",
        price: "20€",
        priceId: "price_1Q58zxGWRVquvw5gIBxCVymN",
    },
    {
        planType: "Premium",
        price: "30€",
        priceId: "price_1Q58xEGWRVquvw5gYRY33RMc",
    },
];

export const subscriptionDictionary = subscription.reduce((acc, plan) => {
    acc[plan.priceId] = plan;
    return acc;
}, {} as Record<string, { planType: string; price: string; priceId: string }>);