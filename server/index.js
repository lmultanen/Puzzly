const port = process.env.PORT || 3000;
const app = require('./app');
// if adding a db, require here

// if db, make async
const init = () => {
    try {
        // sync db if using one here
        app.listen(port, () => console.log(`listening on port ${port}`))
    } catch (err) {
        console.log(err);
    }
}

init();