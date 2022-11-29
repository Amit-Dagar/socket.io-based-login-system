const CryptoJS = require("crypto-js");
const constants = require("./utils/Constant");
const messages = require("./utils/Message");
const permissions = require("./utils/Permission");
const exceptions = require("./utils/Exception");

module.exports = {
  constants,
  messages,
  permissions,
  exceptions,

  // create response object
  createResponse: (
    res,
    status,
    message,
    payload = {},
    pager = {},
    header = {}
  ) => {
    return res.status(status).set(header).json({
      message: message,
      payload: payload,
      pager: pager,
    });
  },

  // check if the request contains the required fields
  checkParams: async (req, params) => {
    let missing = [];
    params.forEach((key) => {
      if (!req[key] && req[key] !== 0 && req[key] !== false) {
        missing.push(key);
      }
    });
    if (missing.length > 0) {
      throw {
        status: constants.BAD_REQUEST,
        message: messages.MODULE_PARAM_MISSING(missing.join(",")),
        missing: missing,
      };
    }
    return true;
  },

  // verify recatcha
  verifyRecaptcha: async (req) => {
    const secret = process.env.RECAPTCHA_SECRET;
    const response = req.body["g-recaptcha-response"];

    !response && exceptions.badRequest(messages.INVALID_RECAPTCHA);

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`;
    const options = {
      method: "POST",
      url: verifyUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const result = await axios(options);
    console.log(result.data);
    if (!result?.data?.success || result?.data?.score < 0.5)
      exceptions.badRequest(messages.INVALID_RECAPTCHA);
    return true;
  },

  // check if records is already exists
  getRecord: async (model, keys, attr = null, message = null) => {
    let record = await model.findOne({ ...keys });
    if (!record) {
      throw {
        status: constants.BAD_REQUEST,
        message: message || messages.MODULE_NOT_FOUND(attr || model.name),
      };
    }
    return record;
  },

  // check for duplicates
  checkDuplicate: async (model, keys, attr) => {
    const record = await model.findOne({ ...keys });
    if (record) {
      throw {
        status: constants.BAD_REQUEST,
        message: messages.MODULE_EXISTS(attr),
      };
    }
    return true;
  },

  // Encrypt Data
  encrypt: async (cipherText, secret = env.AES_SECRET) => {
    return CryptoJS.AES.encrypt(cipherText, secret).toString();
  },

  // Decrypt Data
  decrypt: async (cipherText, secret = env.AES_SECRET) => {
    return CryptoJS.AES.decrypt(cipherText, secret).toString(CryptoJS.enc.Utf8);
  },

  // Generate JWT Tokens for Users
  getToken: (data, setExpiry = env.TOKEN_EXPIRY) => {
    return jwt.sign(data, env.JWT_SECRET, {
      expiresIn: setExpiry,
      algorithm: env.JWT_ALGORITHM,
    });
  },

  // Verify JWT Tokens for Users
  verifyToken: async (token) => {
    try {
      var decoded = jwt.verify(token.split(" ")[1], env.JWT_SECRET);
      if (decoded) return decoded;
      else return false;
    } catch (err) {
      return false;
    }
  },

  // generate OTP
  getOtp: (length) => {
    // only numbers
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  // generate random string
  getRandomString: (length) => {
    // small and capital letters and numbers
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  // get paginated records
  getPaginatedRecords: async (
    req,
    model,
    query,
    populate = null,
    select = null,
    recordsPerPage = constants.RECORDS_PER_PAGE
  ) => {
    const page = req.body.page || 1;
    const sortBy = req.body.sortBy || "";

    var documents;

    if (populate)
      documents = await model
        .find({ ...query })
        .select("-password")
        .sort({ [sortBy]: -1 })
        .populate(...populate)
        .sort({ [sortBy]: -1 })
        .lean();
    else
      documents = await model
        .find({ ...query })
        .select("-password")
        .sort({ [sortBy]: -1 })
        .lean();

    if (select)
      documents = documents.map((doc) => {
        Object.keys(doc).map((key) => {
          if (!select.includes(key)) delete doc[key];
        });
        return doc;
      });

    return {
      records: documents.slice(
        [page * recordsPerPage - recordsPerPage],
        page * recordsPerPage
      ),
      pager: {
        total: documents.length,
        page,
        limit: recordsPerPage,
        next: documents.length > page * recordsPerPage ? page + 1 : null,
        previous: page > 1 ? page - 1 : null,
      },
    };
  },

  // get revenue chart
  getRevenueChart: async (model, query = {}, field, filter) => {
    let filteredRevenue;
    let revenue = await model.aggregate([
      {
        $match: {
          ...query,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          [field]: { $sum: "$" + field },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // today report
    if (filter === "today") {
      const today = new Date();
      const todayString = `${today.getFullYear()}-${
        today.getMonth() + 1 < 10
          ? "0" + (today.getMonth() + 1)
          : today.getMonth() + 1
      }-${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`;
      filteredRevenue = revenue.filter((r) => r._id === todayString);
      for (let i = 0; i < filteredRevenue.length; i++) {
        filteredRevenue[i]._id = moment(filteredRevenue[i]._id).format(
          "MMM DD, YYYY"
        );
      }
    }
    // last week report
    else if (filter === "week") {
      const today = new Date();
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6
      );
      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      filteredRevenue = revenue.filter(
        (r) => new Date(r._id) >= start && new Date(r._id) <= end
      );

      const tempRevenue = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
        const dateString = `${date.getFullYear()}-${
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1
        }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
        const revenue = filteredRevenue.filter((r) => r._id === dateString);

        if (revenue.length === 0) {
          tempRevenue.push({
            _id: moment(date).format("MMM DD, YYYY"),
            revenue: 0,
          });
        } else {
          tempRevenue.push({
            _id: moment(date).format("MMM DD, YYYY"),
            revenue: revenue[0][field],
          });
        }
      }
      filteredRevenue = tempRevenue;
    }
    // last month report
    else if (filter === "month") {
      // get revenue of last 30 days
      const today = new Date();
      const start = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
      );
      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      filteredRevenue = revenue.filter(
        (r) => new Date(r._id) >= start && new Date(r._id) <= end
      );

      const tempRevenue = [];

      for (let i = 0; i < 31; i++) {
        const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
        const dateString = `${date.getFullYear()}-${
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1
        }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
        const revenue = filteredRevenue.filter((r) => r._id === dateString);
        if (revenue.length === 0) {
          tempRevenue.push({
            _id: moment(date).format("MMM DD, YYYY"),
            revenue: 0,
          });
        } else {
          tempRevenue.push({
            _id: moment(date).format("MMM DD, YYYY"),
            revenue: revenue[0][field],
          });
        }
      }
      filteredRevenue = tempRevenue;
    }
    // last year report
    else {
      // group by month
      const today = new Date();
      const start = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      );
      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      // filtering records of the last one year
      filteredRevenue = revenue.filter(
        (r) => new Date(r._id) >= start && new Date(r._id) <= end
      );

      // removing date from _id
      for (let i = 0; i < filteredRevenue.length; i++) {
        filteredRevenue[i]._id = `${filteredRevenue[i]._id.split("-")[0]}-${
          filteredRevenue[i]._id.split("-")[1]
        }`;
      }

      // merge same _id objects in filteredRevenue
      filteredRevenue = filteredRevenue.reduce((acc, curr) => {
        const existing = acc.find((obj) => obj._id === curr._id);
        if (existing) {
          existing[field] += curr[field];
        } else {
          acc.push(curr);
        }
        return acc;
      }, []);

      const tempRevenue = [];

      // arranging data
      for (let i = 0; i < 12; i++) {
        const month = new Date(
          today.getFullYear(),
          today.getMonth() - i,
          today.getDate()
        );
        const monthString = `${month.getFullYear()}-${
          month.getMonth() + 1 < 10
            ? "0" + (month.getMonth() + 1)
            : month.getMonth() + 1
        }`;
        const monthRevenue = filteredRevenue.filter(
          (r) => r._id === monthString
        );
        if (monthRevenue.length > 0) {
          tempRevenue.push({
            _id: monthString,
            revenue: monthRevenue[0][field],
          });
        } else {
          tempRevenue.push({
            _id: monthString,
            revenue: 0,
          });
        }

        filteredRevenue = tempRevenue;
      }

      for (let i = 0; i < filteredRevenue.length; i++) {
        filteredRevenue[i]._id = moment(filteredRevenue[i]._id).format(
          "MMM, YYYY"
        );
      }
    }

    return filteredRevenue;
  },

  // generate  color
  getColor: (color = "#000000") => {
    // generate random hex string
    const hex = Math.floor(Math.random() * 16777215).toString(16);
    // convert hex to rgb
    const rgb = `#${hex}`;
    return rgb;
  },

  sendTelegramMessage: async (
    message,
    token = env.TG_BOT_TOKEN,
    chatId = env.TG_CHAT_ID
  ) => {
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&parse_mode=Markdown&text=${message.replaceAll(
      "#",
      "@"
    )}`;
    try {
      const data = await axios.get(url);
      if (data?.data?.ok) console.log("Message sent");
    } catch (error) {
      console.log(error);
    }
    return;
  },
};
