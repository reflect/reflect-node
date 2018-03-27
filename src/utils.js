exports.secretKeyFromUUID = (uuid) => {
  const buffer = new ArrayBuffer(16);
  const view = new DataView(buffer);

  let i = 0;
  uuid.replace(/([0-9a-f]{4})/g, (_, value) => {
    view.setUint16(i++ * 2, parseInt(value, 16)); // eslint-disable-line no-plusplus
  });

  return Buffer.from(buffer);
};

exports.errorFromResponse = (response) => {
  let error;

  if (response.response) {
    const { data } = response.response;
    error = new Error(data.error.message);

    error.code = data.error.code;
    error.status = data.error.status;
    error.messages = data.error.messages;
  } else {
    error = new Error(response.message);
  }

  Error.captureStackTrace(error, this);

  return error;
};
