FIMS.controller('loginController',['$location','$scope','loginService', '$rootScope','$q',
	function($location,$scope,loginService, $rootScope, $q) {
		if (localStorage.getItem('sid')&&localStorage.getItem('userName')&&localStorage.getItem('email')) {
			$location.path("account_index/chooseTeam").replace();
		}else{
			$scope.user = loginService.user;
			$scope.response = loginService.response;
			$scope.subData = loginService.subData;
		}	
}])

FIMS.controller('sigupController',['$scope','sigupService', '$rootScope','$q',
	function($scope,sigupService, $rootScope, $q) {
		$scope.user = sigupService.user;
		$scope.response = sigupService.response;
		$scope.subData = sigupService.subData;
}])

FIMS.controller('account_indexCtrl',['$scope','account_indexService', '$rootScope','$q',
	function($scope,account_indexService, $rootScope, $q) {
		// $scope.userName = localStorage.getItem("userName");
		$scope.exitSystem = account_indexService.exitSystem;
		$scope.switchCom= account_indexService.switchCom;
		account_indexService.getUserName();
}])

FIMS.controller('userSettingCtrl',['$scope','userSettingService', '$rootScope','$q',
	function($scope,userSettingService, $rootScope, $q) {
		// $rootScope.userName = localStorage.getItem("userName");
		$scope.usersetting = userSettingService.user;
		$scope.subData = userSettingService.subData;
		userSettingService.queryUserExtendInfo();
}])

FIMS.controller('chooseTeamController',['$scope','chooseTeamService', '$rootScope','$q',
	function($scope,chooseTeamService, $rootScope, $q) {
     	$scope.subData = chooseTeamService.subData;
		$scope.createCom = chooseTeamService.createCom;
		chooseTeamService.queryJoinedCompanies();
		// $scope.companyList = chooseTeamService.queryJoinedCompanies();
		$scope.joinedCompanies = chooseTeamService.joinedCompanies;
		$scope.setWorkingCompany = chooseTeamService.setWorkingCompany;
}])

FIMS.controller('chooseModuleCtrl',['$scope', '$rootScope','$q','$location',"$http",
	function($scope, $rootScope, $q,$location,$http) {
		// $scope.userName = localStorage.getItem("userName");
		$scope.curCompanyName = localStorage.getItem("curCompanyName");
		$scope.applyJoinCompanyNumber = localStorage.getItem("applyJoinCompanyNumber");

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

FIMS.controller('userManageCtrl', ['$scope','$location','userManageService',
	function($scope,$location,userManageService){
	$scope.genLink = userManageService.genLink;
	$scope.userManageBack = function(){
		$location.path("account_index/chooseModule").replace();
	}
	userManageService.queryMember();
	$scope.companyMem =  userManageService.companyMem;
	// console.log(userManageService.companyMem);
}])
FIMS.controller('agreeMemCtrl', ['$scope','$location','$http',
	function($scope,$location,$http){
	$scope.invitLink = localStorage.getItem('inlink');
	$scope.agreeMemBack = function(){
		$location.path('account_index/userManage');
		localStorage.removeItem('inlink');
	};
	$scope.regenLink = function(){
		$http({
            method: 'post',
            url: config.HOST + '/api/2.0/bp/account/mailbox_link/regenerateInvitationLink',
            // url: 'account/agreeMem/regenerateInvitationLink.json',
            headers:  {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
            data: {
                "sid": localStorage.getItem('sid'),
                "contents": {
                	"companySid": localStorage.getItem('cSid')
                }
            }
        }).success(function(data){
            if (data.code == 'N01') {
                $scope.invitLink = data.contents;
                console.log(data.contents);
                localStorage.setItem('inlink',data.contents);
            }
            else if(data.code=="E00"){
                alert(data.message+",请重新登陆");
                localStorage.clear();
                $location.path('login').replace();
            }else {
                console.log(data.message);
            }  

        })
	};
}])
FIMS.controller('applyApprovalCtrl', ['$scope', '$location','$http',function($scope,$location,$http){
	$scope.applyInfo = JSON.parse(localStorage.getItem('applyJoin'));
	$scope.agreeJoin = function(){
		// console.log($scope.applyInfo);
		var subContent = [];
		var subContentBody = {};
		// console.log(subContent);
		// console.log($scope.applyInfo.length);

		// subContentBody = {
		// 	"applyJoinSid":($scope.applyInfo)[0].applyJoinSid,
		// 	"userApplyStatus":($scope.applyInfo)[0].userApplyStatus
		// }
		// console.log(subContentBody);

		for(var i =0;i<$scope.applyInfo.length;i++){
			subContentBody = {
				"applyJoinSid":($scope.applyInfo)[i].applyJoinSid,
				"userApplyStatus":($scope.applyInfo)[i].userApplyStatus
			}
			subContent.push(subContentBody);
		}
		$http({
            method: 'POST',
			url: config.HOST+"/api/2.0/bp/account/relation/ratifyJoinCompany",
            // url: "account/applyApproval/applyApproval.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
            data: {
                "sid": localStorage.getItem('sid'),
                "contents": subContent
            }
        }).success(function (data) {
            if(data.code == "N01"){
            	console.log($scope.applyInfo);
            	localStorage.setItem("applyJoin",JSON.stringify($scope.applyInfo));
            	$location.path('account_index/chooseModule').replace();
            }
            else if(data.code=="E00"){
                alert(data.message+",请重新登陆");
                localStorage.clear();
                $location.path('login').replace();
            }else {
                console.log(data.message);
            }  
        }).error(function(){
            console.log('http error')
        });
	}

	$scope.applyApprovalBack = function(){
		localStorage.removeItem('applyJoin');
		$location.path("account_index/chooseModule").replace();
	}

	$scope.refuseJoin = function(index,aid){
	 	$http({
            method: 'POST',
			url: config.HOST+"/api/2.0/bp/account/relation/ratifyJoinCompany",
            // url: "account/applyApproval/applyApproval.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
            data: {
                "sid": localStorage.getItem('sid'),
                "contents": [
                	{
                		"applyJoinSid": aid,
                		"userApplyStatus": "2"
                	}
                ]
            }
        }).success(function (data) {
            if(data.code == "N01"){
            	$scope.applyInfo.splice(index,1);
            	console.log($scope.applyInfo);

            	localStorage.setItem("applyJoin",JSON.stringify($scope.applyInfo));
            	console.log(index);
            }
            else if(data.code=="E00"){
                alert(data.message+",请重新登陆");
                localStorage.clear();
                $location.path('login').replace();
            }else {
                console.log(data.message);
            }  

        }).error(function(){
            console.log('http error')
        });
	}
}])
FIMS.controller('joinCoCtrl', ['$scope','$http', '$state','$location',function ($scope,$http,$state,$location) {
	var joinCo = {
			paramObj: {},
			applicantJobNumber: "",
			notes: "我是"+localStorage.getItem('userName')
	};

	// function(){
	// 	var url = window.location.search; 
	// 	console.log(url);
	// }();
	function init(){
		// console.log($stateParams.companyShortName);
		var url = location.href;
		var param = url.substring(url.indexOf("?")+1, url.length).split("&");
		for (var i=0;i< param.length;i++) {
			joinCo.paramObj[param[i].substring(0,param[i].indexOf("="))] = param[i].substring(param[i].indexOf("=")+1)
		}
		if (joinCo.paramObj!=null){
			if (localStorage.getItem('sid')&&localStorage.getItem('userName')&&localStorage.getItem('email')) {
				localStorage.setItem("apj",JSON.stringify(joinCo.paramObj));
			}else {
				localStorage.setItem("apj",JSON.stringify(joinCo.paramObj));
				alert("您还未登录");
				$location.path("login");
			}
		}
	}
	
	init();


	$scope.applyJoinCompany = function(){
		var paramObj = JSON.parse(localStorage.getItem('apj'));
		$http({
			method: "POST",
			// url: "account/joinCo/joinCo.json",
			url: config.HOST + "/api/2.0/bp/account/relation/applyJoinCompany",
			header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"contents": {
				 	"companySid": paramObj.companySid,
			        "invitePeopleSid":paramObj.invitePeopleSid,
			        "applicantJobNumber":joinCo.applicantJobNumber,
			        "notes":joinCo.notes,
			        "inviteString": location.href
				}
			}
		})
		.success(function(data) {
			if (data.code=='N01') {
				alert("完成申请!");
				localStorage.removeItem('apj');
				$state.go('account_index.chooseTeam');
			}
		    else if(data.code=="E00"){
                alert(data.message+",请重新登陆");
                localStorage.clear();
                $location.path('login').replace();
            }else {
                console.log(data.message);
            }  
		})
	}

	$scope.joinCo = joinCo;
}])
FIMS.controller('comSettingCtrl', ['$scope','$location','$http',function($scope,$location,$http){
	var comSetting = {
		shortName: localStorage.getItem('curCompanyName'),
		name: '',
		comCode: '',
		comTel: '',
		comWeb: '',
		dictionary: {
			// country: [],
			province: [],
			city: [],
			iType: [],
			iInfo: []
		},
		
		industry: {
			iType: {
				name: '',
				code: ''
			},
			iInfo: {
				name: '',
				code: ''
			}

		},

		address: {
			province: {
				name: '',
				code: ''
			},
			city: {
				name: '',
				code: ''
			}
		}
	};

	comSetting.improveComInfo = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/company/improveCompanyInfo",
			// url: "account/comSetting/improveComInfo.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				 "contents": {
			        "companySid": localStorage.getItem("cSid"),
			        "companyShortName": comSetting.shortName,
			        "companyFullName": comSetting.name,
			        "companyRegionCode": "86#",
			        "companyRegion": "中国",
			        "companyProvinceCode": comSetting.address.province.code,
			        "companyProvince": comSetting.address.province.name,
			        "companyCityCode": comSetting.address.city.code,
			        "companyCity": comSetting.address.city.name,
			        "companyIndustryCode": comSetting.industry.iInfo.code,
			        "companyIndustry": comSetting.industry.iInfo.name,
			        "companyZipCode": comSetting.comCode,
			        "companyPhone": comSetting.comTel,
			        "companyWebsite": comSetting.comWeb
			    }
			}
		})
		.success(function(data){
            if (data.code=="N01"){
            	alert("公司信息更新成功");
            	$location.path("account_index/chooseModule");
            }
            else if(data.code=="E00"){
            	alert(data.message+"（获取省份）,请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }
        }).error(function () {
            console.log('improveComInfo'+data.message);
        });
	}

	comSetting.getProvince = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicProvince",
			// url: "account/comSetting/Province.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid')
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                comSetting.dictionary.province = [];
                for (var i=0;i < data.contents.length;i++){
                    comSetting.dictionary.province.push({
                        "name": data.contents[i].provinceName,
                        "code" : data.contents[i].provinceCode
                    });
                }   
            }
            else if(data.code=="E00"){
            	alert(data.message+"（获取省份）,请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }
        }).error(function () {
            console.log('data.message');
        });
	}

	comSetting.getProvince();


	comSetting.getCity = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicCity",
			// url: "account/comSetting/City.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"provinceCode": comSetting.address.province.code
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                comSetting.dictionary.city = [];
                for (var i=0;i < data.contents.length;i++){
                    comSetting.dictionary.city.push({
                        "name": data.contents[i].cityName,
                        "code" : data.contents[i].cityCode
                    });
                }   
            }
         	else if(data.code=="E00"){
            	alert(data.message+"（获取城市）,请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }        
        }).error(function () {
            console.log('error');
        });
	}

	comSetting.queryType = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicCompanyIndustryType",
			// url: "account/comSetting/Industry.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid')
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                comSetting.dictionary.iType = [];
                for (var i=0;i < data.contents.length;i++){
                    comSetting.dictionary.iType.push({
                        "code": data.contents[i].companyIndustryCode,
                        "name" : data.contents[i].companyIndustry
                    });
                }   
            }
            else {
                console.log(data.message);
            }
        }).error(function () {
            console.log('error');
        });
	}

	comSetting.queryType();


	comSetting.queryInfo = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicCompanyIndustry",
			// url: "account/comSetting/Industry.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"companyIndustryCode": comSetting.industry.iType.code
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                comSetting.dictionary.iInfo = [];
                for (var i=0;i < data.contents.length;i++){
                    comSetting.dictionary.iInfo.push({
                        "code": data.contents[i].companyIndustryCode,
                        "name" : data.contents[i].companyIndustry
                    });
                }   
            }
            else if(data.code=="E00"){
            	alert(data.message+",请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }        
            
        }).error(function () {
            console.log('error');
        });

	}

	comSetting.queryCompanyExtendInfo = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/company/queryCompanyExtendInfo",
			// url: "account/comSetting/queryCompanyExtendInfo.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"companySid": localStorage.getItem("cSid")
			}
		})
		.success(function(data){
            if (data.code=="N01"){
            	comSetting.shortName = data.contents.companyShortName ;
		        comSetting.name = data.contents.companyFullName;
		        comSetting.address.province.code = data.contents.countryRegionCode;
			    comSetting.address.province.name = data.contents.companyRegion;
			    comSetting.address.city.code =data.contents.companyProvinceCode;
			    comSetting.address.city.name = data.contents.companyProvince;
			    comSetting.industry.iInfo.code = data.contents.companyIndustryCode;
			    comSetting.industry.iInfo.name = data.contents.companyIndustry;
			    comSetting.comCode = data.contents.companyZipCode;
			    comSetting.comTel = data.contents.companyPhone;
			    comSetting.comWeb = data.contents.companyWebsite;
            }
            else if(data.code=="E00"){
            	alert(data.message+",请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }
        }).error(function () {
            console.log('improveComInfo'+data.message);
        });
	}

	comSetting.queryCompanyExtendInfo();

	$scope.comSetting = comSetting;


}])
FIMS.controller('materialCtrl', ['$scope',  '$location', '$http', 
	function($scope,$location,$http){
		var material = JSON.parse(localStorage.getItem('singlematerial'));
		var updateMaterial = {
			"materialNo": material.materialNo,
            "materialShortName": material.materialShortName,
            "materialVersion": material.materialVersion,
            "materialFullName": material.materialFullName,
           	"materialSid": material.materialSid,
            "notes": material.notes
		};
		console.log(material);
		$scope.updateMaterial= updateMaterial;

		$scope.materialBack = function(){
			localStorage.removeItem('singlematerial');
			$location.path('account_index/materiallist').replace();
		}


		$scope.updateMaterial = updateMaterial;

		$scope.addOrUpdateMaterials = function(){
			$http({
				method: "POST",
				// url: "account/joinCo/joinCo.json",
				url: config.HOST + "/api/2.0/bp/engineering/materials/addOrUpdateMaterials",
				url: "manage/engineer/material/addOrUpdateMaterials.json",
				header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
				data: {
					"sid": localStorage.getItem('sid'),
				    "operateStatus": 1,
				    "materialSid": material.materialSid,
				    "materialNo":updateMaterial.materialNo,
				    "materialShortName":updateMaterial.materialShortName,
				    "materialVersion":updateMaterial.materialVersion,
				    "materialFullName":updateMaterial.materialFullName,
				    "companySid": localStorage.getItem('cSid'),
				    "companyShortName":updateMaterial.materialShortName,
				    "notes":updateMaterial.notes
				}
			})
			.success(function(data){
	            if (data.code == 'N01') {
	                alert(data.message);
	                $scope.materialBack();
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
FIMS.controller('materialListCtrl', ['$scope', '$location', '$http', 
	function($scope,$location,$http){
	$scope.companyShortName = localStorage.getItem('curCompanyName');
	$scope.materiallistBack = function(){
		localStorage.removeItem('singlematerial');
		$location.path('account_index/chooseModule').replace();
	}
	$scope.queryMaterialsInfo = function(){
		$http({
			method: "POST",
			// url: "account/joinCo/joinCo.json",
			url: config.HOST + "/api/2.0/bp/engineering/materials/queryMaterialsInfo",
			// url: "manage/engineer/material/queryMaterialsInfo.json",
			header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"companySid": localStorage.getItem('cSid')
			}
		})
		.success(function(data){
            if (data.code == 'N01') {
                $scope.listdata = data.contents;
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

	$scope.queryMaterialsInfo();

	$scope.querySingleMaterial = function(msid){
		$http({
			method: "POST",
			// url: "account/joinCo/joinCo.json",
			url: config.HOST + "/api/2.0/bp/engineering/materials/queryMaterialsInfo",
			// url: "manage/engineer/material/querySingleMaterial.json",
			header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"materialSid": msid
			}
		})
		.success(function(data){
            if (data.code == 'N01') {
                $scope.singlematerial = data.contents;
                localStorage.setItem('singlematerial',JSON.stringify(data.contents));
                $location.path('account_index/material');
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

	var newMaterial = {
		"materialNo": "",
        "materialShortName": "",
        "materialVersion": "",
        "materialFullName": "",
        "notes": ""
	};

	$scope.newMaterial= newMaterial;

	$scope.addOrUpdateMaterials = function(){
		$http({
			method: "POST",
			// url: "account/joinCo/joinCo.json",
			url: config.HOST + "/api/2.0/bp/engineering/materials/addOrUpdateMaterials",
			// url: "manage/engineer/material/addOrUpdateMaterials.json",
			header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
			    "operateStatus": 0,
			    "materialNo":newMaterial.materialNo,
			    "materialShortName":newMaterial.materialShortName,
			    "materialVersion":newMaterial.materialVersion,
			    "materialFullName":newMaterial.materialFullName,
			    "companySid": localStorage.getItem('cSid'),
			    "companyShortName":newMaterial.materialShortName,
			    "notes":newMaterial.notes
			}
		})
		.success(function(data){
            if (data.code == 'N01') {
            	$scope.queryMaterialsInfo();
                alert(data.message);
                $scope.newMaterial = {
                	"materialNo": "",
			        "materialShortName": "",
			        "materialVersion": "",
			        "materialFullName": "",
			        "notes": ""
                }
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
FIMS.controller('customerCtrl', ['$scope',  '$location', '$http', 
	function($scope,$location,$http){
		var customer = JSON.parse(localStorage.getItem('singlecustomer'));
		var updatecustomer = {
			"customerNo": customer.customerNo,
            "customerShortName": customer.customerShortName,
            "customerFullName": customer.customerFullName,
            "contactPhone": customer.contactPhone,
            "contactAddress": customer.contactAddress,
		    "zipCode": customer.zipCode,
            "notes": customer.notes
		};
		console.log(customer);
		$scope.updatecustomer= updatecustomer;

		$scope.customerBack = function(){
			localStorage.removeItem('singlecustomer');
			$location.path('account_index/customerlist').replace();
		}


		$scope.updatecustomer = updatecustomer;

		$scope.addOrUpdateCustomerInfo = function(){
			$http({
				method: "POST",
				// url: "account/joinCo/joinCo.json",
				url: config.HOST + "/api/2.0/bp/customer/customer/addOrUpdateCustomerInfo",
				// url: "manage/customer/customer/addOrUpdateCustomerInfo.json",
				header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
				data: {
					"sid": localStorage.getItem('sid'),
				    "operateStatus": 1,
				    "customerNo":updatecustomer.customerNo,
				    "customerShortName":updatecustomer.customerShortName,
				    "customerFullName":updatecustomer.customerFullName,
				    "companySid": localStorage.getItem('cSid'),
				    "companyShortName":localStorage.getItem('curCompanyName'),
				    "contactPhone": updatecustomer.contactPhone,
				    "contactAddress": updatecustomer.contactAddress,
		    		"zipCode": updatecustomer.zipCode,
				    "notes":updatecustomer.notes
				}
			})
			.success(function(data){
	            if (data.code == 'N01') {
	                alert(data.message);
	                $scope.customerBack();
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
FIMS.controller('customerListCtrl', ['$scope', '$location', '$http', 
	function($scope,$location,$http){
	$scope.companyShortName = localStorage.getItem('curCompanyName');
	$scope.customerlistBack = function(){
		localStorage.removeItem('singlecustomer');
		$location.path('account_index/chooseModule').replace();
	}
	$scope.queryCustomerInfo = function(){
		$http({
			method: "POST",
			// url: "account/joinCo/joinCo.json",
			url: config.HOST + "/api/2.0/bp/customer/customer/queryCustomerInfo",
			// url: "manage/customer/customer/queryCustomerInfo.json",
			header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"companySid": localStorage.getItem('cSid')
			}
		})
		.success(function(data){
            if (data.code == 'N01') {
                $scope.listdata = data.contents;
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

	$scope.queryCustomerInfo();

	$scope.querySingleCustomerInfo = function(msid){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/customer/customer/querySingleCustomerInfo",
			// url: "manage/customer/customer/querySingleCustomerInfo.json",
			header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"customerSid": msid
			}
		})
		.success(function(data){
            if (data.code == 'N01') {
                // $scope.singlecustomer = data.contents;
                localStorage.setItem('singlecustomer',JSON.stringify(data.contents));
                $location.path('account_index/customer');
            }
            // else if(data.code=="E00"){
            //     alert(data.message+",请重新登陆");
            //     localStorage.clear();
            //     $location.path('login').replace();
            // }else {
            //     alert(data.message);
            // }  
        })
	}

	var newcustomer = {
	    "customerNo":"",
	    "customerShortName":"",
	    "customerFullName":"",
	    "companySid":"",
	    "companyShortName":"",
	    "contactPhone":"",
	    "contactAddress":"",
	    "notes":"",
	    "zipCode":""
	};

	$scope.newcustomer= newcustomer;

	$scope.addOrUpdateCustomers = function(){
		$http({
			method: "POST",
			// url: "account/joinCo/joinCo.json",
			url: config.HOST + "/api/2.0/bp/customer/customer/addOrUpdatecustomers",
			// url: "manage/customer/customer/addOrUpdateCustomerInfo.json",
			header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
			    "status": 0,
			    "customerNo":newcustomer.customerNo,
			    "customerShortName":newcustomer.customerShortName,
			    "customerFullName":newcustomer.customerFullName,
			    "companySid": localStorage.getItem('cSid'),
			    "companyShortName":localStorage.getItem('curCompanyName'),
			    "contactPhone":newcustomer.contactPhone,
	    		"contactAddress":newcustomer.contactAddress,
			    "zipCode": newcustomer.zipCode,
			    "notes":newcustomer.notes
			}
		})
		.success(function(data){
            if (data.code == 'N01') {
            	$scope.queryCustomerInfo();
                alert(data.message);
                $scope.newcustomer = {
                	"customerNo":"",
				    "customerShortName":"",
				    "customerFullName":"",
				    "companySid":"",
				    "companyShortName":"",
				    "contactPhone":"",
				    "contactAddress":"",
				    "notes":"",
				    "zipCode":""
                }
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
FIMS.controller('vendorCtrl', ['$scope',  '$location', '$http', 
	function($scope,$location,$http){
		var vendor = JSON.parse(localStorage.getItem('singlevendor'));
		var updatevendor = {
			"vendorNo": vendor.vendorNo,
            "vendorShortName": vendor.vendorShortName,
            "vendorFullName": vendor.vendorFullName,
            "contactPhone": vendor.contactPhone,
            "contactAddress": vendor.contactAddress,
		    "zipCode": vendor.zipCode,
            "notes": vendor.notes
		};
		console.log(vendor);
		$scope.updatevendor= updatevendor;

		$scope.vendorBack = function(){
			localStorage.removeItem('singlevendor');
			$location.path('account_index/vendorlist').replace();
		}

		$scope.updatevendor = updatevendor;

		$scope.addOrUpdateVendorInfo = function(){
			$http({
				method: "POST",
				// url: "account/joinCo/joinCo.json",
				url: config.HOST + "/api/2.0/bp/vendor/vendor/addOrUpdateVendorInfo",
				// url: "manage/vendor/vendor/addOrUpdatevendorInfo.json",
				header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
				data: {
					"sid": localStorage.getItem('sid'),
				    "operateStatus": 1,
				    "vendorNo":updatevendor.vendorNo,
				    "vendorShortName":updatevendor.vendorShortName,
				    "vendorFullName":updatevendor.vendorFullName,
				    "companySid": localStorage.getItem('cSid'),
				    "companyShortName":localStorage.getItem('curCompanyName'),
				    "contactPhone": updatevendor.contactPhone,
				    "contactAddress": updatevendor.contactAddress,
		    		"zipCode": updatevendor.zipCode,
				    "notes":updatevendor.notes
				}
			})
			.success(function(data){
	            if (data.code == 'N01') {
	                alert(data.message);
	                $scope.vendorBack();
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
FIMS.controller('vendorListCtrl', ['$scope', '$location', '$http', 
	function($scope,$location,$http){
	$scope.companyShortName = localStorage.getItem('curCompanyName');
	$scope.vendorlistBack = function(){
		localStorage.removeItem('singlevendor');
		$location.path('account_index/chooseModule').replace();
	}
	$scope.queryVendorInfo = function(){
		$http({
			method: "POST",
			// url: "account/joinCo/joinCo.json",
			url: config.HOST + "/api/2.0/bp/vendor/vendor/queryVendorInfo",
			// url: "manage/vendor/vendor/queryVendorInfo.json",
			header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"companySid": localStorage.getItem('cSid')
			}
		})
		.success(function(data){
            if (data.code == 'N01') {
                $scope.listdata = data.contents;
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

	$scope.queryVendorInfo();

	$scope.querySingleVendorInfo = function(msid){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/vendor/vendor/querySingleVendorInfo",
			// url: "manage/vendor/vendor/querySingleVendorInfo.json",
			header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"vendorSid": msid
			}
		})
		.success(function(data){
            if (data.code == 'N01') {
                // $scope.singlevendor = data.contents;
                localStorage.setItem('singlevendor',JSON.stringify(data.contents));
                $location.path('account_index/vendor');
            }
            // else if(data.code=="E00"){
            //     alert(data.message+",请重新登陆");
            //     localStorage.clear();
            //     $location.path('login').replace();
            // }else {
            //     alert(data.message);
            // }  
        })
	}

	var newvendor = {
	    "vendorNo":"",
	    "vendorShortName":"",
	    "vendorFullName":"",
	    "companySid":"",
	    "companyShortName":"",
	    "contactPhone":"",
	    "contactAddress":"",
	    "notes":"",
	    "zipCode":""
	};

	$scope.newvendor= newvendor;

	$scope.addOrUpdateVendors = function(){
		$http({
			method: "POST",
			// url: "account/joinCo/joinCo.json",
			url: config.HOST + "/api/2.0/bp/vendor/vendor/addOrUpdateVendorInfo",
			// url: "manage/vendor/vendor/addOrUpdateVendorInfo.json",
			header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
			    "status": 0,
			    "vendorNo":newvendor.vendorNo,
			    "vendorShortName":newvendor.vendorShortName,
			    "vendorFullName":newvendor.vendorFullName,
			    "companySid": localStorage.getItem('cSid'),
			    "companyShortName":localStorage.getItem('curCompanyName'),
			    "contactPhone":newvendor.contactPhone,
	    		"contactAddress":newvendor.contactAddress,
			    "zipCode": newvendor.zipCode,
			    "notes":newvendor.notes
			}
		})
		.success(function(data){
            if (data.code == 'N01') {
            	$scope.queryVendorInfo();
                alert(data.message);
                $scope.newvendor = {
                	"vendorNo":"",
				    "vendorShortName":"",
				    "vendorFullName":"",
				    "companySid":"",
				    "companyShortName":"",
				    "contactPhone":"",
				    "contactAddress":"",
				    "notes":"",
				    "zipCode":""
                }
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
FIMS.controller('planListCtrl', ['$scope', '$location', '$http', 
	function($scope,$location,$http){
		var planlist = {
			dictionary: {
				QCPType: [],
				materialName: [],
				materialVersion: []
			},
			QCPType: {
				checkoutPlanTypeCode: "",
				checkoutPlanType: ""
			},
			Selected : {
				checkoutPlanType :"",
				materialNo: "",
				materialVersion: ""
			},
			QCPSelected :[]
		};
		$scope.companyShortName = localStorage.getItem('curCompanyName');
		$scope.planlist = planlist;

		$scope.planlistBack = function(){
			// localStorage.removeItem('singleplan');
			$location.path('account_index/chooseModule').replace();
		}

		//  /api/2.0/bp/qcp/qcp
		//
		$scope.queryDicQCPType = function(){
			$http({
				method: "POST",
				// url: config.HOST + "/api/2.0/bp/account/dic/queryDicQCPType",
				url: "plan/queryDicQCPType.json",
				header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
				data: {
					"sid": localStorage.getItem('sid'),
				}
			})
			.success(function(data){
	            if (data.code == 'N01') {
	 				planlist.dictionary.QCPType = [];
	                for (var i=0; i < data.contents.length;i++) {
	                	planlist.dictionary.QCPType.push({
	                		"name": data.contents[i].checkoutPlanType,
	                		"code": data.contents[i].checkoutPlanTypeCode
	                	});
	                }
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

		$scope.queryDicQCPType();

		//根据检验计划类型获取检验计划
		$scope.queryQCPByType = function(){
			$http({
				method: "POST",
				// url: config.HOST + "/api/2.0/bp/qcp/qcp/queryQCP",
				url: "plan/queryQCPByType.json",
				header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
				data: {
					"sid": localStorage.getItem('sid'),
					"companySid": localStorage.getItem('cSid'),
					"checkoutPlanType": planlist.Selected.checkoutPlanType
				}
			})
			.success(function(data){
	            if (data.code == 'N01') {
	                planlist.QCPSelected = data.contents;          
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

		// 查询检验计划
		$scope.queryQCP = function(){
			$http({
				method: "POST",
				// url: config.HOST + "/api/2.0/bp/qcp/qcp/queryQCP",
				url: "plan/queryQCP.json",
				header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
				data: {
					"sid": localStorage.getItem('sid'),
					"companySid": localStorage.getItem('cSid')
				}
			})
			.success(function(data){
	            if (data.code == 'N01') {
	                planlist.dictionary.materialName = data.contents;
	                planlist.QCPSelected = data.contents;          
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

		$scope.queryQCP();

		//根据物料编号获取物料版本
		$scope.queryMaterialVersionByMaterialNo = function(){
			$http({
				method: "POST",
				// url: config.HOST + "/api/2.0/bp/qcp/qcp/queryMaterialVersionByMaterialNo",
				url: "plan/queryMaterialVersionByMaterialNo.json",
				header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
				data: {
					"sid": localStorage.getItem('sid'),
					"companySid": localStorage.getItem('cSid'),
					"materialNo": planlist.Selected.materialNo
				}
			})
			.success(function(data){
	            if (data.code == 'N01') {           	
	                planlist.dictionary.materialVersion = data.contents;
	                planlist.QCPSelected = data.contents;
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

		//根据物料ID和物料版本获取检验计划
		$scope.queryQCPByMaterial = function(){
			$http({
				method: "POST",
				// url: config.HOST + "/api/2.0/bp/qcp/qcp/queryQCPByMaterial",
				url: "plan/queryQCPByMaterial.json",
				header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
				data: {
					"sid": localStorage.getItem('sid'),
					"companySid": localStorage.getItem('cSid'),
					"materialNo": planlist.Selected.materialNo,
					"materialVersion": planlist.Selected.materialVersion
				}
			})
			.success(function(data){
	            if (data.code == 'N01') {           	
	                planlist.QCPSelected = data.contents;
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
FIMS.controller('comSettingCtrl', ['$scope','$location','$http',function($scope,$location,$http){
	var comSetting = {
		shortName: localStorage.getItem('curCompanyName'),
		name: '',
		comCode: '',
		comTel: '',
		comWeb: '',
		dictionary: {
			// country: [],
			province: [],
			city: [],
			iType: [],
			iInfo: []
		},
		
		industry: {
			iType: {
				name: '',
				code: ''
			},
			iInfo: {
				name: '',
				code: ''
			}

		},

		address: {
			province: {
				name: '',
				code: ''
			},
			city: {
				name: '',
				code: ''
			}
		}
	};

	comSetting.improveComInfo = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/company/improveCompanyInfo",
			// url: "account/comSetting/improveComInfo.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				 "contents": {
			        "companySid": localStorage.getItem("cSid"),
			        "companyShortName": comSetting.shortName,
			        "companyFullName": comSetting.name,
			        "companyRegionCode": "86#",
			        "companyRegion": "中国",
			        "companyProvinceCode": comSetting.address.province.code,
			        "companyProvince": comSetting.address.province.name,
			        "companyCityCode": comSetting.address.city.code,
			        "companyCity": comSetting.address.city.name,
			        "companyIndustryCode": comSetting.industry.iInfo.code,
			        "companyIndustry": comSetting.industry.iInfo.name,
			        "companyZipCode": comSetting.comCode,
			        "companyPhone": comSetting.comTel,
			        "companyWebsite": comSetting.comWeb
			    }
			}
		})
		.success(function(data){
            if (data.code=="N01"){
            	alert("公司信息更新成功");
            	$location.path("account_index/chooseModule");
            }
            else if(data.code=="E00"){
            	alert(data.message+"（获取省份）,请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }
        }).error(function () {
            console.log('improveComInfo'+data.message);
        });
	}

	comSetting.getProvince = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicProvince",
			// url: "account/comSetting/Province.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid')
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                comSetting.dictionary.province = [];
                for (var i=0;i < data.contents.length;i++){
                    comSetting.dictionary.province.push({
                        "name": data.contents[i].provinceName,
                        "code" : data.contents[i].provinceCode
                    });
                }   
            }
            else if(data.code=="E00"){
            	alert(data.message+"（获取省份）,请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }
        }).error(function () {
            console.log('data.message');
        });
	}

	comSetting.getProvince();


	comSetting.getCity = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicCity",
			// url: "account/comSetting/City.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"provinceCode": comSetting.address.province.code
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                comSetting.dictionary.city = [];
                for (var i=0;i < data.contents.length;i++){
                    comSetting.dictionary.city.push({
                        "name": data.contents[i].cityName,
                        "code" : data.contents[i].cityCode
                    });
                }   
            }
         	else if(data.code=="E00"){
            	alert(data.message+"（获取城市）,请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }        
        }).error(function () {
            console.log('error');
        });
	}

	comSetting.queryType = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicCompanyIndustryType",
			// url: "account/comSetting/Industry.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid')
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                comSetting.dictionary.iType = [];
                for (var i=0;i < data.contents.length;i++){
                    comSetting.dictionary.iType.push({
                        "code": data.contents[i].companyIndustryCode,
                        "name" : data.contents[i].companyIndustry
                    });
                }   
            }
            else {
                console.log(data.message);
            }
        }).error(function () {
            console.log('error');
        });
	}

	comSetting.queryType();


	comSetting.queryInfo = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicCompanyIndustry",
			// url: "account/comSetting/Industry.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"companyIndustryCode": comSetting.industry.iType.code
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                comSetting.dictionary.iInfo = [];
                for (var i=0;i < data.contents.length;i++){
                    comSetting.dictionary.iInfo.push({
                        "code": data.contents[i].companyIndustryCode,
                        "name" : data.contents[i].companyIndustry
                    });
                }   
            }
            else if(data.code=="E00"){
            	alert(data.message+",请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }        
            
        }).error(function () {
            console.log('error');
        });

	}

	comSetting.queryCompanyExtendInfo = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/company/queryCompanyExtendInfo",
			// url: "account/comSetting/queryCompanyExtendInfo.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"companySid": localStorage.getItem("cSid")
			}
		})
		.success(function(data){
            if (data.code=="N01"){
            	comSetting.shortName = data.contents.companyShortName ;
		        comSetting.name = data.contents.companyFullName;
		        comSetting.address.province.code = data.contents.countryRegionCode;
			    comSetting.address.province.name = data.contents.companyRegion;
			    comSetting.address.city.code =data.contents.companyProvinceCode;
			    comSetting.address.city.name = data.contents.companyProvince;
			    comSetting.industry.iInfo.code = data.contents.companyIndustryCode;
			    comSetting.industry.iInfo.name = data.contents.companyIndustry;
			    comSetting.comCode = data.contents.companyZipCode;
			    comSetting.comTel = data.contents.companyPhone;
			    comSetting.comWeb = data.contents.companyWebsite;
            }
            else if(data.code=="E00"){
            	alert(data.message+",请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }
        }).error(function () {
            console.log('improveComInfo'+data.message);
        });
	}

	comSetting.queryCompanyExtendInfo();

	$scope.comSetting = comSetting;


}])
FIMS.controller('planReviseCtrl', ['$scope','$location','$http',function($scope,$location,$http){
	var planRevise = {
		shortName: localStorage.getItem('curCompanyName'),
		name: '',
		comCode: '',
		comTel: '',
		comWeb: '',
		dictionary: {
			// country: [],
			province: [],
			city: [],
			iType: [],
			iInfo: []
		},
		
		industry: {
			iType: {
				name: '',
				code: ''
			},
			iInfo: {
				name: '',
				code: ''
			}

		},

		address: {
			province: {
				name: '',
				code: ''
			},
			city: {
				name: '',
				code: ''
			}
		}
	};

	planRevise.improveComInfo = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/company/improveCompanyInfo",
			// url: "account/planRevise/improveComInfo.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				 "contents": {
			        "companySid": localStorage.getItem("cSid"),
			        "companyShortName": planRevise.shortName,
			        "companyFullName": planRevise.name,
			        "companyRegionCode": "86#",
			        "companyRegion": "中国",
			        "companyProvinceCode": planRevise.address.province.code,
			        "companyProvince": planRevise.address.province.name,
			        "companyCityCode": planRevise.address.city.code,
			        "companyCity": planRevise.address.city.name,
			        "companyIndustryCode": planRevise.industry.iInfo.code,
			        "companyIndustry": planRevise.industry.iInfo.name,
			        "companyZipCode": planRevise.comCode,
			        "companyPhone": planRevise.comTel,
			        "companyWebsite": planRevise.comWeb
			    }
			}
		})
		.success(function(data){
            if (data.code=="N01"){
            	alert("公司信息更新成功");
            	$location.path("account_index/chooseModule");
            }
            else if(data.code=="E00"){
            	alert(data.message+"（获取省份）,请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }
        }).error(function () {
            console.log('improveComInfo'+data.message);
        });
	}

	planRevise.getProvince = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicProvince",
			// url: "account/planRevise/Province.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid')
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                planRevise.dictionary.province = [];
                for (var i=0;i < data.contents.length;i++){
                    planRevise.dictionary.province.push({
                        "name": data.contents[i].provinceName,
                        "code" : data.contents[i].provinceCode
                    });
                }   
            }
            else if(data.code=="E00"){
            	alert(data.message+"（获取省份）,请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }
        }).error(function () {
            console.log('data.message');
        });
	}

	planRevise.getProvince();


	planRevise.getCity = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicCity",
			// url: "account/planRevise/City.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"provinceCode": planRevise.address.province.code
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                planRevise.dictionary.city = [];
                for (var i=0;i < data.contents.length;i++){
                    planRevise.dictionary.city.push({
                        "name": data.contents[i].cityName,
                        "code" : data.contents[i].cityCode
                    });
                }   
            }
         	else if(data.code=="E00"){
            	alert(data.message+"（获取城市）,请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }        
        }).error(function () {
            console.log('error');
        });
	}

	planRevise.queryType = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicCompanyIndustryType",
			// url: "account/planRevise/Industry.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid')
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                planRevise.dictionary.iType = [];
                for (var i=0;i < data.contents.length;i++){
                    planRevise.dictionary.iType.push({
                        "code": data.contents[i].companyIndustryCode,
                        "name" : data.contents[i].companyIndustry
                    });
                }   
            }
            else {
                console.log(data.message);
            }
        }).error(function () {
            console.log('error');
        });
	}

	planRevise.queryType();


	planRevise.queryInfo = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicCompanyIndustry",
			// url: "account/planRevise/Industry.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"companyIndustryCode": planRevise.industry.iType.code
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                planRevise.dictionary.iInfo = [];
                for (var i=0;i < data.contents.length;i++){
                    planRevise.dictionary.iInfo.push({
                        "code": data.contents[i].companyIndustryCode,
                        "name" : data.contents[i].companyIndustry
                    });
                }   
            }
            else if(data.code=="E00"){
            	alert(data.message+",请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }        
            
        }).error(function () {
            console.log('error');
        });

	}

	planRevise.queryCompanyExtendInfo = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/company/queryCompanyExtendInfo",
			// url: "account/planRevise/queryCompanyExtendInfo.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"companySid": localStorage.getItem("cSid")
			}
		})
		.success(function(data){
            if (data.code=="N01"){
            	planRevise.shortName = data.contents.companyShortName ;
		        planRevise.name = data.contents.companyFullName;
		        planRevise.address.province.code = data.contents.countryRegionCode;
			    planRevise.address.province.name = data.contents.companyRegion;
			    planRevise.address.city.code =data.contents.companyProvinceCode;
			    planRevise.address.city.name = data.contents.companyProvince;
			    planRevise.industry.iInfo.code = data.contents.companyIndustryCode;
			    planRevise.industry.iInfo.name = data.contents.companyIndustry;
			    planRevise.comCode = data.contents.companyZipCode;
			    planRevise.comTel = data.contents.companyPhone;
			    planRevise.comWeb = data.contents.companyWebsite;
            }
            else if(data.code=="E00"){
            	alert(data.message+",请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }
        }).error(function () {
            console.log('improveComInfo'+data.message);
        });
	}

	planRevise.queryCompanyExtendInfo();

	$scope.planRevise = planRevise;


}])
FIMS.controller('planAddCtrl', ['$scope','$location','$http',function($scope,$location,$http){
	var planAdd = {
		shortName: localStorage.getItem('curCompanyName'),
		name: '',
		comCode: '',
		comTel: '',
		comWeb: '',
		dictionary: {
			// country: [],
			province: [],
			city: [],
			iType: [],
			iInfo: []
		},
		
		industry: {
			iType: {
				name: '',
				code: ''
			},
			iInfo: {
				name: '',
				code: ''
			}

		},

		address: {
			province: {
				name: '',
				code: ''
			},
			city: {
				name: '',
				code: ''
			}
		}
	};

	planAdd.improveComInfo = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/company/improveCompanyInfo",
			// url: "account/planAdd/improveComInfo.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				 "contents": {
			        "companySid": localStorage.getItem("cSid"),
			        "companyShortName": planAdd.shortName,
			        "companyFullName": planAdd.name,
			        "companyRegionCode": "86#",
			        "companyRegion": "中国",
			        "companyProvinceCode": planAdd.address.province.code,
			        "companyProvince": planAdd.address.province.name,
			        "companyCityCode": planAdd.address.city.code,
			        "companyCity": planAdd.address.city.name,
			        "companyIndustryCode": planAdd.industry.iInfo.code,
			        "companyIndustry": planAdd.industry.iInfo.name,
			        "companyZipCode": planAdd.comCode,
			        "companyPhone": planAdd.comTel,
			        "companyWebsite": planAdd.comWeb
			    }
			}
		})
		.success(function(data){
            if (data.code=="N01"){
            	alert("公司信息更新成功");
            	$location.path("account_index/chooseModule");
            }
            else if(data.code=="E00"){
            	alert(data.message+"（获取省份）,请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }
        }).error(function () {
            console.log('improveComInfo'+data.message);
        });
	}

	planAdd.getProvince = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicProvince",
			// url: "account/planAdd/Province.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid')
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                planAdd.dictionary.province = [];
                for (var i=0;i < data.contents.length;i++){
                    planAdd.dictionary.province.push({
                        "name": data.contents[i].provinceName,
                        "code" : data.contents[i].provinceCode
                    });
                }   
            }
            else if(data.code=="E00"){
            	alert(data.message+"（获取省份）,请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }
        }).error(function () {
            console.log('data.message');
        });
	}

	planAdd.getProvince();


	planAdd.getCity = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicCity",
			// url: "account/planAdd/City.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"provinceCode": planAdd.address.province.code
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                planAdd.dictionary.city = [];
                for (var i=0;i < data.contents.length;i++){
                    planAdd.dictionary.city.push({
                        "name": data.contents[i].cityName,
                        "code" : data.contents[i].cityCode
                    });
                }   
            }
         	else if(data.code=="E00"){
            	alert(data.message+"（获取城市）,请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }        
        }).error(function () {
            console.log('error');
        });
	}

	planAdd.queryType = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicCompanyIndustryType",
			// url: "account/planAdd/Industry.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid')
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                planAdd.dictionary.iType = [];
                for (var i=0;i < data.contents.length;i++){
                    planAdd.dictionary.iType.push({
                        "code": data.contents[i].companyIndustryCode,
                        "name" : data.contents[i].companyIndustry
                    });
                }   
            }
            else {
                console.log(data.message);
            }
        }).error(function () {
            console.log('error');
        });
	}

	planAdd.queryType();


	planAdd.queryInfo = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/dic/queryDicCompanyIndustry",
			// url: "account/planAdd/Industry.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"companyIndustryCode": planAdd.industry.iType.code
			}
		})
		.success(function(data){
            if (data.code=="N01"){
                planAdd.dictionary.iInfo = [];
                for (var i=0;i < data.contents.length;i++){
                    planAdd.dictionary.iInfo.push({
                        "code": data.contents[i].companyIndustryCode,
                        "name" : data.contents[i].companyIndustry
                    });
                }   
            }
            else if(data.code=="E00"){
            	alert(data.message+",请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }        
            
        }).error(function () {
            console.log('error');
        });

	}

	planAdd.queryCompanyExtendInfo = function(){
		$http({
			method: "POST",
			url: config.HOST + "/api/2.0/bp/account/company/queryCompanyExtendInfo",
			// url: "account/planAdd/queryCompanyExtendInfo.json",
            headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
			data: {
				"sid": localStorage.getItem('sid'),
				"companySid": localStorage.getItem("cSid")
			}
		})
		.success(function(data){
            if (data.code=="N01"){
            	planAdd.shortName = data.contents.companyShortName ;
		        planAdd.name = data.contents.companyFullName;
		        planAdd.address.province.code = data.contents.countryRegionCode;
			    planAdd.address.province.name = data.contents.companyRegion;
			    planAdd.address.city.code =data.contents.companyProvinceCode;
			    planAdd.address.city.name = data.contents.companyProvince;
			    planAdd.industry.iInfo.code = data.contents.companyIndustryCode;
			    planAdd.industry.iInfo.name = data.contents.companyIndustry;
			    planAdd.comCode = data.contents.companyZipCode;
			    planAdd.comTel = data.contents.companyPhone;
			    planAdd.comWeb = data.contents.companyWebsite;
            }
            else if(data.code=="E00"){
            	alert(data.message+",请重新登陆");
            	localStorage.clear();
            	$location.path('login');
            }else {
            	console.log(data.message);
            }
        }).error(function () {
            console.log('improveComInfo'+data.message);
        });
	}

	planAdd.queryCompanyExtendInfo();

	$scope.planAdd = planAdd;


}])