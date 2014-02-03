goog.provide("tq.fw.ui.KeyInputManager");

goog.require("tq.fw.ai.AiTermManager");

/**
 * キー入力を管理するクラス
 * 
 * @constructor
 * @extends {tq.fw.ai.AiTermManager}
 */
tq.fw.ui.KeyInputManager = function() {
	tq.fw.ai.AiTermManager.call(this);
	/**
	 * @type {Array.<boolean>} キーが押されたか？
	 * @private
	 */
	this.keyPressed = [];
	this.keyEventLitener = [];
};
goog.inherits(tq.fw.ui.KeyInputManager, tq.fw.ai.AiTermManager);

/**
 * DOMのキーイベントに登録する。
 * 
 * @param d
 */
tq.fw.ui.KeyInputManager.prototype.bind = function(d) {
	if (d instanceof HTMLDocument) {
		var that = this;
		d.onkeyup = function(e) {
			that.keyPressed[e.keyCode] = false;
			e.preventDefault();
		};
		d.onkeydown = function(e) {
			window.console.log(e.keyCode);
			that.keyPressed[e.keyCode] = true;
			e.preventDefault();
		};
		return;
	}
	if (d instanceof Function) {
		this.keyEventLitener.push(d);
		return;
	}
	goog.base(this, "bind", d);
};

tq.fw.ui.KeyInputManager.prototype.handleTermEvent = function(context, info) {
	this.onkeyevent(context, this.keyPressed);
	goog.array.forEach(this.keyEventLitener, function(litener) {
		litener(context, this.keyPressed);
	}, this);
	context.keyPressed = this.keyPressed;
	goog.base(this, "handleTermEvent", context);
};

/**
 * タームごとに呼び出させるコールバック関数。上書きして利用する。
 * 
 * @param context
 * @param keyPressed
 */
tq.fw.ui.KeyInputManager.prototype.onkeyevent = function(context, keyPressed) {
};