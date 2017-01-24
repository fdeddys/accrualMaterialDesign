appControllers.controller('bagianDetilController', 
	['$scope','id','direktoratFactory', '$mdDialog','bagianFactory','$mdToast',
	function($scope, id, direktoratFactory, $mdDialog, bagianFactory,$mdToast){
	
	//alert(id);

	$scope.listStatus;
	$scope.selectedDirektorat;

	function startModule(){
		// getAllDirektorat();

		$scope.listStatus=['ACTIVE', 'NONACTIVE'];

		$scope.bagian={
			id: 0,
			kode: "",
			nama: "",		
			direktorat: {
				id: 0,
				kode:"",
				nama: ""
			},		
			status: ""
		};


		direktoratFactory
	    	.getAllDirektorat()
		    .success(function(response){
			    $scope.direktorats = response ;  

				if(id===0){
					$scope.jenisTransaksi=1;			
					$scope.bagian.id='[Automatic]';	
					$scope.bagian.direktorat = $scope.direktorats[0];
					$scope.bagian.status = $scope.listStatus[0];					
				}else{
					$scope.jenisTransaksi=2;	
					bagianFactory
						.getBagianById(id)
						.success(function(data){
							$scope.bagian = data;
							// $scope.selectedDirektorat = data.direktorat;
							//$scope.bagian.direktorat = $scope.direktorats[1];
							// $scope.bagian.direktorat = data.direktorat;
						})
						.error(function(data){
							// growl.addWarnMessage("Error loading get by id ",{ttl:4000})
							$mdToast.show(
								$mdToast.simple()
									.textContent("Error get data bagian [ "+ data +" ]!!")
									.position("top right")
									.hideDelay(3000)
								);
							console.log(data);
						});	
				}
		});					
		
	}

	$scope.proses = function (){
		switch($scope.jenisTransaksi){
			case 1:
				$scope.bagian.id='';
				bagianFactory
					.isKodeBagianSudahAda($scope.bagian.kode)
					.success(function(data){
						if(data==true){
							//growl.addWarnMessage("kode bagian sudah ada !");
						}else{
							bagianFactory
								.insertBagian($scope.bagian)
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
											.textContent("Error insert [ "+ data +" ]!!")
											.position("top right")
											.hideDelay(3000)
										);
									console.log(data);	
								})
							
						}
					})
				
				break;
			case 2:
				bagianFactory
					.updateBagian($scope.bagian.id, $scope.bagian)
					.success(function(data){
						closeForm();
						// $scope.bagians[idx]=$scope.bagian;	
						//growl.addInfoMessage('edit success');						
						// $scope.tutupGrid= !$scope.tutupGrid;
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