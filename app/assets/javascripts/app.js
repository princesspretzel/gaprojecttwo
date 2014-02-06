var songs;

var audioView = function audioView() {
    var self = this;
    var id;
    var lastSong;
    var song;
    var track = 0;
    var audio = new Audio
    function newSong() {
        song = songs[track]
        lastSong=songs[track-1]
        audio.src = song.url;
        id = song.id;
        audio.play();
        audio.addEventListener("ended", function (){
            track++;
            newSong();
        })
        $('#art').empty();
        $('#art').attr('src', song.artwork_url);
        $('#song-info').empty();
        $('#song-info').text(song.name);
        if (lastSong == songs[-1]){
            $('#lastSong').empty();
        }
        else{
            $('#lastSong').empty();
            $('#lastSong').text(lastSong.name);
        }

    }
    $('#play').on('click', function(){
        audio.play();
    })
    $('#pause').on('click', function(){
        audio.pause();
    })
    $('#next').on('click', function() {
        track++;
        newSong();
        
    })
    $('#heart').on("click", function(){
        $.ajax({
            url: "/liked",
            method: "POST",
            dataType: 'json',
            data: { song_id: song.id}
        })
    }); 

    $('#player').append(audio)
    newSong();
}


 $(function(){
    $('body').on('keypress', function(e){
        if (e.which == 13) {
            $.ajax({
                url: '/save',
                method: 'POST',
                dataType: 'json',
                data: { genre: $('#genre').val(), city: $('#city').val() }
            })
            .success( function(data){
                console.log(data); 

            })
            $.ajax({
                url: '/serve',
                method: 'POST',
                dataType: 'json',
                data: { genre: $('#genre').val(), city: $('#city').val() }
            })
            .success( function(data){
                console.log(data);
                songs = data
                new audioView();
            })

        };
    }); 
})   



