const Blog = require('../modals/blog')
const getBlogs = (req,res)=>{
     Blog
    .find({})
    .then(blogs => {
      res.json(blogs)
    })
}

const postBlog = (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
}

module.exports = {getBlogs, postBlog}