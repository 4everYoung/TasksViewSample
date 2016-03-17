class Device < ActiveRecord::Base
  has_many :tasks, :inverse_of => :device

end