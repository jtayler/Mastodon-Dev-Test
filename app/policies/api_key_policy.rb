# app/policies/api_key_policy.rb
class ApiKeyPolicy < ApplicationPolicy
  def index?
    current_user.admin?
  end

  def create?
    current_user.admin?
  end

  def update?
    current_user.admin?
  end

  def destroy?
    current_user.admin?
  end
end