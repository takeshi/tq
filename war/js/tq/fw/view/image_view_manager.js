goog.provide("tq.fw.view.ImageViewManager");

goog.require("tq.fw.view.ConstView");
goog.require("tq.fw.view.AnimationView");
goog.require("tq.fw.view.MapView");

/**
 * 画像を管理するクラス
 * 
 * @param {string} imgSrc イメージのパス.
 * @constructor
 * @extends {tq.fw.view.ViewManager}
 */
tq.fw.view.ImageViewManager = function(imgSrc) {
	tq.fw.view.ViewManager.call(this);
	this.imgSrc = imgSrc;

	/**
	 * 固定画像
	 * 
	 * @type {Array.<tq.fw.view.ConstView>}
	 */
	this.constants = [];

	/**
	 * 動画
	 * 
	 * @type {Array.<tq.fw.view.AnimationView>}
	 */
	this.animations = [];

	/**
	 * マップ
	 * 
	 * @type {Array.<tq.fw.view.MapView>}
	 */
	this.maps = [];
};
goog.inherits(tq.fw.view.ImageViewManager, tq.fw.view.ViewManager);

/**
 * @param {tq.fw.controller.GameContext} context
 */
tq.fw.view.ImageViewManager.prototype.draw = function(context) {
	goog.array.forEach(this.maps, function(view) {
		view.draw(context);
	});

	goog.array.forEach(this.constants, function(view) {
		view.draw(context);
	});

	goog.array.forEach(this.animations, function(view) {
		view.draw(context);
	});
};

/**
 * Imageの読み込み
 * 
 * @param {Function} loadCallback
 */
tq.fw.view.ImageViewManager.prototype.load = function(loadCallback) {
	this.img = new Image();
	this.img.src = this.imgSrc;
	var that = this;

	this.img.addEventListener("load", function() {
		that.init = true;
		if (loadCallback) {
			loadCallback(that);
		}
	}, false);
};
/**
 * エンティティと画像を紐付ける
 * 
 * @param {tq.fw.model.Etity} entity.
 */
tq.fw.view.ImageViewManager.prototype.bindEntity = function(entity) {
	var that = this;
	return {
		to : function(args) {
			if (args instanceof Array) {
				return this.animation(args);
			} else {
				return this.constant(args);
			}
		},
		/**
		 * 固定画像と紐付ける
		 * 
		 * @param {number} num 画像番号
		 */
		constant : function(num) {
			var constView = new tq.fw.view.ConstView(entity, num, that);
			that.constants.push(constView);

			// for remove
			var remover = tq.fw.util.ArrayUtil.createRemover(that.constants,
					constView);
			entity.addRemover(remover);
		},
		/**
		 * 動画と紐付ける
		 * 
		 * @param {Array.<number>} animationFrames
		 */
		animation : function(animationFrames) {
			var view = new tq.fw.view.AnimationView(entity, animationFrames,
					that);
			that.animations.push(view);

			// for remove
			var remover = tq.fw.util.ArrayUtil.createRemover(that.animations,
					view);
			entity.addRemover(remover);
		}
	};
};

/**
 * マップと紐付ける
 * 
 * @param {Array.<Array.<number>>} map
 */
tq.fw.view.ImageViewManager.prototype.bindMap = function(map) {
	var view = new tq.fw.view.MapView(map, this);
	this.maps.push(view);

	return tq.fw.util.ArrayUtil.createRemover(this.maps, view);
};
