angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicHistory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('HostCtrl', function($scope, $location, hostsService) {
  $scope.hostLoginData = {};
  $scope.hosts = [];

  $scope.host = function() {
    if($scope.hostLoginData.pass != $scope.hostLoginData.retypedPass) {
      alert("Passwords do not match!");
      $scope.hostLoginData = {};
      return;
    }
    hostsService.addHost($scope.hostLoginData);
    $scope.hosts = hostsService.getHosts();
    console.log($scope.hosts);
    var id = $scope.hostLoginData.name;
    $scope.hostLoginData = {};
    $location.path("app/host/" + id);
  }
})

.controller('HostPlayCtrl', function($scope, $stateParams, $ionicPlatform) {
  $scope.stationName = $stateParams.hostId;
  $scope.songs = ["song1", "song2", "song3"];
})

.controller('ConnectCtrl', function($scope, $http, hostsService) {

  $scope.$on('$ionicView.enter', function(e) {
    $scope.hosts = hostsService.getHosts();
    console.log($scope.hosts);
  });

  $scope.clear = function() {
    $scope.searchString = "clear";
  };

  $scope.searchResults = [];
  $scope.playlist = [];
  
  $scope.search = function(searchString) {
    var clientid = 'df9012da9800702acd7c621e45e30bdd';
    $http({
        method: 'GET',
        url: "http://api.soundcloud.com/tracks.json?client_id=" + clientid + "&q=" + searchString + "&limit=10"
    }).
    success(function(data) {
      data.forEach(function(song) {
        var songData = {};
        songData.title = song.title;
        songData.id = song.id;
        $scope.searchResults.push(songData);
      });
      //console.log($scope.searchResults.length);
      // $scope.band = data.user.username;
      // $scope.bandUrl = data.user.permalink_url;
      // $scope.title = data.title;
      // $scope.trackUrl = data.permalink_url;
      // $scope.albumArt = data.artwork_url.replace("large", "t500x500");
      // $scope.wave = data.waveform_url;
      // $scope.stream = data.stream_url + '?client_id=' + clientid;
      // $scope.song = new Audio();
    });
  }

  $scope.addToPlaylist = function(song) {
    $scope.playlist.push(song);
    console.log(song.id);
    $scope.searchResults = [];
  };
})


.controller('PlaylistCtrl', function($scope, $stateParams) {
  console.log($stateParams.playlistId);
});