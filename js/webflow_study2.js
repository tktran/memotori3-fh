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

$("#cardTypeSelectButton").click
(
	function()
	{
		var user = firebase.auth().currentUser;

		if (user) {
			console.log("cardTypeSelectButton click.");
			console.log("User ID is ", user.uid);
			console.log( $('#cloze_checkbox').is(':checked') );
			console.log( $('#vocabulary_checkbox').is(':checked') );
			console.log( $('#grammar_checkbox').is(':checked') );
			console.log( $('#fullsentence_checkbox').is(':checked') );

			var check1 = check2 = check3 = check4 = 'IGNORE';

			// You need the parentheses in an if statement!		
			if ($('#cloze_checkbox').is(':checked')) {
				check1 = 'cloze';
			}

			if ($('#vocabulary_checkbox').is(':checked')) {
				check2 = 'vocabulary';
			}

			if ($('#grammar_checkbox').is(':checked')) {
				check3 = 'grammar';
			}

			if ($('#fullsentence_checkbox').is(':checked')) {
				check4 = 'fullsentence';
			}

			// It's user.uid, not user.id!
			// should be spacingDue descending or ascending?
			var query = db
				.collection('users')
				.doc(user.uid) 
				.collection('progress')
				.where('content_type', 'in', [check1, check2, check3, check4])
				.orderBy('spacingDue')
				.limit(100);
			// console.log(query);

			onSnapshotEach = function(doc)
			{
				console.log('card snapshot listener was triggered w/', doc.id, ' -> ', doc.data());


				if (doc.get('content_type') == 'vocabulary')
				{
					console.log('Doc type is vocabulary')
					$("#frontSide1").show();
					$("#frontSide2").show();
					$("#frontSide3").hide();
					$("#backSide1").hide();

					$("#frontSide1").html(doc.get('contentOriginal'));
					$("#frontSide2").html(doc.get('notePre'));	
				}
				else if (doc.get('content_type') == 'cloze')
				{
					console.log('Doc type is cloze')
					$("#frontSide1").show();
					$("#frontSide2").show();
					$("#frontSide3").show();
					$("#backSide1").hide();

					$("#frontSide1").html(doc.get('contentClozed'));
					$("#frontSide2").html(doc.get('contentNativeTranslation'));
					$("#frontSide3").html(doc.get('notePre'));
					// $("#originalContent").html(doc.get('contentOriginal'));
				}
			}
			onSnapshot = function(snapshot)
			{
				if (!snapshot.size) {
					console.log("Snapshot empty.");
					return;
				}
				snapshot.forEach(onSnapshotEach);
			}
			query.onSnapshot(onSnapshot);

			// NEXT STEP - ADD MORE LEARNING CONTENT, CATEGORIZED AS SHOWN ABOVE, AND TEST IT ALL OUT!

		}
		else {
			console.log('User not logged in');
		}
	}
)

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

// $(this).ready( 
// 	function() {
// 		firebase.auth().onAuthStateChanged(function(user) {
// 			if (user) {
// 				console.log('this ready -> user snapshot attachment succeeded');
// 				attachCardSnapshotListener($(this));
// 			}
// 			else
// 			{
// 				console.log('No user is signed in.');
// 			}
// 		})
// 	}
// )
