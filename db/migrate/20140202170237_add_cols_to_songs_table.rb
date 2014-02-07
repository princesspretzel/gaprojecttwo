class AddColsToSongsTable < ActiveRecord::Migration
  def change
    add_column :songs, :soundcloud_user_id, :integer
    add_column :songs, :waveform_url, :string
    add_column :songs, :artwork_url, :string
    add_column :songs, :time_uploaded, :string
    add_column :songs, :tiny_planet_playcount, :integer
  end
end
