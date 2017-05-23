const execa = require('execa');
const _ = require('lodash');

function mapDependencies(dupeList, path, dependencies) {
  _.forEach(dependencies, (meta, name) => {
    _.update(dupeList, [name, meta.version], (paths) => {
      if (paths) {
        paths.push(path ? path : 'this package');
        return paths;
      } 
      return [path ? path : 'this package']; 
    });

    if (meta.dependencies) {
      const nextPath = path ? `${path} -> ${name}@${meta.version}` : `${name}@${meta.version}`;
      mapDependencies(dupeList, nextPath, meta.dependencies);
    }
  });
}

function removeDupes(dupeList) {
  _.forEach(dupeList, (versions, dep) => {
    let dupesCount = 0;

    _.forEach(versions, (version) => {
      dupesCount += version.length;
    });

    if (dupesCount <= 1) {
      delete dupeList[dep];
    }
  });
}

function formatDupes(dependencyGraph) {
  const dupeList = {};

  mapDependencies(dupeList, '', dependencyGraph.dependencies);
  removeDupes(dupeList);

  return dupeList;
}

module.exports = function prestige() {
  // NPM no longer supports the programmers api and prefers to be called via exec
  // ls --json provides us with output we can work with
  // and we run --prod because we don't care about duplicate devDependencies

  return execa('npm', ['ls', '--json', '--prod']).then(({ stdout: npmStdOut }) => {
    return formatDupes(JSON.parse(npmStdOut));
  })
  .catch(err => {
    try {
      console.log(err.stderr);
      return formatDupes(JSON.parse(err.stdout));
    } catch(e) {
      throw new Error("Couldn't get data from npm -ls", e);
    }
  });
}
