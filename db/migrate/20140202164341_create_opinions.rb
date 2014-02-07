class CreateOpinions < ActiveRecord::Migration
  def change
    create_table :opinions do |t|
        t.integer :song_id, null: false
        t.integer :user_id, null: false
        t.boolean :enjoyed
        t.boolean :favorited, default: false

      t.timestamps
    end
  end
end
