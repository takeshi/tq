goog.provide("tq.fw.config.Configurator");

goog.require("tq.fw.config.GameConfig");
goog.require("tq.fw.controller.GameContext");
goog.require("tq.fw.controller.GameEngine");
goog.require("tq.fw.controller.TermManager");
goog.require("tq.fw.command.CommandManager");
goog.require("tq.fw.view.ViewManager");
goog.require("tq.fw.view.ImageViewManager");

/**
 * @constructor
 */
tq.fw.config.Configurator = function(canvas) {
	this.config = new tq.fw.config.GameConfig();
	this.engine = new tq.fw.controller.GameEngine(canvas, null, this.config);

	this.keyInputManager = new tq.fw.ui.KeyInputManager();
	this.engine.bind(this.keyInputManager);

	this.collisionManager = new tq.fw.collision.CollisionManager();
	this.engine.bind(this.collisionManager);

	this.modelManager = new tq.fw.model.ModelManager();
	this.engine.bind(this.modelManager);

	this.commandManager = new tq.fw.command.CommandManager();
	this.engine.bind(this.commandManager);

	this.deployMapping = {};
	this.deployMap = [ [] ];
	this.loadLiteners = [];
	this.entityBindings = {};

	/*
	 * カリー化関数
	 */
	var that = this;
	/**
	 * thisによらずに、Configurator#pushが呼ばれる。
	 * 
	 * @param {Object} obj
	 */
	this.pushFunc = function(obj) {
		that.push(obj);
	};

};
tq.fw.config.Configurator.prototype.loadImage = function(imgSrc) {
	this.imageViewManager = new tq.fw.view.ImageViewManager(imgSrc);
	this.engine.bind(this.imageViewManager);
};
tq.fw.config.Configurator.prototype.bindMap = function(map) {
	this.map = map;
};
tq.fw.config.Configurator.prototype.bindImage = function(entityClass) {
	var binding = new tq.fw.config.Configurator.ImageBinding(this, entityClass);
	this.entityBindings[entityClass] = binding;
	return binding;
};
/**
 * Imageとエンティティを紐付ける。
 * 
 * @constructor
 */
tq.fw.config.Configurator.ImageBinding = function(configObj, entityClass) {
	this.deployedEntities = [];
	this.clazz = entityClass;
	this.numValue = null;
	this.factoryFunc = function() {
		// デフォルトコンストラクタを呼び出す。
		return new entityClass();
	};
};
/**
 * エンティティに紐付けるImageの番号。 配列指定の場合はアニメーションとなる。
 * 
 * @param {number|Array.<number>} num
 * @returns {tq.fw.config.Configurator.ImageBinding}
 */
tq.fw.config.Configurator.ImageBinding.prototype.to = function(num) {
	this.numValue = num;
	return this;
};
/**
 * Entityのインスタンス生成の関数を登録する。 登録されていない場合は、デフォルトコンストラクタでインスタンスが生成される。
 * 
 * @param {Function} f factory関数を登録する。
 * @returns {tq.fw.config.Configurator.ImageBinding}
 */
tq.fw.config.Configurator.ImageBinding.prototype.factory = function(f) {
	this.factoryFunc = f;
	return this;
};

/**
 * エンティティの初期配置を設定する。
 * 
 * @param mapping
 * @returns {tq.fw.config.Configurator.DeployBinding}
 */
tq.fw.config.Configurator.prototype.deployEntities = function(mapping) {
	return new tq.fw.config.Configurator.DeployBinding(this, mapping);
};
/**
 * @param {tq.fw.config.Configurator} config.
 * @param {Dictionay.<number,tq.fw.config.Configurator.ImaginBinding>} mapping.
 * @constructor
 */
tq.fw.config.Configurator.DeployBinding = function(config, mapping) {
	this.config = config;
	this.config.deployMapping = mapping;
};
/**
 * エンティティの初期配置場所のマップの場所を設定する。
 * 
 * @param map
 */
tq.fw.config.Configurator.DeployBinding.prototype.toMap = function(map) {
	this.config.deployMap = map;
};

/**
 * 衝突検出のリスナーを登録する
 * 
 * @param {Function} f
 */
tq.fw.config.Configurator.prototype.addColissionLitener = function(f) {
	this.collisionManager.bind(f);
};
/**
 * キーイベントのリスナーを登録する。
 * 
 * @param {Document} document.
 * @param {Function} func.
 */
tq.fw.config.Configurator.prototype.addKeyEventLitener = function(document,
		func) {
	this.keyInputManager.bind(document);
	this.keyInputManager.bind(func);
};
/**
 * 初期化時のコールバック関数を登録する。
 * 
 * @param {Function} f.
 */
tq.fw.config.Configurator.prototype.addAfterInitializationListener = function(f) {
	this.loadLiteners.push(f);
};
tq.fw.config.Configurator.prototype.push = function(obj) {
	this.keyInputManager.bind(obj);
	this.collisionManager.bind(obj);
	this.commandManager.bind(obj);
	this.modelManager.bind(obj, this.pushFunc);
	var clazz = obj.constructor;
	if (obj instanceof tq.fw.model.Entity) {
		var mapping = this.entityBindings[clazz];
		this.imageViewManager.bindEntity(obj).to(mapping.numValue);
	}
};
tq.fw.config.Configurator.prototype.configuration = function(configurationFunc) {
	configurationFunc.call(this, this.pushFunc);
};

tq.fw.config.Configurator.prototype.load = function(loadFunction) {
	var that = this;
	// イメージを読み込む
	this.imageViewManager.load(function() {
		// イメージ読み込む後のコールバック

		// 背景を設定する
		that.imageViewManager.bindMap(that.map);

		// エンティティの初期配置を行う
		for ( var i = 0; i < that.deployMap.length; i++) {
			for ( var j = 0; j < that.deployMap[i].length; j++) {
				var num = that.deployMap[i][j];
				var mapping = that.deployMapping[num];
				if (mapping == null) {
					continue;
				}
				var entity = mapping.factoryFunc();

				entity.setX(j * 32);
				entity.setY(i * 32);
				that.push(entity);

				mapping.deployedEntities.push(entity);
				var remover = tq.fw.util.ArrayUtil.createRemover(
						mapping.deployedEntities, entity);
				entity.addRemover(remover);
			}
		}

		// 初期化のコールバック関数を呼び出す
		goog.array.forEach(that.loadLiteners, function(loadLitener) {
			loadLitener();
		}, this);

		// ロード後のコールバック関数を呼び出す
		loadFunction();
	});
};