var require;
var define;

(function () {
  
  var context = {};

  function require(dependencies, cb) {
    var dependencyModules = dependencies.reduce(function (modules, dependencyName) {
      return modules.concat(context[dependencyName]);
    }, []);
    cb.apply(this, dependencyModules);
  }
  
  function define(name, dependencies, cb) {
    context[name] = cb();
  }
  
  define('example', [], function () {
    return {
      foo: 'bar'
    };
  });
  
  require([ 'example' ], function (example) {
    console.log(example.foo);
  });

})();