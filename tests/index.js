const { NeverloseMarket } = require('neverlose');
const config = require('./config.json');

// Various variants
const market = new NeverloseMarket({
    'userid': config.userid,
    'secret': config.secret
});

market.create_http_server();

// Market events
// When user transfered money to your account
market.on('balance_transfer', ctx => {
    console.log(ctx);
    console.info(`${ctx.username} transfered to you ${ctx.amount} NLE`); 
});

// When user purchased your market item
market.on('item_purchase', ctx => {
    console.log(ctx);
    console.info(`${ctx.username} purchased your market item ${ctx.item_id} for ${ctx.amount} NLE`);
});

// When http error occured
market.on('http_error', err => {
    console.err('http error occured:', err);
});

// POST requests
// Giving market item to user
// market.give_for_free('7Pt9n1', 'Teselka', ctx => {
//     console.log(ctx);
//     if (ctx.err) {
//         console.error(`Failed to give market item ${ctx.code} to user ${ctx.username}`);
//         return;
//     }

    
//     console.log(`${ctx.user} successfully got market item ${ctx.code}`);
// });

// // Transferring money to user
// market.transfer_money('Teselka', 0.01, ctx => {
//     if (ctx.err) {
//         console.error(`Failed to transfer ${ctx.amount} NLE to user ${ctx.username}`);
//         return;
//     }

//     console.log(`Successfully transferred ${ctx.amount} NLE to user ${ctx.username}`);
// });

// // Gifting product to user
// market.gift_product('Teselka', 'csgo', ctx => {
//     if (ctx.err) {
//         console.error(`Failed to gift product ${ctx.product} to user ${ctx.username}`);
//         return;
//     }

//     console.log(`${ctx.user} successfully got product ${ctx.product} (${ctx.cnt})`);
// });

// Crypto utils
// Validating signature
const sig = market.generate_signature({
    "amount": 0.9,
    "username": "A49",
    "unique_id": 89968,
    "item_id": "E3yugw",
    "signature": "454174f972a7b044289fb932ee65a86f41ea389807ff303686da496597289510"
});
console.log(sig);