appServices.factory('statusVoucherFactory', ['$http','$rootScope', function($http,$rootScope){

	var	statusVoucherFactory={};

	statusVoucherFactory.getAllStatus=function(){
		return $http({
			method:'GET',
			url:$rootScope.pathServerJSON + '/api/statusVoucher'
		})
	};

	return statusVoucherFactory;
}])