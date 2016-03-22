class TasksController < ApplicationController
  require 'csv'

  def index
    render json: TasksFilterable.compose_tasks_collection(params['filters']), root: false
  end

  def task_types
    task_types = TaskGroup.group(
      :provider, 
      :task_type
    ).map{|t| { provider: t.provider, task_type: t.task_type}}
    render json: task_types
  end

  def export
    render :status => :accepted, :json => { jid: ExportTasksWorker.perform_async(params['filters']) }
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