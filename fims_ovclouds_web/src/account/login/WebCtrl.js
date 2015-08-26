FIMS.controller('WebCtrl',['$scope', '$rootScope','$q','$location',"$http",
	function($scope, $rootScope, $q,$location,$http) {

    login.user = {
        email: '',
        
    };
  
        var joinCo = {
			paramObj: {},
			
	};


/*********************************************************
*********************************************************/
function init(){
		
		var url = location.href;
		var param = url.substring(url.indexOf("?")+1, url.length).split("&");
		for (var i=0;i< param.length;i++) {
			joinCo.paramObj[param[i].substring(0,param[i].indexOf("="))] = param[i].substring(param[i].indexOf("=")+1)
		}
		if (joinCo.paramObj!=null){
			
				localStorage.setItem('code',joinCo.paramObj.code);
			

		}
	}
	
	init();

  //console.log(joinCo.paramObj.code);

/*********************************************************
**********************************************************
loginSystemByWechat 微信直接登录
**********************************************************
*********************************************************/
$scope.loginSystemByWechat = function(){
	  $http({
           //http://ovclouds.com/api/2.0/bp/account/user/loginSystemByWechat
            url: config.HOST+"/api/2.0/bp/account/user/loginSystemByWechat",
            method: 'POST',
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
            data: {
            	
            	  "code": localStorage.getItem('code'),
                 // "code": joinCo.paramObj.code,
            }
        }).success(function(data){
        	if(data.code == "N01") {
        	 var storage = window.localStorage;
             var localData = data.contents;

             if(storage){
                    storage.setItem('sid',localData.sid);    
                    storage.setItem('userName',localData.userName);    
                    storage.setItem('userSid',localData.userSid);  
                    storage.setItem('email',login.user.email);
                    //storage.setItem('userId',localData.userId); 
                    storage.setItem('mailActive',localData.mailActive); 
                    storage.setItem('wxActive',localData.whetherBindWx);  
                }
                else{
                   // $.cookie('email',localData); 
                    //alert(data.message);
                }
                
               
               $location.path("account_index/chooseTeam").replace();  
        	} 
          else if(data.code== "E01")
          {
                alert(data.message+",请重新登陆");
                localStorage.clear();
                $location.path('login').replace();
            }
         //  else {

        	// 	 alert(data.message);
        	// }

        })

}

 $scope.loginSystemByWechat();




}])
