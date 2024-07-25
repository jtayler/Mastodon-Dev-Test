# frozen_string_literal: true

HttpLog.configure do |config|
  config.logger = Logger.new(Rails.root.join('log', 'httplog.log'))
  config.logger.formatter = proc do |severity, datetime, progname, msg|
    "[#{datetime}] #{severity}: #{msg}\n"
  end
  config.color = { color: :yellow }
  config.compact_log = false  # Changed to false for more detailed logs
  config.log_request = true
  config.log_response = true
end