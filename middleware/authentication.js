const jwt = require('jsonwebtoken')

const authenticate = async (req, res, next) => {

  //Check header for access token
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(404).send({
      success : false,
      data : null,
      message : "Access token not found!!!!"
    })
  }
  //Get the token from the header
  const token = authHeader.split(' ')[1]
  try {
    //Verify the token
     req.user = jwt.verify(token, process.env.JWT_SECRET)
     req.id = req.user.id
     next();

  } catch (error) {
    return res.status(400).send({
      success : false,
      data : error.message,
      message : "Access token invalid/expired"
    })
  }
}

module.exports = authenticate