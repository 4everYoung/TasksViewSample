class TasksController < ApplicationController

  def index
    tasks = Task.includes(:device, :business, :task_group, :assignee)
    if params['filters'].present?
      filters = JSON.parse(params['filters'])

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
    end
    render json: tasks, root: false
  end

  def task_types
    task_types = TaskGroup.group(
      :provider, 
      :task_type
    ).map{|t| { provider: t.provider, task_type: t.task_type}}.unshift({provider: '', task_type: ''})
    render json: task_types
  end
end
