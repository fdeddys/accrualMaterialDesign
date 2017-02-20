appServices.factory('bukuBesarTrialFactory', ['$http','$rootScope', function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON + '/api/proses';
	var bukuBesarTrialFactory={};

	bukuBesarTrialFactory.getAll=function(idCoa, idCust, rel, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/bukuBesarTrial/idCoa/'+idCoa+'/idCust/'+idCust+'/rel/'+rel+'/hal/'+hal+'/jumlah/'+jumlah 
		})
	};



	return bukuBesarTrialFactory;

}])