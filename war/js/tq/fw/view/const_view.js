goog.provide("tq.fw.view.ConstView");

goog.require("tq.fw.view.View");
goog.require("tq.fw.view.ViewUtil");

/**
 * 固定画像のView
 * 
 * @constructor
 * @extends {tq.fw.view.View}
 * 
 * @param {tq.fw.model.Entity} entity エンティティ
 * @param {number} num 画像の位置
 * @param {tq.fw.view.ImageViewManager} imageViewManager Imageを管理するクラス。
 */
tq.fw.view.ConstView = function(entity, num, imageViewManager) {
	tq.fw.view.View.call(this);
	this.entity = entity;
	this.num = num;
	this.imageViewManager = imageViewManager;
};
goog.inherits(tq.fw.view.ConstView, tq.fw.view.View);

/**
 * 固定画像を表示する
 * 
 * @param {tq.fw.controller.GameContext} context.
 */
tq.fw.view.ConstView.prototype.draw = function(context) {

	// エンティティが破棄されたら表示しない
	if (this.isDisposed()) {
		return;
	}
	// 画像に変更がない場合は表示しない
	if (tq.fw.view.ViewUtil.isDirty(context, this.entity)) {
		this.drawImage(context.context2d, this.imageViewManager.img, this.num,
				this.entity.getX(), this.entity.getY(), this.entity
						.getRotation());
		this.entity.dirty = false;

		/**
		 * デバッグモード
		 */
		if (context.config.debug) {
			var context2d = context.context2d;
			context2d.save();
			context2d
					.strokeRect(this.entity.getX(), this.entity.getY(), 32, 32);
			context2d.restore();
		}
	}
};

/**
 * @returns {boolean}
 */
tq.fw.view.ConstView.prototype.isDisposed = function() {
	return this.entity.isDisposed();
};