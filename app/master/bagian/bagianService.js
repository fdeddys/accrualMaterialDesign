appServices.factory('bagianFactory', ['$http','$rootScope', function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON +'/api/bagian';
	var bagianFactory={};

	bagianFactory.getAllBagianPage=function(hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/hal/' + hal + '/jumlah/' + jumlah
		});
	}

	bagianFactory.getAllBagianAktifPage=function(hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/aktif/hal/' + hal + '/jumlah/' + jumlah
		});
	}

	bagianFactory.getBagianByKodeByNamaPage=function(kode, nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi+'/kode/'+kode+'/nama/'+nama+'/hal/'+hal+'/jumlah/'+jumlah
		});
	}

	bagianFactory.getBagianByKodeByNamaAktifPage=function(kode, nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi+'/aktif/kode/'+kode+'/nama/'+nama+'/hal/'+hal+'/jumlah/'+jumlah
		});
	}

	bagianFactory.getBagianById=function(id){
		return $http({
			method:'GET',
			url:urlApi+'/id/'+id
		});
	}

	bagianFactory.getBagianByKodePage=function(kode, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi+'/kode/'+kode+'/hal/'+hal+'/jumlah/'+jumlah
		});
	}

	bagianFactory.getBagianByKodeAktifPage=function(kode, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi+'/aktif/kode/'+kode+'/hal/'+hal+'/jumlah/'+jumlah
		});
	}

	bagianFactory.isKodeBagianSudahAda = function(kode){
		return $http({
			method:'GET',
			url:urlApi + '/isKodeExist/' + kode
		})
	}

	bagianFactory.getBagianByNamaPage=function(nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi+'/nama/'+nama+'/hal/'+hal+'/jumlah/'+jumlah
		});
	}

	bagianFactory.getBagianByNamaAktifPage=function(nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi+'/aktif/nama/'+nama+'/hal/'+hal+'/jumlah/'+jumlah
		});
	}

	bagianFactory.insertBagian=function(bagian){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(bagian),
			headers:{'Content-Type':'application/json'}
		});
	}

	bagianFactory.updateBagian = function(id, bagian){
		return $http({
			method:'PUT',
			url:urlApi + '/id/'+ id,
			data:JSON.stringify(bagian)
		});
	};

	bagianFactory.deleteBagian = function (id){
		return $http({
			method:'DELETE',
			url:urlApi + '/id/' + id
		});
	};	

	return bagianFactory;

}]);