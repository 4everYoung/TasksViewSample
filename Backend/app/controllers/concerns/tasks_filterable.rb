module TasksFilterable
  extend ActiveSupport::Concern

  def self.compose_tasks_collection filters
    tasks = Task.includes(:device, :business, :task_group, :assignee)
    if filters.present?
      filters = JSON.parse(filters) unless filters.is_a?(Hash)

      if filters['created_at'].present?
        created_at = filters['created_at'].to_datetime
        tasks = tasks.where(:created_at => (created_at.beginning_of_day..created_at.end_of_day)) 
      end

      if filters['task_type'].present? || filters['provider'].present? || filters['query'].present? 
        tasks = tasks.joins(:task_group)
        tasks = tasks.where(:task_groups => {:task_type => filters['task_type'] })  if filters['task_type'].present?
        tasks = tasks.where(:task_groups => {:provider => filters['provider'] })    if filters['provider'].present?
        tasks = tasks.where("task_groups.name LIKE ?", "%#{filters['query']}%")     if filters['query'].present?
      end

      limit       = filters['limit'].to_i
      total_items = tasks.count

      tasks = tasks.offset(limit*(filters['offset'].to_i - 1)).limit(limit)
    end
    { 
      tasks: ActiveModel::SerializableResource.new(tasks), 
      meta: { 
        total_items: total_items 
      } 
    }
  end
end