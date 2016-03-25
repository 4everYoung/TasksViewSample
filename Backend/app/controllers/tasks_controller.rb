class TasksController < ApplicationController
  require 'csv'

  def index
    result = TasksFilterable.compose_tasks_collection(params['filters'])
    render json: { tasks: ActiveModel::SerializableResource.new(result[:tasks]), meta: { total_items: result[:total_items]  }}
  end

  def remove_collection
    count = 0
    params[:ids].each do | id |
      count+=1 if Task.where(id: id).first.try(:destroy)
    end
    result = TasksFilterable.compose_tasks_collection(params['filters'], count)
    render json: { 
      tasks:  ActiveModel::SerializableResource.new(result[:tasks]),
      count:  count
    } 
  end

  def task_types
    task_types = TaskGroup.group(
      :provider, 
      :task_type
    ).map{|t| { provider: t.provider, task_type: t.task_type}}
    render json: task_types
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
end