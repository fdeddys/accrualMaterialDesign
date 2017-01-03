appControllers.controller('indexController', 
	['$scope', '$mdSidenav','$mdBottomSheet','userFactory','$rootScope','$location',
	function($scope, $mdSidenav, $mdBottomSheet, userFactory, $rootScope, $location){
	

	//$scope.isLoginAuth=false;

	$scope.openSideMenu = function(){
		//alert('open side !!');
		$mdSidenav('menu-left')
        	.toggle()
          	.then(function () {
            	//$log.debug("toggle " + navID + " is done");
          	});
	}

    $scope.logout = function (){
        $location.path('/login'); 
    }

	$scope.menuDirektorat = function(){
        tutupSideMenu();
        $location.path('/masterDirektorat'); 
    }

    $scope.menuBagian = function(){
        tutupSideMenu();
        $location.path('/masterBagian'); 
    }

    $scope.menuBank = function(){
        tutupSideMenu();
        $location.path('/masterBank'); 
    }

    $scope.menuCustomer = function(){
        tutupSideMenu();
        $location.path('/masterCustomer');    
    }

    $scope.menuCoaHdr = function(){
        tutupSideMenu();
        $location.path('/masterCoaHeader'); 
    }    

    $scope.menuCoaDtl = function(){
        tutupSideMenu();
        $location.path('/masterCoaDetil'); 
    } 

    $scope.menuJurnal = function(){
        tutupSideMenu();
        $location.path('/jurnal'); 
    }        

    function tutupSideMenu(){
		$mdSidenav('menu-left')
        	.close()
          	.then(function () {
            	//$log.debug("toggle " + navID + " is done");
          	});	
    }

	$scope.showBottomSheet = function(){
		$mdBottomSheet.show({
			templateUrl: 'app/utama/bottomSheet.html',
			controller: 'bottomSheetController',
			clickOutsideToClose: true
		}).then(function(clickedItem) {	

		});
	}


	$scope.$watch('isLogin',function(newVal,oldVal, scope){
        //console.log("is login " + oldVal + '  berubah  ' + newVal ); 
        if(newVal===true){
            //alert($rootScope.globals.currentUser.username);
            $scope.namaLogin= "Login as [" + $rootScope.globals.currentUser.username + "]";                
            //$scope.namaLogin=$cookieStore.globals.currentUser.username;                
            userFactory
                .isAdmin($rootScope.globals.currentUser.username)
                .success(function(data){
                    $scope.visibleUser=data; 
                    $scope.isLoginAuth=true;                   
                })
            
        }else{
            $scope.namaLogin="Logout ";
            $scope.isLoginAuth=false;                   
        }
        
    })



}])

