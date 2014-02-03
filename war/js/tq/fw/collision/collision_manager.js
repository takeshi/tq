goog.provide("tq.fw.collision.CollisionManager");

goog.require("goog.array");

/**
 * 衝突を管理するマネージャクラス
 * 
 * @constructor
 */
tq.fw.collision.CollisionManager = function() {
	/**
	 * 管理対象のエンティティ
	 * 
	 * @type {Array.<tq.fw.model.Entity>}
	 * @private
	 */
	this.entities = [];
	this.addEntity = function(entity) {
		this.entities.push(entity);
		var remover = tq.fw.util.ArrayUtil.createRemover(this.entities, entity);
		entity.addRemover(remover);
	};
	this.collisionEventLitener = [];
};

/**
 * 衝突を検知する
 * 
 * @returns {Dictionary.<String,Array.<Entity>>}
 */
tq.fw.collision.CollisionManager.prototype.detection = function() {
	var collisionPairs = {};

	var e = this.entities;
	e.sort(function(a, b) {
		return a.getX() - b.getX();
	});
	ifrag: for ( var i = 0; i < e.length; i++) {
		for ( var j = i + 1; j < e.length; j++) {
			var distance = (e[j].size + e[i].size) / 2;
			var jx = e[j].getX();// + e[j].dx;
			var jy = e[j].getY();// + e[j].dy;
			var ix = e[i].getX();// + e[i].dx;
			var iy = e[i].getY();// _+ e[i].dy;

			var dx = Math.abs(jx - ix);
			if (dx >= distance) {
				continue ifrag;
			}
			var dy = Math.abs(jy - iy);
			if (dy >= distance) {
				continue;
			}
			var d = Math.sqrt(dx * dx + dy * dy);
			if (d <= distance) {
				if (collisionPairs[e[j].id] == null) {
					collisionPairs[e[j].id] = new Array();
				}
				collisionPairs[e[j].id].push(e[i]);

				if (collisionPairs[e[i].id] == null) {
					collisionPairs[e[i].id] = new Array();
				}
				collisionPairs[e[i].id].push(e[j]);
			}
		}
	}
	return collisionPairs;
};
/**
 * 衝突を検知し、エンティティに通知する
 * 
 * @param{tq.fw.controller.GameContext} context
 */
tq.fw.collision.CollisionManager.prototype.checkCollision = function(context) {
	var collisions = this.detection();
	goog.array.forEach(this.entities, function(entity) {
		if (collisions[entity.id] != null) {
			this.oncollision(context, entity, collisions[entity.id]);
			goog.array.forEach(this.collisionEventLitener, function(listener) {
				listener(context, entity, collisions[entity.id]);
			});
		}
	}, this);
};

/**
 * 衝突が発生した場合にコールバックされる.
 * 
 * @param {tq.controller.GameContext} context.
 * @param {tq.entity.Entity} to.
 * @param {tq.entity.Entity} from.
 */
tq.fw.collision.CollisionManager.prototype.oncollision = function(context, to,
		from) {
};

/**
 * CollisionManagerに紐付ける。
 * 
 * @param bindObject
 */
tq.fw.collision.CollisionManager.prototype.bind = function(bindObject) {
	if (bindObject instanceof tq.fw.model.Entity) {
		if (bindObject.isCollisionTarget()) {
			this.addEntity(bindObject);
			return;
		}
	}
	if (bindObject instanceof Function) {
		this.collisionEventLitener.push(bindObject);
	}
};