appControllers.controller('direktoratDetilController', 
	['$scope','id','direktoratFactory', '$mdDialog','$mdToast',
	function($scope, id, direktoratFactory, $mdDialog,$mdToast){
		
	//alert(id);
	function startModule(){

		$scope.direktorat={
			id: 0,		
			nama: "",
			kode: ""
		};

		if(id===0){
			$scope.jenisTransaksi=1;			
			$scope.direktorat.id='[Automatic]';				
			$scope.direktorat.nama='';
			$scope.direktorat.kode='';	
			$scope.isEdit=false;		
		}else{
			$scope.jenisTransaksi=2;						
			direktoratFactory
				.getDirektoratById(id)
				.success(function(data){
					$scope.direktorat =data;					
				});
		}
	}

	$scope.proses = function (){
		switch($scope.jenisTransaksi){
			case 1:
				$scope.direktorat.id='';

				direktoratFactory
					.isKodeDirektoratAda($scope.direktorat.kode)
					.success(function(data){
						if(data==true){
							//growl.addWarnMessage("kode sudah ada !!")
						}else{
							direktoratFactory
								.insertDirektorat($scope.direktorat)
								.success(function(data){
									//growl.addInfoMessage('insert success ' + data );
									$scope.jenisTransaksi=2;
									//$scope.direktorat.id =data.id;
									//$scope.direktorats.push($scope.direktorat);
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
				direktoratFactory
					.updateDirektorat($scope.direktorat.id, $scope.direktorat)
					.success(function(data){
						//growl.addInfoMessage('edit success');	
						//$scope.direktorats[idx]=$scope.direktorat;	
						//getAllDirektorat();
						//$scope.tutupGrid = !$scope.tutupGrid;				
						closeForm();
					})
					.error(function(data){
						//growl.addWarnMessage('Error Updata ' + data);
						$mdToast.show(
							$mdToast.simple()
								.textContent('Error Updata ' + data)
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