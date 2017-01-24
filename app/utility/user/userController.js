appControllers.controller('userController', 
	['$scope','userFactory', '$window','$rootScope','focus','$mdDialog',
	function($scope,userFactory, $window, $rootScope, focus,$mdDialog){
	
	var idx=0;
		
	$scope.Users=[];	
	
	$scope.search='';	
	$scope.showCari = false;

	// Paging
	$scope.totalItems=0;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

	$scope.loadIsi = function (){
		$scope.showCari = !$scope.showCari ;		
	}

	$scope.getAll=function(){
		getAllUser();
	};

	$scope.addNew = function (ev){
		openDetilDialog(0,ev);		
	}
	
	$scope.edit = function (id, ev){
		openDetilDialog(id,ev);
	}

	function openDetilDialog(id,ev){
		$mdDialog.show({
			controller : 'userDetilController',
			templateUrl : 'app/utility/user/userDetil.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			locals: { 
				id: id
			}
		}).then(function(answer){
			//refresh
			getAllUser();
		},function(jawab){

		})

	}
	

	function getAllUser(){
		//alert('get all kode arsip');

		if($scope.search===''){
			userFactory
				.getAllUser($scope.currentPage,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.users = data.content ;				 					 	
				}).error(function(data){
					//growl.addWarnMessage("Error `oading getAll data !",{ttl: 4000});		
				});				
		}else{
			userFactory
				.getUserByNama($scope.search,$scope.currentPage,$scope.itemsPerPage )
				.success(function (data){
				 	$scope.users = data.content ;				 	
				}).error(function(data){
					//growl.addWarnMessage("Error Loading getAll data by nama !",{ttl: 4000});		
				});					
		}
		
	};


	$scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/api/User/laporan', '_blank');
	}

	function cekAuth(){
		if( $rootScope.xAuth == true ){
			console.log(' auth true ');
			return true;
		}else{
			userFactory
	            .isAdmin($rootScope.globals.currentUser.username)
	            .success(function(data){
	                if(data==true){
	                	// its okay
	                	console.log(' is admin true ');
	                	return true;
	                }else{
	                	$window.location ="#/login";
	                }
	            })
			
		}
	}

	function startModule(){
		console.log('masuk cek auth');
		cekAuth();
		console.log('get all user');
		getAllUser();

		// if(cekAuth()==true){
		// 	console.log('get all user');
		// 	getAllUser();			
		// }
	}

	//cekAuth();
	startModule();

}])