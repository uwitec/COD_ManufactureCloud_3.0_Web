FIMS.controller('iqcComplexDLCheckCtrl',['$rootScope','$scope','$location','$http',function($rootScope,$scope,$location,$http){
	var iqcComplexDLCheck = {	
		materialNo: "",
		materialShortName: "",
		materialVersion: "",
		checkoutPlanNo: "",
		checkoutPlanVersion: "",
		sampleAmount: "",
		companyShortName: localStorage.getItem('curCompanyName'),

		checkoutRecordSid: "",
         
         sampleCheckoutValue:"",
		
		sampleSel: []
	};

	$scope.iqcComplexDLCheck = iqcComplexDLCheck;

	
/***********************************************************************
************************************************************************
 // 获取基本信息部分
************************************************************************
***********************************************************************/

	var queryCheckoutRecord = function(){
		var checkoutRecord = JSON.parse(localStorage.getItem("checkoutRecord"));
		iqcComplexDLCheck.materialNo = checkoutRecord.materialNo;
		iqcComplexDLCheck.materialShortName = checkoutRecord.materialShortName;
		iqcComplexDLCheck.materialVersion = checkoutRecord.materialVersion;
		iqcComplexDLCheck.checkoutPlanNo = checkoutRecord.checkoutPlanNo;
		iqcComplexDLCheck.checkoutPlanVersion = checkoutRecord.checkoutPlanVersion;
		iqcComplexDLCheck.sampleAmount = checkoutRecord.sampleAmount;

		iqcComplexDLCheck.checkoutRecordSid = checkoutRecord.checkoutRecordSid;

		

		// 绑定定量部分
		$rootScope.DL = JSON.parse(localStorage.getItem("DL"));
		// iqcComplexDLCheck.sampleSel = $rootScope.DL;
		//console.log($rootScope.DL);

		for (var i=0,len=$rootScope.DL.length;i<len;i++) {
			for (var j=0,lenj=$rootScope.DL[i].sample.length;j<lenj;j++) {
				//var item = $rootScope.DL[i].sample[j];
				$rootScope.DL[i].sample[j].sampleCheckoutValue = iqcComplexDLCheck.sampleCheckoutValue;
			}
		}

		
	}
	queryCheckoutRecord();
/***********************************************************************
************************************************************************
 // 返回首页
************************************************************************
***********************************************************************/

	// var.updateComplexIQCRecord = function() {
	// 	// console.log($rootScope.DX);
	// 	// var keyDX

	// 	$http({
	// 		method: "POST",
	// 		 url: config.HOST + "/api/2.0/bp/qc/iqc/updateComplexIQCRecord",
	// 		//url: "iqc/iqc_add/updateComplexIQCRecord.json",
	// 		header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
	// 		data: {
	// 			"sid": localStorage.getItem('sid'),
	// 			// "companySid": localStorage.getItem('cSid'),
	// 			"checkoutRecordSid": iqcComplexDLCheck.checkoutRecordSid,
	// 			"DX": $rootScope.DX,
	// 			"DL": $rootScope.DL 
	// 		}
	// 	})
	// 	.success(function(data){
 //            if (data.code == 'N01') {
 //            	localStorage.setItem("DL",JSON.stringify($rootScope.DL));           	
 //                alert(data.message);
 //                // $location.path("account_index/iqcRecord");
 //            }
 //            else if(data.code=="E00"){
 //                alert(data.message+",请重新登陆");
 //                localStorage.clear();
 //                $location.path('login').replace();
 //            }else {
 //                alert(data.message);
 //            }  
 //        })
	// }



/***********************************************************************
************************************************************************
 // 返回首页
************************************************************************
***********************************************************************/

	$scope.next = function() {
		localStorage.setItem("DL",JSON.stringify($rootScope.DL));
		$location.path("account_index/iqcRecord");
	}

	
	
}])