try {
  if (! window.AudioContext) {
      if (! window.webkitAudioContext) {
          return;
      }
      window.AudioContext = window.webkitAudioContext;
  }
  ctx = new AudioContext();
}
catch(e) {
  console.log('Web Audio API is not supported in this browser');
}


$(function(){

  /* Models */

  var Track = Backbone.Model.extend({
    defaults: {
        title: "Unknown",
        artist: "Unknown",
        url: "Unknown"
    }
  });

  var Playlist = Backbone.Model.extend({
    defaults: {
        title: "Untitled Playlist",
        tracks: []
    }
  });

  var Playlists = Backbone.Collection.extend({
    model: Playlist,
    localStorage: new Backbone.LocalStorage("playlists")
  });

  var playlists = new Playlists();


  /* Views */

  var PlaylistListView = Backbone.View.extend({

    el: "#playlists",
    model: playlists,

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
        this.bind('render', this.render);
        _.bindAll(this, "renderItem");
    },

    renderItem: function(model){
        var playlistView = new PlaylistView({model: model});
        playlistView.render();
        $(this.el).append(playlistView.el);
    },

    render: function(){
      $("#playlists").html('');
      var self = this,
          html = '';
        _.each(this.model.toJSON(), function(mod) {
          self.renderItem(mod);
        });
    }

  });

  var TrackListView = Backbone.View.extend({
    el: $("#tracks"),

    initialize: function(){
        this.bind('changePlaylist', this.changePlaylist);
        _.bindAll(this, "renderItem");
    },

    renderItem: function(model){
        var trackView = new TrackView({model: model});
        trackView.render();
        $(this.el).append(trackView.el);
    },

    render: function(){
      $("#tracks").html('');
      if (this.model)  {
        var self = this,
            html = '';
          _.each(this.model.toJSON().tracks, function(mod) {
            self.renderItem(mod);
          });
      }
    },

    changePlaylist: function(current)  {
      if (!this.model && current) {
        this.model = current;
      }
      this.render();
    }

  });

  var PlaylistView = Backbone.View.extend({

    tagName: "li",
    template: _.template($('#playlist-template').html()),

    events: {
      "dblclick"  : "play"
    },

    render: function() {
      var html = this.template(this.model);
      $(this.el).html(html);

      return this;
    },

    play: function()  {
      this.trigger('play');
    }
  });

  var TrackView = Backbone.View.extend({

    tagName: "li",

    template: _.template($('#track-template').html()),

    events: {
      "dblclick"  : "play"
    },

    render: function() {
      if(this.model)  {
        var html = this.template(this.model);
        $(this.el).html(html);
      }
      return this;
    },

    play: function()  {
      console.log("Playing " + this.model.title);
      player.trigger("play", this.model);
    }

  });

  // The Application
  // ---------------


  var Player = Backbone.View.extend({
    el : "#player",

    track : null,

    state : "paused",

    initialize: function()  {
      this.bind('play', this.play);
      this.bind('pause', this.pause);
      this.bind('togglePlay', this.togglePlay);
    },

    setTrack : function(track)  {
      this.track = track;
    },

    play : function(track)  {
      // If track is set then play new song. Else play current src (used for pausing).
      if (track)  {
        this.setTrack(track);
        $(this.el).attr("src", track.url).appendTo($(this.el).parent());
      }
      $("#togglePlaying").html("Pause");
      this.state = "playing";
      this.el.play();
    },

    pause : function()  {
      $("#togglePlaying").html("Play");
      this.state = "paused";
      this.el.pause();
    },

    togglePlay : function()  {
      if (this.state === "paused") this.trigger("play");
      else this.pause();
    }
  });
  var player = new Player();

  var AppView = Backbone.View.extend({
    el: $("#app"),

    currentPlaylist: -1, // Index of the playlist,
    trackListView : new TrackListView(),
    playlistListView : new PlaylistListView(),

    events: {
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete",
      "click #new-playlist":  "createPlaylist",
      "click #new-track":  "createTrack",
      "click #togglePlaying" : "togglePlay"
    },

    initialize: function() {
      this.listenTo(playlists, 'add', this.renderPlaylists);
      this.listenTo(playlists, 'reset', this.renderPlaylists);
      this.listenTo(playlists, 'all', this.render);
      this.listenTo(playlists, 'play', this.play);


      window.addEventListener('dragover', this.preventDefault, false);
      window.addEventListener('dragenter', this.preventDefault, false);
      window.addEventListener('drop', this.handleDrop, false);


      playlists.fetch();
      if (playlists.models[0]) this.currentPlaylist = playlists.models[0].id;
      this.renderPlaylists();
      this.renderTracks();
      setupNodes();
    },

    changePlaylist: function(id)  {
      this.currentPlaylist = id;
      this.render();
    },

    createPlaylist: function(e) {
      var playlistName = prompt("Playlist Name");
      playlists.create({title: playlistName});
    },

    createTrack: function(url) {
      var trackName = prompt("Track name");
      var trackArtist = prompt("Track artist");
      var trackUrl = (typeof(url) === "string") ? url : prompt("Track url");
      if (trackName && playlists.models[0]) {
        if (this.currentPlaylist===-1) this.currentPlaylist = playlists.models[0].id;
        var tracks = playlists.get(this.currentPlaylist).get("tracks");
        tracks.push({ title: trackName, artist: trackArtist, url: trackUrl });
        playlists.get(this.currentPlaylist).save({ tracks : tracks});
        this.renderTracks();
      }
    },

    handleDrop: function(e) {
      e.stopPropagation();
      e.preventDefault();
      var file = e.dataTransfer.files[0];

      reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (function(theFile) {
        return function(e) {
          App.createTrack(e.target.result);
        };
      })(file);
    },

    play: function()  {
      this.changePlaylist(this.model.id);
      this.render();
      player.trigger("play", playlists.get(this.model.id).toJSON().tracks[0].id);
    },

    preventDefault: function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      return false;
    },

    render: function()  {
      this.renderTracks();
      this.renderPlaylists();
    },

    renderTracks: function() {
      if (this.currentPlaylist != -1)  {
        var current = playlists.get(this.currentPlaylist);
        this.trackListView.trigger('changePlaylist', current);
      }
    },

    renderPlaylists: function() {
      this.playlistListView.trigger('render');
    },

    togglePlay: function()  {
      player.trigger("togglePlay");
    }

  });

  var App = new AppView;

});

ele = $("#player")[0];
function setupNodes()  {
  ctx = new AudioContext(),
  gainNode = ctx.createGainNode(),
  src = ctx.createMediaElementSource(ele);
  analyser = ctx.createAnalyser();

  src.connect( gainNode );
  gainNode.connect( analyser );
  analyser.connect( ctx.destination );

  connectKeys();
  visualizer();
}
