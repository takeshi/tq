goog.provide("tq.fw.command.CommandManager");

goog.require("tq.fw.command.Command");

/**
 * コマンドを管理するマネージャ
 * 
 * @constructor
 */
tq.fw.command.CommandManager = function() {
	/**
	 * @type {Array.<tq.fw.command.Command>}
	 * @private
	 */
	this.commands = [];
};

/**
 * コマンドを追加する。
 * 
 * @private
 * @param {tq.fw.command.Command} command
 */
tq.fw.command.CommandManager.prototype.addCommand = function(command) {
	this.commands.push(command);
};
/**
 * コマンドを実行する
 * 
 * @param {tq.fw.controller.GameContext} context
 */
tq.fw.command.CommandManager.prototype.invokeCommand = function(context) {
	var commands = [];
	goog.array.forEach(this.commands, function(command) {
		command.invoke(context);
		if (!command.isDisposed()) {
			commands.push(command);
		}
	});
	this.commands = commands;
};

/**
 * objectをCommandManagerに紐付ける。
 * 
 * @param object
 */
tq.fw.command.CommandManager.prototype.bind = function(object) {
	if (object instanceof tq.fw.command.Command) {
		this.addCommand(object);
	}
};