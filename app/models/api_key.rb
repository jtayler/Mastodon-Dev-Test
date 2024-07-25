# == Schema Information
#
# Table name: api_keys
#
#  id           :bigint(8)        not null, primary key
#  service_name :string
#  private_key  :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class ApiKey < ApplicationRecord
  validates :service_name, presence: true
  validates :private_key, presence: true
end
