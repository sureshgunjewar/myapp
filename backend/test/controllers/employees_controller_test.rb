require "test_helper"

class EmployeesControllerTest < ActionDispatch::IntegrationTest
  def auth_headers(user)
    token = JWT.encode({ user_id: user.id }, Rails.application.secret_key_base, "HS256")
    { "Authorization" => "Bearer #{token}" }
  end

  test "should reject html requests for the api" do
    user = User.create!(name: "Test User", email: "test@example.com", password: "password123")

    get employees_url, headers: auth_headers(user)

    assert_response :not_found
  end

  test "should return employees as json" do
    user = User.create!(name: "Test User", email: "test@example.com", password: "password123")
    employee = Employee.create!(name: "Alice", email: "alice@example.com", department: "Sales", position: "Representative")

    get employees_url(format: :json), headers: auth_headers(user)

    assert_response :success
    payload = JSON.parse(@response.body)
    assert_includes payload.map { |item| item["id"] }, employee.id
    assert_equal "Alice", payload.find { |item| item["id"] == employee.id }["name"]
  end

  test "should create employee as json" do
    user = User.create!(name: "Test User", email: "test@example.com", password: "password123")

    assert_difference("Employee.count") do
      post employees_url(format: :json), params: {
        employee: {
          name: "Jane Doe",
          email: "jane@example.com",
          department: "Engineering",
          position: "Developer"
        }
      }, headers: auth_headers(user)
    end

    assert_response :created
    payload = JSON.parse(@response.body)
    assert_equal "Jane Doe", payload["name"]
  end
end
