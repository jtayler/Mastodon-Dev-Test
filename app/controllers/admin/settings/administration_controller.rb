# app/controllers/admin/settings/administration_controller.rb
# app/controllers/admin/settings/administration_controller.rb
# frozen_string_literal: true

module Admin
  module Settings
    class AdministrationController < Admin::SettingsController
      def show
         render 'admin/settings/administration/show'
      end
    end
  end
end