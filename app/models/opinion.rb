class Opinion < ActiveRecord::Base
  belongs_to :user
  belongs_to :song
  # attr_accessible :title, :body
end
