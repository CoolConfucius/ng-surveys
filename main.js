'use strict'; 

var app = angular.module('MyApp', ['ui.router', 'ngStorage']); 

app.config(function($stateProvider, $urlRouterProvider, $localStorageProvider){
  $stateProvider
    .state('home', {url: '/', templateUrl: './partials/home.html', controller: 'homeCtrl' })
    .state('add', {url: '/add', templateUrl: './partials/add.html', controller: 'addCtrl' })
    .state('survey', {url: '/survey/:surveyid', templateUrl: './partials/survey.html', controller: 'surveyCtrl' })

  $urlRouterProvider.otherwise('/');
});

var defaultSurvey = {
  title: "title",
  author: "author", 
  date: 0, 
  questions: []
};

app.controller('homeCtrl', function($scope, $state, $localStorage){
  $scope.$storage = $localStorage; 
  if (!$scope.$storage.surveys) {
    $scope.$storage = $localStorage.$default({
      surveys: [ 
        { id: 0, title: "Survey1", author: "zero", date: 20160729 },
        { id: 1, title: "Survey0", author: "one", date: 20160729 },
        { id: 2, title: "Survey2", author: "two", date: 20160729 }, 
        { id: 3, title: "Survey3", author: "three", date: 20160729 }, 
        { id: 4, title: "Survey4", author: "four", date: 20160729 }, 
      ]
    });
  } 
  $scope.surveys = $scope.$storage.surveys;

  if (!$scope.$storage.answers) {
    $scope.$storage = $localStorage.$default({
      answers: []
    });
  } 

  $scope.editState = false; 
  $scope.removeSurvey = function(survey){
    var index = $scope.surveys.indexOf(survey);
    $scope.surveys.splice(index, 1);
    $scope.$storage.surveys = $scope.surveys; 
  };

  $scope.openEdit = function(survey){
    $scope.editIndex = $scope.surveys.indexOf(survey); 
    $scope.editState = !$scope.editState;
    if ($scope.editState) {
      $scope.newSurvey = $scope.surveys[$scope.editIndex]; 
    } else {
      $scope.newSurvey = defaultSurvey; 
    }
  }

  $scope.editSurvey = function(survey){
    $scope.surveys[$scope.editIndex] = $scope.newSurvey;
    $scope.newSurvey = defaultSurvey;
    $scope.editState = false; 
  };


  $scope.sortSurvey = function(key){
    if ($scope.sortText === key) {
      $scope.sortText = '-'+key;   
    } else {
      $scope.sortText = key; 
    }
  };  


});

app.controller('addCtrl', function($scope, $state, $localStorage){
  // $scope.newquestions = []; 
  $scope.newSurvey = defaultSurvey;
  $scope.currentquestion = ""; 
  $scope.addQuestion = function(){
    var qid = 0; 
    for (let id of $scope.newSurvey.questions) {
      if (qid === id) qid++;
    }
    $scope.newSurvey.questions.push({
      id: qid,
      question: $scope.currentquestion
    });
  };

  $scope.addSurvey = function(){
    var newid = 0; 
    for (let id of $localStorage.surveys) {
      if (newid === id) newid++; 
    }
    var survey = {
      id: newid,
      title: $scope.newSurvey.title || ' ',
      author: $scope.newSurvey.author || ' ',
      date: $scope.newSurvey.date || 0, 
      questions: $scope.newSurvey.questions || [],
      answers: []
    }
    $localStorage.surveys.push(survey);
    $scope.newSurvey = defaultSurvey;
    $state.go('home');
  }
});

app.controller('surveyCtrl', function($scope, $state, $localStorage, $stateParams){
  console.log("surveyCtrl")
  var surveyid = parseInt($state.params.surveyid);
  var surveys = $localStorage.surveys;
  for (let i in surveys) {
    if (surveys[i].id === surveyid) {
      $scope.survey = Object.assign({}, surveys[i]);
    }
  }
});

app.controller('answerCtrl', function($scope, $state, $localStorage){

});



app.controller('mainCtrl', function($scope, $localStorage, $sessionStorage) {

  console.log("mainCtrl");
  var defaultSurvey = {
    title: "title",
    author: "author", 
    date: 0
  };
  $scope.newSurvey = defaultSurvey; 

  $scope.surveys = $scope.$storage.surveys;

  $scope.editState = false; 

  $scope.addSurvey = function(){
    var survey = {
      title: $scope.newSurvey.title || ' ',
      author: $scope.newSurvey.author || ' ',
      date: $scope.newSurvey.date || 0
    }
    $scope.surveys.push(survey);
    $scope.newSurvey = defaultSurvey;
  }

  
  $scope.removeSurvey = function(survey){
    var index = $scope.surveys.indexOf(survey);
    $scope.surveys.splice(index, 1);
    $scope.$storage.surveys = $scope.surveys; 
  };

  $scope.openEdit = function(survey){
    $scope.editIndex = $scope.surveys.indexOf(survey); 
    $scope.editState = !$scope.editState;
    if ($scope.editState) {
      $scope.newSurvey = $scope.surveys[$scope.editIndex]; 
    } else {
      $scope.newSurvey = defaultSurvey; 
    }
  }

  $scope.editSurvey = function(survey){
    $scope.surveys[$scope.editIndex] = $scope.newSurvey;
    $scope.newSurvey = defaultSurvey;
    $scope.editState = false; 
  };


  $scope.sortSurvey = function(key){
    if ($scope.sortText === key) {
      $scope.sortText = '-'+key;   
    } else {
      $scope.sortText = key; 
    }
  }
}); 