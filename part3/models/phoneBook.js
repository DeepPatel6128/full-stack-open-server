require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGO_URI
mongoose.set('strictQuery', false)

mongoose
  .connect(url)
  .then((res) => {
    console.log('Connected')
  })
  .catch((e) => {
    console.log(e)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        // Regex: First part (2 or 3 digits), hyphen (-), second part (5 or more digits)
        return /^\d{2,3}-\d{5,}$/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'User phone number required'],
  },
})

module.exports = mongoose.model('Person', personSchema)
