goog.provide("tq.fw.collision.CollisionUtil");

/**
 * @constructor
 */
tq.fw.collision.CollisionUtil = function() {
};

/**
 * 衝突されたエンティティの速度を変更する
 * 
 * @param {number} e 衝突係数
 * @param {tq.fw.model.Entity} from 衝突したエンティティ
 * @param {tq.fw.model.Entity} to 衝突されたエンティティ
 */
tq.fw.collision.CollisionUtil.apllyCollision = function(e, from, to) {
	var dx = from.getX() - to.getX();
	var dy = from.getY() - to.getY();
	var ddx = from.dx - to.dx;
	var ddy = from.dy - to.dy;

	// 同一方向のベクトルの場合は衝突としない
	if (dx * ddx + dy * ddy > 0) {
		return;
	}
	var direction = Math.atan2(dx, dy);
	if (-3 / 4 * Math.PI < direction && direction <= -1 / 4 * Math.PI) {
		to.dx *= -e;
		return;
	}
	if (1 / 4 * Math.PI < direction && direction <= 3 / 4 * Math.PI) {
		to.dx *= -e;
		return;
	}
	to.dy *= -e;
};