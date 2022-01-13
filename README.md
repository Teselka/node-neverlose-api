# Neverlose api
This is the neverlose.cc market api wrapper written on node.js

## Getting started
First of all, you should to get your userid and client secret from site (https://neverlose.cc/market/api)

And setup callback url's

![alt preview](https://i.imgur.com/br0wiSF.jpg)

Then create market class and an http/https server

```js
const { NeverloseMarket } = require('neverlose-api');

const market = new NeverloseMarket({
    'userid': 1337,
    'secret': 'your_secret'
});

market.create_http_server();
// or
market.create_https_server({
    key: 'key',
    cert: 'cert'
});

```

Then create an event handler
```js
market.on('balance_transfer', ctx => {
    console.info(`${ctx.username} transfered to you ${ctx.amount} NLE`); 
});

```

Or use any of POST methods
```js
market.give_for_free('my_item', 'Teselka', ctx => {
    if (ctx.err) {
        console.error(`Failed to give market item ${ctx.code} to user ${ctx.username}, reason: ${ctx.err}`);
        return;
    }
    
    console.log(`${ctx.user} successfully got market item ${ctx.code}`);
});
```


## Available events
### balance_transfer - When user transfered money to your account
```js
market.on('balance_transfer', ctx => {
    console.info(`${ctx.username} transfered to you ${ctx.amount} NLE`); 
});
```

### item_purchase - When user purchased your market item
```js
market.on('item_purchase', ctx => {
    console.info(`${ctx.username} purchased your market item ${ctx.item_id} for ${ctx.amount} NLE`);
});
```

## Available POST requests
### transfer_money - Transferring money to user
```js
market.transfer_money('Teselka', 0.01, ctx => {
    if (ctx.err) {
        console.error(`Failed to transfer ${ctx.amount} NLE to user ${ctx.username}`);
        return;
    }

    console.log(`Successfully transferred ${ctx.amount} NLE to user ${ctx.username}`);
});
```

### gift_product - Gifting product to user
```js
market.gift_product('Teselka', 'csgo', ctx => {
    if (ctx.err) {
        console.error(`Failed to gift product ${ctx.product} to user ${ctx.username}`);
        return;
    }

    console.log(`${ctx.user} successfully got product ${ctx.product} (${ctx.cnt})`);
});
```

## Avilable utils
### generate_signature - Generating signature
```js
const sig = market.generate_signature({
    "amount": 0.9,
    "username": "A49",
    "unique_id": 89968,
    "item_id": "E3yugw",
});
console.log(sig);
```

### validate_signature - Validating signature
```js
const sig = market.validate_signature({
    "amount": 0.9,
    "username": "A49",
    "unique_id": 89968,
    "item_id": "E3yugw",
    "signature": "454174f972a7b044289fb932ee65a86f41ea389807ff303686da496597289510"
});
console.log(sig); // true
```
