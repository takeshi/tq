goog.provide("tq.fw.ai.AiTermManager");

goog.require("tq.fw.controller.TermManager");
goog.require("tq.fw.ai.InfomationCalculator");

/**
 * @constructor
 * @extends {tq.fw.controller.TermManager}
 */
tq.fw.ai.AiTermManager = function() {
	tq.fw.controller.TermManager.call(this);
	this.filter = function(entity) {
		return !entity.ai;
	};
	this.calculator = new tq.fw.ai.InfomationCalculator();
};

goog.inherits(tq.fw.ai.AiTermManager, tq.fw.controller.TermManager);

/**
 * @param context
 */
tq.fw.ai.AiTermManager.prototype.handleTermEvent = function(context) {
	this.onterm(context);
	goog.array.forEach(this.termFunctions, function(termFunction) {
		termFunction(context);
	});
	goog.array.forEach(this.entities, function(entity) {
		if (this.filter(entity)) {
			entity.onterm(context);
			goog.array.forEach(entity.ternLiteners, function(listener) {
				listener(context);
				return;
			});
			return;
		}
		var infos = this.calculator.calculate(entity, this.entities,
				this.filter);
		entity.onterm(context, infos);
		goog.array.forEach(entity.ternLiteners, function(listener) {
			listener(context, infos);
		});
	}, this);

};