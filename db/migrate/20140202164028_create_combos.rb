class CreateCombos < ActiveRecord::Migration
  def change
    create_table :combos do |t|
        t.string :city
        t.string :genre


      t.timestamps
    end
  end
end
