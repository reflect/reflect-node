/**
 * Manager for reporting functionality.
 *
 * @param {Client} client Client to use
 * @constructor
 * @access package
 */
function Reporting(client) {
  this._client = client;
}

/**
 * Generates a report for a specified project
 *
 * @param {string} projectSlug The slug of the project to report against.
 * @param {string[]} dimensions Dimensions to generate the report with.
 * @param {string[]} metrics Metrics to generate the report with
 * @param {Object} [options={}] Options to use for generating the report
 * @param {Array} options.filters Filters to use when generating the report
 * @return {Promise} Promise representing the HTTP request
 */
Reporting.prototype.report = function report(projectSlug, dimensions, metrics, options = {}) {
  const params = Object.keys(options).reduce((opts, option) => {
    opts[option] = JSON.stringify(options[option]);

    return opts;
  }, {});

  params.dimensions = JSON.stringify(dimensions);
  params.metrics = JSON.stringify(metrics);

  return this._client.get(`v1/projects/${projectSlug}/report`, { params });
};

module.exports = Reporting;
