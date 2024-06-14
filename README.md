# EXPRESS LIVE

Live reload for [Express](http://expressjs.com/) template engines. 

### Installation
- Install express-live with npm
```bash
npm install express-live
```

### Install vscode live server
- Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### Usage
```javascript
const express = require('express');
const app = express();

// express-live
app.use(require("express-live")())

// ejs
app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.render('index', { data: 1 });
})

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
```

- use different host and port.
```js
// the default host: 127.0.0.1 & port: 5500
app.use(require("express-live")('127.0.0.1', 8080))
```