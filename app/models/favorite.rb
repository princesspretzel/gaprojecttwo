class Favorite < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :combo
  belongs_to :user
end
