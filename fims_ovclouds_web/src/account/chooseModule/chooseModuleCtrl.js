FIMS.controller('chooseModuleCtrl',['$scope', '$rootScope','$q','$location',"$http",
	function($scope, $rootScope, $q,$location,$http) {
		// $scope.userName = localStorage.getItem("userName");
		$scope.curCompanyName = localStorage.getItem("curCompanyName");
		$scope.applyJoinCompanyNumber = localStorage.getItem("applyJoinCompanyNumber");

		// 将所有当前改为1
		localStorage.setItem("page",1);

		$scope.getApplies = function(){
			 $http({
	            method: 'post',
	            url: config.HOST + '/api/2.0/bp/account/relation/getAppliesJoinCompany',
	            // url: 'account/chooseModule/getAppliesJoinCompany.json',
	            headers:  {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
	            data: {
	                "sid": localStorage.getItem('sid'),
	                 "contents": {
				        "companySid": localStorage.getItem("cSid")
				    }
	            }
	        }).success(function(data){
	            if (data.code == 'N01') {
	                localStorage.setItem('applyJoin', JSON.stringify(data.contents));
	                $location.path("account_index/applyApproval");
	            }
	            else if(data.code=="E00"){
                    alert(data.message+",请重新登陆");
                    localStorage.clear();
                    $location.path('login').replace();
                }else {
                    alert(data.message);
                }  
	        })
		}
}])
