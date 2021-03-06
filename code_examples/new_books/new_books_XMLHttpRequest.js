/*
// 
// Ray Voelker
// University of Dayton Libraries
// 300 College Park Dayton, OH 45419-1360
// rvoelker1@udayton.edu
// ray.voelker@gmail.com
//  If you have any questions or comments 
//  about this script, page or feature, please
//  feel free to contact me.
//
*/

var api_base_url = 'http://library2.udayton.edu/api/newbooks.php?',
	json_data;

function blankOutput() {
	var output = document.getElementById('output');
	//remove all items from the output div
	while (output.firstChild) {
		output.removeChild(output.firstChild);
	}
	output.innerHTML = 'Loading ...';
	
} //end function blankOutput

//our callback function will take the data sent back from our API and do something with it.
function newbooks(data) {
	var output = document.getElementById('output'),
		extra_info = document.getElementById('extra_info');
	json_data = data;
	/*
	if(json_data === undefined) {
		//set the json data so that it's accessible outside of this function 
		json_data = data;
	}
	*/
	
	blankOutput();
	//debugger;
	//if we have no results from the query, display a message and return
	if(data[0].num_results == 0) {
		output.innerHTML = 'No Results';
		extra_info.innerHTML = ' (' + data[0].num_results + ' new books) ';
		return(0);
	}
	else {
		output.innerHTML = '';
	}
	
	if(data && output){
		//we got data, so remove the loading text
		extra_info.innerHTML = ' (' + data[0].num_results + ' new books) ';
		
		var dateBegin = new Date(json_data[0].dateBegin);
		var dateEnd = new Date(json_data[0].dateEnd);
		
		extra_info.innerHTML += (dateBegin.getMonth() + 1) + '/' + dateBegin.getDate() + '/' + dateBegin.getFullYear() + ' to '
			+ (dateEnd.getMonth() + 1) + '/' + dateEnd.getDate() + '/' + dateEnd.getFullYear();
				
		for (var i=0;i<data.length;i++) {
			var node = document.createElement('div');
			
			// output call number if there is a call number in the data
			node.innerHTML += (data[i].call_number_norm !== null ? (data[i].call_number_norm + '<br />\n') : '');
			
			// output author if there is an author in the data
			node.innerHTML += ( (data[i].best_author !== null && data[i].best_author != '' ) ? (data[i].best_author  + '<br />\n') : '');
			
			// output title and the link to the catalog record if there are title, and record_num in the data
			node.innerHTML += ( (data[i].best_title !== null && data[i].record_num !== null) ? ('<a target="_blank" href="http://flyers.udayton.edu/record=b' 
				+ data[i].record_num + '">'
				+ data[i].best_title 
				+ '</a><br />\n') : '');
			
			// output publish year if there is a publish year in the data
			node.innerHTML += (data[i].publish_year ? (data[i].publish_year + '<br />\n') : '');
			
			node.innerHTML += '\n<br />\n<hr>\n</br />'
			
			//append the node to the output div
			output.appendChild(node);
		}//end for
	}//end if
			
} //end function newbooks


var getJSON = function(url, successHandler, errorHandler) {
	var request = typeof XMLHttpRequest != 'undefined'
		? new XMLHttpRequest()
		: new ActiveXObject('Microsoft.XMLHTTP');
	request.open('get', url, true);
	request.onreadystatechange = function() {
		var status;
		var data;
		// https://request.spec.whatwg.org/#dom-xmlhttprequest-readystate
		if (request.readyState == 4) { // `DONE`
			status = request.status;
			if (status == 200) {
				data = JSON.parse(request.responseText);
				successHandler && successHandler(data);
			} 
			else {
				errorHandler && errorHandler(status);
			}
		}
	};
	request.send();
};

getJSON(api_base_url, function(data) {
	newbooks(data);
}, function(status) {
	console.log('Something went wrong.');
});
