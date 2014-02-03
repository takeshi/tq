goog.provide("tq.fw.view.MapView");

goog.require("tq.fw.view.View");

/**
 * ２次元のマップを表示するView
 * 
 * @param {Array.<Array.<number>>} map ２次元のマップ配列
 * @param {tq.fw.view.ImageViewManager} imageViewManager 画像を管理するクラス
 * @constructor
 * @extends {tq.fw.view.View}
 */
tq.fw.view.MapView = function(map, imageViewManager) {
	tq.fw.view.View.call(this);
	this.map = map;
	this.imageViewManager = imageViewManager;
};
goog.inherits(tq.fw.view.MapView, tq.fw.view.View);

/**
 * マップを表示する
 * 
 * @param {tq.fw.controller.GameContext} context.
 */
tq.fw.view.MapView.prototype.draw = function(context) {

	for ( var i = 0; i < this.map.length; i++) {
		for ( var j = 0; j < this.map[i].length; j++) {
			if (context.dirties[i][j]) {
				this.drawImage(context.context2d, this.imageViewManager.img,
						this.map[i][j], j * 32, i * 32, 0);

			}
		}
	}

};