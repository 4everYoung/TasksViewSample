module TasksFilterable
  extend ActiveSupport::Concern

  def self.compose_tasks_collection filters, getLastRecording = nil
    tasks = Task.includes(:device, :business, :task_group, :assignee)
    if filters.present?
      if filters[:created_at].present?
        created_at = filters['created_at'].to_datetime
        tasks = tasks.where(:created_at => (created_at.beginning_of_day..created_at.end_of_day)) 
      end

      if filters[:provider_type].present? || filters[:query].present? 
        tasks = tasks.joins(:task_group)
        tasks = tasks.where(:task_groups => {:provider_type => filters[:provider_type] })  if filters[:provider_type].present?
        tasks = tasks.where("task_groups.name LIKE ?", "%#{filters[:query]}%")     if filters[:query].present?
      end
      
      total_items = tasks.size
      tasks       = tasks.offset(filters[:limit]*(filters[:offset] - 1)).limit(filters[:limit]) if (filters[:limit] > 0 && filters[:offset] > 0)
      tasks       = tasks.last(getLastRecording) if getLastRecording.present?
    end
    { 
      tasks: tasks, 
      total_items: total_items
    }
  end
end