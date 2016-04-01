class BusinessesController < ApplicationController

  def index

  end

  def search_by_name
    businesses = params[:name].present? ? Business.where("name LIKE '#{params[:name]}%'") : []
    render json: { 
      total_count:  businesses.size,
      items:        ActiveModel::SerializableResource.new(businesses)
    }
  end
end