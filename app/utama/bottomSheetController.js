appControllers.controller('bottomSheetController', 
	['$scope','$mdBottomSheet',
	function($scope, $mdBottomSheet){


	$scope.openMenu=function($mdOpenMenu, ev){
		$mdOpenMenu(ev);		
	}	

	$scope.postJurnalPenerimaan = function(){
		$mdBottomSheet.hide(null);
	}

	$scope.postJurnalPengeluaran = function(){
		$mdBottomSheet.hide(null);
	}

	$scope.openJurnal = function(){
		$mdBottomSheet.hide(null);	
	}


}])

