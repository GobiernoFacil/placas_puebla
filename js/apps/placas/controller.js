// PINCHES PLACAS APP
// @package  : placas
// @location : /js/apps/placas
// @file     : controller.js
// @author   : Gobierno fácil
// @url      : http://gobiernofacil.com
// @twitter  : @gobiernofacil


define(function(require){
  //
  // L O A D   T H E   A S S E T S   A N D   L I B R A R I E S
  //
  var Backbone   = require('backbone'),
      Collection = require('collections/municipios'),
      Big_cities = require('views/big_cities'),
      Worst_cities = require('views/worst_cities'),
      All_cities = require('views/all_cities'),
      SVG_map    = require('views/svg_map'),
      d3         = require('d3'),
      G          = require('goog!maps,3.17,other_params:sensor=false&region=MX'),
      Municipios = require('data/puebla'),
      Centros    = require('data/centros'),
      Colores    = require('data/colores');

  //
  // I N I T I A L I Z E   T H E   B A C K B O N E   V I E W
  //
  var controller = Backbone.View.extend({

    //
    // D E F I N E   T H E   E V E N T S
    // 
    events : {
      
    },

    //
    // D E F I N E   T H E   T E M P L A T E S
    // 

    //
    // S E T   T H E   C O N T A I N E R
    //
    el : "#main.placas",


    //
    // T H E   I N I T I A L I Z E   F U N C T I O N
    //
    initialize : function(){
      // city collection
      this.collection = new Collection(Municipios.puebla);
      
      // add the color attribute to the collection
      this.collection.each(function(city){
        city.set({
          color : Colores.color[city.get('level')]
        });
      }, this);

      // offices collection
      this.offices = new Backbone.Collection(Centros.centros);
      // the data array
      this.cities = [];

      // the bigger cities
      this.big_cities = [];

      // exectute the calc
      // this.map_data();

      // colorize :D & assign color values
      this.svg_map = new SVG_map({collection : this.collection});
      this.svg_map.render();

      // create the full list
      this.render_full_list();

      // render the big cities
      this.big_cities_view = new Big_cities({collection : this.collection});
      this.big_cities_view.render();

      this.worst_cities = new Worst_cities({collection : this.collection});
      this.worst_cities.render();

      this.all_cities = new All_cities({collection : this.collection});
      this.all_cities.render();

	  this.render_show_hide();

      // render the google map
      // this.render_google_map();
    },


    //
    // R E N D E R   T H E   C O M P L E T E   C I T Y   L I S T
    //
    render_full_list : function(){
      _.each(this.cities, function(city){
        var c = this.collection.findWhere({clave_municipio : city.clave_municipio});
        this.$('#just-all ol').append('<li style="background:' + Colores.color[c.get('level')] +';">' + c.get('nombre_municipio') + '</li>');
      }, this);
    },
    
    //
    // R E N D E R   T H E   S H O W    / H I D E
    //
    render_show_hide: function() {
    	$("#top-ten").hide();
    	$("#worst-ten").hide();
    	$("#just-all").hide();
    	$("#info").hide();
		
		$("#nav a").on('click', function(){
			$("#nav").find("a").removeClass('current');
	  		event.preventDefault();
			var sectionName = $(this).attr("title");
			
			$(this).addClass("current");
			
			$("#top-ten").hide();
			$("#worst-ten").hide();
			$("#just-all").hide();
			$("#base-map").hide();
			$("#info").hide();
			
			$("#"+sectionName).show();
			 
	  }); 
    },
    	  


    //
    // R E N D E R   T H E   G O O G L E   M A P
    //
    render_google_map : function(){
      // set the map
      var mapOptions = {
        center      : { lat: 19.015416145324707, lng: -98.15610885620117}, // puebla
        zoom        : 8,
        scrollwheel : false
      };
      var map = new google.maps.Map(document.getElementById('centers-and-big-cities'), mapOptions);

      // put the markers on the offices
      var centers = [];
      var cities  = [];
      var center_color = "ffffff";//"3292e6";

      // RENDER THE OFFICE MARKERS
      this.offices.each(function(center){
        // get a marker with the marker color
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + center_color,
          new google.maps.Size(21, 34),
          new google.maps.Point(0,0),
          new google.maps.Point(10, 34));

        // create the marker
        centers.push(new google.maps.Marker({
          position: new google.maps.LatLng(center.get('lat'),center.get('lng')), 
          map: map,
          icon: pinImage
        }));
      }, this);

      // RENDER THE CITY MARKERS
      _.each(this.big_cities, function(city){
        var c = this.collection.findWhere({clave_municipio : city.clave_municipio});
        var city_color = Colores.colorhex[c.get('level')];
        // get a marker with the marker color
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + city_color,
          new google.maps.Size(21, 34),
          new google.maps.Point(0,0),
          new google.maps.Point(10, 34));

        // create the marker
        cities.push(new google.maps.Marker({
          position: new google.maps.LatLng(c.get('lat'),c.get('lng')), 
          map: map,
          icon: pinImage
        }));
      }, this);
    }
  });

  return controller;
});