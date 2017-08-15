var BakaUploader = {
	config: '',
	init: function(config) {
		BakaUploader.config = config;
		if (!config['addr'] || !config['selector']) {
			return false;
		} else {
			element = document.querySelector(config['selector']);
			file_rand_id = Math.floor(Math.random() * 10000000000000);
			element.addEventListener('click', function() {
				var input = document.createElement("input");
				input.type = "file";
				input.name = "file_selector_" + file_rand_id;
				input.style = "display:none";
				if (typeof(BakaUploader.config.multiple) !== 'undefined') {
					input.multiple = "true";
				}
				element.append(input);
				document.querySelector('input[name=file_selector_' + file_rand_id + ']').click();
				document.querySelector('input[name=file_selector_' + file_rand_id + ']').onchange = function(e) {
					BakaUploader.file = e.target.files;
					if (typeof(BakaUploader.config.file_count) !== 'undefined') {
						if (BakaUploader.file.length > BakaUploader.config.file_count) {
							if (typeof(BakaUploader.config.onerror) !== 'undefined') {
								BakaUploader.config.onerror({
									msg: 'ERR_TOO_MANY_FILE',
								});
								return false;
							}
						}
					}
					for (var i = 0; i < BakaUploader.file.length; i++) {
						if (typeof(BakaUploader.config.filter) !== 'undefined') {
							if (!BakaUploader.inArray(BakaUploader.file[i].type, BakaUploader.config.filter)) {
								if (typeof(BakaUploader.config.onerror) !== 'undefined') {
									BakaUploader.config.onerror({
										msg: 'ERR_TYPE_NOT_ALLOW',
										file: BakaUploader.file[i]
									});
									return false;
								}

							}
						}
					}
					for (var i = 0; i < BakaUploader.file.length; i++) {
						if (typeof(BakaUploader.config.max_size) !== 'undefined') {
							if (BakaUploader.file[i].size > BakaUploader.config.max_size) {
								if (typeof(BakaUploader.config.onerror) !== 'undefined') {
									BakaUploader.config.onerror({
										msg: 'ERR_SIZE_TOO_BIG',
										file: BakaUploader.file[i]
									});
									return false;
								}
							}
						}
					}
					if (typeof(BakaUploader.config.onselect) !== 'undefined') {
						BakaUploader.config.onselect(BakaUploader.file);
					}

					BakaUploader.upload(BakaUploader.config['addr'], BakaUploader.file, BakaUploader.config['data']);
				}
			});
		}
	},
	upload: function(address, file, data) {
		var formData = new FormData();
		for (var i = 0; i < file.length; i++) {
			formData.append("file[]", file[i]);
		}
		if (typeof(data) !== 'undefined') {
			var DataKeys = BakaUploader.ArrayKeys(data);
			for (var i = 0; i < DataKeys.length; i++) {
				formData.append(DataKeys[i], data[DataKeys[i]]);
			}
		}
		file_upload_xhr = new XMLHttpRequest();
		file_upload_xhr.open('POST', address);
		file_upload_xhr.onload = function() {
			if (typeof(BakaUploader.config.onsuccess) !== 'undefined') {
				BakaUploader.config.onsuccess(file_upload_xhr.response);
			}
		};
		file_upload_xhr.onerror = function(e) {
			if (typeof(BakaUploader.config.onerror) !== 'undefined') {
				BakaUploader.config.onerror({
					msg: 'XHR_ERROR',
					data: e
				});
			}
		}
		file_upload_xhr.upload.onprogress = function(event) {
			if (event.lengthComputable) {
				var percent = Math.floor(event.loaded / event.total * 100);
				if (typeof(BakaUploader.config.onprogress) !== 'undefined') {
					BakaUploader.config.onprogress(percent);
				}
			}
		};
		file_upload_xhr.send(formData);
	},
	ArrayKeys: function(input, searchValue, argStrict) {
		var search = typeof searchValue !== 'undefined'
		var tmpArr = []
		var strict = !!argStrict
		var include = true
		var key = ''
		for (key in input) {
			if (input.hasOwnProperty(key)) {
				include = true
				if (search) {
					if (strict && input[key] !== searchValue) {
						include = false
					} else if (input[key] !== searchValue) {
						include = false
					}
				}
				if (include) {
					tmpArr[tmpArr.length] = key
				}
			}
		}
		return tmpArr
	},
	inArray: function(needle, haystack) {
		var length = haystack.length;
		for (var i = 0; i < length; i++) {
			if (haystack[i] == needle) return true;
		}
		return false;
	}
}