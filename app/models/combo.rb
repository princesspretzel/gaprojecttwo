class Combo < ActiveRecord::Base
  # attr_accessible :title, :body
  has_many :songs
end
