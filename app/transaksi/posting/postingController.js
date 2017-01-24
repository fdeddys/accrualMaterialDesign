appControllers.controller('postingController', 
	['$scope','jurnalHeaderFactory', '$rootScope', '$filter','$routeParams','bukuBesarFactory',
	function($scope,jurnalHeaderFactory, $rootScope,$filter, $routeParams , bukuBesarFactory){
	
	$scope.jurnals=[];	
	$scope.search='';

	var is_JurnalPengeluaran ;	
	$scope.jenisVouchers=[];
	

	function startModule(){	
		$scope.totalItems=0;
		$scope.itemsPerPage= 10;
		$scope.currentPage = 1;

		$scope.tgl1 = new Date();
		$scope.tgl2 = new Date();

		is_JurnalPengeluaran = $routeParams.isJurnalPengeluaran;
		//console.log("isi is_JurnalPengeluaran " + $scope.is_JurnalPengeluaran );
		if(is_JurnalPengeluaran==='true'){
			$scope.jenisVouchers=['PENGELUARAN'];
		}else{
			$scope.jenisVouchers=['PENERIMAAN','PEMINDAHAN'];
		}
		$scope.jenisVouch = $scope.jenisVouchers[0];
		getAllJurnal();

	}

	$scope.getAll=function(){
		getAllJurnal();
	};

	function getAllJurnal(){					
	
		var jenisVouc1;
			
		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');
		halaman = $scope.currentPage;
		//var idUser = $rootScope.globals.currentUser.authdata;
		if(is_JurnalPengeluaran==='true'){
			jenisVouc1=1;
		}else{
			if($scope.jenisVouch=="PENERIMAAN"){
				jenisVouc1=0;
			}else{
				jenisVouc1=2;
			}			
		}
		//.getJurnalHeaderByPageByTgl(idUser, halaman, $scope.itemsPerPage, vTgl1, vTgl2,$scope.cariStatus) //userIdLogin

		//if($scope.searchNoUrut===''  && $scope.searchNoVoucher==='' ){

		 	jurnalHeaderFactory
		 		.listVoucherBelumPosting(vTgl1, vTgl2, jenisVouc1,  halaman, $scope.itemsPerPage)
				.success(function (data){
				 	$scope.jurnalHeaders = data.content ;
				 	$scope.totalItems = data.totalElements;
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});	
		
	};

	$scope.posting=function(idHdr){		
		if($scope.isJurnalPengeluaran==true){
			// validasi jurnal pengeluaran

			//  BATAL harus saat approve
			// jurnalHeaderFactory
			// 	.validasiVouchPengeluaran(idHdr)
			// 	.then(function(response){
			// 		if(response.data.status=="OK"){
			// 			//refresh
			// 			getAllJurnal($scope.currentPage);
			// 		}else{
			// 			growl.addWarnMessage(response.data.status);
			// 		}
			// 	})

			// masuk Buku Besar
			bukuBesarFactory
				.postingTrial(idHdr)
				.then(function(response){
					getAllJurnal($scope.currentPage);
				})

		}else{
			// posting jurnal penerimaan pemindahan
			// masuk Buku Besar
			bukuBesarFactory
				.postingTrial(idHdr)
				.then(function(response){
					getAllJurnal($scope.currentPage);
				})
		}

		// if(noVoucher==null){
		// 	growl.addWarnMessage("No Voucher belum diisi !!")
		// }else{
		// }
	};

	startModule();

	
}])