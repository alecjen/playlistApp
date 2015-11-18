angular.module('starter.controllers', ['firebase', 'spotify'])

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

.controller('HomeCtrl', function($scope) {
  $scope.songs = [];
  $scope.checkSongs = function(search) {
    Spotify.search(search, 'track').then(function (data) {
      //console.log(data.tracks.items);
      data.tracks.items.forEach(function(item) {
        console.log(item.name);
        console.log(item.artists);
      });
    });
  };

})

.controller('HostCtrl', function($scope, $location, hostsService, Hosts) {
  $scope.hostLoginData = {};
  $scope.hosts = Hosts;

  $scope.host = function() {
    if($scope.hostLoginData.pass != $scope.hostLoginData.retypedPass) {
      alert("Passwords do not match!");
      $scope.hostLoginData = {};
      return;
    }
    hostsService.addHost($scope.hostLoginData);
    $scope.hosts.$add({
      name: $scope.hostLoginData.name,
      pass: $scope.hostLoginData.pass,
      pass2: $scope.hostLoginData.retypedPass,
      desc: $scope.hostLoginData.desc
    });
    console.log($scope.hosts);
    var id = $scope.hostLoginData.name;
    $scope.hostLoginData = {};
    $location.path("app/host/" + id);
  }
})

.controller('HostPlayCtrl', function($scope, $rootScope, $stateParams, $ionicPlatform, $firebaseArray, $http, Hosts) {
  $scope.stationName = $stateParams.hostId;
  var ref = new Firebase("https://dazzling-fire-7990.firebaseio.com/" + $scope.stationName);
  $scope.playlist = $firebaseArray(ref);
  $scope.hosts = Hosts;

  // Host Leaves the Station, i.e. terminate everything
  $rootScope.$on('$locationChangeSuccess', function() {
    console.log("changed location");
    // Delete the playlist from the database
    // angular.forEach($scope.playlist, function(song,key) {
    //   $scope.playlist.$remove(song);
    // });
    // Remove the host station
    // angular.forEach($scope.hosts, function(host,key) {
    //   if(host.name == $scope.stationName) {
    //     $scope.hosts.$remove(host);
    //   }
    // });
  });   

  $scope.searchResults = [];

  $scope.search = function(searchString) {
    $scope.searchResults = [];
    if(searchString == "") {
      return;
    }
    var clientid = 'df9012da9800702acd7c621e45e30bdd';
    $http({
        method: 'GET',
        url: "http://api.soundcloud.com/tracks.json?client_id=" + clientid + "&q=" + searchString + "&limit=10"
    }).
    success(function(data) {
      data.forEach(function(song) {
        if(song.streamable) {
          var songData = {};
          songData.title = song.title;
          songData.id = song.id;
          songData.user = song.user.username;
          songData.permalink_url = song.permalink_url;
          $scope.searchResults.push(songData);
        }
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
    //$scope.playlist.push(song);
    $scope.playlist.$add({
      id: song.id,
      title: song.title,
      user: song.user,
      permalink_url: song.permalink_url
    });
    console.log(song.permalink_url);
    $scope.searchResults = [];
  };

  $scope.removeSong = function(song) {
    $scope.playlist.$remove(song);
  };

  $scope.playNextSong = function() {
    $scope.playlist.$remove($scope.playlist[0]);
  };
})

.controller('ConnectCtrl', function($scope, $http, hostsService, Songs, Hosts) {
  $scope.$on('$ionicView.enter', function(e) {
    $scope.hosts = Hosts;
    console.log($scope.hosts);
  });
})


.controller('PlaylistCtrl', function($scope, $stateParams) {
  console.log($stateParams.playlistId);
});
