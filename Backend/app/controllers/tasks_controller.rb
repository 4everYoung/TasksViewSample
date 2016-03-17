class TasksController < ApplicationController
	
  def index
  	tasks = Task.all.includes(:device, :business, :task_group, :assignee)
  	render json: tasks, root: false
  end
end