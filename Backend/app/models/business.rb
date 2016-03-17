class Business < ActiveRecord::Base
  has_many :tasks, :inverse_of => :business

end