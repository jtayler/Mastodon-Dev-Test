# frozen_string_literal: true

module Admin
  class BaseController < ApplicationController
    include Authorization
    include AccountableConcern

    layout 'admin'

    before_action :authenticate_user!
    before_action :require_admin
    before_action :set_body_classes
    before_action :set_cache_headers

    after_action :verify_authorized

    private 

    def require_admin
      Rails.logger.debug "Current user: #{current_user.inspect}" # Debugging line
      Rails.logger.debug "Is admin: #{current_user.admin?}" # Debugging line
      unless current_user.admin?
        redirect_to root_path, alert: 'You are not authorized to access this page.'
      end
    end
    
    def set_body_classes
      @body_classes = 'admin'
    end

    def set_cache_headers
      response.cache_control.replace(private: true, no_store: true)
    end

    def set_user
      @user = Account.find(params[:account_id]).user || raise(ActiveRecord::RecordNotFound)
    end
  end
end
