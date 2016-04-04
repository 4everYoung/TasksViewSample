class DeviceSerializer < ActiveModel::Serializer
  attributes :id, :name, :browser, :os
end