sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/comp/smartvariants/PersonalizableInfo",
    "sap/ui/table/TablePersoController",
    "../utils/DemoPersoService",
    "../custom/customVariant"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,PersonalizableInfo,TablePersoController,DemoPersoService,customVariant) {
        "use strict";

        return Controller.extend("com.sap.sample.variant.samplevariant.controller.View1", {
            _oSmartVariantManagement:null,
            _oTPC : null,
            _customVariant : null,
            onInit: function () {
                let oUiTable = this.byId("idUiTable");
                
                this._oSmartVariantManagement = this.byId("pageVariantId");

                this._oTPC = new TablePersoController({
                    table: this.byId("idUiTable"),
                    persoService: DemoPersoService.generatePersonalisationService(oUiTable,this)
                });
            },
            onBeforeRendering : function(){
                this._customVariant = new customVariant(this.createId("customVariant"),{persistencyKey:"commanKey"});
            },
            onAfterRendering : function(){

                var oPersInfo = new PersonalizableInfo({
                    keyName: "persistencyKey",
                    type: "table"
                });
                oPersInfo.setControl(this._customVariant);
                this._oSmartVariantManagement.addPersonalizableControl(oPersInfo);

                this._oSmartVariantManagement.initialise(function () {
                    this._oSmartVariantManagement.currentVariantSetModified(false);
                }.bind(this), this._customVariant);
                
                this._customVariant.registerFetchData(this.onVariantFetchData.bind(this));
                this._customVariant.registerApplyData(this.onVariantApplyData.bind(this));
            },

            onVariantFetchData: function () {
                
                const aColumnsData = [];
				this.getView().byId("idUiTable")._getVisibleColumns().forEach((oColumn, index) => {
					const aColumn = {};
					aColumn.fieldName = oColumn.getProperty('name');
					aColumn.Id = oColumn.getId();
					aColumn.index = index;
                    aColumn.width = oColumn.getWidth();
					aColumn.Visible = oColumn.getVisible();
					aColumn.filterProperty = oColumn.getProperty('filterProperty');
					aColumn.sortProperty = oColumn.getProperty('sortProperty');
                    aColumn.sorted = oColumn.getProperty('sorted');
                    aColumn.sortOrder = oColumn.getProperty('sortOrder');
					aColumn.defaultFilterOperator = oColumn.getProperty('defaultFilterOperator');
					aColumnsData.push(aColumn);
				});

                return {
                    "ColumnsVal": aColumnsData,
                    "ButtonProp": {
                        text:this.byId("testBtn").getText(),type:this.byId("testBtn").getType()
                    }
                };
            },
            
            onVariantApplyData: function (oData) {
               let buttonProp = oData.ButtonProp;
               if(buttonProp){
                    this.byId("testBtn").setText(buttonProp.text);
                    this.byId("testBtn").setType(buttonProp.type);
               }

               const aColumns = oData.ColumnsVal;
					// Hide all columns first
					this.getView().byId('idUiTable').getColumns().forEach((oColumn) => {
						oColumn.setVisible(false);
					});
					// re-arrange columns according to the saved variant
					aColumns.forEach((aColumn) => {
						const aTableColumn = $.grep(this.getView().byId('idUiTable').getColumns(), (colObj, id) => colObj.getProperty('name') === aColumn.fieldName);
						if (aTableColumn.length > 0) {
							aTableColumn[0].setVisible(aColumn.Visible);
                            aTableColumn[0].setWidth(aColumn.width);
							aTableColumn[0].setFilterProperty(aColumn.filterProperty);
							aTableColumn[0].setSortProperty(aColumn.sortProperty);
							aTableColumn[0].setDefaultFilterOperator(aColumn.defaultFilterOperator);
							aTableColumn[0].setSorted(aColumn.sorted);
							aTableColumn[0].setSortOrder(aColumn.sortOrder);
							this.getView().byId('idUiTable').removeColumn(aTableColumn[0]);
							this.getView().byId('idUiTable').insertColumn(aTableColumn[0], aColumn.index);
						}
					});
				
            },

            onButtonPress : function(oEvent){
                let oBtn = oEvent.getSource();
                if(oBtn.getText()==="Accept"){
                    oBtn.setText("Emphasized");
                    oBtn.setType("Emphasized");
                }else{
                    oBtn.setText("Accept");
                    oBtn.setType("Accept");
                }
            },
            onPersonalizeColumns: function() {
				this._oTPC.openDialog({
				});
				const that = this;
				setTimeout(() => {
					that._oTPC._oDialog.attachConfirm(that, that._onUITblColumnPersoDonePressed.bind(that));
				}, 300, that);
			},
            _onUITblColumnPersoDonePressed : function(){
                this.handleVaraintModification(true);
            },

            handleVaraintModification : function(bModified){
                this._oSmartVariantManagement.currentVariantSetModified(bModified);
            },

            handleColumnMove : function(){
                this.handleVaraintModification(true);
            },
        });
    });
