 var songs = []

 $(function(){
    var audio = $('<audio>', {  
      autoPlay : 'autoplay',  
      controls : 'controls'  
    });  
    function addSource(elem, path) {  
      $('<source>').attr('src', path).appendTo(elem);  
    }  
    $('body').on('keypress', function(e){
        if (e.which == 13) {
            $.ajax({
             method: 'post',
             dataType: 'json',
             url: '/save',
             data: {city: $('#city').val(), genre: $('#genre').val()}
            })
         
         
         
            SC.get("/tracks", {q:""+$('#city').val()+"", genres:""+$('#genre').val()+"", limit: 10}, function(tracks){
                songs = tracks;
                console.log(songs);
                for (i = 0; i < songs.length; i++) {
                    songs[i].stream_url = songs[i].stream_url+"?client_id=4c2a3b5840e0236549608f59c2cd7d07"
                    console.log(songs[i].stream_url)
                }
                audio.appendTo('body');
                addSource(audio, songs[0].stream_url);
            });
        };
    });
});


  
