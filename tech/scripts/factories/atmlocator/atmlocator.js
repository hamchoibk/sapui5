'use strict';


tcbmwApp.factory('AtmLocatorFactory', function(){

    var atmBranchDummyData = [];
    atmBranchDummyData.atmData = [
        {"id":1,"name":"ATM name Central","type":"Atm","location":"Central","address":"Dummy ATM Address1","latitude":14.058324,"longitude":108.277199},
        {"id":2,"name":"ATM name Central","type":"Atm","location":"Central","address":"Dummy ATM Address2","latitude":13.883412,"longitude":108.733062},
        {"id":3,"name":"ATM name East","type":"Atm","location":"East","address":"Dummy ATM Address3","latitude":13.822078,"longitude":108.38150},
        {"id":4,"name":"ATM name East","type":"Atm","location":"East","address":"Dummy ATM Address4","latitude":13.868746,"longitude":108.65066},
        {"id":5,"name":"ATM name West","type":"Atm","location":"West","address":"Dummy ATM Address5","latitude":14.081969,"longitude":108.591613},
        {"id":6,"name":"ATM name West","type":"Atm","location":"West","address":"Dummy ATM Address6","latitude":14.3628519,"longitude":108.727569},
        {"id":7,"name":"ATM name North","type":"Atm","location":"North","address":"Dummy ATM Address7","latitude":14.3947784,"longitude":108.36227},
        {"id":8,"name":"ATM name North","type":"Atm","location":"North","address":"Dummy ATM Address8","latitude":14.657997,"longitude":108.18511},
        {"id":9,"name":"ATM name South","type":"Atm","location":"South","address":"Dummy ATM Address9","latitude":14.943458,"longitude":14.837284},
        {"id":10,"name":"ATM name South","type":"Atm","location":"South","address":"Dummy ATM Address10","latitude":13.814076,"longitude":108.539428}
    ];

    atmBranchDummyData.branchData = [
                                       {"id":1,"name":"Branch name Central","type":"Branch","location":"Central","address":"Dummy branch Address1","latitude":14.078324,"longitude":108.227199},
                                       {"id":2,"name":"Branch name Central","type":"Branch","location":"Central","address":"Dummy branch Address2","latitude":13.833412,"longitude":108.783062},
                                       {"id":3,"name":"Branch name East","type":"Branch","location":"East","address":"Dummy branch Address3","latitude":13.862078,"longitude":108.38150},
                                       {"id":4,"name":"Branch name East","type":"Branch","location":"East","address":"Dummy branch Address4","latitude":13.818746,"longitude":108.65066},
                                       {"id":5,"name":"Branch name West","type":"Branch","location":"West","address":"Dummy branch Address5","latitude":14.021969,"longitude":108.591613},
                                       {"id":6,"name":"Branch name West","type":"Branch","location":"West","address":"Dummy branch Address6","latitude":14.3028519,"longitude":108.727569},
                                       {"id":7,"name":"Branch name North","type":"Branch","location":"North","address":"Dummy branch Address7","latitude":14.3347784,"longitude":108.36227},
                                       {"id":8,"name":"Branch name North","type":"Branch","location":"North","address":"Dummy branch Address8","latitude":14.607997,"longitude":108.18511},
                                       {"id":9,"name":"Branch name South","type":"Branch","location":"South","address":"Dummy branch Address9","latitude":14.993458,"longitude":14.837284},
                                       {"id":10,"name":"Branch name South","type":"Branch","location":"South","address":"Dummy branch Address10","latitude":13.864076,"longitude":108.539428}
                                   ];

     var selectedItem = {"id":1,"name":"Branch name","type":"branch","location":"Central","address":"Dummy branch Address1","latitude":14.078324,"longitude":108.227199};



     return {
            getAtmBranchDummyData : function(){
                return atmBranchDummyData;
            },
            getSelectedItem: function(){
                return selectedItem;
            },
            setSelectedItem: function(data){
                selectedItem = data;
            }
     };

});