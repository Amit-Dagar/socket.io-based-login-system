module.exports = {
  MODULE_LIST_SUCCESS: function (module) {
    return module + " list.";
  },

  MODULE_LIST_ERROR: function (module) {
    return "Error while listing " + module + ".";
  },

  MODULE_STORE_SUCCESS: function (module) {
    return module + " has been added successfully !";
  },

  MODULE_EXISTS: function (module) {
    return "The " + module + " already exists";
  },

  MODULE_STORE_ERROR: function (module) {
    return "Error while storing " + module + ".";
  },

  MODULE_SHOW_SUCCESS: function (module) {
    return module + " details.";
  },

  MODULE_NOT_FOUND: function (module) {
    return "No " + module + " found.";
  },

  MODULE_SHOW_ERROR: function (module) {
    return "Error during " + module + " details.";
  },

  MODULE_UPDATE_SUCCESS: function (module) {
    return module + " details has been updated successfully!";
  },

  MODULE_UPDATE_ERROR: function (module) {
    return "Error while updating " + module + ".";
  },

  MODULE_STATUS_CHANGE: function (module, status) {
    return module + " has been " + status + " successfully!";
  },

  MODULE_DELETE_ERROR: function (module) {
    return "Error while deleting " + module;
  },

  MODULE_PARAM_MISSING: function (module) {
    return module + " Parameter is missing";
  },

  MODULE_GREATER_EQUAL_THAN: function (module, value) {
    return module + " must be greater than or equal to " + value;
  },

  MODULE_LESS_EQUAL_THAN: function (module, value) {
    return module + " must be less than or equal to " + value;
  },

  MODULE_STATS: function (module) {
    return module + " stats.";
  },

  INVALID_INPUT: (param) => {
    return param + " has invalid value.";
  },

  INVALID_MODULE: (module) => {
    return module + " invalid.";
  },

  INPUT_BETWEEN: function (module, min, max) {
    return "The " + module + " has value between " + min + " and " + max + ".";
  },

  FILE_TYPE_MISMATCH: function (module) {
    return "The " + module + " must be a valid image file.";
  },

  HIGH_FILE_SIZE: function (module, size) {
    return "The " + module + " can not be grater than " + size + " MB.";
  },

  MODULE_EXPORT_ERROR: function (module) {
    return "Error while exporting " + module + ".";
  },

  MODULE_READ_SUCCESS: function (module) {
    return module + " read successfully.";
  },

  PRODUCT_OUT_OF_STOCK: function (product) {
    return "The " + product + " is out of stock.";
  },

  PARAM_MISSING: "Required parameter is missing",
  HEALTH_RESPONSE_OK: "Server is up and running",
  URL_NOT_FOUND: "The URL you are looking for is not found!",
  UNKNOWN_ERR: "Oops something went wrong. Please try again after some time.",

  // EXCEPTION MESSAGES
  SERVER_ERROR: "Internal Server error",
  INVALID_CREDENTIALS: "Invalid credentials",
  ERROR_CHECKOUT: "Error during checkout",
  BAD_REQUEST: "Bad Request",

  // AUTH MESSAGES
  LOGIN_SUCCESS: "Login successful, redirecting....",
  UNAUTHORIZED_REQUEST: "Unauthorized request.",
  USER_BLOCKED: "User is blocked.",
  FORGET_PASSWORD_SUCCESS: "OTP has been sent to your email.",
  RESET_PASSWORD_SUCCESS: "Password has been reset successfully.",
  AUTHENTICATION_CONFIRM: "Authentication confirmed",
  INVALID_OTP: "Invalid OTP",
  ACCESS_GRANTED: "Access granted",
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful, redirecting....",
  INVALID_RECAPTCHA: "Invalid recaptcha",

  // PRODUCT MESSAGES
  OUT_OF_STOCK: "Product is out of stock",
  NOT_ENOUGH_STOCK: "Not enough stock",
  REQUEST_ALREADY_SENT:
    "Your Replacement is pending admin approval. You will receive an email once action is taken.",
  MAX_REQUEST_SENT: "Maximum request sent in 24 hours.",
  FEEDBACK_ALREADY_SENT: "Feedback already sent",
  BALANCE_LOCKED:
    "Balance is locked for ongoing transaction. Please try again after some time.",

  // order
  EMPTY_CART: "Cart is empty",
  SUBSCRIPTION_EXPIRED: "Your subscription has expired for this product",

  // balance
  BALANCE_IS_LOW: "Balance is low.",
  INSUFFICIENT_BALANCE: "Insufficient balance.",

  // API
  SUCCESS: "Success",
  INVALID_DATA: "Invalid data",
  ORDER_FULLFILLED: "Order fullfilled",

  // PAYEMNT GATEWAY
  PAYMENT_GATEWAY_ERROR: "Payment gateway error",

  // WEBHOOK MESSAGES
  ORDER_NOT_FOUND: "Order not found",
  ORDER_ALREADY_FULLFILLED: "Order already fullfilled",
  ORDER_IS_NOT_PAID: "Order is not paid yet",

  // EMAIL
  EMAIL_SENT: "Email sent",
  YOUR_CREDENTIALS: "Your credentials - Limitless",
  TICKET_REPLY: "Ticket reply - Limitless",
};
