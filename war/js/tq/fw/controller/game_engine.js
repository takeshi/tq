goog.provide("tq.fw.controller.GameEngine");

goog.require("goog.array");

goog.require("tq.fw.controller.GameContext");
goog.require("tq.fw.config.GameConfig");
goog.require("tq.fw.controller.TermManager");
goog.require("tq.fw.command.CommandManager");
goog.require("tq.fw.view.ViewManager");

/**
 * ゲームを統括するクラス
 * 
 * @param {Canvas=} canvas.
 * @param {boolean=} debug.
 * @param {tq.fw.controller.GameConfig=} config.
 * @constructor
 */
tq.fw.controller.GameEngine = function(canvas, debug, config) {
	this.canvas = canvas;
	this.config = config ? config : new tq.fw.config.GameConfig(debug);
	this.context = new tq.fw.controller.GameContext(this, this.config);

	var that = this;

	/**
	 * @type {Array.<tq.fw.model.ModelManager>}
	 * @private
	 */
	this.modelManagers = [];
	/**
	 * ModelManagerを追加する。
	 * 
	 * @param {tq.fw.model.ModelManager} modelManager
	 */
	this.addModelManager = function(modelManager) {
		this.modelManagers.push(modelManager);
	};

	/**
	 * @type {Array.<tq.fw.collision.CollisionManager>}
	 * @private
	 */
	this.collisionManagers = [];
	this.addCollisionManager = function(collisionManager) {
		this.collisionManagers.push(collisionManager);
	};

	/**
	 * @type {Array.<tq.fw.view.ViewManager>}
	 * @private
	 */
	this.viewManagers = [];
	this.addViewManager = function(viewManager) {
		that.viewManagers.push(viewManager);
	};

	/**
	 * @type {Array.<tq.fw.controller.TermManager>}
	 * @private
	 */
	this.termManagers = [];
	this.addTermManager = function(termManager) {
		that.termManagers.push(termManager);
	};

	/**
	 * @type {Array.<tq.fw.command.CommandManager>}
	 * @private
	 */
	this.commandManagers = [];
	this.addCommandManager = function(commandManager) {
		that.commandManagers.push(commandManager);
	};
};

/**
 * setIntervalからフレームレートごとに呼び出されるコールバック関数
 */
tq.fw.controller.GameEngine.prototype.run = function() {
	/**
	 * 現在のフレーム
	 */
	this.context.frame++;

	/**
	 * タームレートごとにTermEventManagerを呼び出す
	 */
	if (this.context.frame % this.config.termRate == 0) {
		goog.array.forEach(this.termManagers, function(termManager) {
			termManager.handleTermEvent(this.context);
		}, this);
	}

	/**
	 * 衝突の検出
	 */
	goog.array.forEach(this.collisionManagers, function(collisionManager) {
		collisionManager.checkCollision(this.context);
	}, this);

	/**
	 * コマンドの実行
	 */
	goog.array.forEach(this.commandManagers, function(commandManager) {
		commandManager.invokeCommand(this.context);
	}, this);

	/**
	 * モデルの更新
	 */
	goog.array.forEach(this.modelManagers, function(modelManager) {
		modelManager.updateModel(this.context);
	}, this);

	/**
	 * Viewの更新
	 */
	goog.array.forEach(this.viewManagers, function(viewManager) {
		viewManager.draw(this.context);
	}, this);

	// ダーティフラグははじめはすべてtrueとしておき、すべての画像を描画する。
	tq.fw.util.ArrayUtil.fillArray2(this.context.dirties, true);
};

/**
 * ゲームを開始する
 */
tq.fw.controller.GameEngine.prototype.start = function() {
	var that = this;
	this.intervalObject = setInterval(function() {
		that.run();
	}, 1000 / this.config.frameRate);
};

/**
 * ゲームを一時停止する
 */
tq.fw.controller.GameEngine.prototype.stop = function() {
	clearInterval(this.intervalObject);
};

/**
 * 各種マネージャをGameEngineに紐付ける。
 * 
 * @param manager
 */
tq.fw.controller.GameEngine.prototype.bind = function(manager) {
	if (manager instanceof tq.fw.view.ViewManager) {
		this.viewManagers.push(manager);
		return;
	}

	if (manager instanceof tq.fw.controller.TermManager) {
		this.termManagers.push(manager);
		return;
	}

	if (manager instanceof tq.fw.command.CommandManager) {
		this.commandManagers.push(manager);
		return;
	}

	if (manager instanceof tq.fw.collision.CollisionManager) {
		this.addCollisionManager(manager);
		return;
	}
	if (manager instanceof tq.fw.model.ModelManager) {
		this.addModelManager(manager);
		return;
	}

	throw new Error("unsuported type manager ");
};