// var currentCardId = "NA";
// var currentCardLastDue = null;
// var currentCardLastInterval = null;
// var currentCardLastMultiplier = null;

// var currentCardNextDueAgain = null;
// var currentCardNextDueGood = null;
// var currentCardNextDueBest = null;

const settings = {};
var db = firebase.firestore();
db.settings(settings);

// attachCardSnapshotListener = function(thisObj)
// {
// 	var user = firebase.auth().currentUser;
//   if (user) {
//     console.log('update_learning_content got user: ' + user.uid)
    
//     var query = db
//     	.collection('cards')
//     	.where('user', '==', user.uid)
//     	.where('spacingDue', '<=', )
//     	.orderBy('spacingDue')
//     	.limit(1);

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

// $(this).ready( 
// 	function() {
		
// 	}
// )

// attachInitializeDeckListener = function(thisObj)
// {

// }

// https://stackoverflow.com/questions/5563783/jquery-class-click-multiple-elements-click-event-once

// Jan 8, 2019 - wait, why do I even have to do this?
// In the code that's propragated to each button in the webflow
// Just have <script> with the call that makes a certain entry
// in firebase - there should also be a cloud function that 
// makes the relevant entries. but, then, once that function
// finishes executing, how would I make the getting started dialog
// go to the next page? there would have to be a listener (firebase)
// and when that query changes, this would trigger a javascript 
// function that advances the scroll.

// in contrast, how would i do it using this approach - the listener
// attached to each button? isn't it really just the same, where
// after the query finishes executing, I have to wait 

// but wait, what exactly is the next step in the dialog?
// it's the preview of the cards in the deck. this requires pulling
// the cards, which I can't do static-ly - it has to involve a query
// that pulls the notes, sorted by some ranking.

// but this just makes me think, how do I go from screen to screen
// when some js has to happen beetween each screen?

$("button.deckButton").on('click', function(event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.log($(this).data('hello'));
    //(... rest of your JS code)

    // You put the retrieval of the collection in the docRef, not later after already getting the doc
    var notesCollectionRef = db
    	.collection('starter_decks')
    	.doc( $(this).data('hello') )
    	.collection('notes')
    var query = notesCollectionRef
    	.get()
    	.then
    	( 
    		function(querySnapshot) 
    		{
	    		querySnapshot.forEach
	    		(
	    			function(doc) 
	    			{
	    				console.log("Document exists. Data is: ", doc.data());
	    				fullpage_api.moveTo(2, 0);

	    				// In JS, before moving to the second slide, populate it with the notes of the selected deck.
	    				// But how do I do the populating? The Webflow collections function?

	    				// When I think about it, it's not totally necessary to have the decks be stored in collections,
	    				// since I won't be updating them so often. Oh wait, but don't I need an option to make your
	    				// own custom deck (using vocabulary from a textbook etc?) how would that option look?

	    				// 
	    			}
	    		)
    		}
    	)
    	.catch(function(error) {
    	console.log("Error getting notesCollectionRef: ", error);
    });
});

// var dataElement = $("button.deckButton");

// $(dataElement).each(function() {
//     console.log($(this).data('hello'));
//     // attachInitializeDeckListener($(this));
// });

