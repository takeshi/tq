goog.provide("tq.fw.view.View");

/**
 * Viewの抽象クラス
 * 
 * @constructor
 */
tq.fw.view.View = function() {
};

/**
 * 画面を描画する。上書きして利用する。
 * 
 * @param {tq.fw.controller.GameContext} context
 */
tq.fw.view.View.prototype.draw = function(context) {
};

/**
 * 画像を描画する。
 * 
 * @param {Context2D|Object} context Canvasの2DContextオブジェクト.
 * @param {Image|Object} image Imageのオブジェクト.
 * @param {number} frameIndex 画像の番号.
 * @param {number} x x座長の表示する位置.
 * @param {number} y y座長の表示する位置.
 * @param {number} rotation 回転.
 */
tq.fw.view.View.prototype.drawImage = function(context, image, frameIndex, x, y,
		rotation) {
	context.save();
	context.translate(x + 16, y + 16);
	context.rotate(rotation);

	var sourceX = Math.floor(frameIndex % 8) * 32;
	var sourceY = Math.floor(frameIndex / 8) * 32;

	context.drawImage(image, sourceX, sourceY, 30, 30, -16, -16, 32, 32);
	context.restore();

};

/**
 * Viewが破棄されたか?
 * 
 * @returns {boolean}
 */
tq.fw.view.View.prototype.isDisposed = function() {
	return false;
};