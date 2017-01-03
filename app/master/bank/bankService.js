
appServices.factory('bankFactory', ['$http','$rootScope', function($http,$rootScope){
	var urlApi = $rootScope.pathServerJSON +'/api/bank';
	var bankFactory={};

	bankFactory.getAllBank=function(hal,jumlah){
		return $http({
			method:'GET',
			url:urlApi+'/hal/'+hal+'/jumlah/'+jumlah,
			headers:{'Content-Type':'application/json'}	
		});		
	};

	bankFactory.isKodeExis=function(kode){
		return $http({
			method:'GET',
			url:urlApi + '/isKodeExis/' + kode
		});
	};

	bankFactory.getBankById=function(id){
		return $http({
			method:'GET',
			url:urlApi+'/id/'+id,
			headers:{'Content-Type':'application/json'}	
		});		
	};

	bankFactory.getBankByKodeByNamaPage=function(kode, nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi+'/kode/'+kode+'/nama/'+nama+'/hal/'+hal+'/jumlah/'+jumlah
		});
	};

	bankFactory.insertBank=function(bank){
		var bankData={
			'bank':bank,
			'authData':$rootScope.globals.currentUser.authdata
		};

		return $http({
			method:'POST',
			url:urlApi,
			data: JSON.stringify(bankData),
			headers:{'Content-Type':'application/json'}
		});
	}

	bankFactory.updateBank = function(id, bank){
		return $http({
			method:'PUT',
			url:urlApi + '/id/'+ id,
			data:JSON.stringify(bank)
		});
	};

	bankFactory.deleteBank = function (id){
		return $http({
			method:'DELETE',
			url:urlApi + '/id/' + id
		});

	}

	return bankFactory;

}])