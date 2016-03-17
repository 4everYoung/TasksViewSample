class Task < ActiveRecord::Base

  belongs_to :device, 		:inverse_of => :tasks
  belongs_to :business,		:inverse_of => :tasks	
  belongs_to :task_group, 	:inverse_of => :tasks
  belongs_to :assignee, class_name: 'User', :inverse_of => :tasks
  belongs_to :operator, class_name: 'User', :inverse_of => :tasks
end