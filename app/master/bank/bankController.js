appControllers.controller('bankController', 
	['$scope','bankFactory', '$window','$rootScope','$mdDialog','focus',
	function($scope,bankFactory, $window, $rootScope, $mdDialog, focus){

	$scope.banks=[];
	
	
	$scope.search='';	
	$scope.showCari = false;

	$scope.jenisTransaksi;
	// Paging
	$scope.totalItems=0;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;
	$scope.totalPages=0;

	getAllBank($scope.currentPage);

	$scope.loadIsi = function (){
		$scope.showCari = !$scope.showCari ;		
		focus('idCari');
	}

	$scope.getAll=function(){
		getAllBank();
	};

	$scope.addNew = function (ev){
		openDetilDialog(0,ev);		
	}
	
	$scope.edit = function (id, ev){
		openDetilDialog(id,ev);
	}

	function openDetilDialog(id,ev){
		$mdDialog.show({
			controller : 'bankDetilController',
			templateUrl : 'app/master/bank/bankDetil.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			fullscreen: true,
			locals: { 
				id: id
			}
		}).then(function(answer){
			//refresh
			getAllBank();
		},function(jawab){
			//cancel form
		})
	}
	
	function getAllBank(halaman){		
		if(halaman==undefined){
			halaman = $scope.currentPage;
		}
		$scope.criteriaNama;
			
		if($scope.search==='' ){
		 	bankFactory
				.getAllBank(halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.banks = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	$scope.totalPages= data.totalPages;
				 	//growl.addInfoMessage(data.content.length);
				}).error(function(data){
					//growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		 }else{
		 	
		 	if($scope.search===''){
				criteriaNama='--';
		 	}else{
		 		criteriaNama=$scope.search;	
		 	}

			bankFactory
				.getBankByKodeByNamaPage("--",criteriaNama, halaman, $scope.itemsPerPage)
				.success(function (data){
				 	$scope.banks = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	$scope.totalPages= data.totalPages;
				 	//growl.addInfoMessage(data.content.length);
				}).error(function(data){
					//growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		 }	
		
	};

	$scope.onPaginate = function(page, limit) {
		console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
		console.log('Page: ' + page + ' Limit: ' + limit);	
	};
	
	$scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/api/bank/laporan', '_blank');
	}

}])