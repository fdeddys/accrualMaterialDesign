appServices.factory('coaHdrFactory', ['$http','$rootScope', function($http,$rootScope){
	var urlApi = $rootScope.pathServerJSON + '/api/accountHdr';
	var coaHdrFactory={};

	coaHdrFactory.getCoaHdrByPage=function(hal, jumlah){		
		return $http({
			method:'GET',
			url:urlApi + '/hal/' + hal + '/jumlah/' + jumlah  
		});			
	};

	coaHdrFactory.getCoaHdrByKodePage=function(kode, hal, jumlah){		
		return $http({
			method:'GET',
			url:urlApi + '/kode/' + kode + '/hal/' + hal + '/jumlah/' + jumlah  
		});			
	};

	coaHdrFactory.getCoaHdrByNamaPage=function(nama, hal, jumlah){		
		return $http({
			method:'GET',
			url:urlApi + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah  
		});			
	};

	coaHdrFactory.getCoaHdrByKodeByNamaPage=function(kode, nama, hal, jumlah){		
		return $http({
			method:'GET',
			url:urlApi + '/kode/' + kode + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah  
		});			
	};
	
	coaHdrFactory.getCoaHdrById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/id/' + id		
		});
	};

	coaHdrFactory.isKodeExis=function(kode){
		return $http({
			method:'GET',
			url:urlApi + '/isKodeExis/' + kode		
		});
	};

	coaHdrFactory.insertCoaHdr = function(CoaHdr){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(CoaHdr),
			headers:{'Content-Type':'application/json'}
		});
	};

	coaHdrFactory.updateCoaHdr = function(id,CoaHdr){
		return $http({
			method:'PUT',
			url:urlApi + '/id/' + id,
			data:JSON.stringify(CoaHdr),
			headers:{'Content-Type':'application/json'}
		});
	};

	coaHdrFactory.deleteCoaHdr = function(id){
		return $http({
			method:'DELETE',
			url:urlApi + '/id/' + id
		});
	};

	coaHdrFactory.getBagianById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/GetBagian/id/' + id
		})
	};

	return coaHdrFactory;
}])

appServices.factory('coaDtlFactory', ['$http','$rootScope', function($http,$rootScope){
	var urlApi= $rootScope.pathServerJSON +'/api/accountDtl';
	var coaDtlFactory={};

	coaDtlFactory.getCoaDtlByPage=function(hal, jumlah, isMaster){		
		return $http({
			method:'GET',
			url:urlApi + '/hal/' + hal + '/jumlah/' + jumlah  //+'/isMaster/' + isMaster
		});			
	};

	coaDtlFactory.getCoaDtlByKodePage=function(kode, hal, jumlah, isMaster){		
		return $http({
			method:'GET',
			url:urlApi + '/kode/' + kode + '/hal/' + hal + '/jumlah/' + jumlah // +'/isMaster/' + isMaster
		});			
	};

	coaDtlFactory.getCoaDtlByNamaPage=function(nama, hal, jumlah, isMaster){		
		return $http({
			method:'GET',
			url:urlApi + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah // +'/isMaster/' + isMaster
		});			
	};

	coaDtlFactory.getCoaDtlByKodeByNamaPage=function(kode, nama, hal, jumlah, isMaster){		
		return $http({
			method:'GET',
			url:urlApi + '/kode/' + kode +  '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah // +'/isMaster/' + isMaster
		});			
	};		

	coaDtlFactory.getCoaDtlById=function(id){		
		return $http({
			method:'GET',
			url:urlApi + '/id/' + id 
		});			
	};

	coaDtlFactory.isKodeExis=function(kode){
		return $http({
			method:'GET',
			url:urlApi + '/isKode/' + kode		
		});
	};

	coaDtlFactory.insertCoaDtl=function(coaDtl){		
		return $http({
			method:'POST',
			url:urlApi ,
			data: JSON.stringify(coaDtl),
			headers:{'Content-Type':'application/json'}
		});			
	};

	coaDtlFactory.updateCoaDtl=function(id,coaDtl){		
		return $http({
			method:'PUT',
			url:urlApi +'/id/' + id,
			data: JSON.stringify(coaDtl),
			headers:{'Content-Type':'application/json'}
		});			
	};

	coaDtlFactory.deleteCoaDtl=function(id){		
		return $http({
			method:'DELETE',
			url:urlApi +'/id/' + id			
		});			
	};

	coaDtlFactory.isKodeCoaDtlExis=function(kode){		
		return $http({
			method:'GET',
			url:urlApi +'/isKode/' + kode			
		});			
	};

	return coaDtlFactory;
}]);
