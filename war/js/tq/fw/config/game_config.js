goog.provide("tq.fw.config.GameConfig");

/**
 * ゲームの設定を管理するクラス
 * 
 * @param {boolean=} debug
 * @param {number=} frameRate
 * @param {number=} termRate
 * @param {number=} height
 * @param {number=} width
 * @constructor
 */
tq.fw.config.GameConfig = function(debug, frameRate, termRate, height, width) {
	this.debug = debug ? debug : false;
	this.frameRate = frameRate ? frameRate : 26;
	this.termRate = termRate ? termRate : 2;
	this.height = height ? height : 512;
	this.width = width ? width : 512;
};