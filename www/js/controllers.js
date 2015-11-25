angular.module('starter.controllers', ['firebase'])

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
    { title: 'Alternative', id: 'Alternative' },
    { title: 'Classical', id: 'Classical' },
    { title: 'Electronic', id: 'Electronic' },
    { title: 'Pop', id: 'Pop' },
    { title: 'Rap', id: 'Rap' },
    { title: 'Rock', id: 'Rock' }
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

.controller('HostPlayCtrl', function($scope, $rootScope, $stateParams, $ionicPopover, $ionicPlatform, $firebaseArray, $http, Hosts) {
  $scope.stationName = $stateParams.hostId;
  var ref = new Firebase("https://dazzling-fire-7990.firebaseio.com/" + $scope.stationName);
  $scope.playlist = $firebaseArray(ref);
  $scope.hosts = Hosts;

  $scope.listCanSwipe = true;

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
        url: "http://api.soundcloud.com/tracks.json?client_id=" + clientid + "&q=" + searchString + "&limit=25"
    }).
    success(function(data) {
      data.forEach(function(song) {
        if(song.streamable) {
          var songData = {};
          songData.title = song.title;
          songData.id = song.id;
          songData.user = song.user.username;
          songData.stream_url = song.stream_url + '?client_id=' + clientid;
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
      stream_url: song.stream_url,
      permalink_url: song.permalink_url
    });
    console.log(song.permalink_url);
    $scope.searchResults = [];
  };

  $scope.removeSong = function(song) {
    $scope.playlist.$remove(song);
  };

  $scope.dbUpdated = false;
  $scope.playNext = function() {
    console.log('adf');
    $scope.dbUpdated = false;
    ref.on('child_removed', function() {
      $scope.dbUpdated = true;
    });
    $scope.playlist.$remove($scope.playlist[0]);
    //$scope.playlist.$remove($scope.playlist[0]);
  };

  $scope.getPlaying = function(playing) {
    console.log(playing);
  };

  
  $scope.openPopover = function($event) {
    var template = '<ion-popover-view class="song-popover"><ion-content class="card">' + $scope.playlist[0].title + '</ion-content></ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show($event);
  };

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });

})

.controller('ConnectCtrl', function($scope, $http, $location, $window, $ionicPopup, hostsService, Songs, Hosts) {
  $scope.$on('$ionicView.enter', function(e) {
    $scope.hosts = Hosts;
    console.log($scope.hosts);
  });

  $scope.verify = function(host) {
    var myPopup = $ionicPopup.show({
    template: '<input type="password" ng-model="login.pw">',
    title: 'Enter Station Password',
    subTitle: 'Ask the Host for details',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Connect</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.login.pw) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.login.pw;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    if($scope.login.pw == host.pass) {
      $window.location.href = "#/app/host/" + host.name;
    }
    else {
      alert('Incorrect Password! Try again');
      $scope.login.pw = "";
    }
  });
    
  }
})

.controller('PlaylistCtrl', function($scope, $stateParams, $firebaseArray, $http, $ionicPopover, $ionicPlatform) {
	$scope.stationName = $stateParams.playlistId;
	var ref = new Firebase("https://dazzling-fire-7990.firebaseio.com/" + $scope.stationName + "_pregenerated");
	ref.remove();
  	$scope.playlist = $firebaseArray(ref);

	$scope.listCanSwipe = true;

	var listid;
	if ($stateParams.playlistId == 'Alternative')
		listid = '95467695';
	if ($stateParams.playlistId == 'Classical')
		listid = '53337986';
	if ($stateParams.playlistId == 'Country')
		listid = '4840907';
	if ($stateParams.playlistId == 'Electronic')
		listid = '101244339';
	if ($stateParams.playlistId == 'Rap')
		listid = '4192463';
	if ($stateParams.playlistId == 'Pop')
		listid = '69377943';
	if ($stateParams.playlistId == 'Rock')
		listid = '81173109';

	var clientid = 'df9012da9800702acd7c621e45e30bdd';
    $http({
        method: 'GET',
        url: "http://api.soundcloud.com/playlists/" + listid + "?client_id=" + clientid
    }).
    success(function(list) {
	for (var i=0; i<list.tracks.length; i++)
        	if(list.tracks[i].streamable) {
			$scope.playlist.$add({
      			id: list.tracks[i].id,
      			title: list.tracks[i].title,
      			user: list.tracks[i].user.username,
      			stream_url: list.tracks[i].stream_url + '?client_id=' + clientid,
      			permalink_url: list.tracks[i].permalink_url
		});
		}
    		});

$scope.removeSong = function(song) {
    $scope.playlist.$remove(song);
  };

  $scope.dbUpdated = false;
  $scope.playNext = function() {
    console.log('adf');
    $scope.dbUpdated = false;
    ref.on('child_removed', function() {
      $scope.dbUpdated = true;
    });
    $scope.playlist.$remove($scope.playlist[0]);
    //$scope.playlist.$remove($scope.playlist[0]);
  };

  $scope.getPlaying = function(playing) {
    console.log(playing);
  };

  
  $scope.openPopover = function($event) {
    var template = '<ion-popover-view class="song-popover"><ion-content class="card">' + $scope.playlist[0].title + '</ion-content></ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show($event);
  };
/*
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
*/

})



