goog.provide("tq.fw.controller.GameContext");

goog.require("tq.fw.config.GameConfig");
goog.require("tq.fw.util.ArrayUtil");

/**
 * ゲームの変数を管理するクラス
 * 
 * @param {tq.fw.controller.GameEngine} engine.
 * @param {tq.fw.controller.GameConfig} config.
 * @constructor
 */
tq.fw.controller.GameContext = function(engine, config) {
	this.context2d = engine.canvas.getContext('2d');
	this.engine = engine;
	this.config = config;
	this.frame = 0;
	this.dirties = new Array(config.width/32);
	for ( var i = 0; i < config.width / 32; i++) {
		this.dirties[i] = new Array(config.height / 32);
	}
	tq.fw.util.ArrayUtil.fillArray2(this.dirties, true);
};
