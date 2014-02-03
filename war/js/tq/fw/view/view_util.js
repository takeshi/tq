goog.provide("tq.fw.view.ViewUtil");
goog.require("goog.debug.Logger");
/**
 * 画面用のユーティリティクラス
 * 
 * @constructor
 */
tq.fw.view.ViewUtil = function() {
};

/**
 * ダーティフラグを立て、画面を再描画させる。
 * 
 * @param {tq.domain.Entity} entity.
 * @param {tq.engine.GameContext} context.
 */
tq.fw.view.ViewUtil.markDirty = function(node, context) {
	var l = context.dirties.length;
	var fx = (Math.floor(Math.abs(node.getX()) / 32));
	var fy = (Math.floor(Math.abs(node.getY()) / 32));
	if (fx <= 0) {
		fx = 0;
	}
	if (fy <= 0) {
		fy = 0;
	}
	if (fx >= l - 1) {
		fx = l - 1;
	}
	if (fy >= l - 1) {
		fy = l - 1;
	}

	context.dirties[fy][fx] = true;
};

/**
 * 再描画が必要かどうかの判定を行う。
 * 
 * @param {tq.fw.controller.GameContext} context.
 * @param {tq.fw.model.Entity} entity.
 * @returns {boolean}
 */
tq.fw.view.ViewUtil.isDirty = function(context, entity) {
	if (entity.dirty) {
		return true;
	}
	var l = context.dirties.length;
	var fx = Math.floor(entity.getX() / 32);
	var fy = Math.floor(entity.getY() / 32);

	if (fx <= 0) {
		fx = 0;
	}
	if (fy <= 0) {
		fy = 0;
	}
	if (fx >= l - 1) {
		fx = l - 1;
	}
	if (fy >= l - 1) {
		fy = l - 1;
	}

	if (context.dirties[fy][fx]) {
		return true;
	}
	return false;
};