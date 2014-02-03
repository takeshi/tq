goog.provide("tq.fw.model.ModelManager");

/**
 * モデルを管理するマネージャ
 * 
 * @constructor
 */
tq.fw.model.ModelManager = function() {
	this.models = [];
};

/**
 * @param {tq.fw.model.Entity} model.
 * @param {Function} pushMethod.
 */
tq.fw.model.ModelManager.prototype.bind = function(model, pushMethod) {
	if (model instanceof tq.fw.model.Entity) {
		model.push = pushMethod;
		this.models.push(model);
		var remover = tq.fw.util.ArrayUtil.createRemover(this.models, model);
		model.addRemover(remover);
	}
};
/**
 * 管理しているエンティティの状態を更新する
 * 
 * @param {tq.fw.controller.GameContext} context
 */
tq.fw.model.ModelManager.prototype.updateModel = function(context) {
	goog.array.forEach(this.models, function(model) {
		model.updateModel(context);
	}, this);
};