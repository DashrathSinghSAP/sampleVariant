sap.ui.define(['sap/ui/thirdparty/jquery'],
	function(jQuery) {
	"use strict";

	// Very simple page-context personalization
	// persistence service, not for productive use!
        return {
        /** 
         * Creates personalization columns from table
         * @param {Object} oTable - Table
         * @returns {Array} - array of columns to be personalized
         */
        getPersoTableColumns: function (oTable) {
            
            return oTable.getColumns().map(function (oColumn, index) {
                return {
                    "order": index,
                    "visible": oColumn.getVisible(),
                    "id": "application-comsapsamplevariantsamplevariant-display-component---View1--" + oColumn.getId()
                };
            });
        },

        generatePersonalisationService: function (oTable, oController) {
            let aColumns = this.getPersoTableColumns(oTable);
            let oData = {
                _persoSchemaVersion: "1.0",
                aColumns: aColumns
            };
            return {
                getPersData : function () {
                    var oDeferred = new jQuery.Deferred();
                    if (!this._oBundle) {
                        this._oBundle = this.oData;
                    }
                    oDeferred.resolve(this._oBundle);
                    return oDeferred.promise();
                },
        
                setPersData : function (oBundle) {
                    var oDeferred = new jQuery.Deferred();
                    this._oBundle = oBundle;
                    oDeferred.resolve();
                    return oDeferred.promise();
                },
        
                getResetPersData : function () {
                    var oDeferred = new jQuery.Deferred();
        
                    setTimeout(function() {
                        oDeferred.resolve(this.oResetData);
                    }.bind(this), 2000);
        
                    return oDeferred.promise();
                },

                delPersData : function () {
                    var oDeferred = new jQuery.Deferred();
                    oDeferred.resolve();
                    return oDeferred.promise();
                },
        
                resetPersData : function () {
                    var oDeferred = new jQuery.Deferred();
        
                    //set personalization
                    this._oBundle = this.oData;
        
                    //reset personalization, i.e. display table as defined
                    //this._oBundle = null;
        
                    oDeferred.resolve();
        
                    return oDeferred.promise();
                }
            };
        }
    
        };
    
    });