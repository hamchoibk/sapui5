function initSuccess() {
    angular.element("#app-container").scope().initSuccessFunc();
}
tcbmwApp.controller('LocateIndexController',['$scope','$state','AtmLocatorFactory','$rootScope',function($scope,$state,AtmLocatorFactory,$rootScope){
    $rootScope.initSuccessFunc = function() {
        //
        console.log("success");
        mapInitialization();
        
    };
    var map;
    
    var mapOptions;
    $(function() {
        $("#searchBox").on("focus",function() {
            $("#map-canvas").hide();
            $("#atmList").show();
            $("#search-sorting-main").addClass("s-active");
            $("#search-sorting-search").removeClass("s-active");
        });
        fixMapCenter();
    });
    var atmList = session.atmList;
    if (!atmList)
        atmList=[];
    var loadedATM = [];
    for(var idx=0;(idx<20) && (idx<atmList.length);idx++) {
        loadedATM.push(atmList[idx]);
    }
    $scope.atmList = loadedATM;
    function mapInitialization() {
        if(navigator.geolocation) {
            var geolocate = new google.maps.LatLng(21.010745, 105.849503);
            if (session.selectedATM)
                geolocate = new google.maps.LatLng(session.selectedATM.Latitude, session.selectedATM.Longitude);
            mapOptions = {
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center:geolocate
            };
            map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            map.setCenter(geolocate);
            mc.getAtmLocation(getAtmLocationBack);
            fixMapCenter();
            navigator.geolocation.getCurrentPosition(ShowPosition, locationError,{timeout:3000});    
        }   
    }
    function locationError(error) {
        console.log(error);
        if (error.code == error.PERMISSION_DENIED && !session.selectedATM) {
            MessageBox("ATM_LOCATOR_PLEASE_TURN_ON_LOCATION_SERVICE");
        }
        
        
    }
    if (typeof google === 'undefined') {
    // variable is undefined
        $.ajax({
          url: 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=initSuccess',
          dataType: "script"
        });
        
    }
    else {
        mapInitialization();
    }
    var marker;
    var cityCycle;
    function ShowPosition(position) {
        console.log("ShowPosition");
            
        var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            
        var centerLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        if (session.selectedATM) {
            centerLoc = new google.maps.LatLng(session.selectedATM.Latitude, session.selectedATM.Longitude);
        }

        $scope.center = centerLoc;
        if (marker) {
            marker.setPosition(geolocate);
            cityCycle.setPosition(geolocate);

        } else {
            var markerImage = new google.maps.MarkerImage('images/TrackingDot.png',
                new google.maps.Size(21, 23),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 11));
            marker = new google.maps.Marker({
                  clickable:false,
                  position: geolocate,
                  map: map,
                  title: 'Your position',
                  icon:markerImage
              });
            var populationOptions = {
              strokeColor: '#0000FF',
              strokeOpacity: 0.7,
              strokeWeight: .1,
              fillColor: '#0000FF',
              fillOpacity: 0.1,
              map: map,
              center: geolocate,
              radius: 50
            };
            // Add the circle for this city to the map.
            cityCircle = new google.maps.Circle(populationOptions);
        }
        if (session.atmList) {
            processATMList();
        } else {
            mc.getAtmLocation(getAtmLocationBack);
        }
        fixMapCenter();
    }
    
    //google.maps.event.addDomListener(window, 'load', mapInitialization);
    console.log('State is'+$rootScope.previousState.name);
   if ( $state.current.name == 'locateindex'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                //if ( $rootScope.previousState.name == 'main'){
                if (session.customer)
                    $state.go("dashboard.home");
                else
                    $state.go("main");
                //}else{
                  //  $state.go('dashboard.home');
                //}
                console.log(statuses);
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_ATMLOCATOR_LOCATE_INDEX'}, baseStatus)
        ];

        $scope.status = statuses[0];
    };

    

    $scope.searchTabSelected = function(){
        $("#map-canvas").hide();
        $("#atmList").show();
        $("#search-sorting-main").removeClass("s-active");
        $("#search-sorting-search").addClass("s-active");
        //$state.go("locatesearch");
    };
    $scope.mainTabSelected = function() {
        $("#map-canvas").show();
        $("#atmList").hide();
        $("#search-sorting-main").addClass("s-active");
        $("#search-sorting-search").removeClass("s-active");
    }
    
    function getAtmLocationBack(r) {
    if (r.Status.code == "0") {
        session.atmList = r.atmList;
        atmList = session.atmList;
        if (!atmList)
            atmList=[];
        loadedATM = [];
        for(var idx=0;(idx<20) && (idx<atmList.length);idx++) {
            loadedATM.push(atmList[idx]);
        }
        //var map;
         $scope.atmList = loadedATM;
        
        processATMList();
        $rootScope.safetyApply(function(){});
    }
    
    }
    $scope.test = function() {
        google.maps.event.trigger(map, "resize");
        map.setCenter($scope.center);
        
        //console.log($scope.center);
    };
    /*google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });*/
    function fixMapCenter() {
        setTimeout($scope.test,100);
        setTimeout($scope.test,200);
    }
    function processATMList() {
        for(var idx in session.atmList) {
            var atm = session.atmList[idx];
            if (atm.Latitude && atm.Longitude) {
            var geolocate = new google.maps.LatLng(atm.Latitude, atm.Longitude);
            var marker = new google.maps.Marker({
                  clickable:true,
                  position: geolocate,
                  map: map,
                  title: atm.LocationDetail
              });
            }
            //console.log(atm.LocationDetail);
        }
    }
     $scope.clickATM = function (atm) {
        
        session.selectedATM = atm;
        if (session.selectedATM)
            geolocate = new google.maps.LatLng(session.selectedATM.Latitude, session.selectedATM.Longitude);
        map.setCenter(geolocate);
        $scope.center = geolocate;
        fixMapCenter();
        fixMapCenter();
        $("#map-canvas").show();
        $("#atmList").hide();
         $("#search-sorting-main").addClass("s-active");
        $("#search-sorting-search").removeClass("s-active");
    }
    function loadMore() {
        //var social = friendFactory.getChoosenSocial();
       // var friends = friendFactory.getFriendList(social);
        var filteredList = atmList.filter(filterByName);
        var last = $scope.atmList.length - 1;
        for(var i = 1; i <= 8; i++) {
            //console.log(i, last, friends.length);
            if (last + i< filteredList.length) {
                $scope.atmList.push(filteredList[last + i]);
                //console.log(last + i);
            }
            
        }
        //console.log($scope.friends.length);
    };
    function filterByName(atm) {
        if ($scope.query !== undefined)
            return atm.LocationDetail.toLowerCase().indexOf($scope.query.toLowerCase())>=0;
        else
            return true;
    }
    $scope.filterATM = function(query) {
        $("#map-canvas").hide();
        $("#atmList").show();
        
        console.log($scope.query);
        var filteredList = atmList.filter(filterByName);
        
        //$scope.friends = filteredList;
        loadedATM = [];
        for(var idx=0;(idx<20) && (idx<filteredList.length);idx++) {
            loadedATM.push(filteredList[idx]);
        }
        $scope.atmList = loadedATM;
        setTimeout(function(){ $scope.$apply()},0);
    };
    var isProcessing = false;
    $("#bound").scroll(function() {
        console.log("scroll");
        if (isProcessing) return;
        
        var scrollTop = $(this).scrollTop();
        var height = $(this).height();
        var scrollLength = $(this)[0].scrollHeight - height;
        if (scrollLength - scrollTop<100) {
            //console.log("refresh data");
            isProcessing = true;
            loadMore();
            setTimeout(function(){ $scope.$apply()},0);
            isProcessing = false;
        }
    });

}]);