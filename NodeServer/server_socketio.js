"use strict";

// Title of process in PS and TOP
process.title = 'DwarvenTavern';
 
// Server Websocket port
var dwarvenTavernPort = 1337;
var dwarvenTavernPortName = "noname";

// list of currently connected clients (users)
var clients = {};
var usedDwarves = [];
 
// Required socket.io and express librairies
var express = require('express'), http = require('http');
var dwarvenWord = express();
var dwarvenTavern = http.createServer(dwarvenWord);
var dwarvenCommunity = require('socket.io').listen (
    dwarvenTavern, 
    {transports:
        ['flashsocket', 'websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']
    }
);

// set debug messages off
dwarvenCommunity.set ('log level', 1);

console.log();
console.log ((new Date()) + " - DwarvenTavern is opening ...");
console.log ((new Date()) + " - ... gathering all dwarves ...");

// list of dwarven names
var dwarves = ["Athgar", "Ainin", "Algrimir", "Agmar", "Alrin", "Arngrim", "Auhrik", "Athnir", "Athgar", "Athran", "Aletheum", "Athbor", "Algrond", "Argrek", "Buurf", "Balkag", "Brokk", "Belegar", "Belegol", "Borgin", "Borm", "Brond", "Bradni", "Brogar", "Barin", "Burlok", "Barik", "Beleragond", "Byrrnoth", "Barak", "Baragor", "Bardin", "Bradni", "Bjarmi", "Boran", "Branak", "Barundin", "Bazrak", "Brugual", "Barthrekki", "Brynak", "Burli ", "Byor", "Baldin", "Balnir", "Borgor", "Brani", "Bor", "Ballan", "Balagil", "Barakor", "Baldin", "Balgan", "Brimbor", "Bolgun", "Belkok", "Brodhor", "Byor", "Bari", "Dolgr", "Bodor", "Bragni", "Bogni", "Berdok", "Bokrin", "Baragan", "Burfin", "Brudig", "Burinn", "Cranneg", "Dronglik", "Dwalin", "Damin", "Drong", "Drongli", "Dwalik", "Duregar", "Dern", "Durgrim", "Durin", "Drumin", "Dimrond", "Dimzad", "Daled", "Durgin", "Drokk", "Dertrain", "Daled", "Drakki", "Darbli", "Dorin", "Dargo", "Durmak", "Drang", "Drong", "Durzak", "Durak", "Durgin", "Dwinbar", "Dagmar", "Dorag", "Dormar", "Dorn", "Durbar", "Durifer", "Dolgr", "Dovvet", "Durlin", "Danrun", "Dodrum", "Durlin", "Drokki", "Darent", "Dovvent", "Drongvor", "Duregar", "Dorrin", "Durgan", "Drugni", "Dunden", "Dundin", "Dagren", "Elgrom", "Elgroth", "Eldarig", "Eisenbjorn", "Elgroth", "Eldarig", "Furagrum", "Furtan", "Furgil", "Fudrin", "Finn", "Firgil", "fenni", "Fimbur", "Finn", "Fungg", "Fondar", "Falco", "Fech", "Ferh", "Finbar", "Fijar", "Framm", "Fraunk", "Fumok", "Fimarin", "Furen", "Fin", "Furakrag", "Furd", "Fimki", "Furmir", "Furakrag", "Finarin", "Furmir", "Firengul", "Faramin", "Farlin", "Farnir", "Goddi", "Gomrund", "Gadrin", "Gorazin", "Gorim", "Gorm", "Gottri", "Gimnir", "Golendhil", "Garil", "Grumdin", "Grimbul", "Garaith", "Gudrum", "Gorrin", "Gudii", "Gorgi", "Groth", "Grindol", "Grom", "Grond", "Groth", "Grum", "Gumli", "Grundi", "Grung", "GuttriGotrek", "Grodrik", "Gorri", "Gadrin", "Gumli", "Godrik", "Gorri", "Grimbul", "Garagrim", "Gorazin", "Grimni", "Grimbeard", "Godir", "Grombrindal", "Grim", "Grimli", "Gimlin", "Grongi", "Grumbar", "Grumhilde", "Grom", "Gemmund", "Geirrod", "Gerar", "Gloier", "Gofnyr", "Gorwinay", "Gothrom", "Grennel", "Gruff", "Grimsiad", "Grummore", "Grummer", "Guirod", "Gulnyr", "Guthorm", "Gymir", "Grimgor", "Gantor", "Golgin", "Grundi", "Gronfin", "Grimgor", "Grumir", "Grendel", "Grumdnir", "Gargrim", "Gunnolf", "Gantor", "Gav", "Grogrim", "Grodun", "Glod", "Grulfdok", "Gavrii", "Grogrund", "Hegakin", "Hargrim", "Haakon", "Harek", "Hugnir", "Hurgar", "Hargin", "Harok", "Hegandor", "Helgar", "Hergard", "Hadrin", "Haki", "Helgandor", "Hrolf", "Hodrik", "Hrund", "Hadig", "Horik", "Hargan", "Haldrin", "Halus", "Hordrin", "Hlom", "Hegadrin", "Hanri", "Harkum", "Halma", "Kragdin", "Korgan", "Krorag", "Karmir", "Kazran", "Kazador", "Kazadar", "Kazgar", "Kazran", "Kadri", "Kazrik", "Kettri", "Krudd", "Kurgaz", "Kadrin", "Kallon", "Kurgan", "Kargun", "Kraggi", "Kadrik", "Katalin", "kragg", "Ketil", "Khargrim", "Kranden", "Kogyr", "Kord", "Krelar", "Korrig", "Krogan", "Klorn", "Karon", "Kazgin", "Karmin", "Karrasteel", "Kazgrim", "Kagrella", "Logamir", "Largs", "Lunn", "Lokri", "Logan", "Logazor", "Lothan", "Laergi", "Laskji", "Ligri", "Long", "Lorak", "Lorgrund", "Lunkin", "Loklun", "Lungni", "Molatok", "Morgund", "Morekai", "Morgrim", "Mendri", "Morek", "Mordin", "Morek", "Mjarli", "Malakai", "Macsen", "Magnus", "Magnyr", "Mundri", "Malgrim", "Morradok", "Morden", "Morn", "Mugni", "Norri", "Nordok", "Norgrim", "Nyrn", "Nordin", "Noranrik", "Nyrn", "Notrok", "Orgri", "Oldor", "Ogmi", "Otar", "Olfgrond", "Othralum", "Olfgrom", "Odarik", "Othralun", "Olin", "Quanzar", "Rorantok", "Rorek", "Roran", "Ragni", "Rungni", "Rogni", "Rogri", "Ruggi", "Rorin", "Rafi", "Rogrum", "Rordin", "Ralf", "Rogrin", "Rogrum", "Rori", "Rudrin", "Skalf", "Sven", "Skag", "Skalli", "Sundrim", "Skorri", "Snaddri", "Snorri", "Stromni", "Storri", "Smakki", "Sigrid", "Svengar", "Skaldar", "Skaldor", "Skeggi", "Skobi", "Sveltbar", "Sigrum", "Skalladrin", "Stugni", "Stromrik", "Stugni", "Skolm", "Stromrik", "Stugni", "Skoragrin", "Skaff", "Svengi", "Thorgin", "Thangrim", "Torvald", "Tyr", "Thorgard", "Thorgrim", "Thingrim", "Tori", "Thrund", "Thungni", "Thrugrom", "Thurgrum", "Thyk", "Thorek", "Thorri", "Thialfi", "Toldalf", "Tordek", "Tolkgrim", "Tingrom", "Tharik", "Thoragrim", "Thorgil", "Thargrim", "Thrungon", "Tingrom", "Thurn", "Thormir", "Tolkgrim", "Thar", "Thartrok", "Thagor", "Ulther", "Ungrim", "Ulfar", "Ungi", "Ulgrim", "Valek", "Valkan", "Volgrim", "Vikram", "Vragni", "Vardoc", "Van", "Veor", "Verlad", "Vorgrim", "Volgrig", "Vel", "Varnir", "Wulfram", "Walgrim", "Woller", "Xorax", "Yanni", "Yadri", "Yorri", "Yotis", "Yter", "Yalgon", "Zarado", "Zamnil", "Zamnit", "Zarnir", "Zamgrund", "Zaralin", "Zaki", "Zakakin", "Astrid", "Askima", "Astrid", "Alrika", "Alnira", "Balikina", "Berta", "Balarika", "Boria", "Breda", "Bronda", "Borga", "Beyla", "Brunhilda", "Brigga", "Brilda", "Berruna", "Bergule", "Brinsinga", "Berta", "Doralina", "Dunhilda ", "Derna", "Dorala", "Dangel", "Dani", "Dorala", "Damnir", "Elamina", "Faratinr", "Friga", "Fenna", "Freda", "Fatina", "Grondella", "Gerta", "Gottra", "Grondi", "Grunna", "Grimilda", "Grogana", "Gamira", "Grimelda", "Grufiya", "Grunda", "Helga", "Hadra", "Harga", "Hunni", "Hurgina", "Hakrima", "Inga", "Kargul", "Katanya", "Kargun", "Karga", "Kervista", "Kalea", "Karelia", "Karstin", "Katrin", "KorminaKettra", "Kadrika", "Kagruna", "Kethli", "Korrig", "Lenka", "Lakin", "Luna", "Merla", "MAgda", "Modra", "Morga", "Mornina", "Molaga", "Melandra", "Mora", "Moradrina", "Melni", "Melba", "Molaga", "Mornina", "Melandra", "Nomira", "Olga", "Oldatoka", "Royna", "Runella", "Sifna", "Snarri", "Svava", "Sarras", "Sindri", "Sigrid", "Sigrun", "Skorina", "Solveig", "Sunni", "Selni", "Thurma", "Tosta", "Tyrra", "Toffa", "Tarni", "Tharma", "Thindra", "Thoda", "Trolin", "Trunni", "thrungon", "Ulla", "Vanyra", "Vala", "Valma", "Winnifer", "Zargona", "Zylra", "Zaskinella"];
// Shuffle dwarven names
dwarves.sort(function(){
	return Math.round (Math.random()) - 0.5;
});
// list of dwarven sentences
var greetings = ["Vemu ai-menu !", "Tagazok to you my fellow !", "Gamut manun ai-menu !", "Gamatu yenet menu !"];
var goodbyes = ["Gamut meliku ai-menu !", "Rasup gamat !", "Rasup gamut ai-menu !", "Tak yemu !", "Tan gamut warg ai-menu !", "Tak khaz meliku suz yenetu !"];

// Pick the first dwarf name of the randomized list
function pickDwarf() {
	if (dwarves.length > 0) {
		return dwarves.shift();
	} else {
		return "a random pixie";
	}
}

// Add a given released dwarf name to the list
function freeDwarf (name) {
	dwarves.push (name);
}

console.log ((new Date) + " - ... setting all rules and instructions ...");

/**
* Helper function for picking up a random value from an array
*/
function pickRandom (list) {
	return list[Math.floor(Math.random() * list.length)];
}

function disableHTMLTags (string) {
	string = string.replace (/</g , "&lt;");
	return string.replace (/>/g, "&gt;");	
}

console.log ((new Date()) + " - all dwarves are ready for work !");

/**
* Listening
*/
dwarvenTavern.listen (dwarvenTavernPort, function() {
	dwarvenTavernPortName = pickDwarf();
	console.log ((new Date()) + " - A designated volunteer called " + dwarvenTavernPortName + " was assigned to wait on port " + dwarvenTavernPort + ".");
});

dwarvenCommunity.sockets.on ('connection', function (socket) {
	var time = new Date();
	console.log ((new Date()) + " - Someone knocked at the door ...");
	socket.broadcast.emit ('action', time, dwarvenTavernPortName + " heard someone at thee door.");
	console.log ((new Date()) + " - ... a discussion begins between " + dwarvenTavernPortName + " and the stranger ... \"Who's there ?!\"");

	// when the client emits 'connect', this listens and executes
	socket.on ('connect', function(nickname){
		var time = new Date();
		// we store the username in the socket session for this client
		socket.nickname = nickname;
		usedDwarves[nickname] = pickDwarf();
		// add the client's nickname to the global list
		clients[nickname] = {'nickname' : nickname, 'origin' : socket.handshake.address};
		console.log ((new Date()) + " - ... the stranger's name is " + nickname + "..."); 
		console.log ((new Date()) + " - ... and it appears that he/she comes from " + clients[nickname]['origin'].address + "... It's look like very far away.");
		// echo to client they've connected
		socket.emit('action', time, dwarvenTavernPortName + " greets you \"" + pickRandom (greetings) + "\"");
		// echo globally (all clients) that a new client has connected
		console.log ((new Date()) + " - " + usedDwarves[nickname] + " offers some drinks to " + nickname + "!");
		socket.emit ('action', time, usedDwarves[nickname] + " shouts \"Come in " + nickname + " ! Let's take a keg of beer!\"");
		socket.broadcast.emit ('action', time, usedDwarves[nickname] + " shouts \"Come in " + nickname + " ! Let's take a keg of beer!\"");
		// update the list of users in chat, client-side
		console.log ((new Date()) + " - sending list of clients : " + JSON.stringify (clients)); 
		dwarvenCommunity.sockets.emit ('userslist', JSON.stringify(clients));
	});

	// when the user disconnects.. perform this
	socket.on ('disconnect', function(){
		var time = new Date();
		// remove the username from global usernames list
		var nickname = socket.nickname;
		var dwarf = usedDwarves[nickname];
		delete usedDwarves[nickname];
		delete clients[nickname];
		// update list of users in chat, client-side
		dwarvenCommunity.sockets.emit ('userslist', JSON.stringify(clients));
		// echo globally that this client has left
		console.log ((new Date()) + " - " + dwarf + " says goodbye to " + nickname + "..."); 
		socket.broadcast.emit ('action', time, dwarf + " says goodbye to " + nickname + " \"" + pickRandom (goodbyes) + "\"");
		freeDwarf (dwarf);
	});
	
	// when the client emits 'message', this listens and executes
	socket.on ('message', function (message) {
		var time = new Date();
		// we tell the client to execute 'updatechat' with 2 parameters
		console.log (time + " - " + socket.nickname + ": " + message);
		if (message.length > 0) {
			dwarvenCommunity.sockets.emit ('message', time, socket.nickname, disableHTMLTags (message));
		}
	});
	
	// when the client emits 'data', this listens and executes
	socket.on ('data', function (data) {
		var time = new Date();
		// we tell the client to execute 'updatechat' with 2 parameters
		console.log (time + " - " + socket.nickname + ": " + JSON.stringify (data));
		dwarvenCommunity.sockets.emit ('data', time, socket.nickname, data);
	});
});
