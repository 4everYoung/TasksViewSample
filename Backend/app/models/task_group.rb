class TaskGroup < ActiveRecord::Base
  has_many :tasks, :inverse_of => :task_group
  belongs_to :assignor, class_name: 'User', :inverse_of => :task_groups
  belongs_to :operator, class_name: 'User', :inverse_of => :task_groups

  before_save :set_provider_type

  def set_provider_type
    self.provider_type = [self.provider, self.task_type].join('')
  end
end