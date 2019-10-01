const stampData = require('../stamps.json');
const paymentService = require('./payments-service.js');
const commentsService = require('./comments-service.js');
const rewardService = require('./reward-service.js');

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
};

App = {
    tokenConversionRate: 1,
    walletMapping: {
        'Student1': '0x50A98FC5FfE1adCE8B8C087B70B33217a9d65013'.toLowerCase(),
        'Student2': '0xfF970382280B6c7a46962ddD08e7d591550E6B53'.toLowerCase(),
        'Student3': '0xFeE9813A4B268793D4Edc6DF11A760C3c07a2c98'.toLowerCase(),
        'RedeemedWallet': '0x854db69D54E695BFC29BbA0f64aBCFfDf8666793'.toLowerCase()
    },
    
    init: async function() {
        // Load stamps.
        const stampsRow = $('#stampsRow');
        const stampTemplate = $('#stampTemplate');

        for (i = 0; i < stampData.length; i++) {
            stampTemplate.find('.panel-title').text(stampData[i].name);
            stampTemplate.find('img').attr('src', stampData[i].picture);
            stampTemplate.find('.btn-redeem').attr('data-id', stampData[i].id);
            stampTemplate.find('.btn-value').text(stampData[i].price * App.tokenConversionRate);
            stampTemplate.find('.comments-row').attr('id', stampData[i].id );
            stampsRow.append(stampTemplate.html());
            App.markRewards(i, stampData[i].id);
        }
        await commentsService.getComments();
        commentsService.printComments();
        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.btn-redeem', App.handleRedemption);
        $(document).on('click', '.btn-comment', App.postComment);
    },

    markRewards: async function(index, reward) {
        const { result } = await rewardService.redeemedReward(reward);
        const student = getKeyByValue(App.walletMapping, result);
        
        if (result !== '0x0000000000000000000000000000000000000000') {
            $('.panel-stamp').eq(index).find('#studentAddress').empty();
            $('.panel-stamp').eq(index).find('#studentAddress').append('Student: ' + student).css({ wordWrap: "break-word" });
        }
    },

    fetchAuthority: async function() {
        const { result } = await rewardService.getAuthority();
        console.log('authority is', result);
    },

    redeemReward: async function(event, reward, redeemerAddress) {
        event.preventDefault();
        console.log('Redeemer address is', redeemerAddress);
        try {
            const response = await rewardService.redeemReward(reward, redeemerAddress);
            if(response.errors) {
                alert(response.errors[0].detail);
                $(event.target).text("Redeem").attr('disabled', false);
            } 
            else {
                console.log('redeemReward request successful');
                $(event.target).text("Redeem").attr('disabled', false);
                $(event.target).closest("div.student-address").find("input[name='student']").val('');  
                $(event.target).parents(".panel-stamp").find("#studentAddress").text('Student: ' + getKeyByValue(App.walletMapping, redeemerAddress));
            }
        } catch(err) {
            console.log(err);
            alert("Blockchain network request timed out. Please try again");
        }
    },
    
    handleRedemption: async function(event) {
        event.preventDefault();
        if (confirm("Confirm redemption of this reward, which will take a few seconds to document")) {
            $(event.target).text("Processing").attr('disabled', true);
            const reward = $(event.target).data('id');
            const newRedeemer = $(event.target).closest("div.student-address").find("input[name='student']").val();
            const newRedeemerAddress = App.walletMapping[newRedeemer];
            const price = parseInt($(event.target).next().html());
            let existingRedeemer = $(event.target).parents(".panel-stamp").find("#studentAddress").text().split(" ")[1];
            let existingRedeemerAddress = App.walletMapping[existingRedeemer];
            let redeemTreasury = App.walletMapping['RedeemedWallet'];

            if (existingRedeemerAddress !== '') {
                if (existingRedeemerAddress !== newRedeemerAddress) {
                    $(event.target).text("Redeem").attr('disabled', true);
                    await paymentService(newRedeemerAddress, redeemTreasury, price/App.tokenConversionRate);
                    App.redeemReward(event, reward, newRedeemerAddress);
                } else {
                    alert("The provided name has already redeemed this reward");
                    $(event.target).text("Redeem").attr('disabled', false);
                    $(event.target).closest("div.student-address").find("input[name='student']").val('');
                }
            } else {
                App.redeemReward(event, reward, newRedeemerAddress);
            }
        }
    },

    postComment: async function(event) {
        commentsService.postComment(event);     
    }
};
  
$(function() {
    $(window).load(function() {
        App.init();
    });
});
  