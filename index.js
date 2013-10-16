var require;
var define;

(function () {
  
  var context = {};

  /**
   * Recursively resolve dependencies
   */
  function resolve(dependencies) {
    return dependencies.map(function (dependencyName) {
      var module = context[dependencyName];
      // Resolve this modules dependencies, and then apply the factory
      // using an empty object as the context, passing in the dependencies.
      return module.factory.apply({}, resolve(module.dependencies));
    });
  }
  
  function require(dependencies, cb) {    
    cb.apply({}, resolve(dependencies));
  }
  
  function define(name, dependencies, factory) {
    // Create the module object
    context[name] = {
      dependencies: dependencies,
      factory: factory
    };
  }
  
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