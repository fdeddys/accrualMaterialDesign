appControllers.controller('coaHeaderDetilController', 
	['$scope','id','coaHdrFactory', '$mdDialog','coaHdrFactory','$mdToast',
	function($scope, id, coaHdrFactory, $mdDialog, coaHdrFactory,$mdToast){
	
	//alert(id);

	$scope.groupAccounts=['NERACA','LABARUGI_PENDAPATAN','LABARUGI_BIAYA']

	function startModule(){		

		$scope.coaHdr={
			idAccountHdr: 0,
			namaAccount: "",
			kodeAccount: "",
			kodeBagian :"",
			groupAccount:""
		};

		if(id===0){
			$scope.jenisTransaksi=1;			
			$scope.coaHdr.idAccountHdr='[Automatic]';						
			$scope.coaHdr.groupAccount = $scope.groupAccounts[0];
		}else{
			$scope.jenisTransaksi=2;	
			coaHdrFactory
				.getCoaHdrById(id)
				.success(function(data){
					$scope.coaHdr = data;
					// $scope.selectedDirektorat = data.direktorat;
					//$scope.bagian.direktorat = $scope.direktorats[1];
					// $scope.bagian.direktorat = data.direktorat;
				})
				.error(function(data){

					$mdToast.show(
						$mdToast.simple()
							.textContent('Error get by id !!!')
							.position("top right")
							.hideDelay(3000)
						);
					// growl.addWarnMessage("Error loading get by id ",{ttl:4000})
				});	
		}
						
		
	}

	$scope.proses = function (){
		switch($scope.jenisTransaksi){
			case 1:
				$scope.coaHdr.idAccountHdr='';
				coaHdrFactory
					.isKodeExis($scope.coaHdr.kode)
					.success(function(data){
						if(data==true){
							//growl.addWarnMessage("kode bagian sudah ada !");
						}else{
							coaHdrFactory
								.insertCoaHdr($scope.coaHdr)
								.success(function(data){
									//growl.addInfoMessage('insert success ' + data );
									// $scope.jenisTransaksi=2;
									// $scope.bagian.id=data.id;
									// $scope.bagians.push($scope.bagian) ;
									// $scope.tutupGrid= !$scope.tutupGrid;
									closeForm();
								})
								.error(function(data){
									//growl.addWarnMessage('Error insert ' + data);	
									$mdToast.show(
										$mdToast.simple()
											.textContent('Error insert ' + data)
											.position("top right")
											.hideDelay(3000)
										);	
								})
							
						}
					})
				
				break;
			case 2:
				coaHdrFactory
					.updateCoaHdr($scope.coaHdr.idAccountHdr, $scope.coaHdr)
					.success(function(data){
						closeForm();
						// $scope.bagians[idx]=$scope.bagian;	
						//growl.addInfoMessage('edit success');						
						// $scope.tutupGrid= !$scope.tutupGrid;
					})
					.error(function(data){
						$mdToast.show(
							$mdToast.simple()
								.textContent('Error Updata ' + data)
								.position("top right")
								.hideDelay(3000)
							);	
						//growl.addWarnMessage('Error Updata ' + data);
						//console.log(data);		
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