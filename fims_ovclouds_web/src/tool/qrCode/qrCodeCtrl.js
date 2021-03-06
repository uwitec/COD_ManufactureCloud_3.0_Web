FIMS.controller('qrCodeCtrl',['$scope','$http', '$location', function($scope,$http,$location){
	var qrCode = {    
        "companySid": localStorage.getItem("cSid"),
        "materialNameDic": [],
        "materialVersionDic": [], 
        "vendorDic":[],
        "materialNameSelected": {},
        "materialVersionSelected": {},
        "vendorSelected": {},
         "externalReceiptNo":"",
        "curCom": localStorage.getItem('curCompanyName')
	};

	var resource = "resource/";

    var queryMaterialsInfo = function(){
        $http({
            method: "POST",
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
                qrCode.materialNameDic = data.contents;
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

    queryMaterialsInfo();

    //根据物料编号查版本
    $scope.queryMaterialVersionByMaterialNo = function(){
        $http({
            method: "POST",
            url: config.HOST + "/api/2.0/bp/qcp/qcp/queryMaterialVersionByMaterialNo",
            // url: "plan/queryMaterialVersionByMaterialNo.json",
            header: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
            data: {
                "sid": localStorage.getItem('sid'),
                "companySid": localStorage.getItem('cSid'),
                "materialNo": qrCode.materialNameSelected.materialNo 
            }
        })
        .success(function(data){
            if (data.code == 'N01') {               
                qrCode.materialVersionDic = [];
                qrCode.materialVersionSelected = {};
                qrCode.materialVersionDic = data.contents;
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

    // 供应商字典
    var queryVendorInfo = function(){
        $http({
            method: "POST",
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
               qrCode.vendorDic = data.contents;
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
    queryVendorInfo();

	$scope.genCode = function(){
		$http({
            method: 'POST',
            url: config.HOST+'/api/2.0/ll/tools/tdcode/resolveTDCode',
            data: {
                "materialNo": qrCode.materialNameSelected.materialNo,
                "materialName": qrCode.materialNameSelected.materialShortName,
                "materialVersion": qrCode.materialVersionSelected.materialVersion,
                "vendorNo": qrCode.vendorSelected.vendorNo,
                "vendorSid": qrCode.vendorSelected.vendorSid,
                "vendorShortName": qrCode.vendorSelected.vendorShortName,
                "externalReceiptNo":qrCode.externalReceiptNo
            }
        })
        .success(function(data){
            if (data.code === "E01") {
                console.log(data.message)
            }else{
                resource += data.filename;
                $("#qrcode").attr("src",resource);
                resource = "resource/";
               if(document.getElementById("print").style.display=='none'){
                    document.getElementById("print").style.display='';}
            }            
        });
	}

	$scope.clearCode = function(){
        location.reload(true);
		// qrCode.materialId =  "";
  //       qrCode.materialVersion =  "";
  //       qrCode.vendorId =  "";
  //       qrCode.vendorShortName =  "";
  //       qrCode.materialName =  "";           
  //       $("#qrcode").attr("src",'');
	}

	$scope.back = function(){
		var a = confirm("您确定要退出吗？退出将丢失填写数据!")
		if (a) {
			history.go(-1);
		}
	}

    $scope.print = function(){
        { 
          if (confirm('确定打印吗？')) {
          
              　　    /*var newstr = document.all.item(id).innerHTML;*/
                        var newstr = document.getElementById('qrcodepic').innerHTML;
                        printWindow = window.open();
              　      　printWindow.document.write(newstr);
              　　      printWindow.print();
              　　      return false;
             　   　 }
        } 
    }

	$scope.qrCode = qrCode;
}]);
