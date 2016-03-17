class Task < ActiveRecord::Base

  belongs_to :user
  belongs_to :device
  belongs_to :business
  belongs_to :task_group
  belongs_to :assignee, class_name: 'User'
end