appControllers.controller('accrualConfigController',
	['$scope','accrualConfigFactory','coaDtlFactory','$mdToast',
	function($scope, accrualConfigFactory, coaDtlFactory, $mdToast){		  	
	
	$scope.accrualConfig={
		id: 0,
		headerPenerimaan: "",
		headerPembayaran: "",
		headerPemindahan: "",
		coaBank: "",
		coaKas: "",
		coaJurnalBalik: "",
		kodeKasTableBank:"",
		coaPiutangUsaha:""
	};
	
	getConfig();


	function getConfig(){
		
		accrualConfigFactory
			.getConfig()
			.success(function (data){
			 	$scope.accrualConfig = data;
			}).error(function(data){
				$mdToast.show(
					$mdToast.simple()
						.textContent("Error Loading get config !")
						.position("top right")
						.hideDelay(3000)
					);	
				//growl.addWarnMessage("Error Loading get config !",{ttl: 4000});		
			});				
	};	

	$scope.proses=function(){		
		accrualConfigFactory
			.updateConfig($scope.accrualConfig)
			.success(function(data){
				//growl.addInfoMessage('edit success');		
				$mdToast.show(
					$mdToast.simple()
						.textContent("Save success ")
						.position("top right")
						.hideDelay(5000)
					);				
			})
			.error(function (data){
				//growl.addWarnMessage('Error Updata ' + data);
				$mdToast.show(
					$mdToast.simple()
						.textContent("Error Updata " + data)
						.position("top right")
						.hideDelay(3000)
					);
				console.log(data);		
			})					
	};

	$scope.check=function(kode){

		coaDtlFactory
			.getCoaDtlByKodeByNamaPage(kode,'-',1,1,1)
			.success(function (data){
				$scope.accountDetil = data.content[0];
				// alert($scope.accountDetil.namaPerkiraan);
				if(data.content[0]==undefined){
					//alert("Not Found");
					$mdToast.show(
						$mdToast.simple()
							.textContent("Kode not Found !!")
							.position("top right")
							.hideDelay(3000)
						);
				}else{
					$mdToast.show(
						$mdToast.simple()
							.textContent(data.content[0].namaPerkiraan)
							.position("top right")
							.hideDelay(5000)
						);
					// alert(data.content[0].namaPerkiraan);					
				}
				//.namaPerkiraan
			})
			.error(function(data){
				//growl.addWarnMessage("error loading data")
				$mdToast.show(
					$mdToast.simple()
						.textContent("Error loading data!!")
						.position("top right")
						.hideDelay(5000)
					);
			})		
	}


}]);