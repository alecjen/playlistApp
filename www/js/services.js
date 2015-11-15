angular.module('starter.services', ['firebase'])

.factory('Songs', function($firebaseArray) {
	var ref = new Firebase("https://dazzling-fire-7990.firebaseio.com/Songs");
  // download the data into a local object
  	return $firebaseArray(ref);
})

.factory('Hosts', function($firebaseArray) {
	var ref = new Firebase("https://dazzling-fire-7990.firebaseio.com/Hosts");
  // download the data into a local object
  	return $firebaseArray(ref);
})

.service('hostsService', function() {
	var hosts = [];

	var addHost = function(host) {
		hosts.push(host);
	};

	var getHosts = function() {
		return hosts;
	};

	return {
		addHost: addHost,
		getHosts: getHosts
	};
});