const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/environments')
const { unauthorized } = require('../lib/errorMessage')

async function register(req, res, next) {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ message: `Bonjour! ${user.firstName}` })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user || !user.validatePassword(req.body.password)) {
      throw new Error(unauthorized)
    }

    const token = jwt.sign(
      { sub: user._id },
      secret,
      { expiresIn: '7 days' }
    )

    res.status(202).json({
      message: `${user.firstName} has logged in`,
      token
    })

  } catch (err) {
    next(err)
  }
}

module.exports = {
  register,
  login
}