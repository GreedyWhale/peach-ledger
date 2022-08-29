class ApplicationMailer < ActionMailer::Base
  default from: Rails.application.credentials[:email_account]
  layout "mailer"
end
