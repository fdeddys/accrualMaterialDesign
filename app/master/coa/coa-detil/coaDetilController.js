appControllers.controller('coaDetilController', 
	['$scope','coaDtlFactory', '$window','$rootScope','$mdDialog',
	function($scope,coaDtlFactory, $window, $rootScope, $mdDialog){

	$scope.coas=[];
	
	$scope.showCari = false;

	$scope.jenisTransaksi;
	// Paging
	$scope.totalItems=0;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;
	$scope.totalPages=0;

	getAllCoa($scope.currentPage);

	$scope.loadIsi = function (){
		$scope.showCari = !$scope.showCari ;		
	}

	$scope.getAll=function(){
		getAllCoa();
	};

	$scope.addNew = function (ev){
		openDetilDialog(0,ev);		
	}
	
	$scope.edit = function (id, ev){
		openDetilDialog(id,ev);
	}

	function openDetilDialog(id,ev){
		console.log(id);
		$mdDialog.show({
			controller : 'CoaDetilDetilController',
			templateUrl : 'app/master/coa/coa-detil/coaDetil-detil.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			fullscreen: true,			
			locals: { 
				id: id
			}
		}).then(function(answer){
			//refresh
			getAllCoa();
		},function(jawab){
			//cancel form
		})
	}
	
	function getAllCoa(halaman){	

		if(halaman==undefined){
			halaman = $scope.currentPage;
		}

		var criteriaKode;
		var criteriaNama;
		
	 	if($scope.searchNama===undefined || $scope.searchNama===''){
			criteriaNama='--';
	 	}else{
	 		criteriaNama=$scope.searchNama;	
	 	}

	 	if($scope.searchKode===undefined || $scope.searchKode===''){
			criteriaKode='--';
	 	}else{
	 		criteriaKode=$scope.searchKode;	
	 	}		 	

		coaDtlFactory
			.getCoaDtlByKodeByNamaPage(criteriaKode,criteriaNama, halaman, $scope.itemsPerPage)
			.success(function (data){
			 	$scope.coas = data.content ;
			 	$scope.totalItems = data.totalElements;
			 	$scope.totalPages= data.totalPages;
			 	//growl.addInfoMessage(data.content.length);
			}).error(function(data){
				//growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
			});	
		
	};

	$scope.onPaginate = function(page, limit) {
		console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
		console.log('Page: ' + page + ' Limit: ' + limit);	
	};
	
	$scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/api/coa/laporan', '_blank');
	}

}])