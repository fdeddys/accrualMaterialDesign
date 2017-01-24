appControllers.controller('tarikDataController', 
	['$scope','suratTransferFactory','$filter','$rootScope','focus', '$mdDialog','idBank','namaBank',
	'jurnalDetilFactory','idHdSuratTransfer',
	function($scope, suratTransferFactory,$filter,$rootScope, focus , $mdDialog, idBank,namaBank, 
		jurnalDetilFactory, idHdSuratTransfer){
	
	var userIdLogin;

	$scope.jurnalDetils=[];	
	$scope.ipServer=$rootScope.pathServerJSON;

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage = 8;
	$scope.currentPage = 1;  	
    

	// tanggal
	$scope.today = function() {
    	$scope.tglAwal = new Date();	   
    	$scope.tglAkhir = new Date(); 	
	};
	
	// END tanggal


	function startModule(){
		
		//console.log('nama bank' + namaBank);
		$scope.today();		
		userIdLogin=$rootScope.globals.currentUser.authdata;						
		$scope.totalItems;
		$scope.itemsPerPage= 7;
		$scope.currentPage = 1;
		tarikData();
		$scope.bank = namaBank;
		focus('cariNoUrut');

	};

	$scope.ok = function () {    	
    	$mdDialog.cancel()
  	};

	$scope.proses = function(jurnalId){

	  	// alert(index + '+' + jurnalId);
	  	// return ;
		var suratTransferDt={
		    'suratTransferHdId' : idHdSuratTransfer,
		    'jurnalDetilId' : jurnalId

		  }
		suratTransferFactory
		    .saveDt(suratTransferDt)
		    .then(function(response){
		    	//$scope.jurnalDetils.splice(index,1);          
		    	tarikData();
		    })
	  
	}

	$scope.refreshData = function (){
		//console.log('refresh')
		tarikData();
	}

	function tarikData(){

		var hal = $scope.currentPage;
		var kriteriaCariNoUrut;

		if($scope.cariNoUrut=='' || $scope.cariNoUrut==null){
			kriteriaCariNoUrut='--'
		}else{
			kriteriaCariNoUrut=$scope.cariNoUrut;
		}

		jurnalDetilFactory      
		    .listVoucSTByBank(idBank,kriteriaCariNoUrut, hal, $scope.itemsPerPage)
		    .then(function(response){
		        $scope.jurnalDetils = response.data.content;
		        $scope.totalItems = response.data.totalElements;
		    })			

	}

	startModule();	
	

}])