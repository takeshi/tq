goog.provide("tq.app.model.PlayerTank");
goog.require("tq.app.model.Tank");

/**
 * @constructor
 * @extends {tq.app.model.Tank}
 */
tq.app.model.PlayerTank = function(waitTime, life) {
	tq.app.model.Tank.call(this, waitTime, life);
	this.group = "Player";
};
goog.inherits(tq.app.model.PlayerTank, tq.app.model.Tank);
