appControllers.controller('CoaDetilDetilController', 
	['$scope','id','coaDtlFactory', '$mdDialog','coaHdrFactory','$mdToast',
	function($scope, id, coaDtlFactory, $mdDialog, coaHdrFactory, $mdToast){
	

	//alert(id);
	function startModule(){

		$scope.listStatus=['ACTIVE', 'NONACTIVE'];
		$scope.listDK=['DEBET', 'KREDIT'];
		$scope.posisi;

		$scope.coaDtl={
			idAccountDtl: 0,
			namaPerkiraan: "",
			kodePerkiraan: "",
			rel: false,
			cust: false,
			cashBank: false,
			accountHeader: {
				idAccountHdr: 0,
				namaAccount: "",
				kodeAccount: ""
			},		
			status:'',
			autoGenerateNo: false,
			headerAutoGenerateNo: '',
			isDebet:''
		};

		if(id===0){
			$scope.jenisTransaksi=1;			
			$scope.coaDtl.id='[Automatic]';							
		}else{
			$scope.jenisTransaksi=2;						
			coaDtlFactory
				.getCoaDtlById(id)
				.success(function(data){
					$scope.coaDtl =data;		
					$scope.selectedItem=$scope.coaDtl.accountHeader;
					if($scope.coaDtl.isDebet==true){
						$scope.posisi = $scope.listDK[0];						
					}else{
						$scope.posisi = $scope.listDK[1];						
					}
				});
		}
	}

	$scope.getCoaHdrByKode = function(cariKode){
		if(cariKode==undefined || cariKode ==''){
			cariKode="--"
		}
		return coaHdrFactory
			.getCoaHdrByKodePage(cariKode,1,5)			
			.then(function(response){
				var coas=[];
				angular.forEach(response.data.content,function(item){
					coas.push(item);
				})
				return coas;
			})
	}

	$scope.proses = function (){
		$scope.coaDtl.accountHeader = $scope.selectedItem;
		if($scope.posisi == $scope.listDK[0]){
			$scope.coaDtl.isDebet = true;						
		}else{
			$scope.coaDtl.isDebet = false;
		}

		switch($scope.jenisTransaksi){
			case 1:
				$scope.coaDtl.idAccountDtl='';

				coaDtlFactory
					.isKodeExis($scope.coaDtl.kodePerkiraan)
					.success(function(data){
						if(data==true){
							//growl.addWarnMessage("kode sudah ada !!")
							$mdToast.show(
								$mdToast.simple()
									.textContent('kode sudah ada !!!')
									.position("top right")
									.hideDelay(3000)
								);
							//console.log("kode sudah ada !!");
						}else{
							coaDtlFactory
								.insertCoaDtl($scope.coaDtl)
								.success(function(data){
									//growl.addInfoMessage('insert success ' + data );
									$scope.jenisTransaksi=2;
									//$scope.coaDtl.id =data.id;
									//$scope.coaDtls.push($scope.coaDtl);
									closeForm();
								})
								.error(function(data){
									//growl.addWarnMessage('Error insert ' + data);		
									$mdToast.show(
										$mdToast.simple()
											.textContent("Error insert data [ "+ data +" ] !!")
											.position("top right")
											.hideDelay(3000)
										);
									console.log("Error insert data "+ data +" !!");
								})								
						}
					})
				
				break;
			case 2:
				coaDtlFactory
					.updateCoaDtl($scope.coaDtl.idAccountDtl, $scope.coaDtl)
					.success(function(data){
						//growl.addInfoMessage('edit success');	
						//$scope.coaDtls[idx]=$scope.coaDtl;	
						//getAllDirektorat();
						//$scope.tutupGrid = !$scope.tutupGrid;				
						closeForm();
					})
					.error(function(data){
						//growl.addWarnMessage('Error Updata ' + data);
						$mdToast.show(
							$mdToast.simple()
								.textContent("Error update [ "+ data +" ]!!")
								.position("top right")
								.hideDelay(3000)
							);
						console.log(data);	

					})				
				break;	
		}
	};

	$scope.tutupDetil = function(){
		closeForm();
	}

	$scope.cancelBtn = function(){
		$mdDialog.cancel()
	}

	function closeForm() {
    	$mdDialog.hide(null);
    };

	startModule();

}])