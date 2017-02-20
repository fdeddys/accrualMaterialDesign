appControllers.controller('bukuBesarTrialController', 
	['$scope','bukuBesarTrialFactory', '$window','$rootScope', '$filter','$location',
	'$mdDialog','$mdToast','coaDtlFactory',
	function($scope,bukuBesarTrialFactory, $window, $rootScope,$filter, $location, 
		$mdDialog, $mdToast,coaDtlFactory ){
	
	$scope.bukuBesars=[];
	
	function startModule(){		
		$scope.totalItems=0;
		$scope.itemsPerPage= 10;
		$scope.currentPage = 1;
		getAllBBTrial("");
	}

	$scope.previewLaporan = function(id){

		$window.open($rootScope.pathServerJSON + '/api/proses/laporan/BBTrial', '_blank');			

	}

	$scope.previewLaporanPerItem = function(){
		// if($scope.selectedCoa === null) {
		// 	console.log('null');
		// }else{
		//     if(typeof ($scope.selectedCoa.kode)=== 'string'){
		//     	console.log('kode is string');
		//     }else{
		// 		console.log('not fill item');    	
		//     }
		// }]
		if($scope.selectedCoa) {
			// $mdToast.show(	
			// 	$mdToast.simple()
			// 		.textContent('selected coa = ' +  $scope.selectedCoa.idAccountDtl)
			// 		.position("bottom right")
			// 		.hideDelay(3000)
			// 	);				

			$window.open($rootScope.pathServerJSON + '/api/proses/laporan/BBTrial/idCoaDtl/'+$scope.selectedCoa.idAccountDtl, '_blank');		
		}else{
			$mdToast.show(	
				$mdToast.simple()
					.textContent('COA belum terpilih !!!')
					.position("bottom right")
					.hideDelay(3000)
				);							
		}
	}

	$scope.getAll = function(){
		getAllBBTrial("x");
	}

	$scope.loadIsi = function (){
		$scope.showCari = !$scope.showCari ;		
	}

	$scope.getCoaDtlByKode = function(cari){
		// console.log('cari = ['+ cari +']')
		if (cari=='') {
			return true;
		}
		return coaDtlFactory
			.getCoaDtlByKodePage(cari, 1, 10, true)
			.then(function(response){		
				var coas=[];
				angular.forEach(response.data.content, function(item){
	                coas.push(item);		                
	            });
				return coas;
			})
    };    

	function getAllBBTrial(cari){			

		//idCoa, idBank, idCust, rel, hal, jumlah		

		if($scope.selectedCoa== null || cari == undefined ){
			bukuBesarTrialFactory
				.getAll(-1,0,'--',$scope.currentPage, $scope.itemsPerPage)
				.success(function (data){
				 	$scope.bukuBesars = data.content;
				 	$scope.totalItems = data.totalElements;			 	
				}).error(function(data){
					//growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});		 				
		}else{
			bukuBesarTrialFactory
				.getAll($scope.selectedCoa.idAccountDtl,0,'--',$scope.currentPage, $scope.itemsPerPage)
				.success(function (data){
				 	$scope.bukuBesars = data.content;
				 	$scope.totalItems = data.totalElements;			 	
				}).error(function(data){
					//growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		}
	};

	startModule();

	
}])