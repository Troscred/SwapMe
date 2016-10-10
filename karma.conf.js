//jshint strict: false
module.exports = function(config)
{
  config.set
  ({
    basePath: './app',

    files:
    [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/ngmap/build/scripts/ng-map.min.js',
      'index.html',
      '!(bower_components)/**/*.html',
      '!(bower_components)/**/*.js',
      'testApp.config.js',
      'testApp.module.js'
    ],
    
    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins:
    [
      'karma-chrome-launcher',
      'karma-jasmine'
    ]

  });
};
