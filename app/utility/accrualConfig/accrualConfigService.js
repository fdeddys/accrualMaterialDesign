appServices.factory('accrualConfigFactory', ['$http','$rootScope', function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON + '/api/accrualConfig';
	var accrualConfigFactory = {};

	accrualConfigFactory.getConfig=function(){
		return $http({
			url:urlApi,
			method:'GET'
		})
	};
	

	accrualConfigFactory.updateConfig = function(accrualConfig){
		return $http({
			method:'PUT',
			url:urlApi,
			data:JSON.stringify(accrualConfig)
		});
	};


	return accrualConfigFactory;

}])