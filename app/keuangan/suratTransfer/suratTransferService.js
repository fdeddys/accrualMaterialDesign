appServices.factory('suratTransferFactory', 
	['$http','$rootScope', function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON + '/api/suratTransfer';
	var suratTransferFactory={};
	
	suratTransferFactory.saveHd=function(suratTransferHd){		
		return $http({
			method:'POST',
			url:urlApi +'/hd' ,
			data:JSON.stringify(suratTransferHd),
			headers:{'Content-Type':'application/json'}
		});
	};	

	suratTransferFactory.editHd=function(id,suratTransferHd){		
		return $http({
			method:'PUT',
			url:urlApi +'/hd/'+id ,			
			data:JSON.stringify(suratTransferHd),
			headers:{'Content-Type':'application/json'}
		});
	};	

	suratTransferFactory.getHdById=function(id){		
		return $http({
			method:'GET',
			url:urlApi +'/hd/'+id ,			
			headers:{'Content-Type':'application/json'}
		});
	};	

	suratTransferFactory.getHdByTanggalNoApprove=function(tgl1, tgl2, noApprove, hal, jumlah){		
		return $http({
			method:'GET',
			url:urlApi +'/hd/'+ tgl1 + '/' + tgl2 + '/' + noApprove + '/' + hal + '/' + jumlah ,			
			headers:{'Content-Type':'application/json'}
		});
	};

	suratTransferFactory.saveDt=function(suratTransferDt){		
		return $http({
			method:'POST',
			url:urlApi +'/dt' ,
			data:JSON.stringify(suratTransferDt),
			headers:{'Content-Type':'application/json'}
		});
	};	

	suratTransferFactory.getDtById=function(id){		
		return $http({
			method:'GET',
			url:urlApi +'/dt/'+id ,			
			headers:{'Content-Type':'application/json'}
		});
	};

	suratTransferFactory.delDtById=function(id){		
		return $http({
			method:'DELETE',
			url:urlApi +'/dt/'+id ,			
			headers:{'Content-Type':'application/json'}
		});
	};	

	suratTransferFactory.delHdById=function(id){
		return $http({
			method:'DELETE',
			url:urlApi+'/hd/'+id,
			headers:{'Content-Type':'application/json'}
		});
	};

	suratTransferFactory.getDtByIdHd=function(idHd, hal, jumlah){		
		return $http({
			method:'GET',
			url:urlApi + '/dt/' + idHd + '/' + hal + '/' + jumlah,			
			headers:{'Content-Type':'application/json'}
		});
	};	

	suratTransferFactory.approve = function(idHd, idUser){
		return $http({
			method :'POST',
			url : urlApi + '/approve/'+idHd+'/user/'+idUser,
			headers:{'Content-Type' : 'application/json'}
		})
	}


	return suratTransferFactory;

}])