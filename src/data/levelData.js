
export const levelData = {
    // Starting XP balance
    initialXP: 6420,

    // Level progression and rewards
    levels: [
        {
            level: 1,
            name: "Bronze",
            requiredXP: 0,
            reward: 100,
            rewardType: "VEs"
        },
        {
            level: 2,
            name: "Silver",
            requiredXP: 2000,
            reward: 200,
            rewardType: "VEs"
        },
        {
            level: 3,
            name: "Gold",
            requiredXP: 4000,
            reward: 300,
            rewardType: "VEs"
        },
        {
            level: 4,
            name: "Gold Member",
            requiredXP: 6000,
            reward: 400,
            rewardType: "VEs"
        },
        {
            level: 5,
            name: "Platinum Member",
            requiredXP: 8000,
            reward: 500,
            rewardType: "VEs"
        }
    ]
};
