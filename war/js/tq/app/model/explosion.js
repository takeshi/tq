goog.provide("tq.app.model.Explosion");

goog.require("tq.fw.model.Entity");

/**
 * 爆発のアニメーションのオブジェクト
 * 
 * @constructor
 * @extends {tq.fw.model.Entity}
 */
tq.app.model.Explosion = function(x, y, alive) {
	tq.fw.model.Entity.call(this);
	this.setX(x);
	this.setY(y);
	this.alive = alive;
};
goog.inherits(tq.app.model.Explosion, tq.fw.model.Entity);

tq.app.model.Explosion.prototype.onterm = function() {
	this.alive--;
	if (this.alive <= 0) {
		this.dispose();
	}
};

tq.app.model.Explosion.prototype.isCollisionTarget = function() {
	return false;
};