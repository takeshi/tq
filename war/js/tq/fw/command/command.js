goog.provide("tq.fw.command.Command");

/**
 * コマンドの抽象クラス
 * 
 * @constructor
 */
tq.fw.command.Command = function() {
	this.disposed = false;
};

/**
 * コマンドを実行する
 * 
 * @param {tq.fw.controller.GameContext} context
 */
tq.fw.command.Command.prototype.invoke = function(context) {
	this.invokeMain(context);
	this.dispose();
};

/**
 * コマンドの実行ロジック。上書きして利用する。
 * 
 * @param {tq.fw.controller.GameContext} context
 */
tq.fw.command.Command.prototype.invokeMain = function(context) {
};

/**
 * コマンドを破棄されているか？
 * 
 * @returns {boolean}
 */
tq.fw.command.Command.prototype.isDisposed = function() {
	return this.disposed;
};

/**
 * コマンドを破棄する
 */
tq.fw.command.Command.prototype.dispose = function() {
	this.disposed = true;
};