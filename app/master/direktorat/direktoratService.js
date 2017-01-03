appServices.factory('direktoratFactory', ['$http','$rootScope', function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/direktorat';	
	var direktoratFactory={};

	direktoratFactory.getAllDirektorat=function(){
		return $http({
			method:'GET',
			url : urlApi
		});
	}

	direktoratFactory.getDirektoratByNama=function(nama){
		return $http({
			method:'GET',
			url:urlApi+'/nama/'+nama
		});
	}
	
	direktoratFactory.getDirektoratById=function(id){
		return $http({
			method:'GET',
			url:urlApi+'/id/'+id
		});
	}

	direktoratFactory.isKodeDirektoratAda=function(kode){
		return $http({
			method:'GET',
			url:urlApi+'/isKodeExist/'+kode
		});
	}

	direktoratFactory.insertDirektorat =function (direktorat){
		// var direktoratData={
		// 	'direktorat':direktorat,
		// 	'authData':$rootScope.globals.currentUser.authdata
		// };

		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(direktorat)
		});
	}

	direktoratFactory.updateDirektorat=function(id,direktorat){

		return $http({
			method:'PUT',
			url:urlApi + '/updateid/' + id,
			//url:'http://localhost:8088/api/direktorat/updateid/3',
			data:JSON.stringify(direktorat),
		});
	}

	direktoratFactory.deleteDirektorat=function(id){
		return $http({
			method:'DELETE',
			url:urlApi+'/id/'+id
		})
	}

	return direktoratFactory;

}]);