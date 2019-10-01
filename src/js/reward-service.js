const { link } = require('@blockmason/link-sdk');

// Reward Service API
const rewardMicroservice = link({
    clientId: process.env.RWD_LNK_CLIENT_ID,
    clientSecret: process.env.RWD_LNK_CLIENT_SECRET
});

module.exports = {
    redeemedReward: function(reward) {
        const data = {
            "value": reward
        };
        return rewardMicroservice.get('/redeemedRewards', data);
    },

    getAuthority: function() {
        return rewardMicroservice.get('/authority');
    },

    redeemReward: function(reward, student) {
        const reqBody = {
            "reward": reward,
            "student": student
        };
        return rewardMicroservice.post('/redeemReward', reqBody);
    }
}