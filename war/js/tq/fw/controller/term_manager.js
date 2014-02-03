goog.provide("tq.fw.controller.TermManager");

/**
 * タームごとに発生するイベントを管理するクラス
 * 
 * @constructor
 */
tq.fw.controller.TermManager = function() {
	/**
	 * イベントハンドラ
	 * 
	 * @type {Array.<Function>}
	 * @private
	 */
	this.termFunctions = [];
	this.addTermFunction = function(termFunction) {
		this.termFunctions.push(termFunction);
	};
	/**
	 * エンティティ
	 * 
	 * @private
	 * @type {Array.<tq.fw.model.Entity>}
	 */
	this.entities = [];
	this.addEntity = function(entity) {
		this.entities.push(entity);
		var remover = tq.fw.util.ArrayUtil.createRemover(this.entities, entity);
		entity.addRemover(remover);
	};
};

/**
 * タームごとのイベントをハンドリングする
 * 
 * @param {tq.fw.controller.GameContext} context.
 */
tq.fw.controller.TermManager.prototype.handleTermEvent = function(context) {
	this.onterm(context);
	goog.array.forEach(this.termFunctions, function(termFunction) {
		termFunction(context);
	});
	goog.array.forEach(this.entities, function(entity) {
		entity.onterm(context);
		goog.array.forEach(entity.ternLiteners, function(listener) {
			listener(context);
		});
	});
};

/**
 * TermMaagerに紐付ける。
 * 
 * @param {tq.fw.controller.GameContext} context.
 */
tq.fw.controller.TermManager.prototype.bind = function(termObject) {
	if (termObject instanceof tq.fw.model.Entity) {
		this.addEntity(termObject);
		return;
	}
	if (termObject instanceof Function) {
		this.addTermFunction(termObject);
		return;
	}
	// throw new Error("unsupproted objevt " + termObject);
};

/**
 * タームイベントのコールバック関数
 * 
 * @param {tq.fw.controller.GameContext} context.
 */
tq.fw.controller.TermManager.prototype.onterm = function(context) {
};
