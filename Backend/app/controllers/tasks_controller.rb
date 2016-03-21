class TasksController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => [:export]

  require 'csv'

  def index
    render json: TasksFilterable.compose_tasks_collection(params['filters']), root: false
  end

  def task_types
    task_types = TaskGroup.group(
      :provider, 
      :task_type
    ).map{|t| { provider: t.provider, task_type: t.task_type}}.unshift({provider: '', task_type: ''})
    render json: task_types
  end

  def export
    @job_id = ExportTasksWorker.perform_async(params['filters'])
    render :status => :accepted, :json => { jid: @job_id }
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