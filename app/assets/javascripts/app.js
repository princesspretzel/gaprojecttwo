var songs;
var play ="";
var combo_id;
var save_combos;
var currentCombo;
var track;
var liked;
var queryresult




var audioView = function audioView() {
    var self = this;
    var id;
    var lastSong = "";
    var song;
    var track = 0;
    var audio;
    function newSong() {
        $('audio').remove();
        audio = new Audio
        audio.controls=true;
        // $('#player').append(audio)
        song = songs[track]   
        audio.src = song.url;
        id = song.id;
        audio.play();
        audio.addEventListener("ended", function (){
            nextSong();
        })
        $('#player').removeClass("hide");
        $('#cover').css('background', "url(\'"+song.artwork_url+"\')");
        $('#artist-info').empty();
        $('#artist-info').text(song.artist)
        $('#song-info').empty();
        $('#song-info').text(song.name);
        $('.mastfoot').removeClass("hidden")
        if (lastSong == ""){
        } else {
        $('#lastSong').text(lastSong.name);
        }
        liked(song);
    }


    function liked(track){
        $.ajax({
            url: "/liked?",
            method: "GET",
            dataType: 'json',
            data: {song_id: song.id}
        })
        .success(function(data){
            console.log("THIS IS THE DATA...")
            console.log(data);
            if (track == song){
            enjoyed(data)
        } else if (track == lastSong){
        enjoyedlast(data);
    }
        })
    }

    enjoyed = function enjoyed(song){
        if (song == null){
        console.log("User no enjoyed this!")
         $('#current-heart').removeClass("fa-heart").addClass("fa-heart-o")
    } else if (song.enjoyed == true) {
        console.log("did  so enjoy")
        $('#current-heart').removeClass("fa-heart-o").addClass("fa-heart")
    }
    }
    enjoyedlast = function enjoyedlast(song){
        if (song == null){
        console.log("User no enjoyed last!")
         $('#last-heart').removeClass("fa-heart").addClass("fa-heart-o")
    } else if (song.enjoyed == true) {
        console.log("did  so enjoy last")
        $('#last-heart').removeClass("fa-heart-o").addClass("fa-heart")
    }
    }




    function nextSong(){
        lastSong = song;
        liked(lastSong)
        track = track + 1;
        newSong();
    }
    $('#play').on('click', function(){
        audio.play();
    })
    $('#pause').on('click', function(){
        audio.pause();
    })
    $('#next').on('click', function() {
        nextSong();
    })
    $('#current-heart').on("click", function(){

        $.ajax({
            url: "/like",
            method: "POST",
            dataType: 'json',
            data: { song_id: song.id}   
        })
        .success( function(data){
            console.log("sup")
            enjoyed(data);
        })       
    }); 

    $('#last-heart').on("click", function(){
        $.ajax({
            url: "/like",
            method: "POST",
            dataType: 'json',
            data: { song_id: lastSong.id}
        })
        .success( function(data){
            console.log("suppp")
            enjoyedlast(data)
        }) 


    }); 
    newSong();
    }


$(function(){
    showCombos();

    $('#savecombo').on("click", function (){
        saveCombo();
    })

    $('#makecombo').on("click", function (){
        currentCombo = {genre: $('#genre').val(), city: $('#city').val()}
        serve();       
    })


    $('body').on('keypress', function(e){
        if (e.which == 13) {
            currentCombo = {genre: $('#genre').val(), city: $('#city').val()}
            serve();
        }
    })
});
  



var serve = function serve(){
        getLocation(currentCombo);
        $('#currentscene').empty();
        $('#currentscene').text("The Scene in "+currentCombo.city)
        $.ajax({
            url: '/serve',
            method: 'POST',
            dataType: 'json',
            data: currentCombo
        })
        .success( function(data){
            console.log(data);
            songs = data
            new audioView();

        })
    }

var saveCombo = function saveCombo (){
    $.ajax({
        url: '/favorite',
        method: 'POST',
        dataType: 'json',
        data: { genre: $('#genre').val(), city: $('#city').val() }
    })
    .success(function(data){
        console.log(data);
        showCombos();
    })
}

var showCombos = function showCombos(){
    $.ajax({
        url: '/comboserve',
        method: 'GET',
        dataType: 'json'
    })
    .success( function(data){
        save_combos = data;
        console.log(data);
        renderCombos();
    })
}

var renderCombos = function renderCombos(){
    $('#userscombos').empty();
    x = $(save_combos)
    x.each(function(i){
        var pattern = "<a href=# class='combos' id='combo"+save_combos[i].id+"'> the " + save_combos[i].genre + " scene in "  + save_combos[i].city + "</a>"
        $('#userscombos').append(pattern)
        $('#combo'+save_combos[i].id).data("combo", save_combos[i])
    })
    $('.combos').on("click",function(e){
        e.preventDefault();
        comboPull = $(this).data("combo");
        currentCombo = {genre: comboPull.genre, city: comboPull.city}
        console.log(comboPull);
        serve();

    })
}

var getLocation = function getLocation(currentCombo) {
    var queryYahoo = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.placefinder%20where%20text%3D%22"+currentCombo.city+"%22&format=json&diagnostics=true&callback="
    $.ajax({
        url: queryYahoo,
        method: "GET",
        dataType: 'json'
    })
    .success(function(data){
        queryresult = data.query.results.Result
        console.log(queryresult);
        $('.instagram').on('willLoadInstagram', function(event, options) {
        console.log(options);
      });
     $('.instagram').on('didLoadInstagram', didLoadInstagram);
     $('.instagram').empty();
     $('.instagram').instagram({
            search: {
            lat: queryresult.latitude,
            lng: queryresult.longitude,
            distance: 20000,
        },
        count: 5,
        clientId: 'b82a6dc9b365436fae8919cfe9c53fba'
    });

    })
    
}

var createPhotoElement = function createPhotoElement(photo) {
      var innerHtml = $('<img>')
        .addClass('instagram-image').addClass('img-responsive')
        .attr('src', photo.images.thumbnail.url);

      innerHtml = $('<a>')
        .attr('target', '_blank')
        .attr('href', photo.link)
        .append(innerHtml);

      return $('<div>')
        .addClass('instagram-placeholder')
        .attr('id', photo.id)
        .append(innerHtml);
    }

function didLoadInstagram(event, response) {
    var self = this;
    $(self).empty();
      $.each(response.data, function(i, photo) {
        $(self).append(createPhotoElement(photo));
      });
    }


