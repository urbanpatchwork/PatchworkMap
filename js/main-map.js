(function() {

  'use strict';

  var app = angular.module('up', ['ngAnimate']);

  var map = L.map('map', {
    zoomControl: false
  }).setView([30.292501817758687, -97.74330139160156], 11);

  L.control.zoom({position: 'bottomright'}).addTo(map);

  L.tileLayer(
    'https://{s}.tiles.mapbox.com/v3/jseppi.id24pohb/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.' +
      'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>'
  }).addTo(map);

  app.controller('MapCtrl', function ($scope) {
    $scope.showCategories = false;
    $scope.selectedArea = null; //ZIPCode or point-radius
    $scope.currentProjects = null;


    $scope.toggleListView = function() {
      console.log('toggle list view');
    };

    $scope.toggleCategories = function() {
      console.log('toggle categories');
      $scope.showCategories = !$scope.showCategories;
    };

  });

})();