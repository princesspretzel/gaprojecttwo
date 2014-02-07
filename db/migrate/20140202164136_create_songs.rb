class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
        t.integer :combo_id
        t.string :url
        t.string :artist
        t.string :name
        t.integer :soundcloud_id
      t.timestamps
    end
  end
end
