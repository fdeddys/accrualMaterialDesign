appControllers.controller('customerDetilController', 
	['$scope','customerFactory', '$window','$rootScope','focus','$location','$routeParams','$mdToast',
	function($scope,customerFactory, $window, $rootScope, focus,$location, $routeParams,$mdToast){

	$scope.listStatus=['ACTIVE','NONACTIVE'];

	function startModule(){		

		$scope.customer={
			id: 0,
			kode: "",
			nama: "",
			alamat: "",
			kota: "",
			telp: "",
			fax: "",
			npwp: "",
			namaBank: "",
			noRekening: "",
			namaCabangBank: "",
			kontakPerson:"",
			kotaBank:"",
			isSupplier:0,
			status:""
		};

		var id = $routeParams.id;

		if(id==0){
			$scope.jenisTransaksi=1;			
			$scope.customer.id='[Automatic]';	
			$scope.customer.status=$scope.listStatus[0];

		}else{
			$scope.jenisTransaksi=2;	
			customerFactory
				.getCustomerById(id)
				.success(function(data){
					$scope.customer = data;

				})
				.error(function(data){
					$mdToast.show(
						$mdToast.simple()
							.textContent("Error load data [ "+ data +" ]!!")
							.position("top right")
							.hideDelay(3000)
						);
					console.log(data);
				});	
		}					
		
	}

	$scope.proses = function (){
		switch($scope.jenisTransaksi){
			case 1:
				$scope.customer.id='';
				customerFactory
					.isKodeExis($scope.customer.kode)
					.success(function(data){
						if(data==true){
							//growl.addWarnMessage("kode bagian sudah ada !");
						}else{
							customerFactory
								.insertCustomer($scope.customer)
								.success(function(data){
									closeForm();
								})
								.error(function(data){
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
				customerFactory
					.updateCustomer($scope.customer.id, $scope.customer)
					.success(function(data){
						closeForm();

					})
					.error(function(data){
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

	function closeForm(){
		 $location.path('/masterCustomer'); 
	};

	$scope.tutup = function(){
		closeForm();
	}

	startModule();

}])