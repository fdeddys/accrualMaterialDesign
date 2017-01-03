var myApp = angular.module('appAccrual',[
	'appControllers',
	'appServices',	
	'ngMaterial',
	'ngRoute',
	'ngAnimate',
	'ngCookies',
	'angular-growl',
	'md.data.table'
]);

myApp.factory('focus', function($timeout, $window) {

	return function(id) {
      $timeout(function() {
      	var element = $window.document.getElementById(id);
      	if(element)
      		element.focus();
      });

  };
  
});

myApp.filter('keyboardShortcut', function($window) {
    return function(str) {
      if (!str) return;
      var keys = str.split('-');
      var isOSX = /Mac OS X/.test($window.navigator.userAgent);

      var seperator = (!isOSX || keys.length > 2) ? '+' : '';

      var abbreviations = {
        M: isOSX ? '⌘' : 'Ctrl',
        A: isOSX ? 'Option' : 'Alt',
        S: 'Shift'
      };

      return keys.map(function(key, index) {
        var last = index == keys.length - 1;
        return last ? key : abbreviations[key];
      }).join(seperator);
    };
  })

myApp.directive('eventFocus', function(focus) {
	return function(scope, elem, attr) {
		elem.on(attr.eventFocus, function() {
			focus(attr.eventFocusId);
		});

      // Removes bound events in the element itself
      // when the scope is destroyed
      scope.$on('$destroy', function() {
      	elem.off(attr.eventFocus);
      });
  };
});

myApp.run(['$window', '$rootScope', '$location', '$cookieStore', '$http', 
	function($window, $rootScope, $location, $cookieStore, $http){

	// buat hidden menu nya
	// kalo masuk form LOGIN sembunyikan
	// tapi logo nyo masih ado koq cumen bar menu bae yang ilang
	$rootScope.isLogin=false;

	// Pindahkan scroll selalu ke paling atas => efek dari animasi
	$rootScope.$on('$viewContentLoaded', function(){ window.scrollTo(0, 0); });

	// Path server database
	//$rootScope.pathServerJSON='http://127.0.0.1:8080/AccrualBasisDB';
	$rootScope.pathServerJSON='http://localhost:8088';


	// refresh masih tetep login brooo
    $rootScope.globals = $cookieStore.get('globals') || {};    
    if ($rootScope.globals.currentUser) {
        //$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }
    $rootScope.isLogin = $cookieStore.get('isLogin') || {};
	

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        // redirect to login page, soalnya $rootScope blm login
        if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
            $location.path('/login');
        }
    });

}]);

myApp.config(['$routeProvider','$locationProvider','growlProvider',
	function($routeProvider,$locationProvider,growlProvider){
	//,,


// 	$locationProvider.html5Mode(true);
//  	$locationProvider.html5Mode({
// 		enabled: true,
// 	  	requireBase: false
// 	});
	//$locationProvider.html5Mode(true).hashPrefix('!');

	growlProvider.globalTimeToLive(3000);

	$routeProvider.
		when('/',{
			templateUrl:'app/utama/utama.html'
			//controller :'utamaController'				
		}).
		when('/login',{
			templateUrl:'app/login/login.html',
			controller:'loginController'
		}).
		when('/masterDirektorat',{
			templateUrl:'app/master/direktorat/direktorat.html',
		    controller:'direktoratController'
		}).
		when('/masterBagian',{
			templateUrl:'app/master/bagian/bagian.html',
		    controller:'bagianController'
		}).		
		when('/masterCustomer',{
			templateUrl:'app/master/customer/customer.html',
			controller:'customerController'
		}).
		when('/masterCustomerDetil/:id',{
			templateUrl:'app/master/customer/customerDetil.html',
			controller:'customerDetilController'
		}).
		when('/masterBank',{
			templateUrl:'app/master/bank/bank.html',
			controller:'bankController'
		}).		
		when('/masterCoaHeader',{
			templateUrl:'app/master/coa/coaHeader.html',
			controller:'coaHeaderController'
		}).	
		when('/masterCoaDetil',{
			templateUrl:'app/master/coa/coa-detil/coaDetil.html',
			controller:'coaDetilController'
		}).
		// when('/masterJurnal',{
		// 	templateUrl:'partials/transaksi/masterJurnal.html',
		// 	controller: 'jurnalController'
		// }).							
		when('/masterUser',{
			templateUrl:'partials/Utility/masterUser.html',
			controller: 'userController'
		}).	
		when('/jurnal',{
			templateUrl:'app/transaksi/jurnal/jurnal.html',
			controller: 'jurnalController'
		}).
		when('/jurnalDetil/:idDetil',{
			templateUrl:'app/transaksi/jurnal/detil/jurnalDetil.html',
			controller: 'jurnalDetilController'
		}).
		when('/printJurnal',{
			templateUrl:'partials/printing/jurnalPrinting.html',
			controller: 'jurnalPrintingController'
		}).
		when('/transaksiJurnalDetil/:idDetil',{
			templateUrl:'partials/transaksi/jurnalDetil.html',
			controller: 'jurnalDetilController'
		}).
		when('/transaksiJurnalBalik/:idDetil',{
			templateUrl:'partials/transaksi/jurnalBalik.html',
			controller: 'jurnalBalikController'
		}).	
		when('/suratTransfer',{
			templateUrl:'partials/keuangan/suratTransfer.html',
			controller: 'suratTransferController'
		}).
		when('/suratTransferDetil/:idHd',{
			templateUrl:'partials/keuangan/suratTransferDetil.html',
			controller: 'suratTransferDetilController'
		}).			
		when('/inputBooking',{
			templateUrl:'partials/transaksi/isiBooking.html',
			controller: 'isiBookingController'
		}).	
		when('/config',{
			templateUrl:'partials/Utility/accrualConfig.html',
			controller: 'accrualConfigController'
		}).	
		when('/bukuBesar',{
			templateUrl:'partials/laporan/bukuBesar.html',			
			controller: 'bukuBesarController'
		}).	
		when('/tutupBulan',{
			templateUrl:'partials/laporan/tutupBulan.html',
			controller: 'tutupBulanController'
		}).				
		when('/posting/:isJurnalPengeluaran',{
			templateUrl:'partials/laporan/posting.html',
			controller: 'postingController'
		}).	
		when('/bbTrial',{
			templateUrl:'partials/transaksi/bukuBesarTrial.html',
			controller: 'bukuBesarTrialController'
		}).	
        otherwise({
			redirectTo:'/'
		});

}]);

var appServices = angular.module('appServices',[]);

var appControllers = angular.module('appControllers',['appServices'])
	.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return  input.slice(start);
    };
});