	appServices.factory('jurnalHeaderFactory', ['$http','$rootScope', function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON + '/api/transaksi/jurnalHeader';
	var jurnalHeaderFactory={};

	jurnalHeaderFactory.getJurnalHeaderByPageByTgl=function(idUser, hal, jumlah, tgl1, tgl2, statusV){

		return $http({
			method:'GET',
			url:urlApi + '/idUser/' + idUser + '/hal/' + hal + '/jumlah/' + jumlah + '/tgl1/' + tgl1 + '/tgl2/' + tgl2	+'/statusV/' + statusV
		})
	};
						
	jurnalHeaderFactory.getJurnalHeaderByJurnalIdByUserId=function(jurnalId, userId){

		return $http({
			method:'GET',
			url:urlApi + '/id/'+jurnalId + '/user/'+userId 
		})
	};

	jurnalHeaderFactory.getJurnalPengeluaranByPageByTgl=function(hal, jumlah, tgl1, tgl2){
		return $http({
			method:'GET',
			url:urlApi + '/jurnalPengeluaran/hal/' + hal + '/jumlah/' + jumlah + '/tgl1/' + tgl1 + '/tgl2/' + tgl2
		})
	};

	jurnalHeaderFactory.getJurnalById=function(id){
		return $http({
			method:'GET',
			url:urlApi+'/id/'+id
		})
	}


	jurnalHeaderFactory.insertHeader=function(jurnalHeader){
		//alert(urlApi);
		return $http({
			method:'POST',
			// url:urlApi ,
			url:$rootScope.pathServerJSON +'/transaksi/jurnalHeader/insert/idUser/'+id ,
			data:JSON.stringify(jurnalHeader),
			headers:{'Content-Type':'application/json'}
		});
	};


	jurnalHeaderFactory.jurnalHeaderAdd=function(idUser, data){
		//alert(urlApi);
		return $http({
			method:'POST',
			url:urlApi +'/insert/idUser/' + idUser ,
			data:JSON.stringify(data),
			headers:{'Content-Type':'application/json'}
		});
	};

	jurnalHeaderFactory.saveJurnal=function( data){
		//alert(urlApi);
		return $http({
			method:'POST',			
			url:urlApi + '/save', 
			data:JSON.stringify(data),
			headers:{'Content-Type':'application/json'}
		});
	};

	jurnalHeaderFactory.delete=function(id){
		return $http({
			method:'DELETE',
			url:urlApi + '/id/' + id 			
		})
	};

	jurnalHeaderFactory.validasiVouchPengeluaran=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/validasiPembayaran/idHdr/' + id 			
		})
	};

	jurnalHeaderFactory.getByJenis=function(tgl1, tgl2, jenisVouc, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/byJenisVoucher/issueDate/'+tgl1+'/'+tgl2+'/jenisVouc/'+jenisVouc+'/page/'+hal+'/'+jumlah
		})
	};			
	

	return jurnalHeaderFactory;

}])