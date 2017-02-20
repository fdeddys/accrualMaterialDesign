appControllers.controller('direktoratController', 
	['$scope','direktoratFactory','growl', '$window','$rootScope','focus','$mdDialog',
	function($scope,direktoratFactory, growl, $window, $rootScope, focus,$mdDialog){
	// 
	var idx=0;
	
	$scope.classForm='';
	$scope.direktorats=[];
	$scope.orderDirektorat='kode';
	
	$scope.search='';	
	$scope.showCari = false;

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	

	getAllDirektorat();

	$scope.loadIsi = function (){
		$scope.showCari = !$scope.showCari ;	
		if($scope.showCari == true){
			focus('idCari');			
		}else{
			$scope.search='';			
			getAllDirektorat();
		}
	}

	$scope.getAll=function(){
		getAllDirektorat();
	};

	$scope.addNew = function (ev){
		openDetilDialog(0,ev);		
	}
	
	$scope.edit = function (id, ev){
		openDetilDialog(id,ev);
	}

	function openDetilDialog(id,ev){
		$mdDialog.show({
			controller : 'direktoratDetilController',
			templateUrl : 'app/master/direktorat/direktoratDetil.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			locals: { 
				id: id
			}
		}).then(function(answer){
			//refresh
			getAllDirektorat();
		},function(jawab){

		})

	}
	

	function getAllDirektorat(){
		//alert('get all kode arsip');
		//console.log($scope.search);
		if($scope.search===''){
			direktoratFactory
				.getAllDirektorat()
				.success(function (data){
				 	$scope.direktorats = data ;				 					 	
				}).error(function(data){
					growl.addWarnMessage("Error `oading getAll data !",{ttl: 4000});		
				});				
		}else{
			direktoratFactory
				.getDirektoratByNama($scope.search )
				.success(function (data){
				 	$scope.direktorats = data ;				 	
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama !",{ttl: 4000});		
				});					
		}
		
	};

	$scope.urut=function(urut_berdasar){
		$scope.orderDirektorat=urut_berdasar;		
	};

	// $scope.hapusDirektorat=function(id, urut){
	// 	$scope.jenisTransaksi=3;
	// 	$scope.tutupGrid = !$scope.tutupGrid;
	// 	$scope.classForm = 'formHapus';
	// 	idx=urut;
	// 	direktoratFactory
	// 		.getDirektoratById(id)
	// 		.success(function(data){
	// 			$scope.direktorat =data;				
	// 		});
		
	// 	growl.addInfoMessage(urut);		
	// };

	
	$scope.tutupDetil=function(){
		$scope.tutupGrid = !$scope.tutupGrid;
	};

	$scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/api/direktorat/laporan', '_blank');
	}

}])