/* eslint-disable linebreak-style */
sap.ui.define([
	"sap/ui/core/Control",
	"sap/base/Log"
], function(
	Control,
	Log
) {
	"use strict";

	let customVariant =  Control.extend("com.sap.sample.variant.samplevariant.custom.customVariant", {
        renderer: function (oRm, oControl) {
			Control.getMetadata().getRenderer().render(oRm, oControl);
		},

		metadata: {
			properties: {
				/**
				 * Key used to access personalization data.
				 */
				persistencyKey: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				}
			}
		}
	});

    
	/**
	 * Registration of a callback function. The provided callback function is executed
	 * when saving a variant is triggered and must provide all relevant fields and values in JSON.
	 * @public
	 * @param {function} fCallBack Called when a variant must be fetched
	 * @returns {sap.ui.table.TreeTable} Reference to this in order to allow method chaining.
	 */
	customVariant.prototype.registerFetchData = function (fCallBack) {

		this._fRegisteredFetchData = fCallBack;

		return this;
	};

	/**
	 * Registration of a callback function. The provided callback function is executed
	 * when a variant must be applied.
	 * The callback function will receive the corresponding data set containing all relevant data in JSON,
	 * as initially provided by the callback for fetchData.
	 * @public
	 * @param {function} fCallBack Called when a variant must be applied
	 * @returns {sap.ui.table.TreeTable} Reference to this in order to allow method chaining.
	 */
	customVariant.prototype.registerApplyData = function (fCallBack) {

		this._fRegisteredApplyData = fCallBack;

		return this;
	};

	/**
	 * Creates and returns the variant representation.
	 * @returns {object} JSON object
	 * @public
	 */
	customVariant.prototype.fetchVariant = function () {
		if (this._fRegisteredFetchData) {
			try {
				return this._fRegisteredFetchData();
			} catch (ex) {
			    Log.error("callback for fetching data throws an exception");
			}
		} else {
			Log.warning("no callback for fetch data supplied");
		}

		return {};
	};

	/**
	 * Triggers the registered callBack for applying the variant data.
	 * @private
	 * @param {object} oVariant the data blob representing part of the variant content
	 * @returns {object} data to be stored as part of the variant content
	 */
	customVariant.prototype.applyVariant = function (oVariant) {

		if (this._fRegisteredApplyData) {
			try {
				return this._fRegisteredApplyData(oVariant);
			} catch (ex) {
				Log.error("callback for applying data throws an exception");
			}
		} else {
			Log.warning("no callback for appy data supplied");
		}

		return null;
	};

    return customVariant;
});