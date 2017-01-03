appServices.factory('userFactory', ['$http','$rootScope', function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON + '/api/user';
	var userFactory = {};

	userFactory.getAllUser=function(hal, jumlah){
		return $http({
			url:urlApi + '/hal/' + hal + '/jumlah/' + jumlah,
			method:'GET'
		})
	};

	userFactory.getUserByNama=function(nama, hal, jumlah){
		return $http({
			url : urlApi + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah,
			method:'GET'
		})
	};

	userFactory.getUserById=function(id){
		return $http({
			url : urlApi + '/id/' + id,
			method : 'GET'
		})
	};

	userFactory.getIdByUserName=function(nama){
		return $http({
			url : urlApi + '/nama/' + nama + '/user',
			method : 'GET'
		})
	};

	userFactory.isAdmin = function(nama){
		return $http({
			url : urlApi + '/idAdm/' + nama,
			method : 'GET'
		})
	}
	

	userFactory.insertUser = function(user){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(user),
			headers:{'Content-Type':'application/json'}
		});
	};

	userFactory.updateUser = function(id,user){
		return $http({
			method:'PUT',
			url:urlApi + '/id/'+ id,
			data:JSON.stringify(user)
		});
	};

	userFactory.deleteUser = function (id){
		return $http({
			method:'DELETE',
			url:urlApi + '/id/' + id
		});
	}

	return userFactory;

}])

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