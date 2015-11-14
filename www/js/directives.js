/* ngSoundcloud | By Alain Galvan | Public Domain */
var app = angular.module("starter.directives", []);

app.directive('ngScTrack', ['$http',
    function($http) {
        function link(scope) {
            var clientid = 'df9012da9800702acd7c621e45e30bdd';
            $http({
                method: 'GET',
                url: 'http://api.soundcloud.com/tracks/' + scope.track + '.json?client_id=' + clientid
            }).
            success(function(data) {
                scope.band = data.user.username;
                scope.bandUrl = data.user.permalink_url;
                scope.title = data.title;
                scope.trackUrl = data.permalink_url;
                if(data.artwork_url != null) {
                    scope.albumArt = data.artwork_url.replace("large", "t500x500");
                }
                scope.wave = data.waveform_url;
                scope.stream = data.stream_url + '?client_id=' + clientid;
                scope.song = new Audio();
            });
            scope.playing = false;
            scope.play = function() {
                scope.playing = !scope.playing;
                if (!scope.playing) {
                    scope.song.pause();
                } else {
                    if (scope.song.src == '') {
                        scope.song.src = scope.stream;
                    }
                    scope.song.play();
                }
            }
        }
        return {
            restrict: 'E',
            scope: {
                track: '=track',
            },
            templateUrl: "templates/ng-sc-track.html",
            link: link
        };
    }
]);