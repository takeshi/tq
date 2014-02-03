goog.provide("tq.fw.view.AnimationView");

goog.require("tq.fw.view.View");

/**
 * 動画を表示するView
 * 
 * @param {tq.fw.model.Entity} entity エンティティ
 * @param {Array.<number>} animationFrame アニメーションの配列
 * @param {tq.fw.view.ImageViewManager} imageViewManager Imageを管理するクラス
 * 
 * @constructor
 * @extends {tq.fw.view.View}
 */
tq.fw.view.AnimationView = function(entity, animationFrame, imageViewManager) {
	tq.fw.view.View.call(this);
	this.entity = entity;
	this.animationFrame = animationFrame;
	this.imageViewManager = imageViewManager;
	this.localFrame = 0;
};
goog.inherits(tq.fw.view.AnimationView, tq.fw.view.View);

/**
 * 動画を描画する
 * 
 * @param context
 */
tq.fw.view.AnimationView.prototype.draw = function(context) {
	// エンティティが破棄されていたら表示しない
	if (this.isDisposed()) {
		return;
	}
	var num = this.animationFrame[this.localFrame];
	this.drawImage(context.context2d, this.imageViewManager.img, num,
			this.entity.getX(), this.entity.getY(), this.entity.getRotation());

	this.localFrame++;
	if (this.localFrame >= this.animationFrame.length) {
		this.localFrame = 0;
	}

	/**
	 * デバッグモード
	 */
	if (context.config.debug) {
		var context2d = context.context2d;
		context2d.save();
		context2d.strokeRect(this.entity.getX(), this.entity.getY(), 32, 32);
		context2d.restore();
	}
};
tq.fw.view.AnimationView.prototype.isDisposed = function() {
	return this.entity.isDisposed();
};