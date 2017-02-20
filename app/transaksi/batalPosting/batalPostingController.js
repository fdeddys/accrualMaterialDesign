appControllers.controller('batalPostingController', 
	['$scope','jurnalHeaderFactory', '$window','$rootScope', '$filter','$location','$mdDialog','$mdToast',
	function($scope,jurnalHeaderFactory, $window, $rootScope,$filter, $location, $mdDialog, $mdToast ){
	
	$scope.jurnals=[];
	
	$scope.search='';	
	$scope.showCari = false;	


	function startModule(){	
		$scope.totalItems=0;
		$scope.itemsPerPage= 10;
		$scope.currentPage = 1;

		$scope.tgl1 = new Date();
		$scope.tgl2 = new Date();
		getAllJurnal();
	}


	$scope.loadIsi = function (){
		$scope.showCari = !$scope.showCari ;		
	}

	$scope.getAll=function(){
		getAllJurnal();
	};

	function getAllJurnal(){			
		//console.log($scope.tgl1);
		//console.log($scope.tgl2);
		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');
		var statusVouch;

		var idUser = $rootScope.globals.currentUser.authdata;
		
		statusVouch= "POSTING";	
	
		if(($scope.searchNoUrut=='' || $scope.searchNoUrut == undefined ) && 
			($scope.searchNoVoucher=='' || $scope.searchNoVoucher== undefined )){
		 	jurnalHeaderFactory
				.getJurnalHeaderByPageByTgl(idUser, $scope.currentPage, $scope.itemsPerPage, vTgl1, vTgl2,statusVouch) //userIdLogin
				.success(function (data){
				 	$scope.jurnalHeaders = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	//growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		 }else{
		 	
		 	if($scope.searchNoUrut===''){
				criteriaKode='-';
		 	}else{
		 		criteriaKode=$scope.searchNoUrut;	
		 	}

		 	if($scope.searchNoUrut===''){
				criteriaNama='-';
		 	}else{
		 		criteriaNama=$scope.searchNoUrut;	
		 	}

			jurnalHeaderFactory
				.getJurnalHeaderByKodeByNamaPage(criteriaKode, criteriaNama, $scope.currentPage, $scope.itemsPerPage, $scope.cariStatus)
				.success(function (data){
				 	$scope.jurnalHeaders = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	//growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		 }	
		
	};

	startModule();

	
}])