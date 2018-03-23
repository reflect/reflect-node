const Errors = {};

Errors.fromResponse = function fromResponse(response) {
  let error;

  if (response.response) {
    const { data } = response.response;
    error = new Error(data.error.message);

    error.code = data.error.code;
    error.status = data.error.status;
    error.messages = data.error.messages;
  } else {
    error = new Error(error.message);
  }

  Error.captureStackTrace(error, this);

  return error;
};

module.exports = Errors;
