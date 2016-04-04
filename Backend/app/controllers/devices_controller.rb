class DevicesController < ApplicationController

  def index
    devices = Device.all
    render json: { devices: ActiveModel::SerializableResource.new(devices) }
  end
end