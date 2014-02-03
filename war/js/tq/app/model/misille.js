goog.provide("tq.app.model.Misille");

goog.require("tq.app.model.Explosion");
goog.require("tq.fw.model.Entity");

/**
 * ミサイルのエンティティ
 * 
 * @param x x座長の開始位置
 * @param y y座標の開始位置
 * @param rotation 向き
 * @param speed 速度
 * @param live 生存期間
 * @constructor
 * @extends {tq.fw.model.Entity}
 */
tq.app.model.Misille = function(from, x, y, rotation, speed, live) {
	tq.fw.model.Entity.call(this, 16);
	this.maxD = 50;

	this.from = from;
	this.setX(x);
	this.setY(y);
	this.setRotation(rotation);
	this.speed = speed;
	this.live = live;

	this.speedDx = Math.sin(this.getRotation()) * this.speed;
	this.speedDy = -Math.cos(this.getRotation()) * this.speed;
};
goog.inherits(tq.app.model.Misille, tq.fw.model.Entity);

tq.app.model.Misille.prototype.fire = function() {
	var command = new tq.fw.command.Command();
	var that = this;
	command.invokeMain = function(context) {
		that.dx += that.speedDx;
		that.dy += that.speedDy;
	};
	command.dispose = function() {
		command.disposed = true;
	};
	return command;
};
/**
 * 1Termごとに生存期間を減らす
 */
tq.app.model.Misille.prototype.onterm = function() {
	this.live--;
	if (this.live <= 0) {
		this.setDispose();
	}
};
/**
 * 当たった時は爆発する
 * 
 * @param {tq.fw.model.Entity} entity
 */
tq.app.model.Misille.prototype.onhit = function(entity) {
	// 打った人には当たらない
	if (this.from == entity) {
		return;
	}
	// 同じ人が打った弾は相殺しない。
	if (entity instanceof tq.app.model.Misille) {
		if (this.from == entity.from) {
			return;
		}
	}
	this.setDispose();
	var explosion = new tq.app.model.Explosion(this.getX(), this.getY(), 3);
	this.push(explosion);
};