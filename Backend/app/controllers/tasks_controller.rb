class TasksController < ApplicationController
  # before_filter :authenticate_user!

  def index
  	@tasks = Business.all
  	render json: @tasks
  end

  def show
  	@tasks = Business.all
  	render json: @tasks
  end
end