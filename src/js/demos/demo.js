// Require dependencies
const fetch = require('node-fetch');
const { link } = require('@blockmason/link-sdk');

// Link credentials
const demoService = link({
  clientId: '',
  clientSecret: ''
}, {
    fetch
});

async function demo() {
    const { message } = await demoService.get('/helloWorld');
    console.log(message);
}

demo();