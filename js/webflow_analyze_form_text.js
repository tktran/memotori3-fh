var currentCardId = "NA";
var currentCardLastDue = null;
var currentCardLastInterval = null;
var currentCardLastMultiplier = null;

var currentCardNextDueAgain = null;
var currentCardNextDueGood = null;
var currentCardNextDueBest = null;

const settings = {};

var db = firebase.firestore();
db.settings(settings);

var rows_selected = null;
var data_tables_selection = null;
data_tables_init = function(input_field)
{
	console.log( "input_field is ", input_field, " and it has value ", document.getElementById(input_field).innerText );
	// https://datatables.net/examples/server_side/post.html
	// https://datatables.net/reference/option/ajax.data
	// https://datatables.net/reference/button/selected
	datatables_config = {
		dom: "Bfrtip",
		buttons: [
			{
				extend: 'selected',
				text: 'test text',
				action: function (e, dt, button, config) 
								{
                	console.log('test.');
                	console.log( dt.rows({selected: true}) );
                	console.log( dt.rows({selected: true}).indexes() );
                	console.log( dt.rows({selected: true}).indexes().length );
            		}
      },
			'selected',
			'selectAll',
			'selectNone',
		],

		ajax: {
			url: "https://us-central1-memotori.cloudfunctions.net/hello_firestore_http",
			type: "POST",
			data: function(d) {
				d.text = document.getElementById(input_field).innerText;
				return JSON.stringify(d);
			},
			contentType: "application/json",
			dataSrc: 'data'
		},

		columns: [
			{data: null},
			{data: "i"},
			{data: "tuple1"},
			{data: "word"},
			{data: "pinyin"},
			{data: "defn"},
		],

		columnDefs: [ 
			{
				defaultContent: "",
		    orderable: false,
		    className: "select-checkbox",
		    targets: 0
			} 
		],

		select: {
			style: "multi",
			selector: "td:first-child"
		}
	};

	// https://datatables.net/reference/api/ajax.reload()
	var table = null; // will be assigned one way or the other
	if ( $.fn.dataTable.isDataTable( '#table_id' ) ) {
		// DataTable ALREADY exists
		console.log("DataTable already exists.");
    table = $('#table_id').DataTable();
    table.ajax.reload(); // should work right away,
    // since the data parameter in json config is
    // already a function that retrieves from the
    // input field. AND IT DOES! WOO!
	}
	else {
		console.log("DataTable does not exist.");
		// DataTable does NOT exist
  	$('#table_id').DataTable(datatables_config);
  	table = $('#table_id').DataTable();
	}

	// table will have been assigned in the prior paragraph
	var selectDeselectFunction = function(e, dt, type, indexes)
	{
		console.log("selectDeselectFunction");

		// Indexes only includes what was selected right then and there

		var rowData = table.rows(indexes).data().toArray();
		console.log( JSON.stringify(rowData) );

		rows_selected = dt.rows( { selected: true } ).data();

		// This certainly worked, but (3/7/20) I made the decision to 
		// include the data for entire rows at a time rather than just
		// the word.

		// data_tables_selection = rows_selected.map( x => x["word"] ).toAr/ray();
		data_tables_selection = rows_selected.toArray();
	}
	table.on('select', selectDeselectFunction);
	table.on('deselect', selectDeselectFunction);
}

var data_returned = null;

// https://www.sitepoint.com/use-jquerys-ajax-function/
// https://stackoverflow.com/questions/4159701/jquery-posting-valid-json-in-request-body
submitTextButton_success = function(data)
{
	var user = firebase.auth().currentUser;
	if (user)
	{
		console.log('User exists.');
	}

	// This works!
	console.log(data);
	console.log(data.data);

	data_returned = data;

	$("#resultText2").html(data.jinja_formatted);

	// Testing this.
	// https://stackoverflow.com/questions/2342371/jquery-loop-on-json-data-using-each
	$.each(data, function(index, element) {
		console.log('data[', index, ']=', data[index]);
		// console.log('element = ', element);
	})
};

submitTextButton_failure = function(jqxhr, status, exception)
{
	var user = firebase.auth().currentUser;
	if (user)
	{
		$("#resultText2").html("AJAX call failed with exception " + exception);
	}
	else
	{
		$("#resultText2").html("AJAX call failed.");
	}
};

submitTextButton_click = function()
{
	console.log("submitTextButton_click.");
	gcf_url = "https://us-central1-memotori.cloudfunctions.net/hello_firestore_http";
	// json_data = JSON.stringify({'text': $('#inputTextField').val()});
	// console.log('json_data in data_tables_init: ', json_data);

	// // Don't need this; it's in the datatables init callback now
	// $.ajax(
	// 	{
	// 		url: gcf_url,
	// 		type: 'POST',
	// 		data: json_data,
	// 		dataType: 'json',
	// 		contentType: "application/json",
	// 		success: submitTextButton_success,
	// 		error: submitTextButton_failure
	// 	});

	// pass the selector, not the text, because the selector will pass to the
	// callback and the callback will be called every time you click on a button
	data_tables_init("#inputTextField");
};

$("#submitTextButton").click(submitTextButton_click);

sendToFlashCards_success = function()
{
	
}

sendToFlashCards_failure = function()
{
	
}

// Everything for the sendToFlashCardsButton
sendToFlashCards_click = function()
{
	console.log("sendToFlashCards_click.");

	json_data = { 'recall': $("#Recall").is(':checked'),
		'recognition': $("#Recognition").is(':checked'),
		'selection': data_tables_selection};
	console.log('json_data before stringify: ', json_data);
	console.log('json_data after stringify: ', JSON.stringify(json_data));

	gcf_url = "https://us-central1-memotori.cloudfunctions.net/create_flashcards";

	$.ajax(
		{
			url: gcf_url,
			type: 'POST',
			data: JSON.stringify(json_data),
			dataType: 'json',
			contentType: "application/json",
			success: sendToFlashCards_success,
			error: sendToFlashCards_failure
		});

}
$("#sendToFlashCardsButton").click(sendToFlashCards_click);

// (
// 	function()
// 	{
// 		var user = firebase.auth().currentUser;

// 		if (user) {
// 			$("#resultDiv").html("User ID is " + user.uid);
// 		}
// 		else {
// 			$("#resultDiv").html("User not logged in. ");
// 		}
// 	}
// )

// $("#submitTextButton").click
// (
// 	function()
// 	{
// 		var user = firebase.auth().currentUser;

// 		if (user) {
// 			console.log("submitTextButton click.");
// 			console.log("User ID is ", user.uid);

// 			text_doc = db.collection('pending_text_docs').doc()
// 			text_doc.set(
// 				{
// 					'text': $('#inputTextField').val(),
// 					'user': user.uid
// 				}
// 			)

// 			// // It's user.uid, not user.id!
// 			// // should be spacingDue descending or ascending?
// 			// var query = db
// 			// 	.collection('users')
// 			// 	.doc(user.uid) 
// 			// 	.collection('progress')
// 			// 	.where('content_type', 'in', [check1, check2, check3, check4])
// 			// 	.orderBy('spacingDue')
// 			// 	.limit(100);
// 			// console.log(query);

// 			// NEXT STEP - ADD MORE LEARNING CONTENT, CATEGORIZED AS SHOWN ABOVE, AND TEST IT ALL OUT!

// 		}
// 		else {
// 			console.log('User not logged in');
// 		}
// 	}
// )

// attachCardSnapshotListener = function(thisObj)
// {
// 	var user = firebase.auth().currentUser;
//   if (user) {
//     console.log('update_learning_content got user: ' + user.uid)
    
//     var query = db
//     	.collection('users')
//     	.doc(user.id)
//     	.collection('cloze_progress')
//     	.where('spacingDue', '<=', moment().unix())
//     	.orderBy('spacingDue')
//     	.limit(100)
// 		query.onSnapshot(function(snapshot) {
// 			if (!snapshot.size) {
// 				console.log('snapshot empty')
// 				return;
// 			}
// 			snapshot.forEach(function(doc) {
// 				console.log('card snapshot listener was triggered w/', doc.id, ' -> ', doc.data());
// 				currentCardId = doc.id;
// 				currentCardLastDue = doc.get('spacingLastDue').toDate();
// 				console.log('currentCardLastDue: ', currentCardLastDue);

// 				temp_moment = moment(currentCardLastDue);
// 				temp_moment.add(1, 'hours');
// 				currentCardNextDueAgain = temp_moment.toDate();

// 				temp_moment = moment(currentCardLastDue);
// 				temp_moment.add(1, 'days');
// 				currentCardNextDueGood = temp_moment.toDate();

// 				temp_moment = moment(currentCardLastDue);
// 				temp_moment.add(1, 'weeks');
// 				currentCardNextDueBest = temp_moment.toDate();

// 				console.log('currentCardNextDueAgain: ', currentCardNextDueAgain);
// 				console.log('currentCardNextDueGood: ', currentCardNextDueGood);
// 				console.log('currentCardNextDueBest: ', currentCardNextDueBest);

// 				$("#clozedContent").show();
// 				$("#originalContent").show();
// 				$("#preNote").show();
// 				$("#postNote").hide();
// 				$("#showAnswerDiv").show();
// 				$("#setIntervalGrid").hide();

// 				$("#clozedContent").html(doc.get('contentClozed'));
// 				$("#nativeTranslation").html(doc.get('contentNativeTranslation'));
// 				$("#preNote").html(doc.get('notePre'));
// 				$("#postNote").html(doc.get('notePost'));
// 				$("#originalContent").html(doc.get('contentOriginal'));
// 			});
// 		});
// 	} else {
// 		console.log('no auth user')
// 	}
// };

// $("#showAnswerButton").click
// (
// 	function()
// 	{
// 		console.log("showAnswerButton click");
// 		// $("#clozedContent").show();
// 		// $("#originalContent").show();
// 		// $("#preNote").show();
// 		$("#postNote").show();
// 		$("#showAnswerDiv").hide();
// 		$("#setIntervalGrid").show();
// 	}
// )

// $("#buttonAgain").click
// (
// 	function()
// 	{
// 		console.log("buttonAgain click.");
// 		setLearningDifficulty("Again");
// 	}
// )

// $("#buttonGood").click
// (
// 	function()
// 	{
// 		console.log("buttonGood click.");
// 		setLearningDifficulty("Good");

// 	}
// )

// $("#buttonBest").click
// (
// 	function()
// 	{
// 		console.log("buttonBest click.");
// 		setLearningDifficulty("Best");
// 	}
// )

// function setLearningDifficulty(difficulty) {
// 	// console.log('The lastInterval is ', 
// 	// currentCardAsObject['testSetting'] = 'Look ma';
// 	// https://stackoverflow.com/questions/49682327/how-to-update-a-single-firebase-firestore-document
// 	updates = {};
// 	updates.notePost = 'Look, I modified the postnote on Dec 8.';

// 	if (difficulty == 'Again') 
// 	{
// 		console.log('About to set card w/ id', currentCardId, ' to Again.');
// 		updates.spacingDue = currentCardNextDueAgain;
// 	} 
// 	else if (difficulty == 'Good') 
// 	{
// 		console.log('About to set card w/ id', currentCardId, ' to Good.');
// 		updates.spacingDue = currentCardNextDueGood;
// 	}
// 	else 
// 	{
// 		console.log('About to set card w/ id', currentCardId, ' to Best.');
// 		updates.spacingDue = currentCardNextDueBest;
// 	}

// 	db.collection('cards').doc(currentCardId).update(updates)
// 		.then(function() {
// 			console.log('Success. ', currentCardId, ': ', updates.spacingDue);
// 		})
// 		.catch(function(error) {
// 			console.log('WTF? Doc was not written! Error was ', error);
// 		});
// }

$(this).ready();
