function Reporting(client) {
  this._client = client;
}

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
