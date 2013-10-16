var require;
var define;

(function () {
  
  var modules = {};

  // Resolve this modules dependencies, and then apply the factory
  // using an empty object as the modules, passing in the dependencies.
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
      var module = modules[dependencyName];
      
      if (module) {
        go(module, cb);
      } else {
        // load the script file
        // wait for it to be parsed, and thus be defined
        var script = document.createElement('script');
        script.setAttribute('src', dependencyName + '.js');
        document.head.appendChild(script);
        script.addEventListener('load', function (event) {
          var module = modules[dependencyName];
          go(module, cb);
        });
      }
    }, cb);
  }
  
  require = function (dependencies, cb) {    
    resolve(dependencies, function (error, resolvedDependencies) {
      cb.apply({}, resolvedDependencies);
    });
  };
  
  define = function (name, dependencies, factory) {
    // Create the module object and register it
    modules[name] = {
      dependencies: dependencies,
      factory: factory
    };
  };

})();


(function () {
  
  require([ 'module1' ], function (module1) {
    console.log('module1', module1);
  });
  
})();