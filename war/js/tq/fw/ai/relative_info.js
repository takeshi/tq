goog.provide("tq.fw.ai.RelativeInfo");

/**
 * @constructor
 */
tq.fw.ai.RelativeInfo = function() {

	/**
	 * ｘの差分
	 * 
	 * @type {number}
	 */
	this.dx = 0;

	/**
	 * yの差分
	 * 
	 * @type {number}
	 */
	this.dy = 0;

	/**
	 * 向き
	 * 
	 * @type {number}
	 */
	this.direction = 0;

	/*
	 * 距離 @type {number}
	 */
	this.distance = 0;

	/**
	 * @type {tq.fw.model.Entity}
	 */
	this.entity = null;
};