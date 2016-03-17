class TasksController < ApplicationController
	
  def index
  	@tasks = Business.all
  	render json: @tasks
  end
end