angular.module('starter.services', [])


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