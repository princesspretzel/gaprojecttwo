class Song < ActiveRecord::Base
  has_many :opinions
  has_many :users, through: :opinions
  # attr_accessible :title, :body
end
