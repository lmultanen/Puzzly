const router = require('express').Router();
const { Image } = require('../db');

router.get('/', async (req, res, next) => {
    try {
        const images = await Image.findAll();
        res.send(images);
    } catch (err) {
        next(err)
    }
})

// route for figuring out current day's puzzly; may decide to move this somewhere else to avoid hardcoding here
router.get('/currentpuzzly', (req, res, next) => {
    try {
        const startDate = new Date("6/10/2023")
        const currentDate = new Date()
        const diffTime = Math.abs(currentDate - startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))+1; 
        res.send({dayDiff: diffDays})
    } catch (err) {
        next(err)
    }
})

// need a route to get total count

router.get('/:id', async (req, res, next) => {
    try {
        const image = await Image.findByPk(req.params.id);
        res.send(image)
    } catch (err) {
        next(err)
    }
})

module.exports = router