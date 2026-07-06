class User < ApplicationRecord
    has_secure_password
    has_many :orders
    validates :name, :email, presence: true
    validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, uniqueness: true
    scope :active, -> { where(active: true) }
    default_scope { where(active: true) }
end
