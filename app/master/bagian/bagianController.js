appControllers.controller('bagianController', 
	['$scope','bagianFactory', '$window','$rootScope','focus','$mdDialog',
	function($scope,bagianFactory, $window, $rootScope, focus,$mdDialog){

	var idx=0;
	$scope.bagians=[];
	
	
	$scope.search='';	
	$scope.showCari = false;

	$scope.jenisTransaksi;
	// Paging
	$scope.totalItems=0;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;
	$scope.totalPages=0;

	getAllBagian($scope.currentPage);

	$scope.loadIsi = function (){
		$scope.showCari = !$scope.showCari ;	
		if($scope.showCari == true){
			focus('idCari');			
		}else{
			$scope.search='';			
			getAllBagian();
		}
		// focus('idCari');	
	}

	$scope.getAll=function(){
		getAllBagian();
	};

	$scope.addNew = function (ev){
		openDetilDialog(0,ev);		
	}
	
	$scope.edit = function (id, ev){
		openDetilDialog(id,ev);
	}

	function openDetilDialog(id,ev){
		$mdDialog.show({
			controller : 'bagianDetilController',
			templateUrl : 'app/master/bagian/bagianDetil.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			fullscreen: true,
			locals: { 
				id: id
			}
		}).then(function(answer){
			//refresh
			getAllBagian();
		},function(jawab){
			//cancel form
		})
	}
	
	function getAllBagian(halaman){		
		if(halaman==undefined){
			halaman = $scope.currentPage;
		}
		$scope.criteriaNama;
			
		if($scope.search==='' ){
		 	bagianFactory
				.getAllBagianPage(halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.bagians = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	$scope.totalPages= data.totalPages;
				 	//growl.addInfoMessage(data.content.length);
				}).error(function(data){
					//growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		 }else{
		 	
		 	if($scope.search===''){
				criteriaNama='-';
		 	}else{
		 		criteriaNama=$scope.search;	
		 	}

			bagianFactory
				.getBagianByNamaPage(criteriaNama, halaman, $scope.itemsPerPage)
				.success(function (data){
				 	$scope.bagians = data.content ;
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

	$scope.urut=function(urut_berdasar){
		$scope.orderDirektorat=urut_berdasar;		
	};
	
	$scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/api/bagian/laporan', '_blank');
	}

}])