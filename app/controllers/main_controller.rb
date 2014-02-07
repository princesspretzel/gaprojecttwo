class MainController < ApplicationController

    def serve
        @combo = Combo.where("city = ? AND genre = ?", params[:city],params[:genre])[0]
        if @combo == nil
          @client = SoundCloud.new(:client_id => '4c2a3b5840e0236549608f59c2cd7d07')
          @tracks = @client.get('/tracks', q: params[:city], genres: params[:genre], filter: 'streamable')

          @combo = Combo.new
          @combo.city = params[:city]
          @combo.genre = params[:genre]
          @combo.save

          @tracks.each do |track|
            song = Song.new
            song.combo_id = @combo.id
            song.name = track.title
            song.url = "#{track.stream_url}?client_id=4c2a3b5840e0236549608f59c2cd7d07"
            song.soundcloud_id = track.id
            song.artwork_url = track.artwork_url || 'http://icons.iconarchive.com/icons/dan-wiersma/solar-system/512/Uranus-icon.png'
            song.artwork_url = song.artwork_url.gsub("large", "t300x300")
            song.artist = track.user.username
            song.save if track.stream_url
          end
        end
        unliked = []
        liked = []
        liked_most = 0
        high_count = 0
        @combo.songs.each do |song|
            if song.users.count == 0
                unliked.push(song)
            else
                if song.users.count > high_count
                    high_count = song.users.count
                    liked << liked_most if liked_most
                    liked_most = song
                else
                    liked.push(song)
                end
            end
        end
        liked.shuffle!
        unliked.shuffle!
        rand_front = unliked.shift(liked.length * 2)
        rand_front += liked
        rand_front.shuffle!
        if liked_most != 0  
          rand_front.unshift(liked_most)
        else
          puts "No songs liked in this scene yet :("
        end
        @playlist = rand_front + unliked
         respond_to do |format| 
          format.json { render :json => @playlist.to_json}
        end
    end
    

    def index
    end

    def like
        found = Opinion.where("song_id = ? AND user_id = ?", params[:song_id], current_user)
        if found == []
            foo = Opinion.new
            foo.song_id = Song.find(params[:song_id]).id
            foo.user = current_user
            foo.enjoyed = true
            foo.save
        else
            found[0].delete
        end
        render :nothing => true
    end

    def favorite
        find = Favorite.where("combo_id = ? AND user_id = ?", params[:combo_id], current_user)
        if find == []
            foo = Favorite.new
            foo.user_id = current_user
            foo.combo_id = params[:combo_id]
            foo.save
        else
            find[0].destroy
        end
        render :nothing => true
    end


    def comboserve
        render json: current_user.combos.to_json
    end

end