goog.provide("tq.app.model.Tank");

goog.require("tq.fw.model.Entity");
goog.require("tq.app.model.Misille");
goog.require("tq.fw.collision.CollisionUtil");

/**
 * 戦車のエンティティ
 * 
 * @param {number} waitTime ミサイルの連射間隔.
 * @param {number=} life ミサイルの防御回数.
 * @constructor
 * @extends {tq.fw.model.Entity}
 */
tq.app.model.Tank = function(waitTime, life) {
	tq.fw.model.Entity.call(this);
	this.maxD = 10;
	this.ai = true;
	this.waitTime = waitTime;
	this.wait = 0;
	this.life = life;

	this.addTernListener(function() {
		// タームごとにミサイルの発射待ちカウントを減らす
		this.wait--;
	});
};
goog.inherits(tq.app.model.Tank, tq.fw.model.Entity);

/**
 * ミサイルを発射する
 * 
 * @param {number} speed スピード
 * @param {number} lifeTime 生存期間
 * @returns {tq.app.model.Tank.ShotStatus}
 */
tq.app.model.Tank.prototype.shot = function(speed, lifeTime) {
	if (this.disposed) {
		return tq.app.model.Tank.ShotStatus.DISPOSED;
	}
	if (this.wait > 0) {
		return tq.app.model.Tank.ShotStatus.WAIT;
	}
	this.wait = this.waitTime;
	var x = this.getX();
	var y = this.getY();
	var misille = new tq.app.model.Misille(this, x, y, this.getRotation(),
			speed, lifeTime);

	this.push(misille);
	this.push(misille.fire());

	return tq.app.model.Tank.ShotStatus.SUCCESS;
};

/**
 * @enum
 */
tq.app.model.Tank.ShotStatus = {
	SUCCESS : 0,
	WAIT : 1,
	DISPOSED : 2
};

/**
 * 衝突した場合はエンティティごとに、衝突を受ける
 * 
 * @param {tq.fw.model.Entity} entity
 */
tq.app.model.Tank.prototype.onhit = function(entity) {
	if (this == entity) {
		return;
	}

	if (entity instanceof tq.app.model.Misille) {
		if (entity.from == this) {
			return;
		}
		var d = 0.1;
		var dx = entity.dx - this.dx;
		var dy = entity.dy - this.dy;

		this.dx += dx * d;
		this.dy += dy * d;
		this.life--;

		if (this.life <= 0) {
			this.setDispose();
			var explosion = new tq.app.model.Explosion(this.getX(),
					this.getY(), 10);
			this.push(explosion);
		}
	}
	if (entity instanceof tq.app.model.Wall
			|| entity instanceof tq.app.model.Tank) {
		tq.fw.collision.CollisionUtil.apllyCollision(1, entity, this);
	}
};