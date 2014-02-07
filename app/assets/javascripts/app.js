var songs;
var play ="";
var combo_id;
var save_combos;
var currentCombo;
var track;



var audioView = function audioView() {
    var self = this;
    var id;
    var lastSong;
    var song;
    var track = 0;
    var audio;
    function newSong() {
        $('audio').remove();
        audio = new Audio
        audio.controls=true;
        $('#player').append(audio)
        song = songs[track]   
        audio.src = song.url;
        id = song.id;
        audio.play();
        audio.addEventListener("ended", function (){
                if ( $('#current-heart').hasClass("fa-heart") == true ) {
                $("#current-heart").toggleClass("fa-heart-o", "fa-heart");
                $('#last-heart').removeClass("fa-heart-o");
                $('#last-heart').addClass("fa-heart");
            } else {
                $('#last-heart').removeClass("fa-heart");
                $('#last-heart').addClass("fa-heart-o");
            }
            lastSong = song
            nextSong();
        })
        $('#player').removeClass("hide");
        $('#cover').css('background', "url(\'"+song.artwork_url+"\')");
        $('#artist-info').empty();
        $('#artist-info').text(song.artist)
        $('#song-info').empty();
        $('#song-info').text(song.name);
        $('#lastSong').text(lastSong.name);
        $('#current-heart').removeClass("fa-heart").addClass("fa-heart-o")
        
    }

    function nextSong(){
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
        if ( $('#current-heart').hasClass("fa-heart") == true ) {
            $('#current-heart').removeClass("fa-heart").addClass("fa-heart-o");
            $('#last-heart').removeClass("fa-heart-o").addClass("fa-heart");
        } else {
            $('#last-heart').removeClass("fa-heart").addClass("fa-heart-o");
            $('#current-heart').addClass("fa-heart-o").removeClass("fa-heart");
        }
      
        lastSong = song
        nextSong();
    })
    $('#current-heart').on("click", function(){
        if ($('#current-heart').hasClass('fa-heart-o') == true) {
            $('#current-heart').removeClass("fa-heart-o").addClass("fa-heart");
        } else {
            $('#current-heart').removeClass("fa-heart").addClass("fa-heart-o");
        }
       
        $.ajax({
            url: "/liked",
            method: "POST",
            dataType: 'json',
            data: { song_id: song.id}
        })
    }); 

    $('#last-heart').on("click", function(){
        if ($('#last-heart').hasClass('fa-heart-o') == true) {
            $('#last-heart').removeClass("fa-heart-o");
            $('#last-heart').addClass("fa-heart");
        } else {
            $('#last-heart').removeClass("fa-heart");
            $('#last-heart').addClass("fa-heart-o");
        }
        $.ajax({
            url: "/liked",
            method: "POST",
            dataType: 'json',
            data: { song_id: lastSong.id}
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
})  




var serve = function serve(){
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

