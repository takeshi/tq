goog.provide("tq.fw.model.Entity");

goog.require("tq.fw.command.MoveCommand");

tq.fw.model.idCounter = 0;
/**
 * ゲーム上のエンティティの抽象クラス
 * 
 * @param {number=} size default to 32
 * @constructor
 */
tq.fw.model.Entity = function(size) {
	/**
	 * 衝突検知に利用するエンティティの大きさ
	 */
	this.size = size ? size : 32;
	/**
	 * エンティティの一意のID
	 */
	this.id = "e" + tq.fw.model.idCounter++;
	var that = this;

	/**
	 * グループ
	 */
	this.group = "none";

	/**
	 * 最大速度
	 * 
	 * @private
	 * @type {number}
	 */
	this.maxD = 50;

	/**
	 * 破棄フラグ。フラグが立っているとupdateModel時にエンティティは破棄される。
	 * 
	 * @type {boolean}
	 */
	this.markDispose = false;
	this.setDispose = function() {
		this.markDispose = true;
	};
	/**
	 * x座長の移動速度
	 * 
	 * @type {number}
	 */
	this.dx = 0;

	/**
	 * y座長の移動速度
	 * 
	 * @type {number}
	 */
	this.dy = 0;
	/**
	 * エンティティの破棄時にコールバックされる関数。 マネージャに登録されている参照などを消すために利用している。
	 * 
	 * @type {Array.<Function>}
	 */
	this.removers = [];
	this.addRemover = function(remover) {
		that.removers.push(remover);
	};
	/**
	 * 破棄フラグ
	 * 
	 * @type {boolean}
	 */
	this.disposed = false;

	/**
	 * 変更フラグ
	 */
	this.dirty = true;

	/**
	 * x座長の場所
	 * 
	 * @type {number}
	 * @private
	 */
	this._x = 0;
	this.getX = function() {
		return that._x;
	};
	this.setX = function(x) {
		that.dirty = true;
		that._x = x;
	};
	/**
	 * y座長の場所
	 * 
	 * @type {number}
	 * @private
	 */
	this._y = 0;
	this.getY = function() {
		return that._y;
	};
	this.setY = function(y) {
		that.dirty = true;
		that._y = y;
	};
	/**
	 * 角度
	 * 
	 * @type {number}
	 * @private
	 */
	this._rotation = 0;
	this.getRotation = function() {
		return this._rotation;
	};
	this.setRotation = function(rotation) {
		that.dirty = true;
		this._rotation = rotation;
	};
	/**
	 * @type {Array.<Function>}
	 */
	this.ternLiteners = [];
	this.ai = false;
};
/**
 * {x,y}へ移動する
 * 
 * @param {number} x
 * @param {number} y
 */
tq.fw.model.Entity.prototype.moveTo = function(x, y) {
	this.setX(x);
	this.setY(y);
};
/**
 * 現在地から{x,y}動く
 * 
 * @param {number} dx
 * @param {number} dy
 */
tq.fw.model.Entity.prototype.moveBy = function(dx, dy) {
	this.setX(this._x + dx);
	this.setY(this._y + dy);
};

/**
 * 速度を変更する
 * 
 * @param {number} dx
 * @param {number} dy
 */
tq.fw.model.Entity.prototype.speedChange = function(dx, dy) {
	var command = new tq.fw.command.MoveCommand(this, dx, dy);
	this.push(command);
};

/**
 */
tq.fw.model.Entity.prototype.stop = function() {
	this.dx = 0;
	this.dy = 0;
};

tq.fw.model.Entity.prototype.isCollisionTarget = function() {
	return true;
};

/**
 * 破棄されているか？
 * 
 * @returns {boolean}
 */
tq.fw.model.Entity.prototype.isDisposed = function() {
	return this.disposed;
};
/**
 * エンティティを破棄する。
 */
tq.fw.model.Entity.prototype.dispose = function() {
	goog.array.forEach(this.removers, function(remover) {
		remover();
	});
	this.disposed = true;
};
/**
 * エンティティの状態を更新する。
 * 
 * @param {tq.fw.controller.GameContext} context
 */
tq.fw.model.Entity.prototype.updateModel = function(context) {
	if (this.markDispose == true) {
		this.dispose();
		return;
	}
	if (this.dx == 0 && this.dy == 0) {
		return;
	}
	if (Math.abs(this.dx) > this.maxD) {
		if (this.dx >= 0)
			this.dx = this.maxD;
		else
			this.dx = -this.maxD;
	}
	if (Math.abs(this.dy) > this.maxD) {
		if (this.dy >= 0)
			this.dy = this.maxD;
		else
			this.dy = -this.maxD;
	}
	tq.fw.view.ViewUtil.markDirty(this, context);
	this.moveBy(this.dx, this.dy);
	tq.fw.view.ViewUtil.markDirty(this, context);
};

tq.fw.model.Entity.prototype.ajustDirection = function(context) {
	if (this.dx == 0 && this.dy == 0) {
		return;
	}
	var r = Math.atan2(this.dy, this.dx) + Math.PI / 2;
	this.setRotation(r);
};
/**
 * タームごとにコールバックされる関数。上書きして利用する。
 * 
 * @param {tq.fw.controller.GameContext} context
 */
tq.fw.model.Entity.prototype.onterm = function(context) {
};

/**
 * 衝突時にコールバックされる関数。上書きして利用する。
 * 
 * @param {tq.fw.model.Entity} entity
 */
tq.fw.model.Entity.prototype.onhit = function(entity) {
};

/**
 * GameEngineにオブジェクトを登録する。
 * 
 * @param {Object} obj
 */
tq.fw.model.Entity.prototype.push = function(obj) {
};

tq.fw.model.Entity.prototype.addTernListener = function(listenr) {
	var that = this;
	this.ternLiteners.push(function(context) {
		listenr.call(that, context);
	});
};