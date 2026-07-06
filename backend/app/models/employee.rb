class Employee < ApplicationRecord
  validates :name, :email, :department, :position, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, uniqueness: true
  #test
end
