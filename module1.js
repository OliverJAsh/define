define('module1', [ 'module2' ], function (module2) {
  console.log('module2', module2);
  
  return {
    foo: 'bar'
  };
});

define('module2', [], function () {
  return {
    foo: 'bar'
  };
});
