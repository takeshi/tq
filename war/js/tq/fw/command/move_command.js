goog.provide("tq.fw.command.MoveCommand");

goog.require("tq.fw.command.Command");

/**
 * @param {tq.fw.model.Entity} entity.
 * @param {number} dx.
 * @param {number} dy.
 * @constructor
 * @extends {tq.fw.command.Command}.
 */
tq.fw.command.MoveCommand = function(entity, dx, dy) {
	tq.fw.command.Command.call(this);
	this.entity = entity;
	this.dx = dx;
	this.dy = dy;
};
goog.inherits(tq.fw.command.MoveCommand, tq.fw.command.Command);

/**
 * @param {tq.fw.controller.Context} context.
 */
tq.fw.command.MoveCommand.prototype.invokeMain = function(context) {
	if (this.dx == 0 && this.dy == 0) {
		return;
	}
	this.entity.dx += this.dx;
	this.entity.dy += this.dy;
};