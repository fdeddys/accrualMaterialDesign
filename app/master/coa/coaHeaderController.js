appControllers.controller('coaHeaderController', 
	['$scope','coaHdrFactory', '$window','$rootScope','$mdDialog','focus',
	function($scope,coaHdrFactory, $window, $rootScope, $mdDialog, focus){

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
		focus('idCariKode');	
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
			controller : 'coaHeaderDetilController',
			templateUrl : 'app/master/coa/coaHeader-detil.html',
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
			
		// if($scope.search==='' ){
		//  	coaHdrFactory
		// 		.getAllCoa(halaman,$scope.itemsPerPage)
		// 		.success(function (data){
		// 		 	$scope.coas = data.content ;
		// 		 	$scope.totalItems = data.totalElements;
		// 		 	$scope.totalPages= data.totalPages;
		// 		 	//growl.addInfoMessage(data.content.length);
		// 		}).error(function(data){
		// 			//growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
		// 		});	
		//  }else{
		 	//console.log("isi $scope.searchNama =" + $scope.searchNama);
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

			coaHdrFactory
				.getCoaHdrByKodeByNamaPage(criteriaKode,criteriaNama, halaman, $scope.itemsPerPage)
				.success(function (data){
				 	$scope.coas = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	$scope.totalPages= data.totalPages;
				 	//growl.addInfoMessage(data.content.length);
				}).error(function(data){
					//growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		// }	
		
	};

	$scope.onPaginate = function(page, limit) {
		console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
		console.log('Page: ' + page + ' Limit: ' + limit);	
	};
	
	$scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/api/accountDtl/laporan', '_blank');
	}

}])