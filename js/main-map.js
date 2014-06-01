
(function() {

  'use strict';

  var CATEGORIES_URL = '/mocks/categories.json';
  var PROJECTS_URL = '/mocks/projects.geojson';
  var PROJECT_PAGE_URL_TPL = "/project/{id}";

  // *********************************************************

  L.Icon.Default.imagePath = "/css/images";

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


  // *********************************************************

  var app = angular.module('up', ['ngAnimate']);

  // *********************************************************

  app.factory('ProjectService', function ($http, $q) {
    var service = {};

    service.fetch = function(options) {
      //options.selectedArea - {point, radius}
      //options.categoryIds - specific category ids to filter
      var deferred = $q.defer();
      $http.get(PROJECTS_URL)
        .success(function (results) {
          //TODO: filter based on categoryIds
          // and selectedArea
          deferred.resolve(results);
        });

      return deferred.promise;
    };

    return service;
  });


  // *********************************************************

  app.factory('CategoryService', function ($http, $q) {
    var service = {};

    service.fetch = function() {
      var deferred = $q.defer();
      $http.get(CATEGORIES_URL)
        .success(function (results) {
          deferred.resolve(results);
        });
      return deferred.promise;
    };

    return service;
  });


  // *********************************************************

  var projectPopup = function(props) {
    var html = [];
    html.push("<div class='project-popup'>");
    html.push("<h4>" + props.Name + "</h4>");
    //TODO
    html.push("</div>");

    return html.join('');
  };

  app.controller('MapCtrl', function ($scope, ProjectService, CategoryService) {
    $scope.showCategories = false;
    $scope.selectedArea = null; //ZIPCode or point-radius
    $scope.currentProjects = null; //current project features
    $scope.categories = []; //all valid categories
    $scope.selectedCategories = []; //only selected categories

    //variable to hold projects layer
    var projectsLayer = L.geoJson().addTo(map);

    map.invalidateSize(false); //must call because of ng-cloak

    //retrieve all the valid categoies
    CategoryService.fetch()
      .then(function (cats) {
        //default to all set to isSelected
        _.each(cats, function (c) { c.isSelected = true; });

        //set $scope.categories to the fetched results
        angular.copy(cats, $scope.categories);
      });



    ProjectService.fetch()
      .then(function (projectFeatures) {
        projectsLayer.clearLayers();
        projectsLayer.addData(projectFeatures);
        var icon = L.MakiMarkers.icon({icon: "farm", color: "#5cb85c"});
        projectsLayer.eachLayer(function (lyr) {
          if (lyr.setIcon) {
            lyr.setIcon(icon);
          }

          lyr.bindPopup(projectPopup(lyr.feature.properties));
        });
        map.fitBounds(projectsLayer.getBounds());
      });



    _.each($scope.categories, function (cat) {
      cat.isSelected = true;
    });

    $scope.toggleListView = function() {
      console.log('toggle list view');
    };

    $scope.toggleCategory = function(cat) {
      cat.isSelected = !cat.isSelected;
    };


    $scope.$watch('categories', function(newvals, oldvals) {
      //skip the first time this watch is triggered
      if (_.isEmpty(newvals) && _.isEmpty(oldvals)) {
        return;
      }

      var selectedCats = _.where($scope.categories, {isSelected: true});
      angular.copy(selectedCats, $scope.selectedCategories);
    }, true);

    $scope.$watch('selectedCategories', function() {
      console.log('selectedCategories', $scope.selectedCategories);

    }, true);

  });

})();