const express = require('express')
const controllers = require('../controllers/blog')
const router = express.Router();

router.get('/', controllers.getBlogs)
router.post('/', controllers.postBlog)

module.exports = router