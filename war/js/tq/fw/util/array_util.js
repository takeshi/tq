goog.provide("tq.fw.util.ArrayUtil");

/**
 * Arrayのユティリティクラス
 * 
 * @constructor
 */
tq.fw.util.ArrayUtil = function() {
};

/**
 * 1次元のArrayをvalueで埋める。
 * 
 * @param {Array} array
 * @param {Object|boolean|number} value
 */
tq.fw.util.ArrayUtil.fillArray = function(array, value) {
	for ( var i = 0; i < array.length; i++) {
		array[i] = value;
	}
};
/**
 * ２次元のArrayをvalueで埋める。
 * 
 * @param {Array.<Array>}array
 * @param {Object|boolean|number} value
 */
tq.fw.util.ArrayUtil.fillArray2 = function(array, value) {
	for ( var i = 0; i < array.length; i++) {
		tq.fw.util.ArrayUtil.fillArray(array[i], value);
	}
};

/**
 * 登録した要素を削除するコールバック関数を生成する。
 * 
 * @param {Array} array 配列
 * @param {Object} value 削除する要素
 * @returns {Function}
 */
tq.fw.util.ArrayUtil.createRemover = function(array, value) {
	return function() {
		for ( var i = 0; i < array.length; i++) {
			if (array[i] == value) {
				array.splice(i, 1);
				return;
			}
		}
	};
};