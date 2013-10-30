(function() {
  var HintConfig, lint;

  lint = angular.module("lint", []);

  lint.factory('hintConfig', function() {
    return window.lintOptions;
  });

  lint.controller("options", function($scope, hintConfig) {
    $scope.options = [];
    $scope.selected = false;
    $scope.select = function(option) {
      return $scope.selected = option;
    };
    $scope.setOptionKey = function(key) {
      $scope.managingOption = key;
      $scope.managing = hintConfig.options[key];
      $scope.options = $scope.managing.values.map(function(val) {
        val.type = "radio";
        return val;
      });
      return $scope.selected = $scope.options[0];
    };
    return $scope.itemChecked = function(option) {
      return $scope.selected === option;
    };
  });

  lint.controller("libraries", function($scope, hintConfig) {
    $scope.options = [];
    $scope.selected = {};
    $scope.select = function(option, evt) {
      if (evt.target.tagName.toLowerCase() === "label") {
        return;
      }
      if ($scope.selected[option.id]) {
        return delete $scope.selected[option.id];
      } else {
        return $scope.selected[option.id] = true;
      }
    };
    $scope.setOptionKey = function(key) {
      $scope.managing = hintConfig.options[key];
      return $scope.options = $scope.managing.values.map(function(val) {
        val.type = "checkbox";
        return val;
      });
    };
    return $scope.itemChecked = function(option) {
      return Boolean(option.id in $scope.selected);
    };
  });

  lint.controller("globals", function($scope) {
    return $scope.globals = "working";
  });

  lint.controller("download", function($scope) {
    return $scope.globals = "working";
  });

  lint.controller("advanced", function($scope) {
    return $scope.globals = "working";
  });

  HintConfig = (function() {
    function HintConfig() {
      this.options = {
        "_GENERATED_BY_": "SidekickJS JSHint config tool - http://sidekickjs.com/js-hint-options"
      };
    }

    HintConfig.prototype.applyProfile = function(profile) {};

    HintConfig.prototype.setEnvironment = function(env) {};

    HintConfig.prototype.toggleLibrary = function(lib, adding) {};

    HintConfig.prototype.addGlobals = function(globals) {};

    HintConfig.prototype["export"] = function() {};

    return HintConfig;

  })();

}).call(this);
