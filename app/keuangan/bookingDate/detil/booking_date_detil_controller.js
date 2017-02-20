appControllers.controller('bookDateDetilController', 
	['$scope','$filter','$rootScope','focus', '$mdDialog','jurnalDetilFactory','id',
	function($scope,$filter,$rootScope, focus , $mdDialog,jurnalDetilFactory,idJurnalHd){
		

	$scope.jurnalDetils=[];	
	
	// END tanggal
	function startModule(){		
							
		$scope.totalItems;
		$scope.itemsPerPage= 7;
		$scope.currentPage = 1;				
		tarikData();
	};

	$scope.ok = function () {    	
    	$mdDialog.cancel()
  	};


	function tarikData(){		

		jurnalDetilFactory      
		    .getJurnalDetilByIdJurnalHeader(idJurnalHd)
		    .success(function(response){
		        $scope.jurnalDetils = response;		        
		    })			

	}

	startModule();	
	

}])