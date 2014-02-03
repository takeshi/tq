goog.provide("tq.fw.ai.RelativeInfos");

goog.require("tq.fw.ai.RelativeInfo");

/**
 * @constructor
 */
tq.fw.ai.RelativeInfos = function() {

	/**
	 * 敵の情報
	 * 
	 * @type {Arrays.<tq.fw.ai.RelativeInfo>}
	 */
	this.targets = [];

	/**
	 * 味方の情報
	 * 
	 * @type {Arrays.<tq.fw.ai.RelativeInfo>}
	 */
	this.members = [];
};

tq.fw.ai.RelativeInfos.prototype.firstTarget = function() {
	var info = null;
	for ( var i = 0; i < this.targets.length; i++) {
		info = this.targets[i];
		if (info != null) {
			return info;
		}
	}
	return null;
};

tq.fw.ai.RelativeInfos.prototype.firstMember = function() {
	var info = null;
	for ( var i = 0; i < this.members.length; i++) {
		info = this.members[i];
		if (info != null) {
			return info;
		}
	}
	return null;
};