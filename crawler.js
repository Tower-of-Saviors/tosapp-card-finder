var originRequest = require('request');
var cheerio = require('cheerio');
var originRequest = originRequest.defaults({ jar: true })
var headers = {
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
}
module.exports = {
	login: function (username, password, callback) {
		formData = { 'quickforward': 'yes', 'handlekey': 'ls', 'fastloginfield': 'username', 'username': username, 'password': password };
		originRequest.post({ url: 'http://www.tosapp.tw/member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes&inajax=1', formData: formData }, function (err, res, body) {
			callback(res);
		});
	},
	search: function (input, callback) {
		var pageNum;
		var url = 'http://www.tosapp.tw/friend.html?name=' + encodeURIComponent(input);
		request(url, function (err, res, body) {
			var $ = cheerio.load(body, {
				decodeEntities: false
			});
			pageNum = parseInt($('div > label > span').attr('title').replace('共 ', '').replace(' 頁', ''));
			for (var i = 1; i <= pageNum; i++) {
				var url = 'http://www.tosapp.tw/friend.html?name=' + encodeURIComponent(input) + '&sortby=skilllv&desc=1&page=' + i;
				request(url, function (err, res, body) {
					var $ = cheerio.load(body, {
						decodeEntities: false
					});
					$('div.friend_list').each(function () {
						var index = 2;
						if ($(this).find('ul > li:nth-child(2) > a').text() == '') index = 1;
						callback('卡片名稱: ' + $(this).find('ul.z > li:nth-child(' + index + ') > a').text() + ' 遊戲ID: ' + $(this).find('p.z > a:nth-child(2)').text() + ' 卡片等級: ' + $(this).find('span.t11:nth-child(1)').text() + ' 技能等級: ' + $(this).find('span.t11:nth-child(2)').text());
					});
				});
			}
		});
	}
};

function request(url, callback) {
	var options = {
		url: url,
		method: "GET",
		headers: headers
	}
	originRequest(options, callback)
}