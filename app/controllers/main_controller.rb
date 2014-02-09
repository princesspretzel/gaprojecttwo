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
                liked.push(song)
            end
        end

        liked.shuffle!
        unliked.shuffle!
        rand_front = unliked.shift(liked.length * 2)
        rand_front += liked
        rand_front.shuffle!
        # if liked_most != 0  
        #   rand_front.unshift(liked_most)
        # else
        #   puts "No songs liked in this scene yet :("
        # end
        @playlist = rand_front + unliked
        # @playlist.each do |song|
        #     if song == 0
        #         binding.pry
        #     end
        # end
         respond_to do |format| 
          format.json { render :json => @playlist.to_json }
        end
    end
    

    def index
    end

    def like
        found = Opinion.where("song_id = ? AND user_id = ?", params[:song_id], current_user)
        if found == []
            opinion = Opinion.new
            opinion.song_id = Song.find(params[:song_id]).id
            opinion.user = current_user
            opinion.enjoyed = true
            opinion.save
        else
            found[0].delete
        end
        liked?
    end

    def liked?
        @liked = Opinion.where("song_id = ? AND user_id = ?", params[:song_id], current_user)[0]
        respond_to do |format| 
          format.json { render :json => @liked.to_json }
        end
    end


    def favorite
        @combo = Combo.where("city = ? AND genre = ?", params[:city],params[:genre])[0]
        unless @combo == nil
            favorite = Favorite.new
            favorite.user = current_user
            favorite.combo = @combo
            favorite.save!
        else
            find[0].destroy
        end
        comboserve
    end


    def comboserve
        render json: current_user.combos.to_json
    end

end