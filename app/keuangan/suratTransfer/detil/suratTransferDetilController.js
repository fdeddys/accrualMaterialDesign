appControllers.controller('suratTransferDetilController', 
	['$scope','suratTransferFactory','$filter','$rootScope','focus','bankFactory',
	'$routeParams','$window', '$mdDialog','$location','$q',
	function($scope, suratTransferFactory, $filter,$rootScope, focus, bankService, 
  	$routeParams , $window, $mdDialog, $location, $q){
	
	var userIdLogin;

	$scope.suratTransfers=[];	
	$scope.ipServer=$rootScope.pathServerJSON;
	$scope.isTransApproved = false;

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage = 8;
	$scope.currentPage = 1;  	
	$scope.tglSurat;

    function getAllBank(){
    	bankService
    		.getAllNonKasBank(1,1000)
    		.then(function(response){
    			$scope.banks = response.data.content;  
    			if(response.data.totalElements>1){
    				$scope.bankSelected = $scope.banks[0];
    			}  		
    		})
    }
	
    $scope.hapusDetil = function( idDetil){
    	suratTransferFactory
    		.delDtById(idDetil)
    		.then(function(data){
    			getAllDetil()
    		})
    }

    $scope.transaksiBaru = function(){

		$scope.today();		

		$scope.suratTransferHd={
			id: null,				
			bank: null,
			tglSurat: null,
			noApprove: null,
			noCek: null,
			isApprove: false,
			userUpdate: null,
			lastUpdate: null,
			total: 0
		};

		$scope.suratTransferDts=[];				
		$scope.currentPage = 1;
		$scope.bankSelected = $scope.banks[0];		
		$scope.isTransApproved = false;

    }

    $scope.preview = function(){
		$window.open($rootScope.pathServerJSON + '/api/suratTransfer/report/'+$scope.suratTransferHd.id, '_blank'); 
    }


    $scope.saveHeader = function (){
    	var deferred = $q.defer();

    	var vTgl = $filter('date')($scope.tglSurat,'yyyy-MM-dd');
    	var idUser = $rootScope.globals.currentUser.authdata;


    	var SuratTransferHdDto={
    		'id':'',
    		// 'customerId':$scope.supplierSelected.id,
    		'bankId':$scope.bankSelected.id,
    		'tglSurat':vTgl,
    		'noApprove':$scope.suratTransferHd.noApprove,
    		'noCek':$scope.suratTransferHd.noCek,
    		'userUpdate':idUser
    	}
		

		if($scope.suratTransferHd.id!==null){
			SuratTransferHdDto.id=$scope.suratTransferHd.id;
		}

		suratTransferFactory
			.saveHd(SuratTransferHdDto)
			.then(function(response){
				$scope.suratTransferHd = response.data;
				deferred.resolve('sukses');
			},function(err){
				deferred.reject("Error " + err);
			})
		return deferred.promise;;

    }

    $scope.approve = function( ){
    	var idHd = $scope.suratTransferHd.id;
    	var idUser = $rootScope.globals.currentUser.authdata;
    	//alert('lom selesai');
    	suratTransferFactory
    		.approve(idHd, idUser)
    		.success(function(data){
    			$scope.suratTransferHd = data;
    		})
    }

    $scope.tarikJurnal = function(ev){

		var openDialog = false;
    	
    	if($scope.suratTransferHd.id==null){
    		var deferred = $scope.saveHeader()
    			.then(function(data){
		    		openDialogTarikJurnal(ev);
    			},function(err){
    				
    			})
    	}else{
    		openDialogTarikJurnal(ev);
    	}
    }    

    function openDialogTarikJurnal(ev){
			    	
    	$mdDialog.show({
			templateUrl : 'app/keuangan/suratTransfer/detil/tarikData/tarikData.html',
			controller : 'tarikDataController',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			fullscreen: true,
			locals: { 
				idBank: $scope.bankSelected.id,
				namaBank: $scope.bankSelected.nama,
				idHdSuratTransfer:$scope.suratTransferHd.id
			}			
		}).then(function(answer){
			//refresh
			//getAllBagian();
			getAllDetil();
		},function(jawab){
			//cancel form
			getAllDetil();
		})    		    	
    }

	// tanggal
	$scope.today = function() {
    	$scope.tglSurat = new Date();	    	
	};
	
	// END tanggal

	$scope.toListSuratTransfer = function() {
		$location.path('/suratTransfer'); 
	}


	function getAllDetil(){
		suratTransferFactory
			.getDtByIdHd($scope.suratTransferHd.id, $scope.currentPage, $scope.itemsPerPage  )
			.then(function(response){
				$scope.suratTransferDts = response.data.content;
			})
	}

	function startModule(){

		$scope.today();		
		$scope.bankSelected;
		//$scope.supplierSelected;
		getAllBank();
		userIdLogin=$rootScope.globals.currentUser.authdata;		

		var idHD=$routeParams.id;

		if(idHD == 'new'){

			$scope.suratTransferHd={
				id: null,				
				bank: null,
				tglSurat: null,
				noApprove: null,
				noCek: null,
				isApprove: false,
				userUpdate: null,
				lastUpdate: null,
				total: 0
			}
		}else{
			$scope.suratTransferHd ={};
			suratTransferFactory
				.getHdById(idHD)
				.success(function(data){
					$scope.suratTransferHd = data;
					$scope.tglSurat =new Date($scope.suratTransferHd.tglSurat ) ;
					$scope.bankSelected = $scope.suratTransferHd.bank;					
					// $scope.supplierSelected = $scope.suratTransferHd.customer;
					$scope.isTransApproved = $scope.suratTransferHd.isApprove;
					getAllDetil();
				})

		}
		focus('noCek');

	};

	startModule();	

	

}])