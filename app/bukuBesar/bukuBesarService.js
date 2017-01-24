appServices.factory('bukuBesarFactory', 
	['$http','$rootScope', 
	function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON +'/api/proses';
	var bukuBesarFactory={};

	bukuBesarFactory.getAll=function(bulanTahun, keterangan, idCoa, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/bukuBesar/' + bulanTahun + '/keterangan/' + keterangan + '/idCoa/' + idCoa + '/hal/' + hal + '/jumlah/' + jumlah		
		});
	}

	bukuBesarFactory.getBulanTahunBerjalan=function(){
		return $http({
			method:'GET',
			url:urlApi + '/getBulanTahunBerjalan'
		});
	}

	bukuBesarFactory.prosesTutupBulan=function(){
		return $http({
			method:'GET',
			url:urlApi + '/tutupBulan'
		});
	}

	bukuBesarFactory.postingTrial=function(idHd){
		return $http({
			method:'POST',
			url:urlApi + '/postingTrial/idHd/'+idHd		
		})
	}
	
	return bukuBesarFactory;

}]);