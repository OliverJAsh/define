var require;
var define;

(function () {
  
  var queue = [];

  // Resolve this module's dependencies, and then apply the factory
  // using an empty object as the context, passing in the dependencies.
  function go(module, cb) {
    resolve(module.dependencies, function (error, resolvedDependencies) {
      cb(null, module.factory.apply({}, resolvedDependencies));
    });
  }
  
  /**
   * Recursively resolve dependencies
   */
  
  function resolve(dependencies, cb) {
    async.map(dependencies, function (dependencyName, cb) {
      var module = matchModule(dependencyName);
      
      if (module) {
        go(module, cb);
      } else {
        // Load the script file, wait for it to be parsed, and thereby
        // our module will be defined.
        var script = document.createElement('script');
        script.setAttribute('src', dependencyName + '.js');
        document.head.appendChild(script);
        
        script.addEventListener('load', function (event) {
          var module = matchModule(dependencyName);
          go(module, cb);
        });
      }
    }, cb);
  }
  
  function matchModule(moduleName) {
    // Because the load happens milliseconds after each module is
    // defined, we can shift an item from the queue and it will be
    // our match.
    // TODO: this possibly breaks with multiple definitions in an anon
    // file, and others?
    var module = _.first(queue, { name: undefined })[0];
    if (module) {
      module.name = moduleName
    } else {
      module = _.find(queue, { name: moduleName });
    }
    return module;
  }
  
  require = function (dependencies, cb) {    
    resolve(dependencies, function (error, resolvedDependencies) {
      cb.apply({}, resolvedDependencies);
    });
  };
  
  define = function (name, dependencies, factory) {
    // Create the module object and register it
    queue.push({
      name: name,
      dependencies: dependencies,
      factory: factory
    });
  };

})();
