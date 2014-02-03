class MainController < ApplicationController

    def test
        client = SoundCloud.new(:client_id => '4c2a3b5840e0236549608f59c2cd7d07')


        tracks = client.get('/tracks', q: params[:city], genres: params[:genre] )


        respond_to do |format|
            format.json { render json: tracks.to_json }
        end
    end


    def index
        client = SoundCloud.new(:client_id => '4c2a3b5840e0236549608f59c2cd7d07')


        tracks = client.get('/tracks', q: 'chicago', genres: 'jazz' )

        @responce = HTTParty.get("https://w.soundcloud.com/player/?url=//api.soundcloud.com/tracks/102894524&color=01DFA5&show_comments=false&show_artwork=true&show_playcount=false&liking=false&theme_color=01DFA5&sharing=false&buying=false&show_user=false&show_artwork=false")

        @server_embed = @responce
    
    end



end
