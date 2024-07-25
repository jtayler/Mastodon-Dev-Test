# app/controllers/admin/api_keys_controller.rb
class Admin::ApiKeysController < Admin::BaseController
  before_action :require_admin
  before_action :admin_set_api_key, only: [:update, :destroy]

  def index
    @api_keys = ApiKey.all
    @api_key = ApiKey.new
    authorize @api_keys

    respond_to do |format|
      format.html # renders the index.html.erb view
      format.json { render json: @api_keys }
    end
  end

  def create
    @api_key = ApiKey.new(api_key_params)
    authorize @api_key
    if @api_key.save
      key_set = @api_key.service_name == "truanon" ? set_environment_variables(@api_key) : false
      respond_to do |format|
        format.html { redirect_to admin_api_keys_path, notice: "API key created" }
        format.json { render json: { api_key: @api_key, key_set: key_set }, status: :created }
      end
    else
      respond_to do |format|
        format.html do
          @api_keys = ApiKey.all
          render :index
        end
        format.json { render json: { errors: @api_key.errors.full_messages, key_set: false }, status: :unprocessable_entity }
      end
    end
  rescue StandardError => e
    Rails.logger.error "Error in create action: #{e.message}"
    respond_to do |format|
      format.html { redirect_to admin_api_keys_path, alert: "An error occurred while creating the API key" }
      format.json { render json: { error: e.message, key_set: false }, status: :internal_server_error }
    end
  end

  def update
    authorize @api_key
    if @api_key.update(api_key_params)
      key_set = @api_key.service_name == "truanon" ? set_environment_variables(@api_key) : false
      respond_to do |format|
        format.html { redirect_to admin_api_keys_path, notice: "API key updated" }
        format.json { render json: { api_key: @api_key, key_set: key_set } }
      end
    else 
      respond_to do |format|
        format.html do
          @api_keys = ApiKey.all
          render :index
        end
        format.json { render json: { errors: @api_key.errors.full_messages, key_set: false }, status: :unprocessable_entity }
      end
    end    
  rescue StandardError => e
    Rails.logger.error "Error in update action: #{e.message}"
    respond_to do |format|
      format.html { redirect_to admin_api_keys_path, alert: "An error occurred while updating the API key" }
      format.json { render json: { error: e.message, key_set: false }, status: :internal_server_error }
    end
  end

  def destroy
    authorize @api_key
    if @api_key.destroy
      respond_to do |format|
        format.html { redirect_to admin_api_keys_path, notice: "API key deleted" }
        format.json { render json: { success: true, key_set: false }, status: :ok }
      end
    else
      respond_to do |format|
        format.html { redirect_to admin_api_keys_path, alert: "Failed to delete API key" }
        format.json { render json: { error: "Failed to delete API key", key_set: false }, status: :unprocessable_entity }
      end
    end
  rescue StandardError => e
    Rails.logger.error "Error in destroy action: #{e.message}"
    respond_to do |format|
      format.html { redirect_to admin_api_keys_path, alert: "An error occurred while deleting the API key" }
      format.json { render json: { error: e.message, key_set: false }, status: :internal_server_error }
    end
  end 

  private

  def admin_set_api_key 
    @api_key = ApiKey.find(params[:id])
  end

  def api_key_params
    params.require(:api_key).permit(:service_name, :private_key)
  end

  def set_environment_variables(api_key)
    Rails.logger.info "Updating .env file..."
    env_file = Rails.root.join('.env')
    existing_lines = File.exist?(env_file) ? File.read(env_file).split("\n") : []
    filtered_lines = existing_lines.reject { |line| line.start_with?("PRIVATE_KEY=") }
    new_line = "PRIVATE_KEY=#{api_key.private_key}"
    Rails.logger.info "New line: #{new_line}"
    new_content = (filtered_lines + [new_line]).join("\n")
    File.open(env_file, 'w') { |file| file.puts new_content }
    Dotenv.load(env_file)
    updated_file = File.read(env_file)
    Rails.logger.info "Updated file: #{updated_file}"
    true
  rescue StandardError => e
    Rails.logger.error "Failed to set environment variable: #{e.message}"
    false
  end  
end