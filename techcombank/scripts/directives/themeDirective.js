tcbmwApp.directive('owlcarousel',function(){

    var linker = function(scope,element,attr){
        attr.$observe('myId', function(value){
            if ( value === 'mainPage'){
                //carrega o carrosel
                var loadCarousel = function(){
                    element.owlCarousel({
                        responsive:{
                            0:{
                                items:4,stagePadding:0
                            },
                            360:{
                                items:4,autoWidth: false, margin: 0, stagePadding: 0
                            },
                            480:{
                                items:5,autoWidth: false, margin: 0, stagePadding: 0
                            },
                            600:{
                                items:5,autoWidth: false, margin: 0, stagePadding: 0
                            },
                            1000:{
                                items:6,autoWidth: false, margin: 0, stagePadding: 0
                            }
                        },
                        itemsMobile : false,
                        margin: 0,
                        dots:false,
                        autoWidth: false
                    });
                }



                //toda vez que adicionar ou remover um item da lista ele carrega o carrosel novamente
                scope.$watch("item", function(value) {
                    loadCarousel(element);
                })

            }else if ( value === 'social'){
                //carrega o carrosel
                var loadCarousel = function(){
                    element.owlCarousel({
                        items:1
                    });
                }



                //toda vez que adicionar ou remover um item da lista ele carrega o carrosel novamente
                scope.$watch("item", function(value) {
                    loadCarousel(element);
                })
            }
        });

    }

    return{
        restrict : "A",
        link: linker
    }

});