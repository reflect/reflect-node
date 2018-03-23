

const jose = require('node-jose');
const utils = require('./utils');

const VIEW_IDENTIFIERS_CLAIM_NAME = 'http://reflect.io/s/v3/vid';
const PARAMETERS_CLAIM_NAME = 'http://reflect.io/s/v3/p';
const ATTRIBUTES_CLAIM_NAME = 'http://reflect.io/s/v3/a';

/**
 * Builder for encrypted tokens.
 *
 * Provides a way to create secure, reusable tokens that enable particular
 * functionality in the Reflect API while disallowing tampering.
 *
 * @constructor
 * @param {string} accessKey The access key that identifies the project of
 *                           this token.
 */
function ProjectTokenBuilder(accessKey) {
  this.accessKey = accessKey;

  this._expiration = null;
  this._claims = {
    viewIdentifiers: [],
    parameters: [],
    attributes: Object.create(null),
  };
}

/**
 * Sets the expiration for the constructed token to the given time.
 *
 * After this time, the token will no longer be valid. All requests made
 * using an expired token will fail.
 *
 * @param {Date} when The time at which the token will expire.
 * @return {ProjectTokenBuilder} This token builder.
 */
ProjectTokenBuilder.prototype.expiration = function expiration(when) {
  this._expiration = when;

  return this;
};

/**
 * Adds the given view identifier to the list of view identifiers permitted
 * by this token.
 *
 * If no view identifiers are added to this builder, all views in the given
 * access key's project will be able to be loaded. Otherwise, only those
 * added will be able to be loaded.
 *
 * @param {string} id The view identifier to restrict to.
 * @return {ProjectTokenBuilder} This token builder.
 */
ProjectTokenBuilder.prototype.addViewIdentifier = function addViewIdentifier(id) {
  this._claims.viewIdentifiers.push(id);

  return this;
};

/**
 * Adds a data-filtering parameter to this token.
 *
 * @param {{field: string, op: string, value: (string|string[])}} parameter
 * @return {ProjectTokenBuilder} This token builder.
 */
ProjectTokenBuilder.prototype.addParameter = function addParameter(parameter) {
  this._claims.parameters.push(parameter);

  return this;
};

/**
 * Sets the given attribute in this token.
 *
 * @param {string} name The attribute slug.
 * @param {*} value The attribute's value, which must be serializable to JSON.
 */
ProjectTokenBuilder.prototype.setAttribute = function setAttribute(name, value) {
  this._claims.attributes[name] = value;

  return this;
};

/**
 * @callback ProjectTokenBuilder.buildCallback
 * @param {*} err If not null, an error indicating why generating the token
 *                failed.
 * @param {string} token The generated token.
 */

/**
 * Builds a final copy of the token using the given secret key.
 *
 * @param {string} secretKey The secret key that corresponds to this builder's
 *                           access key.
 * @param {ProjectTokenBuilder.buildCallback} callback
 *   A callback to invoke with the constructed token when it is ready.
 */
ProjectTokenBuilder.prototype.build = function build(secretKey, callback) {
  const secretKeyBuffer = utils.secretKeyFromUUID(secretKey);

  const options = {
    format: 'compact',
    zip: true,
    fields: {
      cty: 'JWT',
    },
  };

  jose.JWK.asKey({
    kty: 'oct',
    alg: 'A128GCM',
    use: 'enc',
    kid: this.accessKey,
    k: secretKeyBuffer,
  }).then((key) => {
    const encrypter = jose.JWE.createEncrypt(options, key);

    const now = Math.floor(Date.now() / 1000);

    const payload = {
      iat: now,
      nbf: now,
    };

    if (this._expiration !== null) {
      payload.exp = Math.floor(this._expiration / 1000);
    }

    if (this._claims.viewIdentifiers.length) {
      payload[VIEW_IDENTIFIERS_CLAIM_NAME] = this._claims.viewIdentifiers;
    }

    if (this._claims.parameters.length) {
      payload[PARAMETERS_CLAIM_NAME] = this._claims.parameters.map((parameter) => {
        const mapping = {
          field: parameter.field,
          op: parameter.op,
        };

        if (parameter.any) {
          mapping.any = parameter.any.slice();
        } else if (Array.isArray(parameter.value)) {
          mapping.any = parameter.value.slice();
        } else {
          mapping.value = parameter.value;
        }

        return mapping;
      });
    }

    if (Object.getOwnPropertyNames(this._claims.attributes).length) {
      payload[ATTRIBUTES_CLAIM_NAME] = this._claims.attributes;
    }

    encrypter.update(JSON.stringify(payload)).final().then((token) => {
      callback(null, token);
    }).catch((err) => {
      callback(err);
    });
  }).catch((err) => {
    callback(err);
  });
};

exports.ProjectTokenBuilder = ProjectTokenBuilder;
