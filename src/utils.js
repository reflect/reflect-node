exports.secretKeyFromUUID = function secretKeyFromUUID(uuid) {
  var buffer = new ArrayBuffer(16);
  var view = new DataView(buffer);

  var i = 0;
  uuid.replace(/([0-9a-f]{4})/g, function(_, value) {
    view.setUint16(i++ * 2, parseInt(value, 16));
  });

  return Buffer.from(buffer);
}
