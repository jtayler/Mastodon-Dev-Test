class AddFieldsToApiKeys < ActiveRecord::Migration[7.1]
  def change
    add_column :api_keys, :name, :string
    add_column :api_keys, :otp_secret, :string
    add_column :api_keys, :secret_key, :string
  end
end
