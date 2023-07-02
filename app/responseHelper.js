const HttpStatus = require("http-status-codes");
const success = (message, results, code, param, status = true) => {
  // const pattern = results;

  const pattern = {
    data: {
      message: message,
      status: status,
      data:  results,
      code: code ? code : HttpStatus.StatusCodes.OK,
    }
  };

  return pattern
};

const failure = (e, type, code, param, status = false) => {
  const pattern = {
    error: {
      message: e.message,
      status: status,
      type: type,
      code: code ? code : HttpStatus.StatusCodes.BAD_REQUEST,
    },
  };

  return pattern;
};

module.exports = {
  success,
  failure,
};
