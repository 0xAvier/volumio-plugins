'use strict';

var libQ = require('kew');
var fs=require('fs-extra');
var config = new (require('v-conf'))();
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var isOnline = require('is-online');
var os = require('os');
var TwitterPackage = require('twitter');


module.exports = senti-p-nel;
function senti-p-nel(context) {
	var self = this;

	this.context = context;
	this.commandRouter = this.context.coreCommand;
	this.logger = this.context.logger;
	this.configManager = this.context.configManager;

}



senti-p-nel.prototype.onVolumioStart = function()
{
	var self = this;
	var configFile=this.commandRouter.pluginManager.getConfigurationFile(this.context,'config.json');
	this.config = new (require('v-conf'))();
	this.config.loadFile(configFile);


    return libQ.resolve();
}

senti-p-nel.prototype.onStart = function() {
    var self = this;
	var defer=libQ.defer();


	// Once the Plugin has successfull started resolve the promise
    isOnline().then(online => {
        var ifaces = os.networkInterfaces();
        var Twitter = new TwitterPackage(this.config);
        
        Object.keys(ifaces).forEach(function (ifname) {
          var alias = 0;
        
          ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
              // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
              return;
            }
        
            if (alias >= 1) {
              // this single interface has multiple ipv4 addresses
              console.log(ifname + ':' + alias, iface.address);
            } else {
              // this interface has only one ipv4 adress
              var datetime = new Date();
              Twitter.post('statuses/update', {status: datetime + '\n' + iface.address},  function(error, tweet, response){
                  if(error){
                    console.log(error);
                    defer.reject(new Error(error))

                  } else {
	                defer.resolve();
                  }
                  console.log(tweet);  // Tweet body.
                  console.log(response);  // Raw response object.
              });
            }
            ++alias;
          });
        });
    });

    return defer.promise;
};

senti-p-nel.prototype.onStop = function() {
    var self = this;
    var defer=libQ.defer();

    // Once the Plugin has successfull stopped resolve the promise
    defer.resolve();

    return libQ.resolve();
};

senti-p-nel.prototype.onRestart = function() {
    var self = this;
    // Optional, use if you need it
};


// Configuration Methods -----------------------------------------------------------------------------

senti-p-nel.prototype.getUIConfig = function() {
    var defer = libQ.defer();
    var self = this;

    var lang_code = this.commandRouter.sharedVars.get('language_code');

    self.commandRouter.i18nJson(__dirname+'/i18n/strings_'+lang_code+'.json',
        __dirname+'/i18n/strings_en.json',
        __dirname + '/UIConfig.json')
        .then(function(uiconf)
        {
			//uiconf.sections[0].content[0].value = self.config.get('consumer_key');
			//uiconf.sections[0].content[1].value = self.config.get('consumer_secret');
			//uiconf.sections[0].content[2].value = self.config.get('access_token_key');
			//uiconf.sections[0].content[3].value = self.config.get('access_token_secret');

            defer.resolve(uiconf);
        })
        .fail(function()
        {
            defer.reject(new Error());
        });

    return defer.promise;
};

ControllerSpop.prototype.saveTwitterAccount = function (data) {
	var self = this;

	var defer = libQ.defer();

	self.config.set('consumer_key', data['consumer_key']);
	self.config.set('consumer_secret', data['consumer_secret']);
	self.config.set('access_token_key', data['access_token_key']);
	self.config.set('access_token_secret', data['access_token_secret']);

	self.rebuildSPOPDAndRestartDaemon()
		.then(function(e){
			self.commandRouter.pushToastMessage('success', "Configuration update", 'The configuration has been successfully updated');
			defer.resolve({});
		})
		.fail(function(e)
		{
			defer.reject(new Error());
		});

	return defer.promise;
};



senti-p-nel.prototype.setUIConfig = function(data) {
	var self = this;
	//Perform your installation tasks here
};

senti-p-nel.prototype.getConf = function(varName) {
	var self = this;
	//Perform your installation tasks here
};

senti-p-nel.prototype.setConf = function(varName, varValue) {
	var self = this;
	//Perform your installation tasks here
};



// Playback Controls ---------------------------------------------------------------------------------------
// If your plugin is not a music_sevice don't use this part and delete it


senti-p-nel.prototype.addToBrowseSources = function () {

	// Use this function to add your music service plugin to music sources
    //var data = {name: 'Spotify', uri: 'spotify',plugin_type:'music_service',plugin_name:'spop'};
    this.commandRouter.volumioAddToBrowseSources(data);
};

senti-p-nel.prototype.handleBrowseUri = function (curUri) {
    var self = this;

    //self.commandRouter.logger.info(curUri);
    var response;


    return response;
};



// Define a method to clear, add, and play an array of tracks
senti-p-nel.prototype.clearAddPlayTrack = function(track) {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'senti-p-nel::clearAddPlayTrack');

	self.commandRouter.logger.info(JSON.stringify(track));

	return self.sendSpopCommand('uplay', [track.uri]);
};

senti-p-nel.prototype.seek = function (timepos) {
    this.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'senti-p-nel::seek to ' + timepos);

    return this.sendSpopCommand('seek '+timepos, []);
};

// Stop
senti-p-nel.prototype.stop = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'senti-p-nel::stop');


};

// Spop pause
senti-p-nel.prototype.pause = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'senti-p-nel::pause');


};

// Get state
senti-p-nel.prototype.getState = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'senti-p-nel::getState');


};

//Parse state
senti-p-nel.prototype.parseState = function(sState) {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'senti-p-nel::parseState');

	//Use this method to parse the state and eventually send it with the following function
};

// Announce updated State
senti-p-nel.prototype.pushState = function(state) {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'senti-p-nel::pushState');

	return self.commandRouter.servicePushState(state, self.servicename);
};


senti-p-nel.prototype.explodeUri = function(uri) {
	var self = this;
	var defer=libQ.defer();

	// Mandatory: retrieve all info for a given URI

	return defer.promise;
};

senti-p-nel.prototype.getAlbumArt = function (data, path) {

	var artist, album;

	if (data != undefined && data.path != undefined) {
		path = data.path;
	}

	var web;

	if (data != undefined && data.artist != undefined) {
		artist = data.artist;
		if (data.album != undefined)
			album = data.album;
		else album = data.artist;

		web = '?web=' + nodetools.urlEncode(artist) + '/' + nodetools.urlEncode(album) + '/large'
	}

	var url = '/albumart';

	if (web != undefined)
		url = url + web;

	if (web != undefined && path != undefined)
		url = url + '&';
	else if (path != undefined)
		url = url + '?';

	if (path != undefined)
		url = url + 'path=' + nodetools.urlEncode(path);

	return url;
};





senti-p-nel.prototype.search = function (query) {
	var self=this;
	var defer=libQ.defer();

	// Mandatory, search. You can divide the search in sections using following functions

	return defer.promise;
};

senti-p-nel.prototype._searchArtists = function (results) {

};

senti-p-nel.prototype._searchAlbums = function (results) {

};

senti-p-nel.prototype._searchPlaylists = function (results) {


};

senti-p-nel.prototype._searchTracks = function (results) {

};
