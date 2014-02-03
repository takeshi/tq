goog.require("tq.fw.controller.GameEngine");
goog.require("tq.fw.config.Configurator");
goog.require("tq.fw.view.View");
goog.require("tq.fw.view.ImageViewManager");
goog.require("tq.fw.command.CommandManager");
goog.require("tq.fw.controller.TermManager");
goog.require("tq.fw.model.ModelManager");
goog.require("tq.fw.model.Entity");

goog.require("tq.fw.ui.KeyInputManager");
goog.require("tq.app.model.PlayerTank");
goog.require("tq.app.model.Tank");
goog.require("tq.app.model.Wall");

goog.require("tq.fw.collision.CollisionManager");

goog.require("goog.net.XhrIo");

function main(canvas) {
	var c = new tq.fw.config.Configurator(canvas);
	goog.net.XhrIo.send("test", function(data) {
		var xhr = /** @type{goog.net.XhrIo} */ data.target;
		
		alert(xhr.getResponseText());
	}, "GET");
	c.configuration(function(push) {
		/**
		 * イメージを読み込む
		 */
		c.loadImage("img/tanks_sheet.png");

		/**
		 * 背景を設定する
		 */
		c.bindMap([//
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 0
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 1
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 2
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 3
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 4
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 5
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 6
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 7
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 8
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 9
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 10
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 11
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 12
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 13
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],// 14
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] // 15
		]//
		);

		/**
		 * Wallエンティティを30番のイメージにバインドする
		 */
		var wall = c.bindImage(tq.app.model.Wall).to(30);
		/**
		 * Tankエンティティを9-16番のアニメーションにバインドする。
		 */
		var tank = c.bindImage(tq.app.model.Tank)//
		.to([ 9, 10, 11, 12, 13, 14, 15, 16 ])//
		.factory(function() {
			/**
			 * Tankエンティティを作る
			 */
			return new tq.app.model.Tank(3, 1000);
		});//

		/**
		 * Playerエンティティを1-8番のアニメーションにバインドする。
		 */
		var player = c.bindImage(tq.app.model.PlayerTank).to(
				[ 1, 2, 3, 4, 5, 6, 7, 8 ]).factory(function() {
			/**
			 * Playerエンティティを作る
			 */
			return new tq.app.model.PlayerTank(3, 60);
		});

		/**
		 * Explosionエンティティを17-19番のアニメーションにバインドする。
		 */
		var explosion = c.bindImage(tq.app.model.Explosion).to([ 17, 18, 19 ]);
		/**
		 * ミサイルエンティティを20番のイメージにバインドする。
		 */
		var misille = c.bindImage(tq.app.model.Misille).to(20);

		/**
		 * エンティティをマップに配置する
		 */
		c.deployEntities({
			0 : null,
			1 : wall,
			2 : tank,
			3 : player,
			4 : explosion,
			5 : misille
		}).toMap([//
		[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],// 
		[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ] //
		]);

		/**
		 * 衝突を検知したら、Entity#onhitを呼び出す。
		 */
		c.addColissionLitener(function(context, entity, entities) {
			goog.array.forEach(entities, function(target) {
				entity.onhit(target);
			});
		});

		/**
		 * マップ初期化後のイベント
		 */
		c.addAfterInitializationListener(function() {
			/**
			 * マップにデプロイされたTankエンティティの動きを定義する
			 */
			goog.array.forEach(tank.deployedEntities, function(tank) {
				tank.onterm = function(context, infos) {
					/*
					 * 一番近くにいる敵を見つける。
					 */
					var info = infos.firstTarget();
					if (info == null) {
						info = infos.firstMember();
					}
					if (info == null) {
						return;
					}
					/*
					 * ミサイルを打つ
					 */
					tank.shot(12, 100);
					/*
					 * 向きを変える
					 */
					tank.setRotation(info.direction);
					var speed = 2;
					/*
					 * 250以下まで近づいたら、ランダムに動く
					 */
					if (info.distance < 250) {
						var dx = (Math.random() - 0.5) * speed;
						var dy = (Math.random() - 0.5) * speed;
						tank.speedChange(dx, dy);
						return;
					}

					/*
					 * 250以上離れていたら、敵に近づく
					 */
					tank.speedChange(info.dx * speed / info.distance * 2,
							info.dy * speed / info.distance);
				};
			}, this);

			/**
			 * マップにデプロイされたPlayerエンティティの動きを定義する。
			 */
			goog.array.forEach(player.deployedEntities, function(tank) {
				tank.onterm = function(context, infos) {
					/**
					 * 一番近くの敵を見つける
					 */
					var info = infos.firstTarget();
					if (info == null) {
						info = infos.firstMember();
					}
					if (info == null) {
						return;
					}
					/**
					 * ミサイルを打つ
					 */
					tank.shot(10, 100);

					/**
					 * 敵の方向を向く
					 */
					tank.setRotation(info.direction);
					/**
					 * 250以内に近づいたら、ランダムに動く
					 */
					var speed = 2;
					if (info.distance < 250) {
						var dx = (Math.random() - 0.5) * speed;
						var dy = (Math.random() - 0.5) * speed;
						tank.speedChange(dx, dy);
						return;
					}
					/**
					 * 250以上はなれていたら、敵に近づく
					 */
					tank.speedChange(info.dx * speed / info.distance * 2,
							info.dy * speed / info.distance);
				};
			}, this);
		});

		c.addAfterInitializationListener(function() {
			/**
			 * キーボードで操作するエンティティを生成する
			 */
			var player = new tq.app.model.PlayerTank(3, 1000);
			/**
			 * 初期値の場所と向きを設定する
			 */
			player.setX(32 * 7);
			player.setY(32 * 4);
			player.setRotation(Math.PI);

			/**
			 * ゲームエンジンにPlayerを登録する
			 */
			push(player);

			/**
			 * キーボードの入力を受け渡すための変数
			 */
			var dx = 0;
			var dy = 0;
			var shot = false;
			var target = false;
			var ajust = false;

			/**
			 * キーボードイベントをPlayerエンティティに適用する
			 */
			player.onterm = function(context, infos) {
				player.speedChange(dx, dy);
				if (shot) {
					player.shot(15, 100);
				}
				var info = infos.firstTarget();
				if (info == null) {
					info = infos.firstMember();
				}
				if (info != null && target) {
					player.setRotation(info.direction);
				} else {
					player.ajustDirection();
				}
			};
			/**
			 * キーボードイベントを受け取る
			 */
			c.addKeyEventLitener(document, function(context, keyPressed) {
				var d = 2;

				if (keyPressed[37]) {
					dx = -d;
				}
				if (keyPressed[38]) {
					dy = -d;
				}
				if (keyPressed[39]) {
					dx = d;
				}
				if (keyPressed[40]) {
					dy = d;
				}

				shot = keyPressed[83];
				target = keyPressed[65];
			});
		});
	});

	var gameEngine = c.engine;
	c.load(function() {
		gameEngine.start();
	});
};

goog.exportSymbol("main", main);