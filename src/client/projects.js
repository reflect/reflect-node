/**
 * Manager for functionality related to projects.
 *
 * @param {Client} client Client to use
 * @constructor
 * @access package
 */
function Projects(client) {
  this._client = client;
}

/**
 * Lists all projects.
 *
 * @return {Promise} Promise representing the HTTP request
 */
Projects.prototype.list = function list() {
  return this._client.get('v1/projects');
};

/**
 * Gets a project.
 *
 * @param {String} slug Slug of the project
 * @return {Promise} Promise representing the HTTP request
 */
Projects.prototype.get = function get(slug) {
  return this._client.get(`v1/projects/${slug}`);
};

/**
 * Creates a project.
 *
 * Requires an API token with write access.
 *
 * @param {Object} project Project to create
 * @param {String} project.name Name for the project
 * @param {String} project.slug Slug for the project
 * @return {Promise} Promise representing the HTTP request
 */
Projects.prototype.create = function post(project) {
  return this._client.post('v1/projects', { data: project });
};

/**
 * Updates a project.
 *
 * Requires an API token with write access.
 *
 * @param {String} projectSlug Slug of project to update
 * @param {Object} project Updated project
 * @param {String} project.name Name to update
 * @return {Promise} Promise representing the HTTP request
 */
Projects.prototype.update = function update(projectSlug, project) {
  return this._client.put(`v1/projects/${projectSlug}`, { data: project });
};

/**
 * Destroys a project.
 *
 * Requires an API token with write access.
 *
 * @param {String} projectSlug Slug of project to destroy
 * @return {Promise} Promise representing the HTTP request
 */
Projects.prototype.destroy = function destroy(projectSlug) {
  return this._client.delete(`v1/projects/${projectSlug}`);
};

/**
 * Gets recent statements for a project.
 *
 * @param {String} projectSlug Slug of project to get statements for
 * @return {Promise} Promise representing the HTTP request
 */
Projects.prototype.getStatements = function getStatements(projectSlug) {
  return this._client.get(`v1/projects/${projectSlug}/statements`);
};

/**
 * Associates a connection with a project.
 *
 * Requires an API token with write access.
 *
 * @param {String} projectSlug Slug of project to associate
 * @param {String} connectionSlug Slug of the connection to associate with
 * @return {Promise} Promise representing the HTTP request
 */
Projects.prototype.associateConnection = function associateConnection(projectSlug, connectionSlug) {
  const body = { slug: connectionSlug };

  return this._client.post(`v1/projects/${projectSlug}/connections`, { body });
};

/**
 * Gets the key pairs that have been generated for this project.
 *
 * Requires an API token with write access.
 *
 * @param {String} projectSlug Slug of the project
 * @return {Promise} Promise represeenting the HTTP request
 */
Projects.prototype.getKeyPairs = function getKeyPairs(projectSlug) {
  return this._client.get(`v1/projects/${projectSlug}/key-pairs`);
};

module.exports = Projects;
