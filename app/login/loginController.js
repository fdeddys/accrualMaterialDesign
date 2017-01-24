appControllers.controller('loginController', 
    ['$scope','growl','AuthenticationService','$location','$rootScope','userFactory','focus','$window','$mdToast',
    function($scope,growl,AuthenticationService,$location,$rootScope,userFactory, focus, $window, $mdToast){
	
	$scope.userId='';
	$scope.password='';
	AuthenticationService.ClearCredentials();
    $rootScope.isLogin=false;    

    var pos ={
        bottom: false,
        top: true,
        left: false,
        right: true
    }



	$scope.login = function () {  

        

        // NO auth 
        // AuthenticationService.SetCredentials(0, 'testing');
        // $rootScope.isLogin=true; 
        // $rootScope.xAuth=true;          
        //  // $location.path('#/masterUser'); 
        // $window.location = "#/masterUser";   
        
        //  return true;
        // -- NO auth 

        AuthenticationService
            .loginAuth($scope.userId, $scope.password)
            .success(function(data){
                //growl.warning(data, {title: 'Auth!'});
                //  alert('isi = ['+data+']');               
                if ( data==true) {
                    var idUser=0 ; 
                    userFactory
                        .getIdByUserName($scope.userId)
                        .success(function(data){
                            // idUser=data;
                            AuthenticationService.SetCredentials($scope.userId, data);
                           //alert('direct')      
                            $rootScope.isLogin=true;          
                            $location.path('#/'); 
                            //$scope.parent.isLoginMenu=true;                           
                        });
                    
                } else {
                    //alert('error login');                
                    //growl.warning('Invalid user or password ', {title: 'Auth!'});
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Invalid user or password  !')
                            .position("top right")
                            .hideDelay(2000)
                        );      
                    // $scope.error = response.message;                
                }    
            })
            .error(function(data){
                //growl.warning('Error get Auth from Server !' , {title: 'Auth!'});       
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Error get Auth from Server !')
                        .position("top right")
                        .hideDelay(2000)
                    );      
            })

    };

	focus('inputID');
    
}])
