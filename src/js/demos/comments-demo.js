const fetch = require('node-fetch');
const { link } = require('@blockmason/link-sdk');

// Link credentials
const project = link({
  clientId: '',
  clientSecret: ''
}, {
    fetch
});

async function postMessage() {
    const reqBody = {
        "asset": "VanGoghPainting",
        "comment": "This one is my favourite!"
    }

    const response = await project.post('/postComment', reqBody);
    if (response.errors) {
        console.log(response.errors[0].detail);
    } else {
        console.log('POST /postComment called successfully with request data ', reqBody);
    }
}

async function getMessage() {
    const comments = await project.get('/events/Comment');
    console.log(comments);
}

postMessage().then(function() {
    getMessage();
});