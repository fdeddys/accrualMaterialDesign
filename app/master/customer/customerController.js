appControllers.controller('customerController', 
	['$scope','customerFactory', '$window','$rootScope','focus','$location',
	function($scope,customerFactory, $window, $rootScope, focus,$location){

	var idx=0;
	$scope.customers=[];
	
	
	$scope.search='';	
	$scope.showCari = false;

	$scope.jenisTransaksi;
	// Paging
	$scope.totalItems=0;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

	getAllCustomer($scope.currentPage);

	$scope.loadIsi = function (){
		$scope.showCari = !$scope.showCari ;		
	}

	$scope.getAll=function(){
		getAllCustomer();
	};

	$scope.addNew = function (){
		openDetilDialog(0);		
	}
	
	$scope.edit = function (id){
		openDetilDialog(id);
	}

	function openDetilDialog(id){
		 $location.path('/masterCustomerDetil/'+id); 
		// $mdDialog.show({
		// 	controller : 'customerDetilController',
		// 	templateUrl : 'app/master/customer/customerDetil.html',
		// 	parent : angular.element(document.body),
		// 	targetEvent : ev,
		// 	clickOutsideToClose : true,
		// 	fullscreen: true,
		// 	locals: { 
		// 		id: id
		// 	}
		// }).then(function(answer){
		// 	//refresh
		// 	getAllCustomer();
		// },function(jawab){
		// 	//cancel form
		// })
	}
	
	function getAllCustomer(halaman){		
		if(halaman==undefined){
			halaman = $scope.currentPage;
		}
		$scope.criteriaNama;
			
		if($scope.search==='' ){
		 	customerFactory
				.getCustomerByPage(halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.customers = data.content ;
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

			customerFactory
				.getCustomerByNamaPage(criteriaNama, halaman, $scope.itemsPerPage)
				.success(function (data){
				 	$scope.customers = data.content ;
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

	// $scope.urut=function(urut_berdasar){
	// 	$scope.orderDirektorat=urut_berdasar;		
	// };
	
	$scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/api/customer/laporan', '_blank');
	}

}])