var require;
var define;

(function () {
  
  var context = {};

  function resolve(dependencies) {
    return dependencies.map(function (dependencyName) {
      var module = context[dependencyName];
      return module.cb.apply(this, resolve(module.dependencies));
    });
  }
  
  function require(dependencies, cb) {    
    cb.apply(this, resolve(dependencies));
  }
  
  function define(name, dependencies, cb) {
    // Create the module object
    context[name] = {
      dependencies: dependencies,
      cb: cb
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