appControllers.controller('bankDetilController', 
	['$scope','id', '$mdDialog','bankFactory',
	function($scope, id, $mdDialog, bankFactory){
	
	//alert(id);

	$scope.listStatus;
	
	function startModule(){		

		$scope.listStatus=['ACTIVE', 'NONACTIVE'];

		$scope.bank={
			id: 0,
			kode: "",
			nama: "",
			namaCabangBank: "",
			status: "",
			noAccount: "",
			kota:""
		};


		if(id===0){
			$scope.jenisTransaksi=1;			
			$scope.bank.id='[Automatic]';				
			$scope.bank.status = $scope.listStatus[0];
		}else{
			$scope.jenisTransaksi=2;	
			bankFactory
				.getBankById(id)
				.success(function(data){
					$scope.bank = data;				
				})
				.error(function(data){
					// growl.addWarnMessage("Error loading get by id ",{ttl:4000})
				});	
		}								
	}

	$scope.proses = function (){
		switch($scope.jenisTransaksi){
			case 1:
				$scope.bank.id='';
				bankFactory
					.isKodeExis($scope.bank.kode)
					.success(function(data){
						if(data==true){
							//growl.addWarnMessage("kode bank sudah ada !");
						}else{
							bankFactory
								.insertBank($scope.bank)
								.success(function(data){
									closeForm();
								})
								.error(function(data){
									//growl.addWarnMessage('Error insert ' + data);		
								})							
						}
					})
				
				break;
			case 2:
				bankFactory
					.updateBank($scope.bank.id, $scope.bank)
					.success(function(data){
						closeForm();
					})
					.error(function(data){
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