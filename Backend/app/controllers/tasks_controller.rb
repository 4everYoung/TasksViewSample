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
    ).map{|t| { provider: t.provider, task_type: t.task_type, id: t.id}}
    render json: task_types
  end

  def users
    users = User.all.map{|t| { full_name: t.full_name, email: t.email, id: t.id}}
    render json: users
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
    task = Task.create({
                    description: 		params["attributes"].select{|key| key["name"] == 'description'}.first['value'],
                    device_id:      Device.first.id,
                    business_id: 		Business.first.id,
                    task_group_id:  params["attributes"].select{|key| key["name"] == 'task_group_id'}.first['value'],
                    assignee_id: 		params["attributes"].select{|key| key["name"] == 'assignee_id'}.first['value']
                })
    render json: { result: "OK" }
  end
end