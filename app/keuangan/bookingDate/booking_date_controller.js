appControllers.controller('bookDateController', 
	['$scope','jurnalHeaderFactory', '$window','$rootScope', '$filter','statusVoucherFactory',
	'$location','$mdDialog','$mdToast','jurnalDetilFactory','bookingDateService','$mdToast',
	function($scope,jurnalHeaderFactory, $window, $rootScope,$filter, statusVoucherFactory, 
		$location, $mdDialog, $mdToast,jurnalDetilFactory, bookingDateService,$mdToast ){
	
	$scope.jurnals=[];
	
	$scope.search='';	
	$scope.showCari = false;

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	
	// Paging

	function startModule(){
		//getAllStatusVoucher();
		$scope.totalItems=0;
		$scope.itemsPerPage= 10;
		$scope.currentPage = 1;

		$scope.tgl1 = new Date();
		$scope.tgl2 = new Date();
		getAllJurnal();
	}

	$scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };


	$scope.loadIsi = function (){
		$scope.showCari = !$scope.showCari ;		
	}

	$scope.getAll=function(){
		getAllJurnal();
	};

	$scope.proses = function(tglBook, idJurnalHd){

		if(tglBook == undefined){
			$mdToast.show(	
				$mdToast.simple()
					.textContent('Invalid Date Format / Tanggal belum diisi !! ' )
					.position("bottom left")
					.hideDelay(5000)
				);			
		}else{
			var vTgl = $filter('date')(tglBook,'yyyy-MM-dd');
	    	bookingDateService
	    		.updateBookingDate(vTgl,idJurnalHd)
	    		.then(function(response){
	    			var respon = angular.fromJson(response.data);
	    			//$scope.isiJurnalHeader.noVoucher=hasil;
	    			//$scope.jurnalHeaders[idxUbah]=$scope.isiJurnalHeader;
	    			// $scope.tutupGrid=!$scope.tutupGrid
	    			
	    			if(respon.hasil=='OK'){
	    					// pesan ="delete success"
	    			// 		$mdToast.show(	
								// $mdToast.simple()
								// 	.textContent("Proses success ... ")
								// 	.position("top right")
								// 	.hideDelay(2000)
								// );
	    			// 		getAllJurnal(1);
	    					jurnalHeaderFactory
	    						.getJurnalById(idJurnalHd)
	    						.success(function(data){
	    							var jurnal = data;
	    							var confirm = $mdDialog.confirm()
								          .title('Booking date input Success !! ')
								          .textContent(jurnal.noVoucher)
								          .ariaLabel('Lucky day')
								          .targetEvent(null)
								          .ok('OK')
								          .cancel('tutup');;								          

								    $mdDialog.show(confirm).then(function() {
								      console.log('ok');
								      getAllJurnal(1);
								    }, function() {
								      console.log('cancel');
								      getAllJurnal(1);
								    })
	    						})
	    				}else{
		    				$mdToast.show(	
								$mdToast.simple()
									.textContent(respon.hasil )
									.position("top right")
									.hideDelay(5000)
								);		    					
	    				}
	    		})
			// console.log(tglBook);			
		}
	}	
	$scope.openDetil = function(ev, idJurnal){

		$mdDialog.show({
			controller : 'bookDateDetilController',
			templateUrl : 'app/keuangan/bookingDate/detil/booking_date_detil.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			fullscreen: true,
			locals: { 
				id: idJurnal
			}
		}).then(function(answer){
			//refresh
			
		},function(jawab){
			//cancel form
		})
	}

	// $scope.addNew = function (ev){
	// 	//openDetilDialog(0,ev);	
	// 	$location.path('/jurnalDetil/new'); 
	// }
	
	// $scope.edit = function (id){
	// 	//openDetilDialog(id,ev);
	// 	$location.path('/jurnalDetil/'+id); 
	// }

	// $scope.cetakJurnal = function(id){
	// 	$window.open($rootScope.pathServerJSON + '/api/transaksi/jurnalDetil/voucher/'+id, '_blank');
	// }

	// $scope.deleteFisikVouc = function(id, $event){

	// 	var konfirmasi = $mdDialog.confirm()
	// 		.title('Konfirmasi')
	// 		.textContent('Apakah anda yakin akan menghapus data ini ['+id+'] ?? ')
	// 		.ariaLabel('konfirmasi')
	// 		.targetEvent($event)
	// 		.ok('OK')
	// 		.cancel('Batal');

	// 	$mdDialog.show(konfirmasi)
	// 		.then(function(){
	// 			jurnalHeaderFactory
	//     			.delete(id)
	//     			.then(function(response){	
	//     				$mdToast.show(	
	// 						$mdToast.simple()
	// 							.textContent('delete success ...' )
	// 							.position("top right")
	// 							.hideDelay(2000)
	// 						);												
	// 					getAllJurnal(); 						
	//     			})
	// 		},function(){
	// 	    	$mdToast.show(	
	// 				$mdToast.simple()
	// 					.textContent('delete batal...' )
	// 					.position("top right")
	// 					.hideDelay(2000)
	// 				);	
	// 			// console.log('batal hapus ')
	// 		})
	// }

	// function getAllStatusVoucher(){
			
	// 	statusVoucherFactory
	// 		.getAllStatus()
	// 		.success(function(data){					
	// 			$scope.statusVouchers=data;	
	// 			$scope.statusVouchers.push("ALL");	
	// 			$scope.statusVoucher=$scope.statusVouchers[0];					
	// 		})
	// 		.error(function(data){
	// 			growl.addWarnMessage('Error loading status vouchers ');
	// 		})	
	// }

	function getAllJurnal(){			
		//console.log($scope.tgl1);
		//console.log($scope.tgl2);
		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');



		jurnalDetilFactory
			.listVouchInputBook(vTgl1, vTgl2, $scope.currentPage, $scope.itemsPerPage)
			.then(function(response){
				$scope.jurnalHeaders = response.data.content;
				$scope.totalItems = response.data.totalElements;
			},function(error){

			})

		// if(($scope.searchNoUrut=='' || $scope.searchNoUrut == undefined ) && 
		// 	($scope.searchNoVoucher=='' || $scope.searchNoVoucher== undefined )){
		//  	jurnalHeaderFactory
		// 		.getJurnalHeaderByPageByTgl(idUser, $scope.currentPage, $scope.itemsPerPage, vTgl1, vTgl2,statusVouch) //userIdLogin
		// 		.success(function (data){
		// 		 	$scope.jurnalHeaders = data.content ;
		// 		 	$scope.totalItems = data.totalElements;
		// 		 	//growl.addInfoMessage(data.content.length);
		// 		}).error(function(data){
		// 			growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
		// 		});	
		//  }else{
		 	
		//  	if($scope.searchNoUrut===''){
		// 		criteriaKode='-';
		//  	}else{
		//  		criteriaKode=$scope.searchNoUrut;	
		//  	}

		//  	if($scope.searchNoUrut===''){
		// 		criteriaNama='-';
		//  	}else{
		//  		criteriaNama=$scope.searchNoUrut;	
		//  	}

		// 	jurnalHeaderFactory
		// 		.getJurnalHeaderByKodeByNamaPage(criteriaKode, criteriaNama, $scope.currentPage, $scope.itemsPerPage, $scope.cariStatus)
		// 		.success(function (data){
		// 		 	$scope.jurnalHeaders = data.content ;
		// 		 	$scope.totalItems = data.totalElements;
		// 		 	//growl.addInfoMessage(data.content.length);
		// 		}).error(function(data){
		// 			growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
		// 		});	
		//  }	
		
	};

	startModule();

	
}])