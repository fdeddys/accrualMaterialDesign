appControllers.controller('suratTransferController', 
	['$scope','suratTransferFactory','$filter','$rootScope','focus','$location', 
	function($scope, suratTransferFactory, $filter,$rootScope, focus, $location){

	var userIdLogin;

	$scope.suratTransfers=[];
	$scope.searchNoApprove='';
	$scope.showCari = false;

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage = 8;
	$scope.currentPage = 1;  
	
	$scope.loadIsi = function (){
		$scope.showCari = !$scope.showCari ;		
	}

	$scope.edit = function (id){		
		$location.path('/suratTransfer/'+id); 
	}

	$scope.getAll = function(){	
		getAllSuratTransfer(1);
	};

	$scope.delete = function(){
		alert('belum buat');
	};

	function getAllSuratTransfer(){	
					
		var halaman = $scope.currentPage;
		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');
		var idUser = $rootScope.globals.currentUser.authdata;
		var noApprove;

		if($scope.searchNoApprove=='' || $scope.searchNoApprove == null){
			noApprove="--";
		}else{
			noApprove=$scope.searchNoApprove;
		}

	 	suratTransferFactory
			.getHdByTanggalNoApprove(vTgl1, vTgl2, noApprove, halaman, $scope.itemsPerPage)
			.success(function (data){
			 	$scope.suratTransfers = data.content ;
			 	$scope.totalItems = data.totalElements;
			 	//growl.addInfoMessage(data.content.length);
			}).error(function(data){
				//growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
			});	
		 			
	};
	
	// tanggal
		$scope.today = function() {
	    	$scope.tgl1 = new Date();	    	
	    	$scope.tgl2 = new Date();
		};
				
	// END tanggal

	function startModule(){

		$scope.today();
		userIdLogin=$rootScope.globals.currentUser.authdata;
		getAllSuratTransfer(1);
		//focus('searchNoApprove');
	};

	startModule();	

	

}])