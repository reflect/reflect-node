exports.secretKeyFromUUID = function secretKeyFromUUID(uuid) {
  const buffer = new ArrayBuffer(16);
  const view = new DataView(buffer);

  let i = 0;
  uuid.replace(/([0-9a-f]{4})/g, (_, value) => {
    view.setUint16(i++ * 2, parseInt(value, 16)); // eslint-disable-line no-plusplus
  });

  return Buffer.from(buffer);
};
