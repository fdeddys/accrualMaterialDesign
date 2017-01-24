appControllers.controller('userDetilController', 
	['$scope','id', '$mdDialog','userFactory','$rootScope','AuthenticationService','Base64',
	function($scope, id, $mdDialog, userFactory, $rootScope, AuthenticationService, Base64){
	
	//alert(id);

	// $scope.listStatus;
	


	// $scope.proses = function (){
	// 	switch($scope.jenisTransaksi){
	// 		case 1:
	// 			$scope.user.id='';
	// 			userFactory
	// 				.isKodeExis($scope.user.kode)
	// 				.success(function(data){
	// 					if(data==true){
	// 						//growl.addWarnMessage("kode user sudah ada !");
	// 					}else{
	// 						userFactory
	// 							.insertUser($scope.user)
	// 							.success(function(data){
	// 								closeForm();
	// 							})
	// 							.error(function(data){
	// 								//growl.addWarnMessage('Error insert ' + data);		
	// 							})							
	// 					}
	// 				})
				
	// 			break;
	// 		case 2:
	// 			userFactory
	// 				.updateUser($scope.user.id, $scope.user)
	// 				.success(function(data){
	// 					closeForm();
	// 				})
	// 				.error(function(data){
	// 					//growl.addWarnMessage('Error Updata ' + data);
	// 					//console.log(data);		
	// 				})				
	// 			break;	
	// 	}
	// };

	// $scope.cancelBtn = function(){
	// 	$mdDialog.cancel()
	// }

	// function closeForm() {
 //    	$mdDialog.hide(null);
 //    };

	



	// scope password terpisah dengan scope user
	$scope.password="";
	//$scope.pesanPassword=false;

	$scope.statusUsers=['ACTIVE','NONACTIVE'];
	
	$scope.search='';

	$scope.proses=function(){		

		switch($scope.jenisTransaksi){
			case 1:
				$scope.user.id='';
				$scope.user.password=AuthenticationService.getAuthCode($scope.user.nama,$scope.password);

				userFactory
					.insertUser($scope.user)
					.success(function(data){
						//growl.addInfoMessage('insert success ' + data );
						$scope.jenisTransaksi=2;
						$scope.user.id=data.id;
						//$scope.users.push(data);
						// getAllUser(1);
						// $scope.tutupGrid = !$scope.tutupGrid;
					})
					.error(function(data){
						//growl.addWarnMessage('Error insert ' + data);		
						$mdToast.show(
							$mdToast.simple()
								.textContent("Error Insert data [ "+ data +" ]!!")
								.position("top right")
								.hideDelay(5000)
							);
					})
				
				break;
			case 2:
				if($scope.password===""){
					$scope.user.password=""
				}else{
					$scope.user.password=Base64.encode($scope.user.nama + ':' +  $scope.password) ;
				};

				userFactory
					.updateUser($scope.user.id, $scope.user)
					.success(function(data){
						//$scope.users[idxEdit]=data;
					})
					.error(function(data){						
						//growl.addWarnMessage('Error Updata ' + data);
						$mdToast.show(
							$mdToast.simple()
								.textContent("Error [ "+ data +" ]!!")
								.position("top right")
								.hideDelay(5000)
							);
						// console.log(data);		
					})				
				break;		
		};

	};

	$scope.cancelBtn = function(){
		console.log('cancel btn func')
		$mdDialog.hide(null);
	}


	function cekAuth(){
		if( $rootScope.xAuth == true ){
			return true;
		}else{
			userFactory
	            .isAdmin($rootScope.globals.currentUser.username)
	            .success(function(data){
	                if(data==true){
	                	// its okay
	                	return true;
	                }else{
	                	$window.location ="#/login";
	                	return false;
	                }
	            })
			
		}
	}

	

	function startModule(){		
		//console.log('id kiriman = '+id)
		cekAuth();		

		$scope.user={
			id: 0,		
			nama: "",
			password: "",
			initial: "",
			status:"ACTIVE",
			isAdmin:false
		};

		if(id==0){			
			$scope.jenisTransaksi=1;
			$scope.user.id='[Automatic]';				
			$scope.user.status = $scope.statusUsers[0];
		}else{
			$scope.jenisTransaksi=2;	
			userFactory
				.getUserById(id)
				.success(function(data){
					$scope.user = data;	
					$scope.user.password='';			
				})
				.error(function(data){
					// growl.addWarnMessage("Error loading get by id ",{ttl:4000})
				});	
		}								
	}

	startModule();
}])