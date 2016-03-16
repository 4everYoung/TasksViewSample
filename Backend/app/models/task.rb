class Task < ActiveRecord::Base

  belongs_to :user
  belongs_to :device
  belongs_to :business
  belongs_to :task_group
  has_one :user
end