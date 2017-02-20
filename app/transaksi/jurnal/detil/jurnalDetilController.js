appControllers.controller('jurnalDetilController', 
	['$scope','jurnalHeaderFactory', '$window','$rootScope', '$filter','$location','$window',
	'jurnalDetilFactory','$mdToast','coaDtlFactory','bankFactory','bagianFactory','accrualConfigFactory',
	'$routeParams','customerFactory','focus','$location','$q','$mdDialog',
	function($scope,jurnalHeaderFactory, $window, $rootScope,$filter, $location,$window,
		jurnalDetilFactory, $mdToast,coaDtlFactory,bankFactory,bagianFactory, accrualConfigFactory,
		$routeParams,customerFactory,focus, $location,$q, $mdDialog ){
	
	//Variabel
	var jumlahMaxRecord;
	var lastDesc;	
	var lastDuit=0;
	var editData=false;
	var lastCust=null;
	var lastCoa = null;

	//untuk cek kalo kas bank di kredit wajib isi customer
	var coaBank;
	var coaKas;

	var customers=[];

	// hide isi detil
	$scope.SimpanIsiDetil=true;
	
	// Edit Detil
	$scope.editDetil=false;

	// agar Jenis voucher tidak bisa diisi
	$scope.headerAda =false;

	$scope.jenisVouchers=['PENERIMAAN', 'PENGELUARAN', 'PEMINDAHAN'];
	$scope.dks=['D','K'];

	// untuk hitung total debet / kredit di bawah
	$scope.totalDebet=0;
	$scope.totalKredit=0;

	//untuk iterate display grid
	$scope.jurnalDetils;
	$scope.coaDetils;
	$scope.banks;
	$scope.bagians=[];

	// untuk tampilan di UI berupa tombol
	// DISPLAY
	// ADD
	// EDIT
	// APPROVED
	$scope.StatusData='DISPLAY';

	// untuk enable / disable object
	
	$scope.disableDibayarKe=true;

	// approved
	$scope.approved=false;

	$scope.jurnalHeader={		
		id: 0,
		noUrut: '-',
		issueDate: '',
		bookingDate: '',
		noVoucher: '-',
		diBayar: '',
		statusVoucher: 'UNPOSTING',
		jenisVoucher: null,
		user: '1'
	};

	$scope.jurnalDetil={
		id: null,
		jurnalHeader: null,
		accountDetil: null,
		bagian: null,
		keterangan: null,
		debet: null,
		kredit: null,
		bank: null,
		rel: null,
		customer: null,
		dk:'D',
		jumlah:null,
		tipeVoucher:null
	};

	// ENABLE bank - rel - cust
	$scope.enableBank=false;
	$scope.enableRel=false;
	$scope.enableCust=false;

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 25;
	$scope.currentPage = 1;
	$scope.classWarnaJenisJurnal;
	
	function bacaConfig(){
		accrualConfigFactory
			.getConfig()
			.success(function(data){
				jumlahMaxRecord=data.jumlahMaxVoucher;
				coaBank=data.coaBank;
				coaKas=data.coaKas;
			})
	};

	function today(){
		$scope.tglBooking= new Date();
		$scope.tglIssue = new Date();
	}

	function startModule(){

		// untuk tanda = di keterangan
		lastDesc='';
		lastDuit=0;
		$scope.kondisiView=true;
		today();
		$scope.classWarnaJenisJurnal = "classPENERIMAAN";
		$scope.jurnalHeader.jenisVoucher="PENERIMAAN";
		getAllCoaDetil();
		getAllBank();
		getAllBagian();
		// default max record pada display 25 jika baca config gagal
		jumlahMaxRecord=25;
		bacaConfig();
		// Cek pengirim
		var param=$routeParams.idDetil;
		if(param==='new'){			
			$scope.kondisiView=false;	
			$scope.transaksiBaru();
			return;
		}else{
			
			//alert($routeParams.idDetil);	
			//
			jurnalHeaderFactory
				.getJurnalHeaderByJurnalIdByUserId($routeParams.idDetil,$rootScope.globals.currentUser.authdata)
				.success(function(data){
					//alert(data);
					if(data==''){
						//alert('data tidak ketemu');
						$location.path('/');
					}else{				
						$scope.jurnalHeader=data;						
						$scope.jurnalHeader.issueDate= new Date($scope.jurnalHeader.issueDate);

						//console.log('get by id ' + data.issueDate);
						getAllDetil();
						$scope.StatusData=data.statusVoucher;	
						$scope.kondisiView=false;	
						$scope.headerAda =true;
						if($scope.StatusData =='UNPOSTING'){
							$scope.kondisiView=false;	
							$mdToast.show(
								$mdToast.simple()
									.textContent('UNPOSTING !!!')
									.position("top right")
									.hideDelay(3000)
								);
							// growl.addWarnMessage('UNPOSTING');
						}else{
							$mdToast.show(	
								$mdToast.simple()
									.textContent('NOT UNPOSTING !!!')
									.position("top right")
									.hideDelay(3000)
								);
							// growl.addWarnMessage('NOT UNPOSTING');
							$scope.kondisiView=true;	
						}
						$scope.classWarnaJenisJurnal = "class"+$scope.jurnalHeader.jenisVoucher;
						// growl.addInfoMessage('Voucher approved');   					
						
					}					
				})
				.error(function(data){
					//alert('gagal get jurnal header');				
				})				
		}						
	};
	
	function getAllCoaDetil(){
		coaDtlFactory
			.getCoaAktifDtlByKodePage('--',1,15)
			.success(function(data){
				$scope.coaDetils = data.content;
			})
			.error(function(data){
				$mdToast.show(	
					$mdToast.simple()
						.textContent('error loading coa !!!')
						.position("top right")
						.hideDelay(3000)
					);
				// growl.addWarnMessage("error loading coa ");	
			})
	};

	function getAllBagian(){
		bagianFactory
			.getAllBagianAktifPage(1,1000)
			.success(function(data){
				$scope.bagians = data.content;
			})
			.error(function(data){
				$mdToast.show(	
					$mdToast.simple()
						.textContent('error loading bagian !!!')
						.position("top right")
						.hideDelay(3000)
					);
				// growl.addWarnMessage("error loading bagian ");	
			})
	};

	function getAllBank(){
		
		bankFactory
			.getAllActiveBank(1,1000)
			.success(function(data){
				$scope.banks = data.content;
				// growl.addInfoMessage('get bank success');	
			})
			.error(function(data){
				$mdToast.show(	
					$mdToast.simple()
						.textContent('error loading bank  !!!')
						.position("top right")
						.hideDelay(3000)
					);
				// growl.addWarnMessage("error loading bank ");	
			})
	};

	$scope.loadBanks = function(){
		return $scope.banks;
		// return bankFactory
		// 	.getAllBank(1,1000)
		// 	.success(function(data){
		// 		return  data.content;
		// 		// growl.addInfoMessage('get bank success');	
		// 	})
		// 	.error(function(data){
		// 		$mdToast.show(	
		// 			$mdToast.simple()
		// 				.textContent('error loading bank  !!!')
		// 				.position("top right")
		// 				.hideDelay(3000)
		// 			);
		// 		// growl.addWarnMessage("error loading bank ");	
		// 	})
	}

	$scope.toListJurnal = function(){
		 $location.path('/jurnal'); 
	}

	$scope.getBagianByKode = function(searchText){
		if(searchText==''){
			return false;
		}
		return bagianFactory
				.getBagianByKodeAktifPage(searchText, 1, 8)
				.then(function(response){
					//console.log('load http' + response.data.nama); 
					bagians=[];
					angular.forEach(response.data.content, function(item){
		                bagians.push(item);		                
		            });
					return bagians;
				})			
	}

	$scope.getCoaByNama = function(cari){

		return coaDtlFactory
				.getCoaDtlByNamaPage(cari, 1, 10, true)
				.then(function(response){
					//console.log('load http' + response.data.nama); 
					coas=[];
					angular.forEach(response.data.content, function(item){
		                coas.push(item);		                
		            });
					return coas;
				})
    };

    $scope.getCoaDtlByKode = function(cari){

    	if(cari=="="){
			//console.log("last cust = " + lastCust );
			//$scope.jurnalDetil.customer=lastCust;	
			var coas=[];	           
			coas.push(lastCoa);
			//console.log("scope customer = " + $scope.jurnalDetil.customer );
	        return coas;			
		}else{

	    	if(cari==''){
	    		cari='--'
	    	}

			return coaDtlFactory
					.getCoaAktifDtlByKodePage(cari, 1, 15)
					.then(function(response){
						//console.log('load http' + response.data.nama); 
						var coas=[];
						angular.forEach(response.data.content, function(item){
			                coas.push(item);		                
			            });
						return coas;
					})
		}

    };    

	$scope.cekLastDesc=function(keyEvent){
		// alert('cek last desc');
		//console.log(keyEvent);

		if($scope.jurnalDetil.keterangan=='='){
	    	$scope.jurnalDetil.keterangan=lastDesc;
		 }
	};

	$scope.cekLastJumlah=function(keyEvent){
		// alert('cek last desc');
		

		if($scope.jurnalDetil.jumlah=='0'){
			//console.log("get last duit =" );
	    	$scope.jurnalDetil.jumlah=lastDuit;
		 }else{
		 	//console.log("get last duit " +$scope.jurnalDetil.jumlah);
		 }
	};	

	// lost focus coa
	$scope.myFunct = function(keyEvent, idx) {

		// *)JURNAL PENGELUARAN  ==> customer harus ENABLE
		if($scope.selectedCoa===null){			
			return false;	
		}else{
			$scope.enableBank=$scope.selectedCoa.cashBank;
			$scope.enableRel = $scope.selectedCoa.rel;	  	

			// *)JURNAL PENGELUARAN  ==> customer harus ENABLE
			if($scope.jurnalHeader.jenisVoucher==='PENGELUARAN'){
				$scope.enableCust=true;					
			}else{				
				$scope.enableCust=$scope.selectedCoa.cust;
			}
		}

		if($scope.selectedCoa.accountHeader===undefined){			
			return false;	
		}		

		if($scope.selectedCoa.accountHeader.idAccountHdr==undefined){
			//console.log("$scope.jurnalDetil.accountDetil.accountHeader.idAccountHdr===undefined")
			return false;
		}

		if($scope.selectedCoa.accountHeader.kodeBagian==''){
			//console.log("kode bagian = tidak Ada");		
			return	
		}		

		//coaHdrFactory
		//	.getBagianById($scope.jurnalDetil.accountDetil.accountHeader.idAccountHdr)
		bagianFactory
			.getBagianByKodePage($scope.selectedCoa.accountHeader.kodeBagian,1,1)		  	
		  	.success(function(data){
		  		if(data ==='ERROR'){
		  			//KODE not found
		  			$mdToast.show(	
						$mdToast.simple()
							.textContent('kode bagian belum ada  !!!')
							.position("top right")
							.hideDelay(3000)
						);
		  			// growl.addWarnMessage('kode bagian belum ada');
		  		}else{
		  			if(data.length<4){
		  				//kode bagian tidak diisi
		  				//console.log("isi kode bagian = ["+data+"]")
		  				$scope.jurnalDetil.bagian ='';
		  				focus('idBagian');			
		  			}else{
		  				// lancar jaya
		  				//console.log("LANCAR jaya = ["+data.content[0]+"]")
		  				$scope.jurnalDetil.bagian =data.content[0];
		  				$scope.selectedbBagian=data.content[0];
		  				//jurnalDetil.bagian=data;	
		  				focus('txtKeterangan');
		  			};
		  		}
		  		// growl.addInfoMessage('get kode bagian success');	  		
		  	})
		  	.error(function(data){
		  		$mdToast.show(	
					$mdToast.simple()
						.textContent('error get kode bagian  !!!')
						.position("top right")
						.hideDelay(3000)
					);
		  		// growl.addWarnMessage('error get kode bagian');
		  	})	  

	};

	$scope.transaksiBaru=function(){
		//$location.path('/#/transaksiJurnalDetil/new');
		$scope.jurnalHeader={		
			id: 0,
			noUrut: '-',
			issueDate: '',
			bookingDate: '',
			noVoucher: null,
			diBayar: '',
			statusVoucher: 'UNPOSTING',
			jenisVoucher: null,
			user: '1'
		};

		
		getAllDetil();

		lastDesc='';
		lastDuit=0;

		today();	
		$scope.classWarnaJenisJurnal = "classPENERIMAAN";
		$scope.jurnalHeader.jenisVoucher="PENERIMAAN";


		//angular.element('#comboJenis').trigger('focus');	
		//$scope.$broadcast('newItemAdded');	
		
		$scope.disableDibayarKe=true;
		$scope.kondisiView=false;
		$scope.headerAda =false;
		$scope.StatusData='ADD';
		$scope.totalDebet=0;
		$scope.totalKredit=0;
		$scope.SimpanIsiDetil=false;
	
		$scope.tambahDetilNEW();
		focus('idJenisVoucher');
	};

	$scope.cekJenisVoucher=function(){

		$scope.classWarnaJenisJurnal = "class"+$scope.jurnalHeader.jenisVoucher;
		
		if($scope.jurnalHeader.jenisVoucher==='PENGELUARAN'){
			$scope.disableDibayarKe=false;		
			focus('idDibayarKe');
		}else{
			$scope.disableDibayarKe=true;
		}

		//console.log($scope.jurnalHeader.jenisVoucher);
		//style=" background-color:SteelBlue; "
	};

	$scope.tambahDetilNEW=function(){

		$scope.jurnalDetil={
			id: null,
			jurnalHeader: null,
			accountDetil: null,
			bagian: null,
			keterangan: null,
			debet: null,
			kredit: null,
			bank: null,
			rel: null,
			customer: null,
			dk:$scope.dks[0]
		};

		$scope.enableBank=false;
		$scope.enableRel=false;
		$scope.enableCust=false;

		$scope.selectedCoa = null;
		$scope.selectedbBagian =null;
		$scope.jurnalDetil.dk =$scope.dks[0];
		focus('dkSelected');
		//focus("cmbDK");
	}

	$scope.tambahDetil=function($event){		

		// 1) untuk jurnal pemindahan tidak boleh KAS/BANK
		if($scope.jurnalHeader.jenisVoucher==='PEMINDAHAN'){
			if ($scope.selectedCoa.kodePerkiraan == coaKas) {
				$mdToast.show(	
					$mdToast.simple()
						.textContent("Jurnal PEMINDAHAN COA tidak boleh KAS / BANK !")
						.position("bottom right")
						.hideDelay(3000)
					);				
				return false;
			}

			if ($scope.selectedCoa.kodePerkiraan == coaBank) {
				$mdToast.show(	
					$mdToast.simple()
						.textContent("Jurnal PEMINDAHAN COA tidak boleh KAS / BANK !")
						.position("bottom right")
						.hideDelay(3000)
					);				
				return false;
			}
		}
		// 1) END 


		// 2) untuk jurnal pembayaran untuk kredit hanya boleh KAS/BANK
		var validasiVoucPengeluaran =false;
		if($scope.jurnalHeader.jenisVoucher==='PENGELUARAN'){
			if($scope.jurnalDetil.dk == "K"){
				if ($scope.selectedCoa.kodePerkiraan == coaKas) {
					validasiVoucPengeluaran = true									
				}else{				
					if ($scope.selectedCoa.kodePerkiraan == coaBank) {
						validasiVoucPengeluaran = true
					}
				}
			}else{
				validasiVoucPengeluaran =true
			}
		}else{
			validasiVoucPengeluaran =true
		}

		if(validasiVoucPengeluaran == false){
			$mdToast.show(	
				$mdToast.simple()
					.textContent("Jurnal PENGELUARAN pada kredit HARUS KAS / BANK !")
					.position("bottom right")
					.hideDelay(3000)
				);				
			return false;			
		}

		// 2) END


		if($scope.jurnalHeader.id==0){			

			var defHdr = simpanHeader()
				.then(function(success){

					var deffered = simpanDetil($scope.jurnalHeader.id)
						.then(function(){
							//console.log('simpan detil sukses');
							getAllDetil();
							$scope.tambahDetilNEW();	
						},function(error){
							//console.log('Error saving [' + error + '] ')
						})						

				},function(error){
					$mdToast.show(	
						$mdToast.simple()
							.textContent(error)
							.position("bottom right")
							.hideDelay(3000)
						);
					return false;
				})


	
		}
		else{
			 //console.log("jurnal header id == " + $scope.jurnalHeader.id);
			//console.log("tambah detil - issue date == " + $scope.jurnalHeader.issueDate);


			var deffered = simpanDetil($scope.jurnalHeader.id)
				.then(function(){
					//console.log('simpan detil sukses');
					getAllDetil();
					$scope.tambahDetilNEW();	
				},function(error){
					//console.log('Error saving [' + error + '] ')
				})	
			// simpanDetil($scope.jurnalHeader.id);				
		}


		//$('#comboJenis').focus();
		//if(suksesTambahDetil===true){
		//$scope.jurnalHeader.issueDate= new Date($scope.jurnalHeader.issueDate);
		//focus('cmbDK');	
		$event.preventDefault();
		//$scope.tambahDetilNEW();	
		//focus('dkSelected');
		//}
	};

	function simpanHeader(){

		// var deferred = $.defer();
		var deferred = $q.defer();

		if($scope.jurnalHeader.jenisVoucher=='PENGELUARAN'){
			if($scope.jurnalHeader.diBayar=='' || $scope.jurnalHeader.diBayar == null){
				// $mdToast.show(	
				// 	$mdToast.simple()
				// 		.textContent('Di bayarkan kepada belum diisi !!!')
				// 		.position("top right")
				// 		.hideDelay(3000)
				// 	);
				// growl.addWarnMessage("Di bayarkan kepada belum diisi !!")
				deferred.reject("dibayar belum diisi");
				return deferred.promise;
			}
		}

		var wajibIsiCust = false;		

		if($scope.jurnalDetils!==undefined){
			if($scope.jurnalDetils.length>=jumlahMaxRecord){
				// alert('max jumlah data = ' + jumlahMaxRecord);
				// $mdToast.show(	
				// 	$mdToast.simple()
				// 		.textContent('max jumlah data = ' + jumlahMaxRecord)
				// 		.position("top right")
				// 		.hideDelay(3000)
				// 	);
				// growl.addWarnMessage('max jumlah data = ' + jumlahMaxRecord);

				deferred.reject('max jumlah data = ' + jumlahMaxRecord);
				return deferred.promise;				
			}
		};

		if ($scope.selectedbBagian === undefined) {		
			deferred.reject('Bagian belum ada !!');
			return deferred.promise;	
		};

		$scope.jurnalDetil.accountDetil = $scope.selectedCoa;
		if ($scope.jurnalDetil.accountDetil === null) {
			// $mdToast.show(	
			// 	$mdToast.simple()
			// 		.textContent('id coa belum ada !!')
			// 		.position("bottom right")
			// 		.hideDelay(3000)
			// 	);
			// growl.addWarnMessage("id coa belum ada");
			deferred.reject('id coa belum ada !!');
			return deferred.promise;	
		};

		if ($scope.jurnalDetil.accountDetil.length <6) {
			// $mdToast.show(	
			// 	$mdToast.simple()
			// 		.textContent('id coa belum cukup !!')
			// 		.position("top right")
			// 		.hideDelay(3000)
			// 	);
			// // growl.addWarnMessage("id coa belum cukup");
			// return false;
			deferred.reject('id coa belum cukup !!');
			return deferred.promise;	
		};		

		if (!($scope.jurnalDetil.keterangan)) {
			// $mdToast.show(	
			// 	$mdToast.simple()
			// 		.textContent('Keterangan belum diisi !!')
			// 		.position("top right")
			// 		.hideDelay(3000)
			// 	);
			// // growl.addWarnMessage("Keterangan belum diisi")
			// return false;
			deferred.reject('Keterangan belum diisi !!');
			return deferred.promise;	
		};

		if (isNaN($scope.jurnalDetil.jumlah)) {
			// $mdToast.show(	
			// 	$mdToast.simple()
			// 		.textContent('Jumlah harus angka !!')
			// 		.position("top right")
			// 		.hideDelay(3000)
			// 	);
			// // growl.addWarnMessage("Jumlah harus angka")
			// return false;

			deferred.reject('Jumlah harus angka  !!');
			return deferred.promise;	
		};


		//VALIDASI CASH Bank
		if($scope.jurnalDetil.accountDetil.cashBank == true ){
			//var instanceof something
			//console.log(typeof($scope.jurnalDetil.bank));
			//return true;
			if (!($scope.jurnalDetil.bank !== null && typeof $scope.jurnalDetil.bank === 'object')){
				// $mdToast.show(	
				// 	$mdToast.simple()
				// 		.textContent('Kas bank belum di isi !!')
				// 		.position("top right")
				// 		.hideDelay(3000)
				// 	);
				// // growl.addWarnMessage("Kas bank belum di isi !!")
				// return false;

				deferred.reject('kas bank harus di isi / salah pilih kas bank !!');
				return deferred.promise;	
			}			
		}
		//console.log('491');
		//VALIDASI rel
		if($scope.jurnalDetil.accountDetil.rel == true ){
			if($scope.jurnalDetil.rel == null ){
				// $mdToast.show(	
				// 	$mdToast.simple()
				// 		.textContent('Rel belum di isi !!')
				// 		.position("top right")
				// 		.hideDelay(3000)
				// 	);
				// // growl.addWarnMessage("Rel belum di isi !!")
				// return false;

			deferred.reject('Rel belum isi !!');
			return deferred.promise;	
			}			
		}

		//console.log('500');
		//VALIDASI CUSTOMER
		// untuk JURNAL PEMBAYARAN CUST HARUS ISI
		if($scope.jurnalHeader.jenisVoucher.jenisVoucher=='PENGELUARAN'){
			wajibIsiCust = true
		}
		if($scope.jurnalDetil.accountDetil.cust == true ){
			wajibIsiCust = true				
		}

		//console.log('510');
		if(wajibIsiCust){
			if (!($scope.jurnalDetil.customer !== null && typeof $scope.jurnalDetil.customer === 'object')){
			// if($scope.jurnalDetil.customer == null){
				// $mdToast.show(	
				// 	$mdToast.simple()
				// 		.textContent('Customer belum di isi !!!')
				// 		.position("top right")
				// 		.hideDelay(3000)
				// 	);
				// // growl.addWarnMessage("Customer belum di isi !!")
				// return false;
				deferred.reject('Customer belum isi / salah pilih customer !!');
				return deferred.promise;	
			}	
		}

		//console.log('519');
		var userNew;
		var vTgl1 = $filter('date')($scope.tglIssue,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tglBooking,'yyyy-MM-dd');
		var suksesTambahDetil =false;

		$scope.jurnalHeader.issueDate=vTgl1;
		$scope.jurnalHeader.bookingDate=vTgl2;
		$scope.jurnalHeader.user = $rootScope.globals.currentUser.authdata;			

		jurnalHeaderFactory
			.jurnalHeaderAdd($rootScope.globals.currentUser.authdata,$scope.jurnalHeader)
			.success(function(data){
				//console.log('selected coa ' + $scope.selectedCoa);
				$scope.jurnalHeader = data;							
				$scope.jurnalDetil.jurnalHeader=$scope.jurnalHeader;
				// growl.addInfoMessage('save header success');
				$scope.headerAda =true;
				if($scope.jurnalHeader.bookingDate	==null){
					$scope.tglBooking = null;
				}else{
					$scope.tglBooking = new Date($scope.jurnalHeader.bookingDate) ;
					console.log($scope.jurnalHeader.bookingDate);
				}

				deferred.resolve('sukses');			
				//focus('dkSelected');
			});
		return deferred.promise;
	}

	function simpanDetil(idHeader){

		var deferred = $q.defer();

		if(typeof($scope.jurnalDetil.bagian) == 'string'){

			var jurnalDetilDTO={			
				jurnalHeaderId:idHeader,
	    		accountDetilId:$scope.selectedCoa.idAccountDtl,
	    		bagian:$scope.selectedbBagian.kode,
	    		keterangan:$scope.jurnalDetil.keterangan,
	    		// debet:$scope.jurnalDetil.debet,
	    		total:$scope.jurnalDetil.jumlah,    		
	    		dk : $scope.jurnalDetil.dk,
	    		rel:$scope.jurnalDetil.rel   
			}

			//console.log('bagian = ' + jurnalDetilDTO.bagian);
		}else{
			var jurnalDetilDTO={			
				jurnalHeaderId:idHeader,
	    		accountDetilId:$scope.selectedCoa.idAccountDtl,
	    		bagian:$scope.selectedbBagian.kode,
	    		keterangan:$scope.jurnalDetil.keterangan,
	    		// debet:$scope.jurnalDetil.debet,
	    		// kredit:$scope.jurnalDetil.kredit,    		
	    		total:$scope.jurnalDetil.jumlah,    		
	    		dk : $scope.jurnalDetil.dk,
	    		rel:$scope.jurnalDetil.rel    		
			}

			//console.log('bagian = ' + jurnalDetilDTO.bagian);
		}
		

		if($scope.jurnalDetil.dk==="D"){
			jurnalDetilDTO.debet=$scope.jurnalDetil.jumlah;	
			jurnalDetilDTO.kredit=0;		
		}else{
			jurnalDetilDTO.debet=0;
			jurnalDetilDTO.kredit=$scope.jurnalDetil.jumlah;			
		};

		if(editData===true){
			jurnalDetilDTO.id=$scope.jurnalDetil.id;			
		}else{
			jurnalDetilDTO.id=0;
		}

		// cek apakah customer diisi, jika tidak isi dengan "0" 
		// agar di proses jadi null di server
		if($scope.jurnalDetil.customer===''){
			jurnalDetilDTO.customerId=0;
		}else{
			if(($scope.jurnalDetil.customer===null)){
				jurnalDetilDTO.customerId=0;	
			}else{
				jurnalDetilDTO.customerId=$scope.jurnalDetil.customer.id ;   			
			}			
		};

		// cek apakah Bank diisi, jika tidak isi dengan " - " agar di proses jadi null di server
		//bankId:$scope.jurnalDetil.bank.kode,
		if($scope.jurnalDetil.bank===''){
			jurnalDetilDTO.bankId=0;	
		}else{
			if($scope.jurnalDetil.bank===null){
				jurnalDetilDTO.bankId=0;	
			}else{
				jurnalDetilDTO.bankId=$scope.jurnalDetil.bank.id ;   			
			}			
		};

		//console.log("simpan detil - issue date == " + $scope.jurnalHeader.issueDate);
		jurnalDetilFactory
			.insert(jurnalDetilDTO)
			.success(function(data){
				//refresh
				//alert('sukses');
				lastDesc=$scope.jurnalDetil.keterangan;
    			lastDuit=$scope.jurnalDetil.jumlah; 
    			lastCust=$scope.jurnalDetil.customer;
    			lastCoa=$scope.selectedCoa;
				editData=false;
				$mdToast.show(	
					$mdToast.simple()
						.textContent('Save detil success...')
						.position("bottom right")
						.hideDelay(3000)
					);	
				// growl.addInfoMessage('save detil success');				\
				deferred.resolve('true');
				
			})
			.error(function(err){
				deferred.reject(err);
			})
		return deferred.promise;
	};

	$scope.editDetil=function(id){
		editData=true;
		$scope.jurnalDetil=null;
		jurnalDetilFactory
			.getById(id)
			.success(function(data){
				$scope.SimpanIsiDetil=false;
				$scope.jurnalDetil=data;
				$scope.jurnalDetil.bagian = data.bagian;
				$scope.selectedCoa = $scope.jurnalDetil.accountDetil;
				$scope.selectedbBagian=$scope.jurnalDetil.bagian;
				//$scope.selectedBank = $scope.jurnalDetil.bank;

				//console.log("selected bank " + $scope.selectedBank);
				// .kode;	
				//console.log("debet =" + data.debet+" kredit" + data.kredit);				
				if(data.debet<=0){
					$scope.jurnalDetil.jumlah=data.kredit;	
					$scope.jurnalDetil.dk="K";
				}else{
					$scope.jurnalDetil.jumlah=data.debet;
					$scope.jurnalDetil.dk="D";
				}
				//console.log("dk=" + $scope.jurnalDetil.dk)
				$scope.enableBank=$scope.jurnalDetil.accountDetil.cashBank;
		  		$scope.enableCust=$scope.jurnalDetil.accountDetil.cust;
		  		$scope.enableRel = $scope.jurnalDetil.accountDetil.rel;	  
				
				focus('kodeCoa');
			})
			.error(function(data){
				$mdToast.show(	
					$mdToast.simple()
						.textContent(data)
						.position("top right")
						.hideDelay(3000)
					);
				// growl.addWarnMessage(data);
			});
	};

	$scope.getCustomer=function(val){

		//
		//growl.addInfoMessage('TYPE head function');
		//console.log(val);
		if(val==""){
			return false;
		}

		if(val=="="){
			//console.log("last cust = " + lastCust );
			//$scope.jurnalDetil.customer=lastCust;	
			var customers=[];	           
			customers.push(lastCust);
			//console.log("scope customer = " + $scope.jurnalDetil.customer );
	        return customers;			
		}else{
	        return customerFactory.getActiveCustomerByNamaPage(val,1,15).then(function (response) {
	            var customers=[];
	            //console.log('jumlah response : ' + response.data.content.length);
	            angular.forEach(response.data.content, function(item){
	                customers.push(item);
	                // console.log('tambah :' + item.namaSatuan);
	            });
	            // growl.addInfoMessage('get all customer success');
	            return customers;
	        });			
		}
		
    };

    $scope.openDetil=function(){
    	//focus('kodeCoa');
    	$scope.SimpanIsiDetil=!$scope.SimpanIsiDetil
    	if($scope.SimpanIsiDetil == false){
    		focus('dkSelected');
    	}
    }

    $scope.changePageDetil1 = function(){
    	getAllDetil();
    }

    function getAllDetil(){ 
    	
		var vDebet=0;
		var vKredit=0;
		var d_k;
		//console.log("get all detil - issue date == " + $scope.jurnalHeader.issueDate);
		jurnalDetilFactory	
    		.getJurnalDetilByIdJurnalHeaderPage($scope.jurnalHeader.id,$scope.currentPage, $scope.itemsPerPage)
    		.success(function(data){
    			$scope.jurnalDetils=data.content;
    			$scope.totalItems = data.totalElements;
    			// growl.addInfoMessage('refresh list detil success');
    			//alert($scope.jurnalDetils);
    			d_k=$scope.jurnalDetil.dk;    			

				hitungDebetkredit();
				
    			$scope.jurnalDetil={
					id: null,
					jurnalHeader: null,
					accountDetil: null,
					bagian: null,
					keterangan: null,
					debet: null,
					kredit: null,
					bank: null,
					rel: null,
					customer: null,
					dk: d_k				
				};

				// growl.addInfoMessage('Jumlah data ' + $scope.totalItems);
				// growl.addInfoMessage('header ' + $scope.jurnalHeader.issueDate );
    		});    	
    };

 	function hitungDebetkredit(){
    	var vDebet=0;
		var vKredit=0;
		//console.log("hitung debet kredit - issue date == " + $scope.jurnalHeader.issueDate);
		jurnalDetilFactory	
    		.getJurnalDetilByIdJurnalHeaderPage($scope.jurnalHeader.id,1, 25)
    		.success(function(data){
    			    			
    			angular.forEach(data.content, function(jurnaldetil){    				
					vDebet=vDebet + jurnaldetil.debet;
					vKredit=vKredit + jurnaldetil.kredit;
				});

				$scope.totalDebet = vDebet;
				$scope.totalKredit = vKredit;

    		});    		
    }

    $scope.saveVoucher=function(){

    	if($scope.totalDebet==0){
    		// alert('Total debet  masih nol');
    		$mdToast.show(	
				$mdToast.simple()
					.textContent('Total debet / kredit masih Nol !!')
					.position("top right")
					.hideDelay(3000)
				);
    		// growl.addWarnMessage('Total debet / kredit masih Nol !!');
    		return false;
    	};

    	if($scope.totalKredit==0){
    		// alert('Total kredit masih nol');
    		$mdToast.show(	
				$mdToast.simple()
					.textContent('Total debet / kredit masih Nol !!')
					.position("top right")
					.hideDelay(3000)
				);
    		// growl.addWarnMessage('Total debet / kredit masih Nol !!');
    		return false;
    	};

		if($scope.totalDebet != $scope.totalKredit){
    		// alert('Total debet / kredit tidak sama');
    		$mdToast.show(	
				$mdToast.simple()
					.textContent('Total debet / kredit tidak sama !!')
					.position("top right")
					.hideDelay(3000)
				);
    		// growl.addWarnMessage('Total debet / kredit tidak sama !!');
    		return false;
    	};    	

		var vTgl1 = $filter('date')($scope.jurnalHeader.issueDate,'yyyy-MM-dd');

		$scope.jurnalHeader.issueDate=vTgl1;
		$scope.jurnalHeader.bookingDate=vTgl1;
		$scope.jurnalHeader.user = $rootScope.globals.currentUser.authdata;	

    	jurnalHeaderFactory
    		.saveJurnal($scope.jurnalHeader)
    		.success(function(data){
    			$mdToast.show(	
					$mdToast.simple()
						.textContent('Save success  !!')
						.position("top right")
						.hideDelay(5000)
					);
    			var hasil=data;
    			// if(hasil==='Y'){
    				$scope.approved=true;
			    	$scope.StatusData=data.statusVoucher;							
					$scope.jurnalHeader=data;
					//growl.addInfoMessage('Voucher approved');    
					if($scope.jurnalHeader.jenisVoucher==='PEMINDAHAN'){
						$scope.statusJurnalBalik='Ok';					
					}else{
						$scope.statusJurnalBalik='X';					
					}
					
    			// }else{
    			// 	growl.addWarnMessage('Error approve jurnal');
    			// }
    		})	
    };

    $scope.batal=function(){
    	$scope.StatusData='DISPLAY';			
    };

    $scope.jurnalBalik=function(){
    	
    	if($scope.jurnalHeader.id==='' || $scope.jurnalHeader.id== 0){
    		alert('jurnal Balik belum ada ID');
    	}else{
    		jurnalHeaderFactory
    			.getJurnalHeaderByJurnalIdByUserId($scope.jurnalHeader.id, $rootScope.globals.currentUser.authdata)
    			.success(function(data){
    				if(data.statusVoucher!=='APPROVED'){
    					// alert('status belum approved');
    					$mdToast.show(	
							$mdToast.simple()
								.textContent('status belum approved !!')
								.position("top right")
								.hideDelay(3000)
							);
    					// growl.addWarnMessage('status belum approved')
    				}else{
    					if(data.idJurnalBalik==null ||data.idJurnalBalik=='' ){
    						//proses
    						if(data.jenisVoucher!=='PEMINDAHAN'){
    							// alert('Tipe Jurnal Pemindahan baru bisa dibuat Jurnal Balik');
    						$mdToast.show(	
								$mdToast.simple()
									.textContent('Tipe Jurnal Pemindahan baru bisa dibuat Jurnal Balik !!')
									.position("top right")
									.hideDelay(3000)
								);
    							// growl.addWarnMessage('Tipe Jurnal Pemindahan baru bisa dibuat Jurnal Balik')
    						}else{
    							$location.path('/transaksiJurnalBalik/'+$scope.jurnalHeader.id);	
    						}    						
    						
    					}else{
    						// alert('Sudah ada jurnal balik nya!')
    						$mdToast.show(	
								$mdToast.simple()
									.textContent('Sudah ada jurnal balik nya!!!')
									.position("top right")
									.hideDelay(3000)
								);
    						// growl.addWarnMessage('Sudah ada jurnal balik nya!')
    					}
    				}
    			})
    			.error(function(data){
    				// alert('Header ID tidak ditemukan');
    				$mdToast.show(	
						$mdToast.simple()
							.textContent('Header ID tidak ditemukan!!')
							.position("top right")
							.hideDelay(3000)
						);
    				// growl.addWarnMessage('Header ID tidak ditemukan')
    			})
    	}
    }

    $scope.hapusDetil =function(ev, id, nama, urut ){


    	var confirm = $mdDialog.confirm()
    			.title("Konfirmasi hapus data")	
    			.textContent('Apakah akan menghapus data [ '+ urut + ' - ' + nama + ' ]')
    			.ariaLabel('konfirmasi bae')
    			.targetEvent(ev)
    			.ok('Ok')
    			.cancel('Batal');

    	$mdDialog.show(confirm)
    		.then(function(){
    			// TOMBOL OK
    			jurnalDetilFactory
		      		.delete(id)
		      		.success(function(data){
		      			if(data==1){
		      				$mdToast.show(	
								$mdToast.simple()
									.textContent('delete success ...' )
									.position("top right")
									.hideDelay(3000)
								);
		      				
		      			}
		      			getAllDetil();
		      		})
		      		.error(function(data){
		      			$mdToast.show(	
							$mdToast.simple()
								.textContent("error delete detail " + data)
								.position("top right")
								.hideDelay(3000)
							);
		      		})
    		}, function(){
    			// TOMBOL CANCEL
    			//console.log('batal oi');
    		})

   //  	var modalInstance = $uibModal.open({
			// templateUrl: 'myModalContent.html',
			// controller: 'ModalInstanceCtrl',
			// size: '',
		 //    resolve: 
		 //    	{
	  //       		idHeader: function () {
	  //         			return id;
	  //       		},
	  //       		kode: function () {
	  //         			return nama;
	  //       		}

   //    			}
	  //   });
    	

    	// modalInstance.result.then(function (id) {
	    //   	jurnalDetilFactory
	    //   		.delete(id)
	    //   		.success(function(data){
	    //   			if(data==1){
	    //   				$mdToast.show(	
					// 		$mdToast.simple()
					// 			.textContent('delete success ...' )
					// 			.position("top right")
					// 			.hideDelay(3000)
					// 		);
	      				
	    //   			}
	    //   			getAllDetil();
	    //   		})
	    //   		.error(function(data){
	    //   			$mdToast.show(	
					// 	$mdToast.simple()
					// 		.textContent("error delete detail " + data)
					// 		.position("top right")
					// 		.hideDelay(3000)
					// 	);
	      			
	    //   		})
		   //  }, function (){
		   //   	$mdToast.show(	
					// $mdToast.simple()
					// 	.textContent('Batal delete : ' + new Date())
					// 	.position("top right")
					// 	.hideDelay(3000)
					// );
		      	
		   //  });
    	
	    };

    $scope.printJurnal=function(){
    	$window.open($rootScope.pathServerJSON + '/api/transaksi/jurnalDetil/voucher/'+$scope.jurnalHeader.id, '_blank');
    };

    $scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/laporan/jurnal/'+$scope.jurnalHeader.id, '_blank');
	};

	startModule();

}])