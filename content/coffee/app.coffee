lint = angular.module("lint",[])

lint.factory('hintConfig',->
  window.lintOptions
)

lint.controller("options",($scope,hintConfig) ->

  $scope.options = []

  $scope.selected = false

  $scope.select = (option) ->
    $scope.selected = option

  $scope.setOptionKey = (key) ->
    $scope.managingOption = key
    $scope.managing = hintConfig.options[key]
    $scope.options = $scope.managing.values.map (val) ->
      val.type = "radio"
      val
    $scope.selected = $scope.options[0]

  $scope.itemChecked = (option) ->
    $scope.selected == option
  
)

lint.controller("libraries",($scope,hintConfig) ->

  $scope.options = []
  $scope.selected = {}

  $scope.select = (option,evt) ->
    if evt.target.tagName.toLowerCase() == "label"
      return # this will generate a click event on input anyway
    if $scope.selected[option.id]
      delete $scope.selected[option.id]
    else
      $scope.selected[option.id] = true

  $scope.setOptionKey = (key) ->
    $scope.managing = hintConfig.options[key]
    $scope.options = $scope.managing.values.map (val) ->
      val.type = "checkbox"
      val

  $scope.itemChecked = (option) ->
    Boolean(option.id of $scope.selected)

)

lint.controller("globals",($scope) ->
  $scope.globals = "working"
    
)


lint.controller("download",($scope) ->
  $scope.globals = "working"
)

lint.controller("advanced",($scope) ->
  $scope.globals = "working"
)

class HintConfig
  constructor: ->
    @options = {
      "_GENERATED_BY_": "SidekickJS JSHint config tool - http://sidekickjs.com/js-hint-options"
    }
  applyProfile: (profile) ->

  setEnvironment: (env) ->

  toggleLibrary: (lib,adding) ->

  addGlobals: (globals) ->

  export: ->
  


