var require;
var define;

(function () {
  
  var modules = {};

  /**
   * Recursively resolve dependencies
   */
  function resolve(dependencies) {
    return dependencies.map(function (dependencyName) {
      var module = modules[dependencyName];
      // Resolve this modules dependencies, and then apply the factory
      // using an empty object as the modules, passing in the dependencies.
      return module.factory.apply({}, resolve(module.dependencies));
    });
  }
  
  require = function (dependencies, cb) {    
    cb.apply({}, resolve(dependencies));
  }
  
  define = function (name, dependencies, factory) {
    // Create the module object
    modules[name] = {
      dependencies: dependencies,
      factory: factory
    };
  }

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