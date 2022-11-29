const constants = require("./Constant");
const messages = require("./Message");

module.exports = {
  invalidCredentials: () => {
    throw {
      status: constants.UNAUTHORIZED,
      message: messages.INVALID_CREDENTIALS,
    };
  },
  unauthorized: (message = null) => {
    throw {
      status: constants.UNAUTHORIZED,
      message: message || messages.UNAUTHORIZED_REQUEST,
    };
  },
  duplicateRecord: (model) => {
    throw {
      status: constants.BAD_REQUEST,
      message: messages.MODULE_EXISTS(model),
    };
  },
  notFound: (model) => {
    throw {
      status: constants.NOT_FOUND,
      message: messages.MODULE_NOT_FOUND(model),
    };
  },
  paymentGatewayError: () => {
    throw {
      status: constants.BAD_REQUEST,
      message: messages.ERROR_CHECKOUT,
    };
  },
  badRequest: (message = null) => {
    throw {
      status: constants.BAD_REQUEST,
      message: message || messages.BAD_REQUEST,
    };
  },
  successException: (message = null) => {
    throw {
      status: constants.SUCCESS,
      message: message || messages.SUCCESS,
    };
  },
};
