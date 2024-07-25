class VerifiedIdentity < ApplicationRecord
  validates :is_verified, presence: true
end
