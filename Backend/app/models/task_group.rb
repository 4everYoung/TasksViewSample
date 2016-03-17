class TaskGroup < ActiveRecord::Base
  has_many :tasks
  belongs_to :assignor, class_name: 'User'
end