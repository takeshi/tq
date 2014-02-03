goog.provide("tq.fw.ai.InfomationCalculator");

goog.require("goog.array");
goog.require("tq.fw.ai.RelativeInfo");
goog.require("tq.fw.ai.RelativeInfos");

/**
 * @constructor
 */
tq.fw.ai.InfomationCalculator = function() {
};

/**
 * 
 * @param {tq.fw.model.Entity} me 起点となるエンティティ.
 * @param {Array.<tq.fw.model.Entity>} targets 比較対象のエンティティ.
 * @param {Function} filter エンティティフィルタ.
 * @returns {tq.fw.ai.RelativeInfos}
 */
tq.fw.ai.InfomationCalculator.prototype.calculate = function(me, targets,
		filter) {
	var infos = new tq.fw.ai.RelativeInfos();
	goog.array.forEach(targets, function(target) {
		if (me == target) {
			return;
		}
		if (filter(target)) {
			return;
		}
		var info = new tq.fw.ai.RelativeInfo();
		info.dx = target.getX() - me.getX();
		info.dy = target.getY() - me.getY();
		info.direction = Math.atan2(info.dy, info.dx) + Math.PI / 2;
		info.distance = Math.sqrt(info.dx * info.dx + info.dy * info.dy);
		info.entity = target;
		if (me.group == target.group) {
			infos.members.push(info);
		} else {
			infos.targets.push(info);
		}
	});
	infos.targets.sort(function(a, b) {
		return a.distance - b.distance;
	});
	infos.members.sort(function(a, b) {
		return a.distance - b.distance;
	});
	return infos;
};