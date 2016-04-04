class TasksController < ApplicationController
  require 'csv'

  def index
    result = TasksFilterable.compose_tasks_collection(convert_filters(params['filters']))
    render json: { tasks: ActiveModel::SerializableResource.new(result[:tasks]), meta: { total_items: result[:total_items]  }}
  end

  def remove_collection
    count = 0
    params[:ids].each do | id |
      count+=1 if Task.where(id: id).first.try(:destroy)
    end
    result = TasksFilterable.compose_tasks_collection(convert_filters(params['filters']), count)
    render json: { 
      tasks:  ActiveModel::SerializableResource.new(result[:tasks]),
      count:  count
    } 
  end

  def task_types
    task_types = TaskGroup.group(
      :provider, 
      :task_type
    ).map{|t| { provider: t.provider, task_type: t.task_type, id: t.id}}
    render json: task_types
  end

  def assign
    assignee = User.where(id: params[:assignee_id]).first
    tasks = Task.where(id: params[:ids])
    tasks.map {|t| t.update_attributes(assignee_id: assignee.id) }
    render json: { count: tasks.count, assignee: assignee.as_json } 
  end

  def unassign
    tasks = Task.where(id: params[:ids])
    tasks.map {|t| t.update_attributes(assignee_id: nil) }
    render json: { count: tasks.count } 
  end

  def export
    render :status => :accepted, :json => { jid: ExportTasksWorker.perform_async(params['filters'].except('limit', 'offset')) }
  end

  def check_perform
    status = case Sidekiq::Status::status params[:jid]
    when :complete
      'OK'
    when :failed
      'ERROR'
    else
      'QUEUED'
    end
    render json: { result: status }
  end

  def add_task
    task = Task.new(params.require(:task).permit(:description, :task_group_id, :assignee_id, :business_id, :device_id))
    render json: { result: task.save ? "OK" : "FAILED" }
  end

  private

  def convert_filters filters
    filters   = JSON.parse(filters) unless filters.is_a?(Hash)
    @filters  = filters.present? ? hash_string_symbols(filters) : {}
  end
end