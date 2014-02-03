goog.provide("tq.fw.view.ViewManager");

/**
 * 画面管理の抽象クラス
 * 
 * @constructor
 */
tq.fw.view.ViewManager = function() {

};

/**
 * 画面を描画する。上書きして利用する。
 * 
 * @param {tq.fw.controller.GameContext} context.
 */
tq.fw.view.ViewManager.prototype.draw = function(context) {
	throw new Error("abstract method");
};