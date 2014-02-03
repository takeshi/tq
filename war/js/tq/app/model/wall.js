goog.provide("tq.app.model.Wall");

goog.require("tq.fw.model.Entity");

/**
 * 壁のエンティティ
 * 
 * @constructor
 * @extends {tq.fw.model.Entity}
 */
tq.app.model.Wall = function(x, y) {
	tq.fw.model.Entity.call(this);
	this.setX(x);
	this.setY(y);
	this.size = 40;
};
goog.inherits(tq.app.model.Wall, tq.fw.model.Entity);