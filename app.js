"use strict";

var http = require('http'),
  fs = require('fs'),
	async = require('async'),
	url = 'http://stackoverflow.com',
	cURL = 'http://careers.stackoverflow.com',
	elements = [],
	counter = [],
	links = [];

var start = (new Date()).getTime();

function print_counter(counter) {
	var content = '';
	for(var y=0; y < counter.length; y++) {
		content += elements[y] + ',' + counter[y] + '\n';
	}
	fs.writeFile("report.txt", content, function(error) {
		if(error) {
			console.log('\n --- /!\\ in page --- ' + error + '\n');
		}
		else {
			console.log("The file was saved with success !");
		}
	});
}

http.get(url + '/tags', function(res) {
	var body = '';
	res.on('data', function(chunk) {
		body += chunk;
	});
	res.on('end', function() {
		var regEx = /<span class="page-numbers">(.*?)<\/span>/g,
			pages = body.match(regEx),
			last = parseInt(pages[pages.length - 1].match(/[0-9]/g).join('')),
			//last = parseInt(pages[0].match(/[0-9]/g).join('')),
			tags = [];
		rep(0, last)
	});
}).on('error', function(error) {
	console.log('\n --- /!\\ in page --- ' + error.message + '\n');
});

var tag = function(i, cb) {
	http.get(url + '/tags?page=' + (i+1) + '&tab=popular', function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			var regEx = /(rel="tag">)(.*?)(?=<\/a>)/g,
				matches = body.match(regEx),
				curr = '',
				tagList = [];
			for(var k=0; k < matches.length; k++) {
				curr = matches[k].replace(/rel="tag">/g, '').replace(/-/g, ' ');
				tagList.push(curr);
			}
			cb(tagList);
		});
	}).on('error', function(error) {
		console.log('\n --- /!\\ in tag --- ' + error.message + '\n');
	});
};

var rep = function(i, last) {
	if(i < last) {
		tag(i, function(result) {
			for(var j=0; j < result.length; j++) {
				elements.push(result[j].replace(/<img[^<]+?>/g, ''));
				counter.push(0);
			}
			console.log((i+1) + ' / ' + last + ' TAG pages completed !');
			rep(i+1, last);
		});
	}
	else {
		career(elements);
	}
};

var career = function(tags) {
	http.get(cURL + '/jobs?searchTerm=&location=', function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			var regEx = /(<a class="job-link" [^<]+? title="(.*?)">)(.*?)(?=<\/a>)/g,
				count = body.match(regEx),
				last = count[count.length - 1],
				//last = count[0],
				last = last.replace(/<a class="job-link" [^<]+?>/g, '');
			rep2(0, last);
		});
	}).on('error', function(error) {
		console.log('\n --- /!\\ in career --- ' + error.message + '\n');
	});	
};

var jobs = function(n, cb) {
	http.get(cURL + '/jobs?searchTerm=&location=&pg=' + (n+1), function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			var regEx = /(<a class="title job-link" href="(.*?))(?=" title="(.*?)">)/g,
				ahref = body.match(regEx);
			for(var l=0; l < ahref.length; l++) {
				links.push(ahref[l].replace(/<a class="title job-link" href="/, ''));
			}
			cb();
		});
	}).on('error', function(error) {
		console.log('\n --- /!\\ in jobs --- ' + error.message + '\n');
	});
};

var rep2 = function(n, last) {
	if(n < last) {
		jobs(n, function() {
			console.log((n+1) + ' / ' + last + ' JOB pages completed !');
			rep2(n+1, last);
		});
	}
	else {
		var end = links.length;
		rep3(0, end);
	}
};

var description = function(m, cb) {
	http.get(cURL + links[m], function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			var regEx = /(<div id="jobdetailpage">)([\s\S]+?)(<p class="returntolist">)/gm;
			for(var o=0; o < elements.length; o++) {
				if(body.match(regEx)[0].indexOf(elements[o]) !== -1) {
					counter[o] += 1;
				}
			}
			cb();
		});
	}).on('error', function(error) {
		console.log('\n --- /!\\ in description --- ' + error.message + '\n');
		console.log('\n address is ' + links[m] + '\n');
	});
};

var rep3 = function(m, end) {
	if(m < end) {
		description(m, function() {
			console.log((m+1) + ' / ' + end + ' DESCRIPTION pages completed !');
			rep3(m+1, end);
		});
	}
	else {
		print_counter(counter);
		var stop = (new Date()).getTime();
		console.log('Operation took ' + ((stop - start) / 1000) + ' seconds.');
	}
};
