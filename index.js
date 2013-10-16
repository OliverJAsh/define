var require;
var define;

(function () {
  
  var modules = {};
  
  /**
   * Recursively resolve dependencies
   */
  
  function resolve(dependencies, cb) {
    async.map(dependencies, function (dependencyName, cb) {
      var module = modules[dependencyName];
      
      // Resolve this modules dependencies, and then apply the factory
      // using an empty object as the modules, passing in the dependencies.
      resolve(module.dependencies, function (error, resolvedDependencies) {
        cb(null, module.factory.apply({}, resolvedDependencies));
      });
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
  
  define('module-1', [], function () {
    return {
      baz: 'bar'
    };
  });
  
  define('module-2', [ 'module-1' ], function (module1) {
    console.log('module-1', module1);
    return {
      foo: 'bar'
    };
  });
  
  require([ 'module-2' ], function (module2) {
    console.log('module-2', module2);
  });
  
})();