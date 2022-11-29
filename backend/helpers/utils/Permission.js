const exceptions = require("./Exception");
const messages = require("./Message");
const constants = require("./Constant");
const UserModel = require("../../models/UserModel");

function verifyToken(token) {
  try {
    var decoded = jwt.verify(token.split(" ")[1], env.JWT_SECRET);
    if (decoded) return decoded;
    exceptions.unauthorized();
  } catch (err) {
    exceptions.unauthorized();
  }
}

module.exports = {
  isUser: async (req) => {
    const authorizationToken = req.headers.authorization;

    // check for authorizationToken
    !authorizationToken && exceptions.unauthorized();
    const decoded = verifyToken(authorizationToken);

    // check for user
    const user = await UserModel.findOne({
      _id: decoded.id,
      isActive: true,
      isVerified: true,
    });

    !user && exceptions.unauthorized();

    return user;
  },
};
